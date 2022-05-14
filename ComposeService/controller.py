from flask import Flask, request, json, make_response, jsonify
import compose as cm
from os.path import exists
from os import listdir
import re

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

        if not is_pathname_valid(input_filename):
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

def is_pathname_valid(pathname: str) -> bool:
    root_path_optional = "([A-z0-9]:/){,1}"
    dirs = "\/{,1}([A-z0-9-_+]+\/)*"
    filename = "(.(?:[^<>:\"\|\?\*\n])+"
    formatting = "(\.([A-z]+)){,1})"
    reg = f'^{root_path_optional}{dirs}{filename}{formatting}$'
    try:
        # re.search(reg, _path_norm) -> check if valid format
        # exists(os.path.split(_path_norm)[0]) -> check if path directory exists
        _path_norm = os.path.normpath(pathname).replace("\\", "/")
        return re.search(reg, _path_norm) and exists(os.path.split(_path_norm)[0])
    except:
        return False


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
