from flask import Flask, render_template, request
import pymongo
import dateutil.parser
import json
import bson

app = Flask(__name__)
app.config.from_object('config')

client = pymongo.MongoClient('localhost', 27017)
db = client.phronesis_dev


def format_transport(trans):
    return {
        'id': str(trans['_id']),
        'date': dateutil.parser.parse(trans['startTime']),
        'start': dateutil.parser.parse(trans['startTime']),
        'end': dateutil.parser.parse(trans['endTime']),
        'duration': "%.2f" % (float(trans['duration']) / 60),
        'distance': trans['distance'],
        'type': trans['type'],
        'trackPoints': trans['trackPoints']
    }


def format_date(trans, ix):
    trans['date'] = trans['start'].strftime("%A, %b %d '%y")
    trans['start'] = trans['start'].strftime("%I:%M %p")
    trans['end'] = trans['end'].strftime("%I:%M %p")
    trans['num'] = ix

    return trans


@app.route('/')
def hello_world():
    return render_template('main.html')


@app.route('/transports')
def transports():
    raw_transports = db.moves_transport.find().limit(300)
    transports = [format_transport(transport) for transport in raw_transports]
    transports = sorted(transports, key=lambda k: k['end'], reverse=True)
    transports = [format_date(transport, ix) for ix, transport in enumerate(transports)]

    return json.dumps(transports)


@app.route('/transport', methods=['GET', 'PUT'])
def transport():
    if request.method == 'GET':
        try:
            transport_id = bson.objectid.ObjectId(request.args['id'])
        except:
            return json.dumps({"error": "Either no id or bad id"})

        transport_doc = db.moves_transport.find_one({'_id': transport_id})
        transport_doc['_id'] = str(transport_doc['_id'])

        return json.dumps(transport_doc)

    else:
        data = json.loads(request.data)
        res = db.moves_transport.update(
                {'_id': bson.objectid.ObjectId(data['id'])},
                {'$set': {'type': data['type']}}
            )
        return "success"


if __name__ == '__main__':
    app.run()