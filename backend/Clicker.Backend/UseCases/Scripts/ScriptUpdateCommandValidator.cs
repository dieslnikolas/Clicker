using Clicker.Backend.Common.Validations;
using FluentValidation;

namespace Clicker.Backend.UseCases.Scripts;

public class ScriptUpdateCommandValidator : Validator<ScriptUpdateCommand>
{
    public ScriptUpdateCommandValidator()
    {
        RuleFor(x => x.Command).NotEmpty();
    }
}