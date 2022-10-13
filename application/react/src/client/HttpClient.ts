import { BaseClient } from "./BaseClient";

export class HttpClient implements BaseClient {
    ip: string

    constructor(ip: string) {
        this.ip = ip    
    }

    Connect(): boolean {
        return false
    }
}