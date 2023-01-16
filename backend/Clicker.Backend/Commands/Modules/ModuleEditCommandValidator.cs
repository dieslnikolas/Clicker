using Clicker.Backend.Common.Validations;
using FluentValidation;

namespace Clicker.Backend.Commands.Modules;

public class ModuleEditCommandValidator : ValidatorBase<ModuleEditCommand>
{
    public ModuleEditCommandValidator()
    {
        RuleFor(x => x.Key)
            .NotEmpty();
    }
}