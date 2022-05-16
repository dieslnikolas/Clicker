import { exit } from "process";
import { IEnv } from "../../core/interfaces/IEnv";
export { IEnv } from "../../core/interfaces/IEnv";

export const env: () => IEnv = () => {
    if (process.env.ENVIRONMENT === "dev") {
        let env = require("./_dev");
        return env;
    } else if (process.env.ENVIRONMENT === "production") {
        let env = require("./_prod");
        return env;
    } else {
        console.log(
            `Error. shell variable ENVIRONMENT not set. Acceptable values are 'dev' | 'production'`
        );
        exit(1);
    }
};
