export class Chart {
    id: number
    title: string
    data: any
    showed = false

    constructor(id: number, title: string, data: any) {
        this.id = id
        this.title = title
        this.data = data
    }
}

export type MapChart = Map<number, Chart>

// export class ChartMap extends Map<number, Chart> {

//     constructor() {
//         super()
//     }

//     push(chart: Chart) {
//         this.set(chart.id, chart)
//         return this
//     }

//     get(id: number) {
//         return super.get(id)
//     }
// }