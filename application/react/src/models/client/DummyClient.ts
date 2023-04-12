import { Chart } from "../../chart/chart";
import { Axis, BaseClient, ClientState, Direction } from "./BaseClient";

export class DummyClient extends BaseClient {
    state: ClientState | undefined;

    constructor() {
        super()
    }

    private generateCharts(): Chart[] {
        let chart1 = new Chart(1, "Chart 1", 
            [
                { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
                { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
                { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
                { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
                { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
                { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
                { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
            ]
        )

        let chart2 = new Chart(2, "Chart 2", [
            { name: 'Page A', uv: 1000, pv: 2400, amt: 2400 },
            { name: 'Page B', uv: 1000, pv: 2398, amt: 2210 },
            { name: 'Page C', uv: 1000, pv: 2800, amt: 2290 },
            { name: 'Page D', uv: 1780, pv: 2908, amt: 2000 },
            { name: 'Page E', uv: 1890, pv: 2800, amt: 2181 },
            { name: 'Page F', uv: 1390, pv: 2800, amt: 2500 },
            { name: 'Page G', uv: 1490, pv: 300, amt: 2100 },
        ])

        return [chart1, chart2]
    }

    Connect(): Promise<boolean> {
        return new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
            return true
        })
    }

    GetCharts(): Chart[] {
        return this.generateCharts()
    }

    Move(length: number, axis: "x" | "y"): void {}
}