using Clicker.Backend.Common.Validations;
using FluentValidation;

namespace Clicker.Backend.UseCases.Scripts;

public class ScriptRunCommandValidator : Validator<ScriptRunCommand>
{
    public ScriptRunCommandValidator()
    {
        RuleFor(x => x.Command).NotEmpty();
    }
}