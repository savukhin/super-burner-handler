import React, { ChangeEvent, useEffect, useRef, useState } from "react";
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
    const [ COMs, setCOMs ] = useState<String[]>([])

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

    async function refreshCOMs() {
        setCOMs(await props.client.GetCOMs())
    }

    function sendMotorMove(event: ChangeEvent<HTMLInputElement>, axis: "x" | "y") {
        const target = event.target
        if (target == null)
            return
        console.log("sended value", target.value);
        
        props.client.Move(+target.value, axis)
    }

    return (
        <div className="options-wrapper">
            <input className="text-input" type="text" placeholder="A?"></input>
            <input type="button" className="btn" value="Run"></input>
            <input type="button" className="btn" value="Test run"></input>
            <div id="sliders">
                <Slider></Slider>
                <Slider></Slider>
                <Slider></Slider>
            </div>


            <Slider text="X-Axis" onChange={ (event) => { sendMotorMove(event, "x") } }></Slider>
            <Slider text="Y-Axis" onChange={ (event) => { sendMotorMove(event, "y") } }></Slider>

            <input type="button" className="btn" value="Refresh COMs" onClick={ refreshCOMs }></input>
            <select onChange={ (event) => { if (event.target) props.client.ChoseCOM(event.target.value) } }>
                { COMs.map((port, ind) => (
                    <option key={ ind }> { port } </option>
                )) }
            </select>

            { Array.from(props.charts.values()).map((chart) => {
                return(
                    generateChartOption(chart)
                )
            })}
        </div>
    )
}
