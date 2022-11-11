import React, { ChangeEvent } from "react";
import './slider.scss'

interface SliderProps {
    text?: string,
    onChange?: (event: ChangeEvent<HTMLInputElement> ) => void
}

export function Slider(props: SliderProps) {
    return (
        <div className="slider-wrapper">
            <span> { props.text } </span>
            <input type="range" onChange={ (event) => { if (props.onChange) props.onChange(event) } }>
            </input>
        </div>
    )
}