import React from "react";

interface CrossIconProps {
    height: string | number,
    width: string | number
}

export function CrossIcon(props: CrossIconProps) {
    return (
        <svg width={ props.width } height={ props.height } viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="100" x2="100" y2="0" strokeWidth="8" stroke="black"/>
            <line x1="0" y1="0" x2="100" y2="100" strokeWidth="8" stroke="black"/>
        </svg>
    )
}