export class Settings {
    
    /** Iw its running in the production */
    isProduction: boolean;

    constructor(){}
    
    /**
     * Reads config file
     */
    init() {
        this.isProduction = false;
    }
}