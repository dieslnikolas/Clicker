using Clicker.Backend.Common.Validations;
using FluentValidation;

namespace Clicker.Backend.Commands.Settings;

public class SettingsEditCommandValidator : ValidatorBase<SettingsEditCommand>
{
    public SettingsEditCommandValidator()
    {
        RuleFor(x => x.Key)
            .NotEmpty();
    }
}