from flask import Flask, request, json, make_response, jsonify
import compose as cm
from os.path import exists, normpath, split
from os import listdir

GENRES_DIR = 'trained_genres_models'

# init app
app = Flask(__name__)

@app.route('/letscompose', methods=['POST'])
def lets_compose():
    try:
        # unmarshalling the JSON into a dictionary
        body = json.loads(request.data)

        # unload the content into components
        input_filename = body.get('inputfile')
        genre = body.get('genre')
        output_filename = body.get('outputfile')

        if not exists(input_filename):
            res = make_response(jsonify(error='Input file doesn\'t exists'), 400)
            return res

        if not is_pathname_valid(output_filename, 'midi'):
            res = make_response(jsonify(error='Input file name isn\'t valid'), 400)
            return res

        # generate seed
        if cm.compose(input_filename, output_filename, genre):
            res = make_response(jsonify(outputfile=output_filename), 200)
            return res
        else:
            res = make_response(jsonify(error='Compose error'), 500)
            return res

    except Exception as e:
        print(e)
        res = make_response(jsonify(error='Service inner error'), 500)
        return res

def is_pathname_valid(pathname: str, file_type: str) -> bool:
    filename_norm = normpath(pathname.replace("/", "\\"))
    filename_norm_splitted = split(filename_norm)
    path = filename_norm_splitted[0]
    if not exists(path):
        return False

    filename = filename_norm_splitted[1]
    not_allowed_chars = [ '/', '\\', ':', '*', '?', '\"', '<', '>', '|' ]
    for c in not_allowed_chars:
        if filename.__contains__(c):
            return False

    filename_splited_by_dot = filename.split('.')
    return len(filename_splited_by_dot)>=2 and filename_splited_by_dot[-1]==file_type


@app.route('/getgenres', methods=['GET'])
def get_genres():
    try:
        genres_lst = listdir(GENRES_DIR)
        genres_lst = [ s.split('_')[0] for s in genres_lst]
        res = make_response(jsonify(genres=genres_lst), 200)
        return res
    except:
        res = make_response(jsonify(error='Service inner error'), 500)
        return res



if __name__ == "__main__":
    app.run(port=5001)
