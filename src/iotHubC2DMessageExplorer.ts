// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

"use strict";
import { Message } from "azure-iot-common";
import { Client, ConnectionString } from "azure-iot-device";
import { clientFromConnectionString } from "azure-iot-device-mqtt";
import { Client as ServiceClient } from "azure-iothub";
import * as vscode from "vscode";
import { BaseExplorer } from "./baseExplorer";
import { Constants } from "./constants";
import { DeviceItem } from "./Model/DeviceItem";
import { TelemetryClient } from "./telemetryClient";
import { Utility } from "./utility";

export class IotHubC2DMessageExplorer extends BaseExplorer {
    private _deviceClient: Client;

    constructor(outputChannel: vscode.OutputChannel) {
        super(outputChannel);
    }

    public async sendC2DMessage(deviceItem?: DeviceItem) {
        let iotHubConnectionString = await Utility.getConnectionString(Constants.IotHubConnectionStringKey, Constants.IotHubConnectionStringTitle);
        if (!iotHubConnectionString) {
            return;
        }

        deviceItem = await Utility.getInputDevice(deviceItem, Constants.IoTHubAIC2DMessageStartEvent);

        if (deviceItem && deviceItem.label) {
            this.sendC2DMessageById(iotHubConnectionString, deviceItem.label);
        }
    }

    public async startMonitorC2DMessage(deviceItem?: DeviceItem) {
        if (this._deviceClient) {
            this._outputChannel.show();
            this.outputLine(Constants.IoTHubC2DMessageMonitorLabel, "There is a running job to monitor C2D message. Please stop it first.");
            return;
        }

        deviceItem = await Utility.getInputDevice(deviceItem, Constants.IoTHubAIStartMonitorC2DEvent);
        if (!deviceItem || !deviceItem.connectionString) {
            return;
        }

        const deviceConnectionString: string = deviceItem.connectionString;
        this._outputChannel.show();
        this._deviceClient = clientFromConnectionString(deviceConnectionString);
        this._deviceClient.open(this.connectCallback(deviceConnectionString));
    }

    public stopMonitorC2DMessage(): void {
        TelemetryClient.sendEvent(Constants.IoTHubAIStopMonitorC2DEvent);
        this._outputChannel.show();
        if (this._deviceClient) {
            this.outputLine(Constants.IoTHubC2DMessageMonitorLabel, "C2D monitoring stopped.");
            this._deviceClient.close(() => { return; });
            this._deviceClient = null;
        } else {
            this.outputLine(Constants.IoTHubC2DMessageMonitorLabel, "No C2D monitor job running.");
        }
    }

    private sendC2DMessageById(iotHubConnectionString: string, deviceId: string): void {
        vscode.window.showInputBox({ prompt: `Enter message to send to device` }).then((messageBody) => {
            if (messageBody !== undefined) {
                let serviceClient = ServiceClient.fromConnectionString(iotHubConnectionString);
                this._outputChannel.show();
                serviceClient.open((err) => {
                    if (err) {
                        this.outputLine(Constants.IoTHubC2DMessageLabel, err.message);
                    } else {
                        let message = new Message(messageBody);
                        serviceClient.send(deviceId, message.getData(),
                            this.sendEventDone(serviceClient, Constants.IoTHubC2DMessageLabel, deviceId, Constants.IoTHubAIC2DMessageDoneEvent));
                    }
                });
            }
        });
    }

    private connectCallback(deviceConnectionString: string) {
        return (err) => {
            if (err) {
                this.outputLine(Constants.IoTHubC2DMessageMonitorLabel, err);
                TelemetryClient.sendEvent(Constants.IoTHubAIStartMonitorC2DEvent, { Result: "Exception", Message: err });
            } else {
                let deviceId = ConnectionString.parse(deviceConnectionString).DeviceId;
                this.outputLine(Constants.IoTHubC2DMessageMonitorLabel, `Start monitoring C2D message for [${deviceId}]...`);
                TelemetryClient.sendEvent(Constants.IoTHubAIStartMonitorC2DEvent);
                this._deviceClient.on("message", (msg) => {
                    this.outputLine(Constants.IoTHubC2DMessageMonitorLabel, "Message Received: " + msg.getData());
                    this._deviceClient.complete(msg, this.printResult);
                });
            }
        };
    }

    private printResult = (err, res) => {
        if (err) {
            this.outputLine(Constants.IoTHubC2DMessageMonitorLabel, "Error: " + err.toString());
        }
        if (res) {
            this.outputLine(Constants.IoTHubC2DMessageMonitorLabel, "Status: " + res.constructor.name);
        }
    }
}
