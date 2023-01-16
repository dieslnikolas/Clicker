using Clicker.Backend.Common.Validations;
using FluentValidation;

namespace Clicker.Backend.Commands.Scripts;

public class ScriptEditCommandValidator : ValidatorBase<ScriptEditCommand>
{
    public ScriptEditCommandValidator()
    {
        RuleFor(x => x.Key)
            .NotEmpty();
    }
}