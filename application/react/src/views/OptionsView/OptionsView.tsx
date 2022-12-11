import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Chart, type MapChart } from "../../chart/chart";
import { BaseClient } from "../../models/client/BaseClient";
import { SerialClient } from "../../models/client/SerialClient";
import { Slider } from "../../components/slider/slider";
import './OptionsView.scss'
import Select, { StylesConfig } from 'react-select';
import { ExperimentState } from "../../models/Experiment/ExperimentState";


interface OptionsViewProps {
    client: SerialClient
    charts: MapChart
    onChartClick: (chart_id: number) => void
    onChartSettingsClick: (chart_id: number) => void
}

const COMsStyles: StylesConfig = {
    control: styles => ({ ...styles, backgroundColor: 'var(--bg-color-dark)', borderColor: 'var(--bg-color-dark-2)',  color: 'var(--text-color-light)', overflow: "hidden" }),
    dropdownIndicator: styles => ({ ...styles, backgroundColor: 'var(--main-color)',  color: 'var(--text-color-light)' }),
    
    indicatorSeparator: styles => ({ ...styles, display: "none" }),
    singleValue: styles => ({ ...styles, color: 'var(--text-color-light)' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: "#fffefe",
        color: 'black',
        cursor: isDisabled ? 'not-allowed' : 'default',
      };
    },
};

interface IOptionValue {
    value: string 
    label: string
    isFixed: boolean
}

export function OptionsView(props: OptionsViewProps) {
    const [ COMs, setCOMs ] = useState<string[]>([])
    const [ experimentState, setExperimentState ] = useState(new ExperimentState());
    const [ chosenCOM, setChosenCOM ] = useState<string>()
    const [ errors, setErrors ] = useState<string[]>()
    const [ YMoving, setYMoving ] = useState(false)
    const [ YPosition, setYPosition ] = useState(0)
    const [ XMoving, setXMoving ] = useState(false)
    const [ XPosition, setXPosition ] = useState(0)

    useEffect(() => {
        refreshCOMs()
    }, [])

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
    }

    async function sendMotorMove(position: number, axis: "x" | "y") {
        console.log("sended value", position);
        
        if (axis == "x")
            setXMoving(true)
        else
            setYMoving(true)

        // await new Promise(async () => {
            const response = await props.client.Move(position, axis)
            console.log(response);
            
            if (axis == "x") {
                setXPosition(position)
                setXMoving(false)
            } else {
                setYPosition(position)
                setYMoving(false)
            }
        // })
    }

    async function sendMotorMoveBtn(event: ChangeEvent<HTMLInputElement>, axis: "x" | "y") {
        const target = event.target
        if (target == null)
            return

        const position = +target.value
        if (isNaN(position))
            return
        
        sendMotorMove(position, axis)
    }

    function startExperiment() {
        experimentState.Start()
        setExperimentState(Object.create(experimentState))
    }

    function onChangeCOM(newValue: IOptionValue) {
        if (!newValue) 
            return

        setChosenCOM(newValue.value)
    }

    async function connectCOM(com: string) {
        const response = (await props.client.ChoseCOM(com)).split(";")
        if (response.length == 1 && response[0] == "ok") {
            setExperimentState(value => { experimentState.SetCOMPrepared(true); return Object.create(experimentState) })
            
            return true
        }
        
        setErrors(response)
        
    }

    function generateErrors(errors: string[] | undefined) {
        if (errors == undefined || errors.length == 0)
            return <></>
        
        return (
            <ul>
                { errors.map((error, ind) => 
                <li className="warning" key={ind}>
                    { error }
                </li>)}
            </ul>
        )
    }

    function fixYPosition() {
        setExperimentState(value => { experimentState.SetYAxisEndPositionn(YPosition); return Object.create(experimentState) })
        sendMotorMove(0, "y")
    }

    return (
        <div className="options-wrapper">
            {/* <input className="text-input" type="text" placeholder="A?"></input> */}
            {/* <input type="button" className="btn" value="Test run"></input> */}
            <div id="sliders">
                {/* <Slider></Slider>
                <Slider></Slider>
                <Slider></Slider> */}
            </div>

            { !experimentState.COMPrepared ? 
            <>
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
                    onChange={ (newValue) => { onChangeCOM(newValue as IOptionValue) } }
                    styles={COMsStyles}
                />

                { chosenCOM ?
                    <input type="button" className="btn" value="Connect COM" onClick={ () => connectCOM(chosenCOM) }></input>
                    : ""
                }
            </>
                : <></>
            }

            { experimentState.COMPrepared && !experimentState.YAxisPrepared 
                ? <>
                    <Slider text="Y-Axis" enabled={ !YMoving } onChange={ (event) => { sendMotorMoveBtn(event, "y") } }></Slider>
                    <input type="button" className="btn" disabled={ YMoving } value="Fix position" onClick={ fixYPosition }></input>
                </>
                : ""
            }
            { experimentState.Started 
                ? <Slider text="X-Axis" enabled={ !XMoving } onChange={ (event) => { sendMotorMoveBtn(event, "x") } }></Slider>
                : ""
            }
            {/* <Slider text="Y-Axis" onChange={ (event) => { sendMotorMove(event, "y") } }></Slider> */}

            { experimentState.IsReady() ? 
                <input type="button" className="btn" value="Start!" onClick={ startExperiment }></input>
                : <></>
            }

            { generateErrors(errors) }

            { Array.from(props.charts.values()).map((chart) => {
                return(
                    generateChartOption(chart)
                )
            })}

            
        </div>
    )
}
