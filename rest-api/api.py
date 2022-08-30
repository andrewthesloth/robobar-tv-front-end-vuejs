from datetime import datetime

from flask import Flask
from flask_cors import CORS
from flask_restful import Api, Resource

from datetime import datetime

import opc_client
import threading

app = Flask(__name__)
api = Api(app)
CORS(app)

opc_client_instance = opc_client.RobobarOpcClient('opc.tpc://10.35.91.101:4840')

DRINK_TYPES_JSON_EXAMPLE = {
    "drinkTypes": [
        {
            "id": 0,
            "name": "Coffee",
            "prepTimeInSeconds": 10,
        },{
            "id": 1,
            "name": "Beer",
            "prepTimeInSeconds": 30,
        },{
            "id": 2,
            "name": "Whiskey",
            "prepTimeInSeconds": 60,
        }
    ]
}

QUEUE_STATE_JSON_EXAMPLE = {
    "queueDrinks": [
        {
            "drinkOrderId": 11,
            "drinkTypeId": 1,
            "prepStartedAt": None,
        },
        {
            "drinkOrderId": 12,
            "drinkTypeId": 2,
            "prepStartedAt": None,
        },
        {
            "drinkOrderId": 13,
            "drinkTypeId": 1,
            "prepStartedAt": None,
        },
        {
            "drinkOrderId": 14,
            "drinkTypeId": 2,
            "prepStartedAt": None,
        },
        {
            "drinkOrderId": 15,
            "drinkTypeId": 1,
            "prepStartedAt": None,
        },
        {
            "drinkOrderId": 16,
            "drinkTypeId": 2,
            "prepStartedAt": None,
        },
        {
            "drinkOrderId": 17,
            "drinkTypeId": 1,
            "prepStartedAt": None,
        },
        {
            "drinkOrderId": 18,
            "drinkTypeId": 2,
            "prepStartedAt": None,
        },
    ],
}

PICKUP_DRINKS_JSON_EXAMPLE = {
    "pickUpDrinks": {
        1: {
            "drinkOrderId": 1,
            "drinkTypeId": 1,
            "prepStartedAt": None,
        },
        11: {
            "drinkOrderId": 11,
            "drinkTypeId": 2,
            "prepStartedAt": None,
        },
    },
}

DRINK_IN_PROGRESS_JSON_EXAMPLE = {
    "drinkInProgress": {
        "drinkOrderId": 10,
        "drinkTypeId": 0,
        "prepStartedAt": "2022-05-12-15-10-00",
    }
}

class DrinkTypes(Resource):
    def get(self):
        # return DRINK_TYPES_JSON_EXAMPLE
        drink_types = opc_client_instance.get_drink_types_json()

        if drink_types is opc_client.ReturnCodes.NOK:
            return None

        return drink_types

class QueueState(Resource):
    def get(self):
        queue_state = opc_client_instance.get_queue_drinks_json()

        if queue_state is opc_client.ReturnCodes.NOK:
            return None

        return queue_state
        # return QUEUE_STATE_JSON_EXAMPLE

class PlcCurrentTime(Resource):
    def get(self):
        # now = datetime.now()
        # print(opc_client_instance.get_current_plc_time())
        # return now.strftime('%Y-%m-%d-%H-%M-%S')
        current_plc_time = opc_client_instance.get_current_plc_time()

        if current_plc_time is opc_client.ReturnCodes.NOK:
            return None

        return current_plc_time

class PickUpDrinksState(Resource):
    def get(self):
        pickup_drinks = opc_client_instance.get_pickup_drinks_json()

        if pickup_drinks is opc_client.ReturnCodes.NOK:
            return None

        return pickup_drinks
        # return PICKUP_DRINKS_JSON_EXAMPLE

class DrinkInProgress(Resource):
    def get(self, side=0):
        # now = datetime.now()
        # DRINK_IN_PROGRESS_JSON_EXAMPLE["drinkInProgress"]["prepStartedAt"] = now.strftime('%Y-%m-%d-%H-%M-%S')
        # return DRINK_IN_PROGRESS_JSON_EXAMPLE
        prep_drink = opc_client_instance.get_prep_drink_json(side)

        if prep_drink is opc_client.ReturnCodes.NOK:
            return None

        return prep_drink

api.add_resource(DrinkTypes, '/DrinkTypes/')
api.add_resource(QueueState, '/QueueState/')
api.add_resource(PickUpDrinksState, '/PickUpDrinksState/')
api.add_resource(DrinkInProgress, '/DrinkInProgress/<int:side>/')
api.add_resource(PlcCurrentTime, '/PlcCurrentTime/')

if __name__ == '__main__':
    conn_thread = threading.Thread(target=opc_client_instance.create_and_maintain_connection)
    conn_thread.start()
    app.run(host='0.0.0.0', debug=True)
