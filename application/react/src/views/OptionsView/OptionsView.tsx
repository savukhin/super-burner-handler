import React from "react";
import { BaseClient } from "../../client/BaseClient";
import { SerialClient } from "../../client/SerialClient";
import { Slider } from "../../components/slider/slider";
import './OptionsView.scss'

export function OptionsView(props: { client: BaseClient }) {
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
        </div>
    )
}
