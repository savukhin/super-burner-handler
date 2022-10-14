import { Chart } from "../chart/chart";
import { BaseClient, ClientState } from "./BaseClient";

export class SerialClient extends BaseClient {
    port: string

    constructor(port: string) {
        super()
        this.port = port    
    }

    Connect(): Promise<boolean> {
        return new Promise(() => {
            setTimeout(() => {}, 1000)
            return true
        })
    }

    GetCharts(): Chart[] {
        return []
    }
}
