import React from "react";
import { Legend, Line, LineChart, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Chart } from "../../chart/chart";
import { CrossIcon } from "../../icons/CrossIcon";
import './chart.scss'

interface ChartProps {
    chart: Chart
    onHideSettings: () => void
}

export function ChartComponent(props: ChartProps) {
    return (
        <div className="chart">
            <h3>{ props.chart.title} </h3>
                <ResponsiveContainer height="90%" width="90%" className="reponsive-container" >
                    <LineChart data={props.chart.data}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                        <XAxis dataKey="name"/>
                        <YAxis />
                        <Tooltip isAnimationActive={false} />
                        <Legend />
                        <Line type="monotone" isAnimationActive={ false } dataKey="pv" stroke="#8884d8" />
                        <Line type="monotone" isAnimationActive={ false } dataKey="uv" stroke="red" />
                    </LineChart>
                </ResponsiveContainer>

            { props.chart.showSettings ?
            <div className="chart-settings">
                <fieldset>
                    <span className="close" onClick={ props.onHideSettings }>
                        <CrossIcon height="10" width="10" />
                    </span>
                    <div className="chart-settings-option">
                        <label htmlFor="A">
                            Show A
                        </label>
                        <input type="checkbox" name="A" id="A" value="AAA"></input>
                        
                    </div>
                    <div className="chart-settings-option">
                        <input type="button" className="btn" value="Make B"></input>
                    </div>
                </fieldset>
            </div>
            : <></>}
        </div>
    )
}