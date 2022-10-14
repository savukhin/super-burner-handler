import React, { useEffect, useRef, useState } from "react";
import './app.scss'
import { Chart } from "./chart/chart";
import { BaseClient } from "./client/BaseClient";
import { Slider } from "./components/slider/slider";
import { ChartsView } from "./views/ChartsView/ChartsView";
import { OptionsView } from "./views/OptionsView/OptionsView";

export function App(props: { client: BaseClient }) {
    const [charts, setCharts] = useState(new Map<number, Chart>())
    const [showedCharts, setShowedCharts] = useState<Chart[]>([])

    useEffect(() => {
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

        // chart1.showed = true
        // chart2.showed = true

        
        setCharts(prev => new Map([...prev, [chart1.id, chart1]]))
        setCharts(prev => new Map([...prev, [chart2.id, chart2]]))
    }, [])

    

    function toggleChart(id: number) {
        let chart = charts.get(id)
        if (!chart) 
            return
            
        chart.showed = !chart.showed
        setCharts(prev => new Map([...prev, [chart!.id, chart!]]))
    }

    function showChartSettings(id: number) {

    }

    return (
        <div id="app">
            <div id="options" className="block">
                <OptionsView client={ props.client } charts={ charts } 
                    onChartClick={toggleChart} onChartSettingsClick={showChartSettings} />
            </div>
            <div id="divider"></div>
            <div id="charts" className="block">
                <ChartsView client={ props.client} charts={ charts }/>
            </div>
        </div>
    )
}