// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

"use strict";
import * as os from "os";
import * as path from "path";
import * as vscode from "vscode";

enum TemplateLanguage {
    CSharp = "C#",
    FSharp = "F#",
    Go = "Go",
    HTTP = "HTTP",
    Java = "Java",
    Node = "Node.js",
    PHP = "PHP",
    Python = "Python",
    Ruby = "Ruby",
}

enum TemplateType {
    SendD2C = "Send device-to-cloud message",
    MonitorD2C = "Monitor device-to-cloud message",
    DeviceManageDeviceTwin = "Device - Manage device twin",
    ServiceManageDeviceTwin = "Service - Manage device twin",
    ListenForDirectMethod = "Listen for direct method",
    CallDirectMethod = "Call direct method",
}

export enum DeviceTwinPropertyType {
    Desired = "desired",
    Reported = "reported",
}

export enum DistributedSettingUpdateType {
    OnlyMode = "onlyMode",
    OnlySamplingRate = "onlySamplingRate",
    All = "all",
}

export class Constants {
    public static ExtensionContext: vscode.ExtensionContext;
    public static ExtensionId = "vsciot-vscode.azure-iot-toolkit";
    public static CampaignID = "vsciottoolkit";

    public static IoTHub = "IoT Hub";
    public static IsWelcomePageShown = "IsWelcomePageShown";

    public static DeviceConnectionStringKey = "deviceConnectionString";
    public static IotHubConnectionStringKey = "iotHubConnectionString";
    public static IotHubConnectionStringTitle = "IoT Hub Connection String";
    public static IotHubEventHubConnectionStringKey = "eventHubConnectionString";
    public static IotHubEventHubConnectionStringTitle = "Event Hub compatible connection string";
    public static IoTHubConsumerGroup = "iotHubConsumerGroup";
    public static IoTHubD2CMessageStringifyKey = "iotHubD2CMessageStringify";
    public static IoTHubMonitorLabel = "IoTHubMonitor";
    public static EventHubMonitorLabel = "EventHubMonitor";
    public static IoTHubMessageLabel = "D2CMessage";
    public static IoTHubC2DMessageLabel = "C2DMessage";
    public static IoTHubC2DMessageMonitorLabel = "C2DMessageMonitor";
    public static TreeViewAutoRefreshEnableKey = "treeViewAutoRefreshEnable";
    public static TreeViewAutoRefreshIntervalInSecondsKey = "treeViewAutoRefreshIntervalInSeconds";

    public static IoTHubDirectMethodLabel = "DirectMethod";
    public static IoTHubDeviceTwinLabel = "DeviceTwin";
    public static IoTHubModuleTwinLabel = "ModuleTwin";
    public static IoTHubDistributedTracingSettingLabel = "DistributedTracingSetting";
    public static IoTHubEdgeLabel = "Edge";

    public static IoTHubAILoadDeviceTreeEvent = "AZ.LoadDeviceTree";
    public static IoTHubAIStartMonitorEvent = "AZ.D2C.startMonitoring";
    public static IoTHubAIStopMonitorEvent = "AZ.D2C.stopMonitoring";
    public static IoTHubAIMessageStartEvent = "AZ.D2C.Send.Start";
    public static IoTHubAIMessageDoneEvent = "AZ.D2C.Send.Done";
    public static IoTHubAIStartMonitorC2DEvent = "AZ.C2D.startMonitoring";
    public static IoTHubAIStopMonitorC2DEvent = "AZ.C2D.stopMonitoring";
    public static IoTHubAIC2DMessageStartEvent = "AZ.C2D.Send.Start";
    public static IoTHubAIC2DMessageDoneEvent = "AZ.C2D.Send.Done";
    public static IoTHubAIInvokeDeviceMethodEvent = "AZ.DeviceMethod.Invoke";
    public static IoTHubAIInvokeModuleMethodEvent = "AZ.ModuleMethod.Invoke";
    public static IoTHubAIGetDeviceTwinStartEvent = "AZ.DeviceTwin.Get.Start";
    public static IoTHubAIGetDeviceTwinDoneEvent = "AZ.DeviceTwin.Get.Done";
    public static IoTHubAIUpdateDeviceTwinEvent = "AZ.DeviceTwin.Update";
    public static DeviceTwinJosnFileName = "azure-iot-device-twin.json";
    public static DeviceTwinJosnFilePath: string;
    public static IoTHubAIEdgeDeployStartEvent = "Edge.Deploy.Start";
    public static IoTHubAIEdgeDeployDoneEvent = "AZ.Edge.Deploy.Done";
    public static IoTHubAIEdgeDeployAtScaleStartEvent = "Edge.DeployAtScale.Start";
    public static IoTHubAIEdgeDeployAtScaleDoneEvent = "AZ.Edge.DeployAtScale.Done";
    public static IoTHubAICreateStartEvent = "General.IoTHub.Create.Start";
    public static IoTHubAICreateDoneEvent = "AZ.IoTHub.Create.Done";
    public static IoTHubAIGetModuleTwinStartEvent = "AZ.ModuleTwin.Get.Start";
    public static IoTHubAIGetModuleTwinDoneEvent = "AZ.ModuleTwin.Get.Done";
    public static IoTHubAIUpdateModuleTwinStartEvent = "AZ.ModuleTwin.Update.Start";
    public static IoTHubAIUpdateModuleTwinDoneEvent = "AZ.ModuleTwin.Update.Done";
    public static ModuleTwinJosnFileName = "azure-iot-module-twin.json";
    public static ModuleTwinJosnFilePath: string;
    public static IoTHubAILoadModuleTreeStartEvent = "AZ.LoadModuleTree.Start";
    public static IoTHubAILoadModuleTreeDoneEvent = "AZ.LoadModuleTree.Done";
    public static IoTHubAILoadEdgeModuleTreeStartEvent = "AZ.Edge.LoadModuleTree.Start";
    public static IoTHubAILoadEdgeModuleTreeDoneEvent = "AZ.Edge.LoadModuleTree.Done";
    public static IoTHubAICreateModuleStartEvent = "AZ.Module.Create.Start";
    public static IoTHubAICreateModuleDoneEvent = "AZ.Module.Create.Done";
    public static IoTHubAIDeleteModuleStartEvent = "AZ.Module.Delete.Start";
    public static IoTHubAIDeleteModuleDoneEvent = "AZ.Module.Delete.Done";
    public static IoTHubAIGetModuleStartEvent = "AZ.Module.Get.Start";
    public static IoTHubAIDGetModuleDoneEvent = "AZ.Module.Get.Done";
    public static IoTHubAIUpdateDistributedSettingStartEvent = "AZ.DistributedTracing.Update.Start";
    public static IoTHubAIUpdateDistributedSettingDoneEvent = "AZ.DistributedTracing.Update.Done";
    public static IoTHubAILoadDistributedTracingSettingTreeStartEvent = "AZ.LoadDistributedTracingSettingTree.Start";
    public static IoTHubAILoadDistributedTracingSettingTreeDoneEvent = "AZ.LoadDistributedTracingSettingTree.Done";
    public static IoTHubAILoadLabelInDeviceTreeDoneEvent = "AZ.LoadLabelInDeviceTree.Done";
    public static IoTHubAIStartLoadDeviceTreeEvent = "General.StartLoadDeviceTree";
    public static IoTHubAIShowWelcomePagetEvent = "General.WelcomePage.Show";
    public static IoTHubAIValidateJsonSchemaEvent = "General.ValidateJsonSchema.Done";
    public static IoTHubAILoadEndpointsTreeStartEvent = "AZ.LoadEndpointsTree.Start";
    public static IoTHubAILoadEndpointsTreeDoneEvent = "AZ.LoadEndpointsTree.Done";
    public static IoTHubAIEHStartMonitorEvent = "AZ.EventHub.startMonitoring";
    public static IoTHubAIEHStopMonitorEvent = "AZ.EventHub.stopMonitoring";
    public static PercentageLabel = "(%)";
    public static NotSetLabel = "Not Set";
    public static DisabledLabel = "Disabled";
    public static EnabledLabel = "Enabled";
    public static DeploymentJsonSchemaUrl = "http://json.schemastore.org/azure-iot-edge-deployment-2.0";
    public static CREATE_OPTIONS_MAX_CHUNKS = 8;
    public static StateKeySubsID = "subscriptionId";
    public static StateKeyIoTHubID = "iothubid";
    public static SimulatorOutputChannelTitle = "Send D2C Messages";
    public static SimulatorProgressBarCancelLog = "You just canceled sending D2C messages.";
    public static SimulatorSendingMessageProgressBarTitle = "Sending D2C Message(s)";
    public static SimulatorLaunchEvent = "General.D2C.V2.Start";
    public static SimulatorCloseEvent = "General.D2C.V2.Done";
    public static SimulatorSendEvent = "AZ.D2C.V2.Send";
    public static IoTHubAILoadInterfacesTreeStartEvent = "AZ.LoadInterfacesTree.Start";
    public static IoTHubAILoadInterfacesTreeDoneEvent = "AZ.LoadInterfacesTree.Done";
    public static modelDiscoveryInterfaceName = "urn_azureiot_ModelDiscovery_DigitalTwin";

    public static DeleteLabel = "Delete";
    public static DeleteMessage = "Are you sure you want to delete"; public static readonly DISTRIBUTED_TWIN_NAME: string = "azureiot*com^dtracing^1";
    public static ConnectionStringFormat = {
        [Constants.IotHubConnectionStringKey]: "HostName=<my-hostname>;SharedAccessKeyName=<my-policy>;SharedAccessKey=<my-policy-key>",
        [Constants.DeviceConnectionStringKey]: "HostName=<my-hostname>;DeviceId=<known-device-id>;SharedAccessKey=<known-device-key>",
        [Constants.IotHubEventHubConnectionStringKey]: "Endpoint=sb://<my-namespace>.servicebus.windows.net/;SharedAccessKeyName=<my-policy>;SharedAccessKey=<my-policy-key>;EntityPath=<eventHub-name>$",
    };

    public static ConnectionStringRegex = {
        [Constants.IotHubConnectionStringKey]: /^HostName=.+;SharedAccessKeyName=.+;SharedAccessKey=.+$/,
        [Constants.DeviceConnectionStringKey]: /^HostName=.+;DeviceId=.+;SharedAccessKey=.+$/,
        [Constants.IotHubEventHubConnectionStringKey]: /^Endpoint=sb:\/\/.+;SharedAccessKeyName=.+;SharedAccessKey=.+;EntityPath=.+$/,
    };

    public static ShowIoTHubInfoKey = "showIoTHubInfo";
    public static ShowConnectionStringInputBoxKey = "showConnectionStringInputBox";
    public static IoTHubApiVersion = "2019-07-01-preview";

    public static CodeTemplates = {
        [TemplateLanguage.CSharp]: {
            [TemplateType.SendD2C]: "csharp/sendD2C",
            [TemplateType.DeviceManageDeviceTwin]: "csharp/deviceManageDeviceTwin",
        },
        [TemplateLanguage.FSharp]: {
            [TemplateType.SendD2C]: "fsharp/sendD2C",
            [TemplateType.DeviceManageDeviceTwin]: "fsharp/deviceManageDeviceTwin"
        },
        [TemplateLanguage.Go]: {
            [TemplateType.SendD2C]: "go/sendD2C.go",
        },
        [TemplateLanguage.HTTP]: {
            [TemplateType.SendD2C]: "http/sendD2C.http",
        },
        [TemplateLanguage.Java]: {
            [TemplateType.SendD2C]: "java/sendD2C",
        },
        [TemplateLanguage.Node]: {
            [TemplateType.SendD2C]: "node/sendD2C.js",
            [TemplateType.MonitorD2C]: "node/monitorD2C.js",
            [TemplateType.DeviceManageDeviceTwin]: "node/deviceManageDeviceTwin.js",
            [TemplateType.ServiceManageDeviceTwin]: "node/serviceManageDeviceTwin.js",
            [TemplateType.ListenForDirectMethod]: "node/listenForDirectMethod.js",
            [TemplateType.CallDirectMethod]: "node/callDirectMethod.js",
        },
        [TemplateLanguage.PHP]: {
            [TemplateType.SendD2C]: "php/sendD2C.php",
        },
        [TemplateLanguage.Python]: {
            [TemplateType.SendD2C]: "python/sendD2C.py",
        },
        [TemplateLanguage.Ruby]: {
            [TemplateType.SendD2C]: "ruby/sendD2C.rb",
        },
    };

    public static LanguageIds = {
        [TemplateLanguage.Go]: "go",
        [TemplateLanguage.HTTP]: "http",
        [TemplateLanguage.Node]: "javascript",
        [TemplateLanguage.PHP]: "php",
        [TemplateLanguage.Python]: "python",
        [TemplateLanguage.Ruby]: "ruby",
    };

    // 'error', 'errorMessage' and 'stack' are used in vscode-azureextensionui npm
    public static errorProperties = {
        Message: "Message",
        detailedMessage: "detailedMessage",
        error: "error",
        errorMessage: "errorMessage",
        stack: "stack",
    };

    // Capture the {resource-group-name} in pattern /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/
    public static DpsResourceGroupNameRegex = /\/subscriptions\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/resourcegroups\/([^/]*)\//i;
    public static ResourcesFolderPath: string;

    public static initialize(context: vscode.ExtensionContext) {
        Constants.ExtensionContext = context;
        const directory = context.storagePath ? context.storagePath : os.tmpdir();
        Constants.ModuleTwinJosnFilePath = path.join(directory, Constants.ModuleTwinJosnFileName);
        Constants.DeviceTwinJosnFilePath = path.join(directory, Constants.DeviceTwinJosnFileName);
        Constants.ResourcesFolderPath = context.asAbsolutePath("resources");
    }
}
