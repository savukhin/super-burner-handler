import { Chart } from "../chart/chart"

export class ClientState {
    charts: Chart[]

    constructor(charts: Chart[]) {
        this.charts = charts
    }
}

export abstract class BaseClient {
    protected state: ClientState | undefined
    abstract Connect(): Promise<boolean>
    abstract GetCharts(): Chart[]
}
