export class Chart {
    id: number
    title: string
    data: any
    showed = false
    showSettings = false

    constructor(id: number, title: string, data: any) {
        this.id = id
        this.title = title
        this.data = data
    }
}

export type MapChart = Map<number, Chart>
