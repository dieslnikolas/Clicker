/**
 * Class for creating menubar
 */
export class Logger {

    /** Where error comes from */
    private static isRenderProcess : boolean = false;

    /**
     * Creates initial menu
     */
    public static catch(ex: any) {
        console.error(this.isRenderProcess ? `RENDERER PROCESS` : `MAIN PROCESS:`, ex);
    }

}