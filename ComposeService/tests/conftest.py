import pytest
from os import listdir

GENRES_DIR = 'trained_genres_models'
TEST_JSON = {
    "inputfile": "C:/Users/Omer/Desktop/user_uploads/input_file.krn",
    "outputfile": "C:/Users/Omer/Desktop/user_uploads/output-some_input_file-default-12_01_22_16_35_15.midi",
    "genre": "waltzes"
}


@pytest.fixture()
def get_json_non_exists_file():
    corrupted_filename = TEST_JSON.get("inputfile").rsplit("/", 1)[0] + "/corrupted_input_file.krn"
    TEST_JSON["inputfile"] = corrupted_filename
    return TEST_JSON


@pytest.fixture()
def get_json_unsupported_file_format():
    unsupported_file = TEST_JSON.get("inputfile").rsplit("/", 1)[0] + "/input_file.mp3"
    TEST_JSON["inputfile"] = unsupported_file
    return TEST_JSON


@pytest.fixture()
def get_json_non_exists_genre():
    non_exists_genre = "rock"
    TEST_JSON["genre"] = non_exists_genre
    return TEST_JSON


@pytest.fixture()
def gen_genres_list():
    genres_lst = listdir(GENRES_DIR)
    genres_lst = [s.split('_')[0] for s in genres_lst]
    return genres_lst

