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

# The device connection string to authenticate the device with your IoT hub.
CONNECTION_STRING = "{{deviceConnectionString}}"

async def manage_device_twin_sample_run():
    try:
        # Create instance of the device client using the authentication provider
        device_client = IoTHubDeviceClient.create_from_connection_string(CONNECTION_STRING)

        # Connect the device client.
        await device_client.connect()

        print ( "Get device twin" )
        twin = await device_client.get_twin()
        print (twin)

        print ( "Updating reported properties" )
        reported_properties_patch = {
            "weather": {
                "temperature": 72,
                "humidity": 17
            },
            "firmwareVersion": "1.2.2"
        }
        await device_client.patch_twin_reported_properties(reported_properties_patch)

    except Exception as iothub_error:
        print ( "Unexpected error %s from IoTHub" % iothub_error )
    finally:
        print ( "Disconnecting client" )
        await device_client.disconnect()

if __name__ == '__main__':
    print ( "IoT Hub simulated device" )
    asyncio.run(manage_device_twin_sample_run())

    # If using Python 3.6 or below, use the following code instead of asyncio.run(manage_device_twin_sample_run()):
    # loop = asyncio.get_event_loop()
    # loop.run_until_complete(manage_device_twin_sample_run())
    # loop.close()