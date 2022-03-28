﻿param (
    [Parameter(ValueFromPipeline = $true)]$data
)

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateLine $data

# usingy
#Add-Line('using {0}.Services{1}{2};' -f $data.Metadata.CoreNamespace, ('.',('.{0}.'-f $data.Metadata.Modules))[![string]::IsNullOrEmpty($data.Metadata.Modules)], $data.Metadata.PluralName)
Add-Line('using {0}.Services;' -f $data.Metadata.CoreNamespace, ('.',('.{0}.'-f $data.Metadata.Modules))[![string]::IsNullOrEmpty($data.Metadata.Modules)], $data.Metadata.PluralName)
Add-Line('using {0}.Mvc.Common;' -f $data.Metadata.FrameworkNamespace)
Add-Line('using {0}.Mvc.LoggedUsers;' -f $data.Metadata.FrameworkNamespace)
Add-Line('using {0}.Mvc.Results;' -f $data.Metadata.FrameworkNamespace)
#Add-Line('using {0}.Results;' -f $data.Metadata.FrameworkNamespace)
Add-Line('using System;')

Add-Line('')

# hlavicka
Add-Line('namespace {0}.Controllers{1}{2}{3}' -f $data.Metadata.AppWebApiNamespace, ('.',('.{0}.'-f $data.Metadata.Modules))[![string]::IsNullOrEmpty($data.Metadata.Modules)], $data.Metadata.PluralName, (('.'+$data.Metadata.PrefixType+$data.Metadata.PrefixExtension),'')[$data.Metadata.OperationType -eq 'BLANK'])

Add-Line('{')
Add-Line('    /// <summary>')
Add-Line('    /// {0}' -f $data.Metadata.ProcedureDescription)
Add-Line('    /// Builder pro entitu - {0}' -f $data.Metadata.Description)
Add-Line('    /// </summary>')
Add-Line('    public class {2}{3}{0}Handler : IModelHandler<{0}{1}InputModel>' -f $data.Metadata.Name, $data.Metadata.Prefix, $data.Metadata.PrefixType, $data.Metadata.PrefixExtension)
Add-Line('    {')
Add-Line('        private readonly ILoggedUser _loggedUser;')
Add-Line('        private readonly I{0}Service _{0}Service;'  -f  $data.Metadata.Name)
Add-Line('')

# ctor
Add-Line('        public {2}{3}{0}Handler(ILoggedUser loggedUser, I{0}Service {0}Service)' -f $data.Metadata.Name, $data.Metadata.Prefix, $data.Metadata.PrefixType, $data.Metadata.PrefixExtension)
Add-Line('        {')
Add-Line('            _loggedUser = loggedUser;')
Add-Line('            _{0}Service = {0}Service;'  -f  $data.Metadata.Name)
Add-Line('        }')

# build
Add-Line('')
Add-Line('        public ModelHandlerResult Handle({0}{1}InputModel model)' -f  $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('        {')
Add-Line('            var data = new {0}{1}OutputModel();' -f  $data.Metadata.Name, $data.Metadata.Prefix)

Add-Line('            var result = _{0}Service.{1}(new {0}{1}InputModel' -f  $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('            {')
Add-Line('                ID_Login = _loggedUser.ID_Login,')

#sloupce - input
foreach ($column in $data.InputColumns.GetEnumerator())
{  
    if ($column.Value.Name -ne 'ID_Login')
    {
        Add-Line('                {1} = model.{0},' -f $column.Value.Name, $column.Value.Name)
    }
}
Add-Line('            });')
Add-Line('')

# return model
Add-Line('            return new ModelHandlerResult()')
Add-Line('            {')

Add-Line('                Message = result.IsSuccess ? Resources.Dictionary.Global_{0}_SuccessNotification : null,' -f $obj.Metadata.PrefixType)
Add-Line('                Data = result.Data,')
Add-Line('                Exception = result.Exception,')
Add-Line('                ValidationMessages = result.ValidationMessages')

Add-Line('            };')
Add-Line('        }')


# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder