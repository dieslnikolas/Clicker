using Clicker.Backend.Common.Validations;
using FluentValidation;

namespace Clicker.Backend.Commands.Projects;

public class ProjectOpenQueryValidator : Validator<ProjectOpenQuery>
{
    public ProjectOpenQueryValidator()
    {
        RuleFor(x => x.Path)
            .NotEmpty()
            .MustAsync(async (command, prop, result) => { return Path.IsPathFullyQualified(command.Path); })
            .WithMessage("Path to project MUST be absolute")
            .MustAsync(async (command, prop, result) => { return command.Path.ToLowerInvariant().EndsWith(".json"); })
            .WithMessage("Path to project MUST end with .json")
            .MustAsync(async (command, prop, result) => { return File.Exists(command.Path); })
            .WithMessage("Path dont exists");

        RuleFor(x => x.Key)
            .NotEmpty();
    }
}