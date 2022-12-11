import { Chart } from "../../chart/chart"
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
        return ipcRenderer.invoke("get-coms")
    }

    async ChoseCOM(COM: string) {
        const res = await ipcRenderer.invoke("chose-com", COM)
        return res as string
    }

    abstract Move(length: number, axis: "x" | "y"): void
}
