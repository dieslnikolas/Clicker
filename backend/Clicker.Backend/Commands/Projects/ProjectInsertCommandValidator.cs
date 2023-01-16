using Clicker.Backend.Common.Validations;
using FluentValidation;

namespace Clicker.Backend.Commands.Projects;

public class ProjectInsertCommandValidator : ValidatorBase<ProjectInsertCommand>
{
    public ProjectInsertCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .MinimumLength(8)
            .MaximumLength(32);
        
        RuleFor(x => x.Path)
            .NotEmpty()
            .MustAsync(async (command, prop, result) => { return !command.Path.Contains("\\"); })
            .WithMessage(@"Path to project can't use backslash")
            .MustAsync(async (command, prop, result) => { return Path.IsPathFullyQualified(command.Path); })
            .WithMessage("Path to project MUST be absolute")
            .MustAsync(async (command, prop, result) => { return command.Path.ToLowerInvariant().EndsWith(".json"); })
            .WithMessage("Path to project MUST end with .json");

        RuleFor(x => x.Key)
            .NotEmpty();
    }
}