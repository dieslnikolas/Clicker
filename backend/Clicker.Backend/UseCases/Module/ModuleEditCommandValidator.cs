using Clicker.Backend.Common.Validations;
using FluentValidation;

namespace Clicker.Backend.UseCases.Module;

public class ModuleEditCommandValidator : Validator<ModuleEditCommand>
{
    public ModuleEditCommandValidator()
    {
        RuleFor(x => x.Key)
            .NotEmpty();
    }
}