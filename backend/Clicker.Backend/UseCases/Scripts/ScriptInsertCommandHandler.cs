using Clicker.Backend.Common.UseCases;

namespace Clicker.Backend.UseCases.Scripts;

public class ScriptInsertCommandHandler: CommonHandler<ScriptInsertCommand, ScriptInsertCommandModel>
{
    public ScriptInsertCommandHandler(ICommonHandlerContext<ScriptInsertCommand> context) : base(context)
    {
    }

    public override async Task<ScriptInsertCommandModel> Handle(ScriptInsertCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        return _mapper.Map<ScriptInsertCommandModel>(new object());
    }
}
