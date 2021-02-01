from flask import Flask, jsonify
from flasgger import Swagger
import sqlite3
conn = sqlite3.connect('./bot_samples.db', check_same_thread=False)

app = Flask(__name__)
swagger = Swagger(app)

@app.route('/ingest_since/<unixepoch>/')
def ingest_since(unixepoch):
    """Ingests bot samples deposited since the provided unix epoch
    ---
    parameters:
      - name: unixepoch
        in: path
        type: integer
        required: true
        default: all
    definitions:
      ingestion_result:
        type: string
        properties:
          status:
            type: string
            items:
              $ref: '#/definitions/ingest_since'
      ingest_since:
        type: string
    responses:
      200:
        description: Samples were ingested successfully
        schema:
          $ref: '#/definitions/ingestion_result'
        examples:
          rgb: ['red', 'green', 'blue']
    """
    c = conn.cursor()
    c.execute("SELECT count(*) FROM logs WHERE unixepoch >= %s" % int(unixepoch))

    return jsonify(c.fetchone())

app.run(debug=False)