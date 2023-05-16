import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
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
    const [ freeze, setFreeze ] = useState(false)
    const [ XPosition, setXPosition ] = useState(0)
    const [ stepRange, setStepRange] = useState(0)
    const [ currentSpeed, setCurrentSpeed] = useState(0)

    const [ speedXRapid, setSpeedXRapid] = useState(1600)
    const [ speedXFeed, setSpeedXFeed] = useState(1000)
    const [ speedYRapid, setSpeedYRapid] = useState(5000)
    const [ speedYFeed, setSpeedYFeed] = useState(1000)
    
    const [ pyrometerDegs, setPyrometerDegs ] = useState(0)
    const [ thermoCoupleDegs, setThermoCoupleDegs ] = useState(0)
    const [ photoResistorDegs, setPhotoResistorDegs ] = useState(0)
    const [ currentPosition, setCurrentPosition ] = useState<IPosition>({x: 0, y: 0})
    const [ blockedButtons, setBlockedButtons ] = useState(false)

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

    async function sendMotorMove(position: number, axis: "x" | "y", speed?: number) {
        console.log("sended value", position);
        
        if (axis == "x")
            setXMoving(true)
        else
            setYMoving(true)

        // await new Promise(async () => {
            const response = await props.client.Move(position, axis, speed)
            console.log(response);
            
            if (axis == "x") {
                setXPosition(response)
                setXMoving(false)
            } else {
                setYPosition(response)
                setYMoving(false)
            }

            return response
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
        setFreeze(true)
        experimentState.Start()
        await props.client.StartExperiment()
        experimentState.Finish()
        setFreeze(false)

        // experimentState.Start()
        // setExperimentState(Object.create(experimentState))

        // const MAX_Y = 190;
        // await sendMotorMove(0, "y", speedYRapid)
        // await sendMotorMove(0, "x", speedXRapid)

        // await sendMotorMove(experimentState.positions.x1_end, "x", speedXRapid)
        // await sendMotorMove(experimentState.positions.y_start, "y", speedYRapid)
        // await setTimeout(() => {}, 1000)

        // await sendMotorMove(MAX_Y, "y", speedYFeed)
        // await setTimeout(() => {}, 500)

        // await sendMotorMove(experimentState.positions.y_start, "y", speedYFeed)
        // await setTimeout(() => {}, 500)
        // await sendMotorMove(experimentState.positions.x2_end, "x", speedXRapid)

        // await setTimeout(() => {}, 500)
        // await sendMotorMove(MAX_Y, "y", speedYFeed)
        // await setTimeout(() => {}, 500)
        // await sendMotorMove(experimentState.positions.y_start, "y", speedYFeed)
        
        // await sendMotorMove(0, "y", speedYRapid)
        // await sendMotorMove(0, "x", speedXRapid)

        // console.log("Ended");
        

        // experimentState.Finish()
        // setExperimentState(Object.create(experimentState))
    }

    function onChangeCOM(newValue: IOptionValue) {
        if (!newValue) 
            return

        setChosenCOM(newValue.value)
    }

    async function connectCOM(com: string) {
        setBlockedButtons(true)

        const response1 = (await props.client.ChoseCOM(com)).split(";")
        if (!(response1.length == 1 && response1[0] == "ok")) {
            setErrors(response1)
            setBlockedButtons(false)

            return false
        }


        const response2 = (await props.client.Calibrate()).split(";")
        if (!(response2.length == 1 && response2[0] == "ok")) {
            setErrors(response2)
            setBlockedButtons(false)

            return false
        }

        setExperimentState(value => { experimentState.SetCOMPrepared(true); return Object.create(experimentState) })

        setBlockedButtons(false)
        
        return true
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
        let position = 0

        setFreeze(true)
        
        switch (direction) {
            case "up":
                position = await sendMotorMove(currentPosition.y + step, "y", speedYRapid)
                // currentPosition.y += step
                currentPosition.y = position
                break;
            case "down":
                position = await sendMotorMove(currentPosition.y - step, "y", speedYRapid)
                // currentPosition.y -= step
                currentPosition.y = position
                break;

            case "right":
                position = await sendMotorMove(currentPosition.x + step, "x", speedXRapid)
                // currentPosition.x += step
                currentPosition.x = position
                break;
            case "left":
                position = await sendMotorMove(currentPosition.x - step, "x", speedXRapid)
                // currentPosition.x -= step
                currentPosition.x = position
                break;
        }

        setCurrentPosition(Object.create(currentPosition))
        setFreeze(false)
    }

    const setVarFloat = useCallback(async (varname : "XLowSpeed" | "XHighSpeed" | "YLowSpeed" | "YHighSpeed", value: number) => {
        // props.client.SetVarFloat(varname, value)
        setFreeze(true)
        var response = await props.client.SetVarFloat(varname, value)
        // await response
        setFreeze(false)

    }, [props.client])

    useEffect(() => {
        setVarFloat("XLowSpeed", speedXFeed)
    }, [speedXFeed, props.client])
    useEffect(() => {
        setVarFloat("XHighSpeed", speedXRapid)
        // props.client.SetVarFloat("XHighSpeed", speedXRapid)
    }, [speedXRapid, props.client])
    useEffect(() => {
        setVarFloat("YLowSpeed", speedYFeed)
        // props.client.SetVarFloat("YLowSpeed", YLowSpeed)
    }, [speedYFeed, props.client])
    useEffect(() => {
        setVarFloat("YHighSpeed", speedYRapid)
        // props.client.SetVarFloat("YHighSpeed", speedYRapid)
    }, [speedYRapid, props.client])
    

    async function setExperimentPosition(point: "x" | "y1" | "y2") {
        setFreeze(true)
        switch (point) {
            case "x":
                await props.client.SetVarFloat("XStart", currentPosition.x)
                experimentState.positions.x1_start = currentPosition.x
                break;
            case "y1":
                await  props.client.SetVarFloat("YStart", currentPosition.y)
                experimentState.positions.y_start = currentPosition.y
                break;
            case "y2":
                await props.client.SetVarFloat("YEnd", currentPosition.y)
                experimentState.positions.y_end = currentPosition.y
                break;
        }

        setExperimentState(Object.create(experimentState))
        setFreeze(false)
    }

    function onChangeEndPosition(event: React.ChangeEvent<HTMLInputElement>, point: "x" | "y1" | "y2") {
        const value = +event.target.value
        if (isNaN(value)) {
            showErrorAlert("Value must be number!")
            return
        }

        switch (point) {
            case "x":
                experimentState.positions.x1_start = value
                props.client.SetVarFloat("XStart", value)
                break;
            case "y1":
                experimentState.positions.y_start = value
                props.client.SetVarFloat("YStart", value)
                break;
            case "y2":
                experimentState.positions.y_end = value
                props.client.SetVarFloat("YEnd", value)
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

    function onChangeSpeed(event: React.ChangeEvent<HTMLInputElement>) {
        const speed = +event.target.value
        if (isNaN(speed)) { 
            showErrorAlert("Type number!")
            return
        }

        setCurrentSpeed(speed)
    }

    async function forceStopExperiment() {

    }

    function onChangeNumericInput(event: React.ChangeEvent<HTMLInputElement>, setter: (value: number) => void) {
        const value = +event.target.value
        if (isNaN(value)) {
            showErrorAlert("Value must be number!")
            return
        }

        setter(value)
    }

    function generateControls() {
        return (
            <div className="controls-wrapper">
                {
                    freeze ? "Disabled" : "enabled"
                }
                {/* <Slider text="X-Axis" enabled={ !XMoving } onChange={ (event) => { sendMotorMoveBtn(event, "x") } }></Slider> */}
                <fieldset className="position-options-wrapper">
                    <div className="labeled-parameter">
                        <span>Step:</span>
                        <input type="text" placeholder="Step in mm - Type number" value={ stepRange } onChange={ onChangeStep } ></input>
                        <span>mm</span>
                    </div>
                    <div className="direction-arrows-wrapper">
                        <button disabled={ XMoving || YMoving || experimentState.Started || freeze } className="btn arrow-top" onClick={() => { moveArrowClick("up") }}>↑</button>
                        <button disabled={ XMoving || YMoving || experimentState.Started || freeze  } className="btn arrow-left" onClick={() => { moveArrowClick("left") }}>←</button>
                        <button disabled={ XMoving || YMoving || experimentState.Started || freeze  } className="btn arrow-bottom" onClick={() => { moveArrowClick("down") }}>↓</button>
                        <button disabled={ XMoving || YMoving || experimentState.Started || freeze  } className="btn arrow-right" onClick={() => { moveArrowClick("right") }}>→</button>
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

                    <button disabled={ XMoving || YMoving || experimentState.Started || freeze  } className="btn arrow-right" onClick={() => { setExperimentPosition("x") }}> Set X end position</button>
                    <button disabled={ XMoving || YMoving || experimentState.Started || freeze  } className="btn arrow-right" onClick={() => { setExperimentPosition("y1") }}> Set Y1 start position</button>
                    <button disabled={ XMoving || YMoving || experimentState.Started || freeze  } className="btn arrow-right" onClick={() => { setExperimentPosition("y2") }}> Set Y2 end position</button>
                </fieldset>
                <fieldset className="fixed-values">
                    <div className="labeled-parameter">
                        <span>X</span>
                        <input type="text" disabled={ experimentState.Started || freeze  } value={ experimentState.positions.x1_start } onChange={(event) => { onChangeEndPosition(event, "x") }}></input>
                        <span>mm</span>
                    </div>
                    <div className="labeled-parameter">
                        <span>Y1</span>
                        <input type="text" disabled={ experimentState.Started || freeze  } value={ experimentState.positions.y_start } onChange={(event) => { onChangeEndPosition(event, "y1") }}></input>
                        <span>mm</span>
                    </div>
                    <div className="labeled-parameter">
                        <span>Y2</span>
                        <input type="text" disabled={ experimentState.Started || freeze  } value={ experimentState.positions.y_end } onChange={(event) => { onChangeEndPosition(event, "y2") }}></input>
                        <span>mm</span>
                    </div>
                </fieldset>
                <fieldset className="run-fieldset">
                    <div className="labeled-parameter">
                        <span>Speed X Feed</span>
                        <input type="text" disabled={ experimentState.Started || freeze  } placeholder="Feed Speed X" value={ speedXFeed } onChange={ (event) => { onChangeNumericInput(event, setSpeedXFeed) } }></input>
                        <div className="fraction"><span>mm</span><span>min</span></div>
                    </div>
                    <div className="labeled-parameter">
                        <span>Speed Y Feed</span>
                        <input type="text" disabled={ experimentState.Started || freeze  } placeholder="Feed Speed Y" value={ speedYFeed } onChange={ (event) => { onChangeNumericInput(event, setSpeedYFeed) } }></input>
                        <div className="fraction"><span>mm</span><span>min</span></div>
                    </div>
                    <div className="labeled-parameter">
                        <span>Speed X Rapid</span>
                        <input type="text" disabled={ experimentState.Started || freeze  } placeholder="Rapid Speed X" value={ speedXRapid } onChange={ (event) => { onChangeNumericInput(event, setSpeedXRapid) } }></input>
                        <div className="fraction"><span>mm</span><span>min</span></div>
                    </div>
                    <div className="labeled-parameter">
                        <span>Speed Y Rapid</span>
                        <input type="text" disabled={ experimentState.Started || freeze  } placeholder="Rapid Speed Y" value={ speedYRapid } onChange={ (event) => { onChangeNumericInput(event, setSpeedYRapid) } }></input>
                        <div className="fraction"><span>mm</span><span>min</span></div>
                    </div>
                    <button disabled={ !experimentState.IsReadyToStart() || freeze } className="btn" onClick={ startExperiment }>Start experiment</button>
                    {/* <button disabled={ !experimentState.Started } className="btn btn-warning" onClick={ forceStopExperiment }>Stop</button> */}
                </fieldset>
                <fieldset className="sensors-fieldset">
                    <div className="labeled-parameter">
                        <span>Pyrometer</span>
                        <input type="text" readOnly={ true } value={ pyrometerDegs }></input>
                        <span>°C</span>
                    </div>
                    <div className="labeled-parameter">
                        <span>Thermo Couple</span>
                        <input type="text" readOnly={ true } value={ thermoCoupleDegs }></input>
                        <span>°C</span>
                    </div>
                    <div className="labeled-parameter">
                        <span>Photo Resistor</span>
                        <input type="text" readOnly={ true } value={ photoResistorDegs }></input>
                        <span>°C</span>
                    </div>
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
                <input type="button" disabled={ blockedButtons } className="btn" value="Refresh COMs" onClick={ refreshCOMs }></input>
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
                    isDisabled={ blockedButtons }
                />

                { chosenCOM ?
                    <input disabled={ blockedButtons } type="button" className="btn" value="Connect COM" onClick={ () => connectCOM(chosenCOM) }></input>
                    : ""
                }
            </>
                : <></>
            }

            { experimentState.COMPrepared 
                ? generateControls()
                : ""
            }

            {/* { experimentState.COMPrepared && !experimentState.YAxisPrepared 
                ? <>
                    <Slider text="Y-Axis" enabled={ !YMoving } onChange={ (event) => { sendMotorMoveBtn(event, "y") } }></Slider>
                    <input type="button" className="btn" disabled={ YMoving } value="Fix position" onClick={ fixYPosition }></input>
                </>
                : ""
            } */}
            {/* { experimentState.Started 
                ? generateControls()
                : ""
            } */}
            {/* <Slider text="Y-Axis" onChange={ (event) => { sendMotorMove(event, "y") } }></Slider> */}

            {/* { experimentState.IsReady() ? 
                <input type="button" className="btn" value="Start!" onClick={ startExperiment }></input>
                : <></>
            } */}

            { generateErrors(errors) }

            { Array.from(props.charts.values()).map((chart) => {
                return(
                    generateChartOption(chart)
                )
            })}

            
        </div>
    )
}
