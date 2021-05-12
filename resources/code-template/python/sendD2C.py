# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project root for full license information.

import random
import time
import sys

# Using the Python Device SDK for IoT Hub:
#   https://github.com/Azure/azure-iot-sdk-python
#   Run 'pip install azure-iot-device' to install the required libraries for this application

import asyncio
from azure.iot.device.aio import IoTHubDeviceClient
from azure.iot.device import Message

# The device connection string to authenticate the device with your IoT hub.
CONNECTION_STRING = "{{deviceConnectionString}}"

# Define the JSON message to send to IoT Hub.
TEMPERATURE = 20.0
HUMIDITY = 60
MSG_TXT = "{\"temperature\": %.2f,\"humidity\": %.2f}"

async def iothub_client_telemetry_sample_run():

    try:
        # Create instance of the device client using the authentication provider
        device_client = IoTHubDeviceClient.create_from_connection_string(CONNECTION_STRING)

        # Connect the device client.
        await device_client.connect()

        while True:
            # Build the message with simulated telemetry values.
            temperature = TEMPERATURE + (random.random() * 15)
            humidity = HUMIDITY + (random.random() * 20)
            msg_txt_formatted = MSG_TXT % (temperature, humidity)
            message = Message(msg_txt_formatted)

            # Add a custom application property to the message.
            # An IoT hub can filter on these properties without access to the message body.
            if temperature > 30:
                message.custom_properties["temperatureAlert"] = "true"
            else:
                message.custom_properties["temperatureAlert"] = "false"

            # Send a single message
            print( "Sending message: %s" % message )
            await device_client.send_message(message)
            print("Message successfully sent!")

            time.sleep(1)

    except KeyboardInterrupt:
        print ( "IoTHubClient sample stopped" )
    except Exception as iothub_error:
        print ( "Unexpected error %s from IoTHub" % iothub_error )
    finally:
        print ( "Disconnecting client" )
        await device_client.disconnect()

if __name__ == '__main__':
    print ( "IoT Hub simulated device" )
    print ( "Press Ctrl-C to exit" )
    asyncio.run(iothub_client_telemetry_sample_run())

    # If using Python 3.6 or below, use the following code instead of asyncio.run(iothub_client_telemetry_sample_run()):
    # loop = asyncio.get_event_loop()
    # loop.run_until_complete(iothub_client_telemetry_sample_run())
    # loop.close()