using System.Windows.Input;
using AutoMapper;
using Clicker.Backend.Models;
using MediatR;

namespace Clicker.Backend.UseCases.Command;

public class CommandHandler: IRequestHandler<CommandQuery, CommandModel>
{
    private readonly ILogger<CommandHandler> _logger;

    public CommandHandler(ILogger<CommandHandler> logger)
    {
        _logger = logger;
    }

    public Task<CommandModel> Handle(CommandQuery request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}

public class CommandQuery : IRequest<CommandModel>, Common.IQuery
{
    
}

public class CommandModel
{
    
}

public class CommandQueryMappingProfile : Profile
{
    public CommandQueryMappingProfile()
    {
        CreateMap<CommandRequest, CommandQuery>();
        // CreateMap<CommandQuery, CommandService>();
        CreateMap<CommandModel, CommandResponse>();
    } 
}