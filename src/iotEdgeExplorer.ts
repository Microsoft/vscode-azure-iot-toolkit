// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

"use strict";
import axios from "axios";
import * as iothub from "azure-iothub";
import * as fqdn from "fqdn-multi";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as stripJsonComments from "strip-json-comments";
import * as vscode from "vscode";
import { BaseExplorer } from "./baseExplorer";
import { Constants } from "./constants";
import { Executor } from "./executor";
import { DeviceItem } from "./Model/DeviceItem";
import { ModuleItem } from "./Model/ModuleItem";
import { TelemetryClient } from "./telemetryClient";
import { Utility } from "./utility";

export class IoTEdgeExplorer extends BaseExplorer {
    constructor(outputChannel: vscode.OutputChannel) {
        super(outputChannel);
    }

    public async createDeployment(input?: DeviceItem | vscode.Uri) {
        TelemetryClient.sendEvent(Constants.IoTHubAIEdgeDeployStartEvent);

        let iotHubConnectionString = await Utility.getConnectionString(Constants.IotHubConnectionStringKey, Constants.IotHubConnectionStringTitle);
        if (!iotHubConnectionString) {
            return;
        }

        let from = "none";
        let deviceItem;
        if (input instanceof DeviceItem) {
            deviceItem = input;
            from = "device";
        }
        deviceItem = await Utility.getInputDevice(deviceItem, null, true);
        if (!deviceItem) {
            return;
        }

        let filePath;
        if (input instanceof vscode.Uri) {
            filePath = input.fsPath;
            from = "file";
        }
        const deploymentJson = await this.getDeploymentJson(filePath);
        if (!deploymentJson) {
            return;
        }

        this.deploy(iotHubConnectionString, deviceItem.deviceId, deploymentJson, from);
    }

    public async setupEdge(deviceItem: DeviceItem) {
        deviceItem = await Utility.getInputDevice(deviceItem, "Edge.Setup.Start", true);

        if (!deviceItem) {
            return;
        }

        Executor.runInTerminal(Utility.adjustTerminalCommand(`iotedgectl setup --connection-string "${deviceItem.connectionString}"  --auto-cert-gen-force-no-passwords`));
        TelemetryClient.sendEvent("AZ.Edge.Setup.Done");
    }

    public async setupEdgeFromConfig() {
        TelemetryClient.sendEvent("Edge.SetupFromConfig.Start");
        const filePathUri: vscode.Uri[] = await vscode.window.showOpenDialog({
            openLabel: "Select Edge Setup Configuration File",
            filters: {
                JSON: ["json"],
            },
            defaultUri: Utility.getDefaultPath(),
        });
        if (filePathUri) {
            Executor.runInTerminal(Utility.adjustTerminalCommand(`iotedgectl setup --config-file "${Utility.adjustFilePath(filePathUri[0].fsPath)}"`));
            TelemetryClient.sendEvent("AZ.Edge.SetupFromConfig.Done");
        }
    }

    public startEdge() {
        Executor.runInTerminal(Utility.adjustTerminalCommand("iotedgectl start"));
        TelemetryClient.sendEvent("AZ.Edge.StartRuntime");
    }

    public stopEdge() {
        Executor.runInTerminal(Utility.adjustTerminalCommand("iotedgectl stop"));
        TelemetryClient.sendEvent("AZ.Edge.Stop");
    }

    public restartEdge() {
        Executor.runInTerminal(Utility.adjustTerminalCommand("iotedgectl restart"));
        TelemetryClient.sendEvent("AZ.Edge.Restart");
    }

    public uninstallEdge() {
        Executor.runInTerminal(Utility.adjustTerminalCommand("iotedgectl uninstall"));
        TelemetryClient.sendEvent("AZ.Edge.Uninstall");
    }

    public async loginToContainerRegistry() {
        TelemetryClient.sendEvent("AZ.Edge.LoginToContainerRegistry.Start");
        let address: string = await vscode.window.showInputBox({
            prompt: "Enter container registry address (Leave blank for Docker Hub)",
            placeHolder: "E.g., myregistry.azurecr.io",
            ignoreFocusOut: true,
        });
        if (address === undefined) {
            return;
        }
        address = address.trim();

        const username: string = await vscode.window.showInputBox({
            prompt: "Enter username",
            ignoreFocusOut: true,
        });
        if (username === undefined) {
            return;
        }
        if (username === "") {
            vscode.window.showErrorMessage("Username cannot be empty");
            return;
        }

        const password: string = await vscode.window.showInputBox({
            prompt: "Enter password",
            password: true,
            ignoreFocusOut: true,
        });
        if (password === undefined) {
            return;
        }
        if (password === "") {
            vscode.window.showErrorMessage("Password cannot be empty");
            return;
        }

        Executor.runInTerminal(Utility.adjustTerminalCommand(`iotedgectl login${address ? ` --address "${address}"` : ""} --username "${username}" --password "${password}"`));
        TelemetryClient.sendEvent("AZ.Edge.LoginToContainerRegistry.Done");
    }

    public async generateEdgeSetupConfig(deviceItem?: DeviceItem) {
        deviceItem = await Utility.getInputDevice(deviceItem, "Edge.GenerateSetupConfig.Start", true);

        if (deviceItem) {
            const containerOS: string = await vscode.window.showQuickPick(["Linux", "Windows"], { placeHolder: "Select container OS", ignoreFocusOut: true });
            if (containerOS) {
                const configContent: string = this.generateEdgeSetupConfigContent(deviceItem.connectionString, containerOS);
                const configPath: vscode.Uri = await vscode.window.showSaveDialog({
                    defaultUri: Utility.getDefaultPath("config.json"),
                    saveLabel: "Save Edge Setup Configuration File",
                    filters: {
                        JSON: ["json"],
                    },
                });

                if (configPath) {
                    Utility.writeFile(configPath, configContent);
                    TelemetryClient.sendEvent("Edge.GenerateSetupConfig.Done");
                }
            }
        }
    }

    public async getModuleTwin(moduleItem: ModuleItem) {
        TelemetryClient.sendEvent(Constants.IoTHubAIGetModuleTwinStartEvent);
        const iotHubConnectionString = await Utility.getConnectionString(Constants.IotHubConnectionStringKey, Constants.IotHubConnectionStringTitle);
        if (!iotHubConnectionString) {
            return;
        }

        try {
            const content = await Utility.getModuleTwin(iotHubConnectionString, moduleItem.deviceId, moduleItem.moduleId);
            const textDocument = await vscode.workspace.openTextDocument({ content: JSON.stringify(content, null, 4), language: "json" });
            vscode.window.showTextDocument(textDocument);
            TelemetryClient.sendEvent(Constants.IoTHubAIGetModuleTwinDoneEvent, { Result: "Success"});
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to get Module Twin: ${error}`);
            TelemetryClient.sendEvent(Constants.IoTHubAIGetModuleTwinDoneEvent, { Result: "Fail", Message: error });
        }
    }

    private async getDeploymentJson(filePath: string): Promise<string> {
        if (!filePath) {
            const filePathUri: vscode.Uri[] = await vscode.window.showOpenDialog({
                openLabel: "Select Edge Deployment Manifest",
                filters: {
                    JSON: ["json"],
                },
                defaultUri: Utility.getDefaultPath(),
            });
            if (!filePathUri) {
                return "";
            }
            filePath = filePathUri[0].fsPath;
        }
        return fs.readFileSync(filePath, "utf8");
    }

    private deploy(iotHubConnectionString: string, deviceId: string, deploymentJson: string, from: string) {
        const label = "Edge";
        this._outputChannel.show();
        this.outputLine(label, `Start deployment to [${deviceId}]`);

        const url = `/devices/${deviceId}/applyConfigurationContent?api-version=${Constants.IoTHubApiVersion}`;
        const config = Utility.generateIoTHubAxiosRequestConfig(iotHubConnectionString, url, "post", stripJsonComments(deploymentJson));
        const entry = from === "none" ? "commandPalette" : "contextMenu";

        axios.request(config)
            .then((response) => {
                this.outputLine(label, "Deployment succeeded.");
                TelemetryClient.sendEvent(Constants.IoTHubAIEdgeDeployDoneEvent, { Result: "Success", entry, from });
            })
            .catch((err) => {
                this.outputLine(label, `Deployment failed. ${err}`);
                if (err && err.response && err.response.data && err.response.data.Message) {
                    this.outputLine(label, err.response.data.Message);
                }
                TelemetryClient.sendEvent(Constants.IoTHubAIEdgeDeployDoneEvent, { Result: "Fail", Message: err, entry, from });
            });
    }

    private generateEdgeSetupConfigContent(connectionString: string, containerOS: string): string {
        return `{
    "deployment": {
        "docker": {
            "edgeRuntimeImage": "microsoft/azureiotedge-agent:1.0-preview",
            "loggingOptions": {
                "log-driver": "json-file",
                "log-opts": {
                    "max-size": "10m"
                }
            },
            "registries": [],
            "uri": "${containerOS === "Linux" ? "unix:///var/run/docker.sock" : "npipe://./pipe/docker_engine"}"
        },
        "type": "docker"
    },
    "deviceConnectionString": "${connectionString}",
    "homeDir": "${(os.platform() === "win32" ? path.join(process.env.PROGRAMDATA, "azure-iot-edge", "data") : path.join("/var", "lib", "azure_iot_edge")).replace(/\\/g, "\\\\")}",
    "hostName": "${fqdn().toLowerCase()}",
    "logLevel": "info",
    "schemaVersion": "1",
    "security": {
        "certificates": {
            "option": "selfSigned",
            "preInstalled": {
                "deviceCACertificateFilePath": "",
                "serverCertificateFilePath": ""
            },
            "selfSigned": {
                "forceNoPasswords": true,
                "forceRegenerate": false
            }
        }
    }
}`;
    }
}
