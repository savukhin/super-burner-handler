import { Chart } from "../../chart/chart";
import { Axis, BaseClient, ClientState, Direction } from "./BaseClient";
import { ipcRenderer } from "electron"

export class SerialClient extends BaseClient {
    constructor() {
        super()
    }

    Connect(): Promise<boolean> {
        return new Promise((resolve) => setTimeout(resolve, 1)).then(() => {
            return true
        })
    }

    GetCharts(): Chart[] {
        return []
    }

    async Move(length: number, axis: "x" | "y") {
        console.log(length);
        
        return await ipcRenderer.invoke("send-move", length, axis) as number
    }

    Calibrate() {
        return ipcRenderer.invoke("calibrate")
    }
}
