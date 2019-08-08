// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

"use strict";
import * as vscode from "vscode";
import { SimulatorWebview } from "./simulatorwebview/simulatorwebview";
import { Utility } from "./utility";
import { DeviceItem } from "./Model/DeviceItem";
import { Constants } from "./constants";
import { IoTHubMessageExplorer } from "./iotHubMessageExplorer";
import { IotHubC2DMessageExplorer } from "./iotHubC2DMessageExplorer";

export class Simulator {

    private _iotHubMessageExplorer: IoTHubMessageExplorer;
    private _iotHubC2DMessageExplorer: IotHubC2DMessageExplorer;
    private static simulatorOutputChannel: vscode.OutputChannel = vscode.window.createOutputChannel("Azure IoT Hub Toolkit Simulator");
    private static processing: boolean = false;

    constructor(private context: vscode.ExtensionContext) {
        this._iotHubMessageExplorer = new IoTHubMessageExplorer(Simulator.getSimulatorOutputChannel());
        this._iotHubC2DMessageExplorer = new IotHubC2DMessageExplorer(Simulator.getSimulatorOutputChannel());
    }

    public static getSimulatorOutputChannel(): vscode.OutputChannel {
        return Simulator.simulatorOutputChannel;
    }

    public static isProcessing(): boolean {
        return Simulator.processing;
    }

    public static setProcessing(processing: boolean) {
        this.processing = processing;
    }

    public async showWebview(): Promise<void> {
        const simulatorwebview = SimulatorWebview.getInstance(this.context);
        await simulatorwebview.openSimulatorWebviewPage();
        return;
	}

    public static async getInputDeviceList(): Promise<DeviceItem[]> {
        return await Utility.getInputDeviceList(Constants.IoTHubAIMessageStartEvent);
    }

    public async sendD2CMessage(deviceConnectionStrings: string[], message: string, times: number, interval: number) {
        Simulator.setProcessing(true);
        await this._iotHubMessageExplorer.sendD2CMessageFromMultipleDevicesRepeatedlyWithProgressBar(deviceConnectionStrings, message, times, interval);
        Simulator.setProcessing(false);
    }

    public async sendC2DMessage(iotHubConnectionString: string, deviceIds: string[], message: string, times: number, interval: number) {
        Simulator.setProcessing(true);
        await this._iotHubC2DMessageExplorer.sendC2DMessageToMultipleDevicesRepeatedlyWithProgressBar(iotHubConnectionString, deviceIds, message, times, interval);
        Simulator.setProcessing(false);
    }

}
