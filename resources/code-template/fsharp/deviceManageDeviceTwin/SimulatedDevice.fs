// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

// This application uses the Azure IoT Hub device SDK for .NET
// For samples see: https://github.com/Microsoft/iot-samples/tree/master/DeviceManagement/fsharp

// Learn more about F# at http://fsharp.org

open System
open System.Threading.Tasks
open Microsoft.Azure.Devices.Client
open Microsoft.Azure.Devices.Shared

// The device connection string to authenticate the device with your IoT hub.
let connectionString = "{{deviceConnectionString}}"

let onDesiredPropertyChanged (desiredProperties: TwinCollection) (_: obj) : Task =
    async {
        Console.WriteLine("New desired properties received:")
        Console.WriteLine(desiredProperties.ToJson())
    } |> Async.StartAsTask :> Task

let sendDeviceToCloudMessagesAsync = async {
    // Connect to the IoT hub using the MQTT protocol
    printfn "Connecting to IoT Hub"
    let deviceClient = DeviceClient.CreateFromConnectionString(connectionString, TransportType.Mqtt)
    let callback = DesiredPropertyUpdateCallback(onDesiredPropertyChanged)
    do! deviceClient.SetDesiredPropertyUpdateCallbackAsync(callback, null) |> Async.AwaitTask

    let reportedProperties = TwinCollection()
    let weather = TwinCollection()
    weather.["temperature"] <- 72
    weather.["humidity"] <- 17
    reportedProperties.["firmwareVersion"] <- "1.2.2"
    reportedProperties.["weather"] <- weather

    do! deviceClient.UpdateReportedPropertiesAsync(reportedProperties) |> Async.AwaitTask
}

[<EntryPoint>]
let main _ =
    sendDeviceToCloudMessagesAsync
    |> Async.RunSynchronously
    |> ignore

    printfn "Press Enter to exit."
    Console.ReadLine() |> ignore

    0
