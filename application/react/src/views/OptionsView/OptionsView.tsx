import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Chart, type MapChart } from "../../chart/chart";
import { BaseClient } from "../../models/client/BaseClient";
import { SerialClient } from "../../models/client/SerialClient";
import { Slider } from "../../components/slider/slider";
import './OptionsView.scss'
import Select, { StylesConfig } from 'react-select';
import { ExperimentState, IPosition, IPositions } from "../../models/Experiment/ExperimentState";
import { ipcRenderer } from "electron";

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
    const [ stepRange, setStepRange] = useState(0)
    const [ currentPosition, setCurrentPosition ] = useState<IPosition>({x: 0, y: 0})

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

    function showErrorAlert(msg: string) {
        ipcRenderer.invoke("show-message-box", msg)
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

    async function startExperiment() {
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

    async function moveArrowClick(direction: "up" | "left" | "down" | "right") {
        const step = stepRange
        
        switch (direction) {
            case "up":
                await sendMotorMove(currentPosition.x + step, "x")
                currentPosition.x += step
                break;
            case "down":
                await sendMotorMove(currentPosition.x - step, "x")
                currentPosition.x -= step
                break;

            case "right":
                await sendMotorMove(currentPosition.y + step, "y")
                currentPosition.y += step
                break;
            case "left":
                await sendMotorMove(currentPosition.y - step, "y")
                currentPosition.y -= step
                break;
        }
    }

    function setExperimentPosition(point: "x1" | "x2" | "y") {
        switch (point) {
            case "x1":
                experimentState.positions.x1_end = currentPosition.x
                break;
            case "x2":
                experimentState.positions.x2_end = currentPosition.x
                break;
            case "y":
                experimentState.positions.y_start = currentPosition.y
                break;
        }

        setExperimentState(Object.create(experimentState))
    }

    function onChangeEndPosition(event: React.ChangeEvent<HTMLInputElement>, point: "x1" | "x2" | "y") {
        const value = +event.target.value
        if (isNaN(value)) {
            showErrorAlert("Value must be number!")
            return
        }

        switch (point) {
            case "x1":
                experimentState.positions.x1_end = value
                break;
            case "x2":
                experimentState.positions.x2_end = value
                break;
            case "y":
                experimentState.positions.y_start = value
                break;
        }

        setExperimentState(Object.create(experimentState))
    }

    function onChangeStep(event: React.ChangeEvent<HTMLInputElement>) {
        const step = +event.target.value
        if (isNaN(step)) { 
            showErrorAlert("Type number!")
            return
        }

        setStepRange(step)
    }

    async function forceStopExperiment() {

    }

    function generateControls() {
        return (
            <div className="controls-wrapper">
                {/* <Slider text="X-Axis" enabled={ !XMoving } onChange={ (event) => { sendMotorMoveBtn(event, "x") } }></Slider> */}
                <fieldset className="position-options-wrapper">
                    <div className="labeled-parameter">
                        <span>Step:</span>
                        <input type="text" placeholder="Step in mm - Type number" value={ stepRange } onChange={ onChangeStep } ></input>
                        <span>mm</span>
                    </div>
                    <div className="direction-arrows-wrapper">
                        <button disabled={ XMoving || YMoving || experimentState.Started } className="btn arrow-top" onClick={() => { moveArrowClick("up") }}>↑</button>
                        <button disabled={ XMoving || YMoving || experimentState.Started } className="btn arrow-left" onClick={() => { moveArrowClick("left") }}>←</button>
                        <button disabled={ XMoving || YMoving || experimentState.Started } className="btn arrow-bottom" onClick={() => { moveArrowClick("down") }}>↓</button>
                        <button disabled={ XMoving || YMoving || experimentState.Started } className="btn arrow-right" onClick={() => { moveArrowClick("right") }}>→</button>
                    </div>

                    <h3>Current position</h3>
                    <div className="labeled-parameter">
                        <span>X:</span>
                        <input type="text" style={{ pointerEvents: "none" }} readOnly value={ currentPosition.x }></input>
                        <span>mm</span>
                    </div>
                    <div className="labeled-parameter">
                        <span>Y:</span>
                        <input type="text" style={{ pointerEvents: "none" }} readOnly value={ currentPosition.y }></input>
                        <span>mm</span>
                    </div>

                    <button disabled={ XMoving || YMoving || experimentState.Started } className="btn arrow-right" onClick={() => { setExperimentPosition("x1") }}> Set X1 end position</button>
                    <button disabled={ XMoving || YMoving || experimentState.Started } className="btn arrow-right" onClick={() => { setExperimentPosition("x2") }}> Set X2 end position</button>
                    <button disabled={ XMoving || YMoving || experimentState.Started } className="btn arrow-right" onClick={() => { setExperimentPosition("y") }}> Set Y start position</button>
                </fieldset>
                <fieldset className="fixed-values">
                    <div className="labeled-parameter">
                        <span>X1</span>
                        <input type="text" disabled={ experimentState.Started } value={ experimentState.positions.x1_end } onChange={(event) => { onChangeEndPosition(event, "x1") }}></input>
                        <span>mm</span>
                    </div>
                    <div className="labeled-parameter">
                        <span>X2</span>
                        <input type="text" disabled={ experimentState.Started } value={ experimentState.positions.x2_end } onChange={(event) => { onChangeEndPosition(event, "x2") }}></input>
                        <span>mm</span>
                    </div>
                    <div className="labeled-parameter">
                        <span>Y</span>
                        <input type="text" disabled={ experimentState.Started } value={ experimentState.positions.y_start } onChange={(event) => { onChangeEndPosition(event, "y") }}></input>
                        <span>mm</span>
                    </div>
                </fieldset>
                <fieldset className="run-fieldset">
                    <div className="labeled-input">
                        <input type="text" placeholder="Speed"></input> <span>mm/s</span>
                    </div>
                    <button disabled={ !experimentState.IsReadyToStart() } className="btn" onClick={ startExperiment }>Start experiment</button>
                    <button disabled={ !experimentState.Started } className="btn btn-warning" onClick={ forceStopExperiment }>Stop</button>
                </fieldset>
            </div>
        )
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

            { experimentState.COMPrepared 
                ? generateControls()
                : ""
            }

            { experimentState.COMPrepared && !experimentState.YAxisPrepared 
                ? <>
                    <Slider text="Y-Axis" enabled={ !YMoving } onChange={ (event) => { sendMotorMoveBtn(event, "y") } }></Slider>
                    <input type="button" className="btn" disabled={ YMoving } value="Fix position" onClick={ fixYPosition }></input>
                </>
                : ""
            }
            { experimentState.Started 
                ? generateControls()
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
