import { BaseClient } from "./BaseClient";

export class SerialClient implements BaseClient {
    port: string

    constructor(port: string) {
        this.port = port    
    }

    Connect(): boolean {
        return false
    }
}
