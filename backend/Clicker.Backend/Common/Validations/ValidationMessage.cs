namespace Clicker.Backend.Common.Validations
{
    /// <summary>
    /// Validation
    /// </summary>
    public class ValidationMessage
    {
        public string Property { get; set; }
        public string DisplayName { get; set; }
        public string ResourceName { get; set; }
        public string[] Args { get; set; }

        public override string ToString() => this.DisplayName;
    }
}