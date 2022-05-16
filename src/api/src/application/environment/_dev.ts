import { IEnv } from "../../core/interfaces/IEnv";

export const ENV: IEnv = {
    secret: `coolsecret`,
    stage: process.env.ENVIRONMENT,
    port: 8082,
    domain: '',
    apiPath: '/api',
    staticPath: ''
}


