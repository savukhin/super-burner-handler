import React, { useEffect, useState } from "react";
import './app.scss'
import { BaseClient } from "./models/client/BaseClient";
import { Main } from "./main";

export function App(props: { client: BaseClient }) {
    const [error, setError] = useState<string>()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(true)
        props.client.Connect().then((connected) => {
            console.log(connected);
            
            if (!connected) {
                setError("Cannot connect to the client")

                return
            }

            setIsLoading(false)
        })
    }, [])

    if (isLoading) {
        return (
            <div id="app-loading">
                <h1> Loading... </h1>
            </div>
        )
    }

    if (error) {
        return (
            <div id="app-loading">
                <h1> { error } </h1>
            </div>
        )
    }

    return (
        <Main client={ props.client }></Main>
    )
}