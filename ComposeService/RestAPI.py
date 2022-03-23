import preprocess as pp
import os
import random

KERN_DATASET_PATH = "deutschl\erk"
SAVE_DIR = "dataset"
SINGLE_FILE_DATASET = "file_dataset"
SEED_FILE = "user_seed.txt"
MAPPING_PATH = "mapping.json"
SEQUENCE_LENGTH = 64


def compose(io_folder_path):
    pp.preprocess(io_folder_path)
    songs = pp.create_single_file_dataset(SAVE_DIR, io_folder_path + '/' + SINGLE_FILE_DATASET, SEQUENCE_LENGTH)
    pp.create_mapping(songs, MAPPING_PATH)

    write_processed_files_to_folder(io_folder_path)


def write_seed_to_folder(io_folder_path, seed):

    dir_files = [f for f in os.listdir(io_folder_path)]
    print(dir_files)
    for f in dir_files:
        os.remove(os.path.join(io_folder_path, f))

    seed_file = open(io_folder_path + '/' + SEED_FILE, "w")
    seed_file.write(seed)
    seed_file.close()


def extract_random_seed(io_folder_path, user_precessed_file_content):
    while True:
        seed_start_pos = random.randint(0, len(user_precessed_file_content))
        seed_end_pos = random.randint(0, len(user_precessed_file_content))
        pos_differ = seed_end_pos - seed_start_pos
        if seed_end_pos > seed_start_pos and 10 < pos_differ < len(user_precessed_file_content):
            seed = user_precessed_file_content[seed_start_pos: seed_end_pos]
            break
    print(seed)
    write_seed_to_folder(io_folder_path, seed)


def write_processed_files_to_folder(io_folder_path):
    user_processed_file = open(io_folder_path + '/' + SINGLE_FILE_DATASET, "r")
    user_precessed_file_content = user_processed_file.read()
    user_processed_file.close()
    print(user_precessed_file_content)
    extract_random_seed(io_folder_path, user_precessed_file_content)


def main():
    ## TODO: get the path to user's folder by request
    io_folder_path = "/Users/Omer/Desktop/user_uploads"
    compose(io_folder_path)


if __name__ == "__main__":
    main()
