from flask import Flask, request, json, make_response, jsonify
import datetime
import compose as cm
from os.path import exists

# init app
app = Flask(__name__)


@app.route('/letscompose', methods=['POST'])
def compose_req():
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

    except:
        res = make_response(jsonify(error='Service inner error'), 500)
        return res


if __name__ == "__main__":
    app.run(port=5001)
