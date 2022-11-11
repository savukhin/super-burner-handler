import { Chart } from "../chart/chart";
import { Axis, BaseClient, ClientState, Direction } from "./BaseClient";

export class HttpClient extends BaseClient {
    ip: string

    constructor(ip: string) {
        super()
        this.ip = ip    
    }

    Connect(): Promise<boolean> {
        return new Promise(() => {
            setTimeout(() => {}, 1000)
            return false
        })
    }

    GetCharts(): Chart[] {
        return []
    }

    Move(length: number, axis: "x" | "y"): void {}

}