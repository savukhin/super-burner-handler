import React, { useEffect, useState } from "react";
import { BaseClient } from "./models/client/BaseClient";
import { ChartsView } from "./views/ChartsView/ChartsView";
import { OptionsView } from "./views/OptionsView/OptionsView";
import { Chart } from "./chart/chart";
import './main.scss'
import { SerialClient } from "./models/client/SerialClient";

interface MainProps {
    client: SerialClient
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

    function toggleChartSettings(id: number, state: boolean | undefined = undefined) {
        let chart = charts.get(id)
        if (!chart) 
            return
        
        if (!state)
            chart.showSettings = !chart.showSettings
        else
            chart.showSettings = state
        
        setCharts(prev => new Map([...prev, [chart!.id, chart!]]))
    }

    return (
        <div id="main">
            <div id="options" className="block">
                <OptionsView client={ props.client } charts={ charts } 
                    onChartClick={toggleChart} onChartSettingsClick={(id) => {toggleChartSettings(id)}} />
            </div>
            <div id="divider"></div>
            <div id="charts" className="block">
                <ChartsView client={ props.client} charts={ charts }
                    onHideSettings={(id) => { toggleChartSettings(id, false) }}/>
            </div>
        </div>
    )
}