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
    public HasData: boolean;

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

    /**
     * If its action over module data, it needs to be filled
     */
    public ProcessItem: { [key: string]: any; };

    /**
     * Key (name of the property)
     */
     public Key: string;

}