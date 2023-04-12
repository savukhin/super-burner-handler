import React from "react";
import './ChartsView.scss'
import { BaseClient } from "../../models/client/BaseClient";
import { ChartComponent } from "../../components/chart/chart";
import { Chart, MapChart } from "../../chart/chart";

interface ChartsViewProps {
    client: BaseClient,
    charts: MapChart,
    onHideSettings: (id: number) => void
}

export function ChartsView(props: ChartsViewProps) {
    return (
        <div id="charts-view">
            {[...props.charts.values()].filter((chart) => { return chart.showed }).map((chart) =>  (
                <ChartComponent key={chart.id} chart={chart}
                    onHideSettings={() => { props.onHideSettings(chart.id) }}></ChartComponent>
            ))}
        </div>
    )
}