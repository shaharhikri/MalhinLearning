import preprocess as pp
import melodygenerator as mg
import os
import random
from os.path import exists
import json

SEED_DEFAULT_LEN = 20
MAPPING_FILE = './common_mapping.json'
MAPPING_KEYS = None
with open(MAPPING_FILE, "r") as fp:
    mappings = json.load(fp)
    MAPPING_KEYS = list(dict(mappings).keys())


def compose(input_filename: str ,output_filename: str , genre: str):
    try:
        # pp the user input file
        pp_str = get_encoded_song(input_filename)

        # extract random seed
        seed = extract_random_seed(pp_str)

        genre = genre.lower()
        model_filename = './trained_genres_models/'+genre+'_model.h5'

        if not exists(model_filename):
            print("compose: Missing Requested \'"+genre+"\' Model file")
            return False

        if not exists(MAPPING_FILE):
            print("compose: Missing common mapping file")
            return False

        generator = mg.MelodyGenerator(model_filename, MAPPING_FILE)

        melody = generator.generate_melody(seed, 500, pp.SEQUENCE_LENGTH, 0.3)
        generator.save_melody(melody, file_name=output_filename)
        return True
    except Exception as e:
        print(e)
        return False


def get_encoded_song(input_filename):
    file_stream = pp.get_preprocessed_str(input_filename)

    # transpose songs to Cmaj/Amin
    song = pp.transpose(file_stream)

    # encode songs with music time series representation
    encoded_song = pp.encode_song(song)

    return encoded_song


def extract_random_seed(pp_str):
    pp_list = get_clean_pp_list(pp_str.split(' '))
    n = len(pp_list)

    if n <= SEED_DEFAULT_LEN:
        seed_list = pp_list
    else:
        seed_start_pos = random.randint(0, n-SEED_DEFAULT_LEN)
        seed_end_pos = seed_start_pos + SEED_DEFAULT_LEN
        seed_list = pp_list[seed_start_pos:seed_end_pos]
    return get_seed_str(seed_list)

def get_clean_pp_list(pp_list):
    pp_list_clean = []
    invalid_note = False
    for note in pp_list:
        if invalid_note and note=='_':
            continue;

        if note not in MAPPING_KEYS:
            invalid_note = True
        else:
            pp_list_clean.append(note)
            invalid_note = False

    return pp_list_clean

def get_seed_str(seed_list):
    seed_str = ''
    for e in seed_list:
        seed_str = seed_str + e + ' '
    seed_str = seed_str[0:len(seed_str)-1]
    return seed_str