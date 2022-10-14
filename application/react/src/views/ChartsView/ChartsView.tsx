import React from "react";
import './ChartsView.scss'
import { BaseClient } from "../../client/BaseClient";
import { ChartComponent } from "../../components/chart/chart";
import { Chart, MapChart } from "../../chart/chart";

interface ChartsViewProps {
    client: BaseClient,
    charts: MapChart,
}

export function ChartsView(props: ChartsViewProps) {
    return (
        <div id="charts-view">
            {[...props.charts.values()].filter((chart) => { return chart.showed }).map((chart) =>  (
                <ChartComponent title={ chart.title } key={chart.id} data={chart.data}></ChartComponent>
            ))}
        </div>
    )
}