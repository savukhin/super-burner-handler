import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Chart, type MapChart } from "../../chart/chart";
import { BaseClient } from "../../client/BaseClient";
import { SerialClient } from "../../client/SerialClient";
import { Slider } from "../../components/slider/slider";
import './OptionsView.scss'
import Select, { StylesConfig } from 'react-select';


interface OptionsViewProps {
    client: BaseClient
    charts: MapChart
    onChartClick: (chart_id: number) => void
    onChartSettingsClick: (chart_id: number) => void
}

const COMsStyles: StylesConfig = {
    control: styles => ({ ...styles, backgroundColor: '#474238', borderColor: 'var(--bg-color-dark-2)',  color: 'white', overflow: "hidden" }),
    dropdownIndicator: styles => ({ ...styles, backgroundColor: '#EB7F13',  color: 'blue' }),
    
    indicatorSeparator: styles => ({ ...styles, display: "none" }),
    // container: styles => ({ ...styles, backgroundColor: 'blue',  color: 'blue' }),
    singleValue: styles => ({ ...styles, color: 'white' }),
    // menu: styles => ({ ...styles, backgroundColor: 'lime',  color: 'blue' }),
    // singleValue: styles => ({ ...styles, backgroundColor: 'pink',  color: 'blue' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: "#fffefe",
        color: 'black',
        cursor: isDisabled ? 'not-allowed' : 'default',
      };
    },
};

export function OptionsView(props: OptionsViewProps) {
    const [ COMs, setCOMs ] = useState<string[]>([])

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
        const coms = await props.client.GetCOMs()
        setCOMs(coms)

        console.log(coms);
        

        if (coms.length > 0)
            props.client.ChoseCOM(coms[0])
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
            {/* <select onChange={ (event) => { console.log("Changed!");
             if (event.target) props.client.ChoseCOM(event.target.value) } }>
                { COMs.map((port, ind) => (
                    <option key={ ind }> { port } </option>
                )) }
            </select> */}
            <Select
                options={
                    COMs.map(COM => { return { value: COM, label: COM, isFixed: true } })
                }
                isSearchable={false}
                styles={COMsStyles}
            />

            { Array.from(props.charts.values()).map((chart) => {
                return(
                    generateChartOption(chart)
                )
            })}
        </div>
    )
}
