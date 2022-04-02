import preprocess as pp
import melodygenerator as mg
import os
import random
from os.path import exists

SEED_DEFAULT_LEN = 30


def compose(input_filename: str ,output_filename: str , genre: str):
    try:
        # pp the user input file
        pp_str = get_encoded_song(input_filename)

        # extract random seed
        seed = extract_random_seed(pp_str)

        genre = genre.lower()
        model_filename = './trained_genres_models/'+genre+'_model.h5'
        mapping_filename = './common_mapping.json' #'trained_genres_models/' + genre + '_mapping.json'

        if not check_genre_existence(model_filename, mapping_filename):
            print("compose: Missing Requested Model/Mapping file")
            return False

        generator = mg.MelodyGenerator(model_filename, mapping_filename)

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
    n = len(pp_str)
    if n < SEED_DEFAULT_LEN:
        return pp_str

    seed_start_pos = random.randint(0, n-SEED_DEFAULT_LEN)
    seed_end_pos = seed_start_pos + SEED_DEFAULT_LEN

    return pp_str[seed_start_pos:seed_end_pos]


def check_genre_existence(model_filename, mapping_filename):
    if exists(model_filename) and exists(mapping_filename):
        return True
    else:
        return False