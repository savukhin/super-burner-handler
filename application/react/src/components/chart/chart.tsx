import React from "react";
import { Legend, Line, LineChart, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import './chart.scss'

export function ChartComponent(props: { title: string, data: any }) {
    return (
        <div className="chart">
            <h3>{ props.title} </h3>
                <ResponsiveContainer height="90%" width="90%" className="reponsive-container" >
                    <LineChart data={props.data}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                        <XAxis dataKey="name"/>
                        <YAxis />
                        <Tooltip isAnimationActive={false} />
                        <Legend />
                        <Line type="monotone" isAnimationActive={ false } dataKey="pv" stroke="#8884d8" />
                        <Line type="monotone" isAnimationActive={ false } dataKey="uv" stroke="red" />
                    </LineChart>
                </ResponsiveContainer>
        </div>
    )
}