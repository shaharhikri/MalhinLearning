from flask import Flask, request, json, make_response, jsonify
import compose as cm
from os.path import exists
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

        #TODO: Add output filename format - check what you need to check

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
