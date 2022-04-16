import requests

LETS_COMPOSE_URL = "http://localhost:5001/letscompose"
GET_GENRES_URL = "http://localhost:5001/getgenres"


def test_letscompose_check_status_code_equals_200():
    """
    GIVEN a Flask controller
    WHEN the Compose operation is requested (POST)
    THEN check that the response is valid (200) and a proper message is returned
    """
    response = requests.get(GET_GENRES_URL)
    assert response.status_code == 200

def test_letscompose_check_unauthorized_method():
    """
    GIVEN a Flask controller
    WHEN the Compose operation is badly requested (GET)
    THEN check that a '405' status code is returned
    """
    response = requests.post(GET_GENRES_URL)
    assert response.status_code == 405

def test_letscompose_check_req_body_non_exists_file(get_json_non_exists_file):
    """
    GIVEN a Flask controller
    WHEN the Compose operation is requested (POST) and the file is non-exists or has bad name
    THEN check  that a '400' status code and a proper message is returned
    """
    response = requests.post(LETS_COMPOSE_URL, json=get_json_non_exists_file)
    assert response.status_code == 400
    assert response.json()["error"] == "Input file doesn't exists"


def test_letscompose_check_req_body_non_exists_specific_genre(get_json_non_exists_genre):
    """
    GIVEN a Flask controller
    WHEN the Compose operation is requested (POST) and the requested genre is non-exists or has bad name
    THEN check  that a '500' status code is returned and a proper message
    """
    response = requests.post(LETS_COMPOSE_URL, json=get_json_non_exists_genre)
    # TODO: update the controller to return 'bad request' 400 and a proper message
    assert response.status_code == 400
    assert response.json()["error"] == "The requested genre is not found"


def test_letscompose_check_req_body_unsupported_file_format(get_json_unsupported_file_format):
    """
    GIVEN a Flask controller
    WHEN the Compose operation is requested (POST) and the  and the file has unsupported format (aka. non .krn file)
    THEN check  that a '500' status code is returned and a proper message
    """
    response = requests.post(LETS_COMPOSE_URL, json=get_json_unsupported_file_format)
    # TODO: update the controller to return 'bad request' 400 and a proper message
    assert response.status_code == 400
    assert response.json()["error"] == "Input file format is unsupported"


# TODO: ask Haimov for further explanations
# def test_letscompose_check_req_body_non_valid_path(get_json_non_valid_path):

def test_getgenres_check_status_code_equals_200():
    """
    GIVEN a Flask controller
    WHEN the Genres list is requested (GET)
    THEN check that the response is valid (200)
    """
    response = requests.get(GET_GENRES_URL)
    assert response.status_code == 200


def test_getgenres_check_unauthorized_method():
    """
    GIVEN a Flask controller
    WHEN the Genres list is to be posted (POST)
    THEN check that a '405' status code is returned
    """
    response = requests.post(GET_GENRES_URL)
    assert response.status_code == 405


def test_getgenres_check_content_type_equals_json():
    """
    GIVEN a Flask controller
     WHEN the Genres list is requested (GET)
     THEN check that the response's value correctly identifies that
          the response body is in JSON format
     """
    response = requests.post(GET_GENRES_URL)
    assert response.headers["Content-Type"] == "application/json"


def test_getgenres_check_all_genres_are_presented(gen_genres_list):
    """
    GIVEN a Flask controller
     WHEN the Genres list is requested (GET)
     THEN check that all body elements are presented
     """
    response = requests.get(GET_GENRES_URL)
    response_body = response.json()
    for i in range(len(gen_genres_list)):
        assert response_body["genres"][i] == gen_genres_list[i]
