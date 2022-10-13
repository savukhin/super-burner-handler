import React, { useEffect, useRef } from "react";
import './app.scss'
import { Slider } from "./components/slider/slider";
import { ChartsView } from "./views/ChartsView/ChartsView";
import { OptionsView } from "./views/OptionsView/OptionsView";

export function App() {
    return (
        <div id="app">
            <div id="options" className="block">
                <OptionsView/>
            </div>
            <div id="charts" className="block">
                <ChartsView/>
            </div>
        </div>
    )
}