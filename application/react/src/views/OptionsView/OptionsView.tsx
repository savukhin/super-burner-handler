import React from "react";
import { BaseClient } from "../../client/BaseClient";
import { SerialClient } from "../../client/SerialClient";
import './OptionsView.scss'

export function OptionsView(props: { client: BaseClient }) {
    return (
        <div>
            <input placeholder="A?"></input>
        </div>
    )
}
