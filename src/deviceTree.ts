import { ConnectionString } from "azure-iot-device";
import * as path from "path";
import * as vscode from "vscode";
import { Constants } from "./constants";
import { DeviceItem } from "./Model/DeviceItem";
import { TelemetryClient } from "./telemetryClient";
import { Utility } from "./utility";
import iothub = require("azure-iothub");

export class DeviceTree implements vscode.TreeDataProvider<vscode.TreeItem> {
    public _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined> = new vscode.EventEmitter<vscode.TreeItem | undefined>();
    public readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined> = this._onDidChangeTreeData.event;

    constructor(private context: vscode.ExtensionContext) {
    }

    public refresh(): void {
        this._onDidChangeTreeData.fire();
        TelemetryClient.sendEvent("AZ.RefreshDeviceTree");
    }

    public async setIoTHubConnectionString() {
        TelemetryClient.sendEvent("General.Set.IoTHubConnectionString");
        const iotHubConnectionString = await Utility.setConnectionString(Constants.IotHubConnectionStringKey, Constants.IotHubConnectionStringTitle);
        if (iotHubConnectionString) {
            vscode.window.showInformationMessage(`${Constants.IotHubConnectionStringTitle} is updated.`);
            this._onDidChangeTreeData.fire();
        }
    }

    public getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    public async getChildren(element?: vscode.TreeItem): Promise<vscode.TreeItem[]> {
        let iotHubConnectionString = await Utility.getConnectionString(Constants.IotHubConnectionStringKey, Constants.IotHubConnectionStringTitle);
        if (!iotHubConnectionString) {
            return;
        }

        TelemetryClient.sendEvent(Constants.IoTHubAIStartLoadDeviceTreeEvent);
        try {
            const deviceList: vscode.TreeItem[] = await Utility.getDeviceList(iotHubConnectionString, this.context);
            TelemetryClient.sendEvent(Constants.IoTHubAILoadDeviceTreeEvent, { Result: "Success", DeviceCount: deviceList.length.toString() });
            if (deviceList.length === 0) {
                deviceList.push(new vscode.TreeItem(`No devices in ${Utility.getHostName(iotHubConnectionString)}`));
            }
            return deviceList;
        } catch (err) {
            TelemetryClient.sendEvent(Constants.IoTHubAILoadDeviceTreeEvent, { Result: "Fail", Message: err.message });
            let items = [];
            items.push(new vscode.TreeItem("Failed to list IoT Hub devices"));
            items.push(new vscode.TreeItem(`Error: ${err.message}`));
            return items;
        }
    }
}
