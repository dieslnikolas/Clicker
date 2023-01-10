using Clicker.Backend.Common.Validations;
using FluentValidation;

namespace Clicker.Backend.Commands.Scripts;

public class ScriptInsertCommandValidator : Validator<ScriptInsertCommand>
{
    public ScriptInsertCommandValidator()
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