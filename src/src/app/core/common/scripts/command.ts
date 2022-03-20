/**
 * Represents script command
 */
export class Command {

    /**
     * Command key
     */
    public DisplayName: string;

    /**
     * Context
     */
    public IsContext: boolean;

    /**
     * Default action
     */
    public IsDefault: boolean;

    /**
     * Path to command
     */
    public Path: string;

}