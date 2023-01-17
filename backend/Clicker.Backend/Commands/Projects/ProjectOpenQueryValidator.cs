using Clicker.Backend.Common.Validations;
using FluentValidation;

namespace Clicker.Backend.Commands.Projects;

public class ProjectOpenQueryValidator : ValidatorBase<ProjectOpenQuery>
{
    public ProjectOpenQueryValidator()
    {
        RuleFor(x => x.Path)
            .NotEmpty()
            .MustAsync(async (command, prop, result) => { return !command.Path.Contains("\\"); })
            .WithMessage(@"Path to project can't use backslash")
            .MustAsync(async (command, prop, result) => { return Path.IsPathFullyQualified(command.Path); })
            .WithMessage("Path to project MUST be absolute")
            .MustAsync(async (command, prop, result) => { return command.Path.ToLowerInvariant().EndsWith(".clicker"); })
            .WithMessage("Path to project MUST end with .clicker")
            .MustAsync(async (command, prop, result) => { return File.Exists(command.Path); })
            .WithMessage("Path dont exists");

        RuleFor(x => x.Key)
            .NotEmpty();
    }
}