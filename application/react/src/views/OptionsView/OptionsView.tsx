import React, { useEffect } from "react";
import { Chart, type MapChart } from "../../chart/chart";
import { BaseClient } from "../../client/BaseClient";
import { SerialClient } from "../../client/SerialClient";
import { Slider } from "../../components/slider/slider";
import './OptionsView.scss'

interface OptionsViewProps {
    client: BaseClient
    charts: MapChart
    onChartClick: (chart_id: number) => void
    onChartSettingsClick: (chart_id: number) => void
}

export function OptionsView(props: OptionsViewProps) {
    function generateChartOption(chart: Chart) {
        return (
            <div className="chart-option" key={chart.id}>
                <input type="button" className="btn-no-right-radius btn" 
                    value={chart.title} onClick={() => { props.onChartClick(chart.id) }}></input>
                <input type="button" disabled={ !chart.showed } className="btn-no-left-radius btn" 
                    value="N" onClick={() => { props.onChartSettingsClick(chart.id) }} ></input>
            </div>
        )
    }

    return (
        <div>
            <input className="text-input" type="text" placeholder="A?"></input>
            <input type="button" className="btn" value="Run"></input>
            <input type="button" className="btn" value="Test run"></input>
            <div id="sliders">
                <Slider></Slider>
                <Slider></Slider>
                <Slider></Slider>
            </div>

            { Array.from(props.charts.values()).map((chart) => {
                return(
                    generateChartOption(chart)
                )
            })}
        </div>
    )
}
