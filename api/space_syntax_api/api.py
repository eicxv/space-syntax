from flask import Flask, request

app = Flask(__name__)

import spacesyntax


def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "http://127.0.0.1:3000"
    # response.headers["Access-Control-Allow-Origin"] = "http://spacesyntax.eicxv.com"
    if request.method == "OPTIONS":
        response.headers["Access-Control-Allow-Methods"] = "DELETE, GET, POST, PUT"
        headers = request.headers.get("Access-Control-Request-Headers")
        if headers:
            response.headers["Access-Control-Allow-Headers"] = headers
    return response


app.after_request(add_cors_headers)


@app.route("/")
def hello():
    return "<h1 style='color:green'>Api for spacesyntax.eicxv.com</h1>"


@app.route("/get_geojson", methods=["POST"])
def get_geojson():
    print("request recieved")
    options = request.json
    print(options)
    geojson = spacesyntax.get_geojson(
        bounds=options["bounds"],
        network_type=options["networkType"],
        analysis_type=options["analysisType"],
    )
    return geojson


if __name__ == "__main__":
    app.run(host="0.0.0.0")

