export class Settings {
    
    /** Iw its running in the production */
    static isProduction: boolean;

    /**
     * Reads config file
     */
    static init() {
        this.isProduction = false;
    }
}