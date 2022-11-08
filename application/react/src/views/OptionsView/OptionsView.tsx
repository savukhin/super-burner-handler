import React, { useEffect, useRef, useState } from "react";
import { Chart, type MapChart } from "../../chart/chart";
import { BaseClient } from "../../client/BaseClient";
import { SerialClient } from "../../client/SerialClient";
import { Slider } from "../../components/slider/slider";
import './OptionsView.scss'
import { ipcRenderer } from "electron"

declare global {
    interface Window {
      require(moduleSpecifier: 'serialport'): typeof SerialPort;
      require(moduleSpecifier: 'electron'): typeof Electron;
    }
}

interface OptionsViewProps {
    client: BaseClient
    charts: MapChart
    onChartClick: (chart_id: number) => void
    onChartSettingsClick: (chart_id: number) => void
}

export function OptionsView(props: OptionsViewProps) {
    const selectCOMRef = useRef<HTMLSelectElement>(null);
    const [ COMs, setCOMs ] = useState<String[]>([])
    // const [ serialPort, _] = useState(new serialPort())
    // const port = new SerialPort.('', {})

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

    async function onCOMListOpen() {
        const ports = await ipcRenderer.invoke("set-title", "Work?")
        console.log(ports);
        setCOMs(ports)
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

            <select ref={ selectCOMRef } onClick={ onCOMListOpen }>
                { COMs.map((port) => (
                    <option> { port } </option>
                )) }
                {/* <option value="">--Please choose an option--</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="hamster">Hamster</option>
                <option value="parrot">Parrot</option>
                <option value="spider">Spider</option>
                <option value="goldfish">Goldfish</option> */}
            </select>

            { Array.from(props.charts.values()).map((chart) => {
                return(
                    generateChartOption(chart)
                )
            })}
        </div>
    )
}
