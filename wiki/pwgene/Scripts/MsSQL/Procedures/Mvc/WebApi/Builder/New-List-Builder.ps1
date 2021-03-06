param (
    [Parameter(ValueFromPipeline = $true)]$data
)

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateLine $data

# usingy
#Add-Line('using {0}.Services{1}{2};' -f $data.Metadata.CoreNamespace, ('.',('.{0}.'-f $data.Metadata.Modules))[![string]::IsNullOrEmpty($data.Metadata.Modules)], $data.Metadata.PluralName)
Add-Line('using {0}.Services;' -f $data.Metadata.CoreNamespace)
Add-Line('using {0}.Mvc.Common;' -f $data.Metadata.FrameworkNamespace)
Add-Line('using {0}.Mvc.Results;' -f $data.Metadata.FrameworkNamespace)
Add-Line('using System.Collections.Generic;')
Add-Line('using System.Linq;')

Add-Line('')

# hlavicka
Add-Line('namespace {0}.Controllers{1}{2}{3}' -f $data.Metadata.AppWebApiNamespace, ('.',('.{0}.'-f $data.Metadata.Modules))[![string]::IsNullOrEmpty($data.Metadata.Modules)], $data.Metadata.PluralName, (('.'+$data.Metadata.PrefixType+$data.Metadata.PrefixExtension),'')[$data.Metadata.OperationType -eq 'BLANK'])

Add-Line('{')
Add-Line('    /// <summary>')
Add-Line('    /// {0}' -f $data.Metadata.ProcedureDescription)
Add-Line('    /// Builder pro entitu - {0}' -f $data.Metadata.Description)
Add-Line('    /// </summary>')
Add-Line('    public class {2}{3}{0}Builder : IModelBuilder<List<{0}{1}OutputModel>, {0}{1}InputModel>' -f $data.Metadata.Name, $data.Metadata.Prefix, $data.Metadata.PrefixType, $data.Metadata.PrefixExtension)
Add-Line('    {')
Add-Line('        private readonly I{0}Service _{0}Service;'  -f  $data.Metadata.Name)
Add-Line('')

# ctor
Add-Line('        public {2}{3}{0}Builder(I{0}Service {0}Service)'  -f  $data.Metadata.Name, $data.Metadata.Prefix, $data.Metadata.PrefixType, $data.Metadata.PrefixExtension)
Add-Line('        {')
Add-Line('            _{0}Service = {0}Service;'  -f  $data.Metadata.Name)
Add-Line('        }')

# build
Add-Line('')
Add-Line('        public ModelBuilderResult<List<{0}{1}OutputModel>> Build({0}{1}InputModel input)' -f  $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('        {')
Add-Line('            var data = new List<{0}{1}OutputModel>();' -f  $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('')
Add-Line('            var result{0}{1} = _{0}Service.{1}(new {0}{1}InputModel' -f  $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('            {')
Add-Line('                ID_Login = input.ID_Login,')

#sloupce - input
foreach ($column in $data.InputColumns.GetEnumerator())
{  
    if ($column.Value.Name -in ('ID_Login', 'IsContext')) {
        continue;
    }
    Add-Line('                {1} = input.{0},' -f $column.Value.Name, $column.Value.Name)
}
Add-Line('            });')
Add-Line('')
Add-Line('            data = result{0}{1}.Data.Select(x => new {0}{1}OutputModel' -f  $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('            {')
#sloupce - output
$columns = ($data.OutputColumns.GetEnumerator(), $data.OutputColumns.GetEnumerator())[$data.Metadata.OperationType -in ('ALL','NEW', 'DEL', 'EDIT')]
foreach ($column in $columns)
{  
    Add-Line('                {0} = x.{1},' -f $column.Value.Name, $column.Value.Name)    ## $column.Value.Name
}
Add-Line('            }).ToList();')
Add-Line('')
Add-Line('            return this.Success(data);')
Add-Line('        }')


# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder
