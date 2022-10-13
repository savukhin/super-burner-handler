import React from "react";
import './app.scss'
import { Slider } from "./components/slider/slider";

export function App() {
    return (
        <div id="app">
            <div className="block">
                <h1>App</h1>
            </div>
            <div className="block">
                <Slider></Slider>
            </div>
        </div>
    )
}