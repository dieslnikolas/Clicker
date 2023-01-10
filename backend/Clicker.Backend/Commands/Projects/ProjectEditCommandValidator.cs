using Clicker.Backend.Common.Validations;
using FluentValidation;

namespace Clicker.Backend.Commands.Projects;

public class ProjectEditCommandValidator : Validator<ProjectEditCommand>
{
    public ProjectEditCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .MinimumLength(8)
            .MaximumLength(32);

        RuleFor(x => x.Author)
            .NotEmpty();

        RuleFor(x => x.Version)
            .NotEmpty();
    }
}