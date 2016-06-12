from flask import Flask, render_template, request
import pymongo
import dateutil.parser
import json
import bson
import pickle


app = Flask(__name__)
app.config.from_object('config')

client = pymongo.MongoClient('localhost', 27017)
db = client.carbon_calculator


def format_transport(trans):
    return {
        'id': str(trans['_id']),
        'hash': str(trans['_id'])[-5:],
        'date': dateutil.parser.parse(trans['startTime']),
        'start': dateutil.parser.parse(trans['startTime']),
        'end': dateutil.parser.parse(trans['endTime']),
        'duration': "%.2f" % (float(trans['duration']) / 60),
        'distance': trans['distance'],
        'pred': trans['pred'],
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
    ids = pickle.load(open('./misclassified.p', 'rb'))
    print ids
    # raw_transports = db.moves_transport.find({'_id': {'$in': ids}})
    # raw_transports = db.moves_transport.find({'type': None, '_id': {'$in': [bson.ObjectId(id_) for id_ in ids]}}) #.sort('duration', -1).skip(800).limit(200)
    # raw_transports = db.moves_transport.find({'$and': [{'type': None}, {'distance': {'$lt': 4500}}, {'distance': {'$gte': 3000}}]}).sort('distance', -1).limit(500)
    raw_transports = db.moves_transport.find({'pred': 'car'})
    transports = [format_transport(transport) for transport in raw_transports]
    transports = sorted(transports, key=lambda k: k['distance'], reverse=True)
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
        print "THE INCOMING DATA IS %r" % request.data
        data = json.loads(request.data)
        res = db.moves_transport.update(
                {'_id': bson.objectid.ObjectId(data['id'])},
                {'$set': {'type': data['type']}}
            )
        return "success"


if __name__ == '__main__':
    app.run()

