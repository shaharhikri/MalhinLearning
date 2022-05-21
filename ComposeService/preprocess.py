import os
import json
import music21 as m21
import numpy as np
import tensorflow.keras as keras

KERN_DATASET_PATH = "krns"
SAVE_DIR = "dataset"
SINGLE_FILE_DATASET = "file_dataset"
SEQUENCE_LENGTH = 64

# durations are expressed in quarter length
ACCEPTABLE_DURATIONS = [
    0.25,  # 16th note
    0.5,  # 8th note
    0.75,
    1.0,  # quarter note
    1.5,
    2,  # half note
    3,
    4  # whole note
]

def get_preprocessed_str(filename):
    return m21.converter.parse(filename)

def transpose(song):
    try:
        """Transposes song to C maj/A min

        :param piece (m21 stream): Piece to transpose
        :return transposed_song (m21 stream):
        """

        # get key from the song
        parts = song.getElementsByClass(m21.stream.Part)
        measures_part0 = parts[0].getElementsByClass(m21.stream.Measure)
        key = measures_part0[0][4]

        # estimate key using music21
        if not isinstance(key, m21.key.Key):
            key = song.analyze("key")

        # get interval for transposition. E.g., Bmaj -> Cmaj
        if key.mode == "major":
            interval = m21.interval.Interval(key.tonic, m21.pitch.Pitch("C"))
        elif key.mode == "minor":
            interval = m21.interval.Interval(key.tonic, m21.pitch.Pitch("A"))

        # transpose song by calculated interval
        tranposed_song = song.transpose(interval)
        return tranposed_song
    except Exception as e:
        print('transpose:', e)
        return None


def encode_song(song, time_step=0.25):
    """Converts a score into a time-series-like music representation. Each item in the encoded list represents 'min_duration'
    quarter lengths. The symbols used at each step are: integers for MIDI notes, 'r' for representing a rest, and '_'
    for representing notes/rests that are carried over into a new time step. Here's a sample encoding:

        ["r", "_", "60", "_", "_", "_", "72" "_"]

    :param song (m21 stream): Piece to encode
    :param time_step (float): Duration of each time step in quarter length
    :return:
    """

    encoded_song = []

    for event in song.flat.notesAndRests:

        # handle notes
        if isinstance(event, m21.note.Note):
            symbol = event.pitch.midi  # 60
        # handle rests
        elif isinstance(event, m21.note.Rest):
            symbol = "r"

        # convert the note/rest into time series notation
        steps = int(event.duration.quarterLength / time_step)
        for step in range(steps):

            # if it's the first time we see a note/rest, let's encode it. Otherwise, it means we're carrying the same
            # symbol in a new time step
            if step == 0:
                encoded_song.append(symbol)
            else:
                encoded_song.append("_")

    # cast encoded song to str
    encoded_song = " ".join(map(str, encoded_song))

    return encoded_song


def load(file_path):
    with open(file_path, "r") as fp:
        song = fp.read()
    return song