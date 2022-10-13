import React, { useEffect, useRef } from "react";
import './app.scss'
import { BaseClient } from "./client/BaseClient";
import { Slider } from "./components/slider/slider";
import { ChartsView } from "./views/ChartsView/ChartsView";
import { OptionsView } from "./views/OptionsView/OptionsView";

export function App(props: { client: BaseClient }) {
    return (
        <div id="app">
            <div id="options" className="block">
                <OptionsView client={ props.client }/>
            </div>
            <div id="charts" className="block">
                <ChartsView client={ props.client }/>
            </div>
        </div>
    )
}