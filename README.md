# Azure IoT Toolkit

[![Join the chat at https://gitter.im/Microsoft/azure-iot-toolkit](https://badges.gitter.im/Microsoft/azure-iot-toolkit.svg)](https://gitter.im/Microsoft/azure-iot-toolkit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Interact with Azure IoT Hub, IoT Device Management, IoT Edge Management, IoT Hub Code Snippets.

## Device Explorer

* Device management
    * List devices
    * Get device info
    * Create device
    * Delete device
* Interact with Azure IoT Hub
    * Send D2C message to IoT Hub
    * Monitor IoT Hub D2C message
    * Send C2D message to device
    * Monitor C2D message from IoT Hub
    * Invoke Direct Method
    * Get/update Device Twin

### Prerequisites

1. In Explorer of VS Code, click "IoT Hub Devices" in the bottom left corner.

  ![Click Device Explorer](https://github.com/formulahendry/vscode-azure-iot-toolkit/raw/master/images/device-explorer-click.png)

2. Click "Set IoT Hub Connection String" in context menu.

  ![Set Connection String](https://github.com/formulahendry/vscode-azure-iot-toolkit/raw/master/images/set-connection-string.png)

3. An input box will pop up, then enter your Iot Hub Connection String (It is one-time configuration, and please make sure it is **Iot Hub Connection String** not **Device Connection String**. The format is `HostName=<my-hub>.azure-devices.net;SharedAccessKeyName=<my-policy>;SharedAccessKey=<my-policy-key>`).

  ![Enter Connection String](https://github.com/formulahendry/vscode-azure-iot-toolkit/raw/master/images/enter-connection-string.png)

4. The device list will be shown.

  ![Device Explorer](https://github.com/formulahendry/vscode-azure-iot-toolkit/raw/master/images/device-explorer.png)

**NOTE**: You could also go to **File** > **Preferences** > **Settings** (**Code** > **Preferences** > **Settings** on Mac), update the config of `azure-iot-toolkit.iotHubConnectionString` to change your IoT Hub Connection String.

### Sign in to Azure

Instead of copying and pasting to set IoT Hub Connection String, you could sign in to Azure to select IoT Hub from your Azure Subscription.

1. Click "Select IoT Hub" in context menu.

  ![Select IoT Hub](https://github.com/formulahendry/vscode-azure-iot-toolkit/raw/master/images/select-iot-hub.png)

2. If you have not signed in to Azure, a pop-up will show to let you sign in to Azure.
3. After you sign in, your Azure Subscription list will be shown, then select an Azure Subscription.
4. Your IoT Hub list will be shown, then select an IoT Hub.
5. The device list will be shown.

## Code Snippets

| Trigger | Content |
| ---- | ---- |
| iotSendD2CMessage | Send D2C message to IoT Hub |
| iotMonitorD2CMessage | Monitor D2C message for IoT Hub |
| iotSendC2DMessage | Send C2D message to device |
| iotMonitorC2DMessage | Monitor C2D message from IoT Hub |
| iotCallDirectMethods | Send direct methods to device |
| iotReceiveDirectMethods | Receive direct methods from IoT Hub |

![Snippet](https://github.com/formulahendry/vscode-azure-iot-toolkit/raw/master/images/snippet.gif)

> After code snippet is created, you need to install corresponding npm package (e.g. [azure-iot-device-mqtt](https://www.npmjs.com/package/azure-iot-device-mqtt)) to run the code snippet.
> If you want to 'Run Code' directly, you need to install [Code Runner](https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner).

## Configuration

IoT Hub Connection String:
```json
{
    "azure-iot-toolkit.iotHubConnectionString": "HostName=<my-hub>.azure-devices.net;SharedAccessKeyName=<my-policy>;SharedAccessKey=<my-policy-key>"
}
```

Device Connection String:
```json
{
    "azure-iot-toolkit.deviceConnectionString": "HostName=<my-hub>.azure-devices.net;DeviceId=<known-device-id>;SharedAccessKey=<known-device-key>"
}
```

IoT Hub Consumer Group (default is `"$Default"`):
```json
{
    "azure-iot-toolkit.iotHubConsumerGroup": "$Default"
}
```

Whether to show verbose info when monitoring messages (default is `false`):
```json
{
    "azure-iot-toolkit.showVerboseMessage": false
}
```

Whether to stringify device-to-cloud messages (default is `false`):
```json
{ 
    "azure-iot-toolkit.iotHubD2CMessageStringify": false
}
```

Whether to show Connection String Input Box on startup (default is `true`):
```json
{ 
    "azure-iot-toolkit.showConnectionStringInputBox": true
}
```

Whether to show IoT Hub info when IoT Hub Connection String is not set (default is `true`):
```json
{ 
    "azure-iot-toolkit.showIoTHubInfo": true
}
```
