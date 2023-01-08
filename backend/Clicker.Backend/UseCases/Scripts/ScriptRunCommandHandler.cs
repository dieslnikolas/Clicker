using Clicker.Backend.Common.UseCases;

namespace Clicker.Backend.UseCases.Scripts;

public class ScriptRunCommandHandler: CommonHandler<ScriptRunCommand, ScriptRunCommandModel>
{
    public ScriptRunCommandHandler(ICommonHandlerContext<ScriptRunCommand> context) : base(context)
    {
    }

    public override async Task<ScriptRunCommandModel> Handle(ScriptRunCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));
        
        // TODO: RUN SCRIPT

        return _mapper.Map<ScriptRunCommandModel>(new object());
    }
}
