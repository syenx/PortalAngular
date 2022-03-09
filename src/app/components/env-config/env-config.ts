import { Injectable } from '@angular/core';

declare var require: any;

@Injectable({
    providedIn: 'root'
})
export class EnvConfig {

    public env: Env = null;
    constructor() {
        this.env = require('./env-config.json')[window.location.hostname];
    }

    public async getEnv(): Promise<Env> {
        return this.env;
    }
}

export class Env {
    public ambiente: string;
    public apiUrl: string;
    public clientId: string;
    public authority: string;
    public redirectUri: string;

}
