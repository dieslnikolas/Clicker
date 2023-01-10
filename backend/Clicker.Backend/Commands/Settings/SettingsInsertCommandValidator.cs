using Clicker.Backend.Common.Validations;
using FluentValidation;

namespace Clicker.Backend.Commands.Settings;

public class SettingsInsertCommandValidator : Validator<SettingsInsertCommand>
{
    public SettingsInsertCommandValidator()
    {
        RuleFor(x => x.Key)
            .NotEmpty()
            .MinimumLength(1)
            .MaximumLength(16);
        
        RuleFor(x => x.Name)
            .NotEmpty()
            .MinimumLength(1)
            .MaximumLength(16);

    }
}