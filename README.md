# Azure IoT Toolkit

[![Join the chat at https://gitter.im/Microsoft/azure-iot-toolkit](https://badges.gitter.im/Microsoft/azure-iot-toolkit.svg)](https://gitter.im/Microsoft/azure-iot-toolkit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Marketplace Version](https://vsmarketplacebadge.apphb.com/version-short/vsciot-vscode.azure-iot-toolkit.svg)](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit)

Interact with Azure IoT Hub, IoT Device Management, IoT Edge Management, IoT Hub Code Generation.

## Device Explorer
The [Wiki page](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki) includes a comprehensive getting started guide as well as  detailed usage instructions of the following features:

* IoT Hub management
    * Create IoT Hub
    * Select IoT Hub
    * Copy IoT Hub Connection String
    * Generate SAS Token for IoT Hub
* Device management
    * List devices
    * Get device info
    * Create IoT device
    * Create Edge device
    * Delete device
    * Copy Device Connection String
    * Generate SAS Token for Device
* Module management
    * List Moudles
    * Create Module
    * Edit Module Twin
    * Invoke Module Direct Method
    * Delete Module
* Interact with Azure IoT Hub
    * Generate Code for C#, Go, Java, Node.js, PHP, Python, Ruby or REST API
    * Send D2C message to IoT Hub
    * Monitor IoT Hub D2C message
    * Send C2D message to device
    * Monitor C2D message from IoT Hub
    * Invoke Device Direct Method
    * Edit Device Twin
* Interact with Azure IoT Edge (Install [Azure IoT Edge](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge) for more IoT Edge support)
    * List Moudles 
    * Edit Module Twin
    * Create deployment for Single Device
    * Create Deployment at Scale

### Prerequisites

1. In Explorer of VS Code, click "Azure IoT Hub Devices" in the bottom left corner.

  ![Click Device Explorer](images/device-explorer-click.png)

2. Click "Set IoT Hub Connection String" in context menu.

  ![Set Connection String](images/set-connection-string.png)

3. An input box will pop up, then enter your IoT Hub Connection String (It is one-time configuration, and please make sure it is **IoT Hub Connection String** not **Device Connection String**. The format is `HostName=<my-hub>.azure-devices.net;SharedAccessKeyName=<my-policy>;SharedAccessKey=<my-policy-key>`).

  ![Enter Connection String](images/enter-connection-string.png)

4. The device list will be shown.

  ![Device Explorer](images/device-explorer.png)

**NOTE**: You could also go to **File** > **Preferences** > **Settings** (**Code** > **Preferences** > **Settings** on Mac), update the config of `azure-iot-toolkit.iotHubConnectionString` to change your IoT Hub Connection String.

### Sign in to Azure

Instead of copying and pasting to set IoT Hub Connection String, you could sign in to Azure to select IoT Hub from your Azure Subscription.

1. Click "Select IoT Hub" in context menu.

  ![Select IoT Hub](images/select-iot-hub.png)

2. If you have not signed in to Azure, a pop-up will show to let you sign in to Azure.
3. After you sign in, your Azure Subscription list will be shown, then select an Azure Subscription.
4. Your IoT Hub list will be shown, then select an IoT Hub.
5. The device list will be shown.

## Code Generation

![Code Generation](images/code-generation.gif)

## Code Snippets

| Trigger | Content |
| ---- | ---- |
| iotSendD2CMessage | Send D2C message to IoT Hub |
| iotMonitorD2CMessage | Monitor D2C message for IoT Hub |
| iotSendC2DMessage | Send C2D message to device |
| iotMonitorC2DMessage | Monitor C2D message from IoT Hub |
| iotCallDirectMethods | Send direct methods to device |
| iotReceiveDirectMethods | Receive direct methods from IoT Hub |

![Snippet](images/snippet.gif)

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

The time span (in minutes) of monitoring D2C message before current time (default is `0`):
```json
{
    "azure-iot-toolkit.monitorD2CBeforeNowInMinutes": 0
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

Whether to show IoT Hub info when IoT Hub Connection String is not set (default is `true`):
```json
{ 
    "azure-iot-toolkit.showIoTHubInfo": true
}
```

## Resources
- [Channel 9 video: Walkthrough of Azure IoT Toolkit extension](https://channel9.msdn.com/Shows/Internet-of-Things-Show/Azure-IoT-Toolkit-extension-for-Visual-Studio-Code)
- [Create an IoT hub using the Azure IoT Toolkit for Visual Studio Code](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-create-use-iot-toolkit)
- [Use Azure IoT Toolkit to send and receive messages between your device and IoT Hub](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-vscode-iot-toolkit-cloud-device-messaging)
- [Use Azure IoT Toolkit for Azure IoT Hub device management](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-device-management-iot-toolkit)
- [Quickly build your Azure IoT application with Node.js, Python or REST API](https://blogs.msdn.microsoft.com/iotdev/2018/08/08/quickly-build-your-azure-iot-application-in-vs-code-with-node-js-python-or-rest-api/)
- [Use VS Code as IoT Hub Device Simulator](https://blogs.msdn.microsoft.com/iotdev/2018/07/12/use-vs-code-as-iot-hub-device-simulator-say-hello-to-azure-iot-hub-in-5-minutes/)
- [Use VS Code to call Azure IoT Hub REST APIs](https://blogs.msdn.microsoft.com/iotdev/2018/07/19/call-azure-iot-hub-rest-apis-in-vs-code/)
- [Create and control an IoT device connected to an IoT hub (Node.js)](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/Quickstart-Node.js)
- [Create and control an IoT device connected to an IoT hub (.NET)](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/Quickstart-.NET)
- [Handy Tool When You Develop With Azure IoT](https://blogs.msdn.microsoft.com/iotdev/2017/09/01/handy-tool-when-you-develop-with-azure-iot/)
- [Azure IoT Toolkit for Visual Studio Code generally available for managing Azure IoT Hub and Devices with ease](https://blogs.msdn.microsoft.com/iotdev/2018/06/30/azure-iot-toolkit-for-visual-studio-code-generally-available-for-managing-azure-iot-hub-and-devices-with-ease/)



## Data/Telemetry
This project collects usage data and sends it to Microsoft to help improve our products and services. Read our [privacy statement](http://go.microsoft.com/fwlink/?LinkId=521839) to learn more. 
If you don’t wish to send usage data to Microsoft, you can set the `telemetry.enableTelemetry` setting to `false`. Learn more in our [FAQ](https://code.visualstudio.com/docs/supporting/faq#_how-to-disable-telemetry-reporting).
