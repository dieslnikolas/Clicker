using Clicker.Backend.Common.Validations;
using FluentValidation;

namespace Clicker.Backend.UseCases.Module;

public class ModuleInsertCommandValidator : Validator<ModuleInsertCommand>
{
    public ModuleInsertCommandValidator()
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