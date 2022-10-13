import React, { useEffect, useRef } from "react";
import './app.scss'
import { Slider } from "./components/slider/slider";

export function App() {
    const sliders = useRef<HTMLDivElement>(null)
    const divider = useRef<HTMLDivElement>(null)
    let resizing = false
    let slidersBottom = 0
    let dividerHeightHalf = 0

    useEffect(() => {
        if (sliders && sliders.current && divider && divider.current) {
            slidersBottom = sliders.current.getBoundingClientRect().bottom
            dividerHeightHalf = divider.current.getBoundingClientRect().height / 2
        }
    }, [])

    function startResizeSliders(event: React.MouseEvent) {
        resizing = true
    }

    function stopResizeSliders(event: React.MouseEvent) {
        resizing = false
    }

    function resizeSliders(event: React.MouseEvent) {
        if (!sliders || !sliders.current || !resizing)
            return

        let newHeight = slidersBottom - event.pageY - dividerHeightHalf
        newHeight = Math.max(...[newHeight, 100])
        // newHeight = Math.min(...[newHeight, 800])

        document.documentElement.style.setProperty("--sliders-height", newHeight + "px");
    }

    return (
        <div id="app" 
            onMouseMove={resizeSliders} 
            onMouseUp={stopResizeSliders}
        >
            <div id="charts" className="block">
                <h1>App</h1>
            </div>
            <div id="block-dividers" ref={divider}
                onMouseDown={startResizeSliders}>...</div>
            <div id="sliders" ref={sliders} className="block">
                <Slider></Slider>
            </div>
        </div>
    )
}