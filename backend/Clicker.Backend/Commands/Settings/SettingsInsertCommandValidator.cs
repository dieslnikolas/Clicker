using Clicker.Backend.Common.Validations;
using FluentValidation;

namespace Clicker.Backend.Commands.Settings;

public class SettingsInsertCommandValidator : ValidatorBase<SettingsInsertCommand>
{
    public SettingsInsertCommandValidator()
    {
        RuleFor(x => x.Key)
            .NotEmpty()
            .MinimumLength(1)
            .MaximumLength(16);
        
        RuleFor(x => x.Value)
            .NotEmpty()
            .MinimumLength(1)
            .MaximumLength(16);

    }
}