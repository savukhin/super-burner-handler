import React, { useEffect, useState } from "react";
import { BaseClient } from "./client/BaseClient";
import { ChartsView } from "./views/ChartsView/ChartsView";
import { OptionsView } from "./views/OptionsView/OptionsView";
import { Chart } from "./chart/chart";
import './main.scss'

interface MainProps {
    client: BaseClient
}

export function Main(props: MainProps) {
    const [charts, setCharts] = useState(new Map<number, Chart>())

    useEffect(() => {
        props.client.GetCharts().forEach((chart) => {
            setCharts(prev => new Map([...prev, [chart.id, chart]]))
        })
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
        <div id="main">
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