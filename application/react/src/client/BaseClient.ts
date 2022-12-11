import { Chart } from "../chart/chart"
import { ipcRenderer } from "electron"

export class ClientState {
    charts: Chart[]

    constructor(charts: Chart[]) {
        this.charts = charts
    }
}

export enum Axis{x, y}
export enum Direction{plus, minus}

export abstract class BaseClient {
    protected state: ClientState | undefined
    abstract Connect(): Promise<boolean>
    abstract GetCharts(): Chart[]

    GetCOMs(): Promise<string[]> {
        const coms = ipcRenderer.invoke("get-coms")
        console.log(coms);
        
        return coms
    }

    ChoseCOM(COM: string) {
        console.log("chose", COM);
        ipcRenderer.send("chose-com", COM)
    }

    abstract Move(length: number, axis: "x" | "y"): void
}
