param (
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
Add-Line('using {0}.Mvc.Results;' -f $data.Metadata.FrameworkNamespace)
Add-Line('using System;')
Add-Line('using System.Linq;')

Add-Line('')

# hlavicka
Add-Line('namespace {0}.Controllers{1}{2}{3}' -f $data.Metadata.AppWebApiNamespace, ('.',('.{0}.'-f $data.Metadata.Modules))[![string]::IsNullOrEmpty($data.Metadata.Modules)], $data.Metadata.PluralName, (('.'+$data.Metadata.PrefixType + $data.Metadata.PrefixExstension),'')[$data.Metadata.OperationType -eq 'BLANK'])

Add-Line('{')
Add-Line('    /// <summary>')
Add-Line('    /// {0}' -f $data.Metadata.ProcedureDescription)
Add-Line('    /// Builder pro entitu - {0}' -f $data.Metadata.Description)
Add-Line('    /// </summary>')
Add-Line('    public class {2}{3}{0}Builder : IModelBuilder<{0}{1}OutputModel, {0}{1}InputModel>' -f $data.Metadata.Name, $data.Metadata.Prefix, $data.Metadata.PrefixType, $data.Metadata.PrefixExtension)
Add-Line('    {')
Add-Line('        private readonly I{0}Service _{0}Service;'  -f  $data.Metadata.Name)
#Add-Line('        /*')
$columns = $data.InputColumns.GetEnumerator()
foreach ($column in $columns)
{    
    if ($column.Value.IsFk -eq $true) {
        Add-Line('        // private readonly I{0}Service _{0}Service;'  -f  $column.Value.TableName)
    }
}
#Add-Line('        */')

Add-Line('')

# ctor
Add-Line('        public {2}{3}{0}Builder(I{0}Service {0}Service)'  -f  $data.Metadata.Name, $data.Metadata.Prefix, $data.Metadata.PrefixType, $data.Metadata.PrefixExtension)
Add-Line('        {')
Add-Line('            _{0}Service = {0}Service;'  -f  $data.Metadata.Name)
Add-Line('        }')

# build
Add-Line('')
Add-Line('        public ModelBuilderResult<{0}{1}OutputModel> Build({0}{1}InputModel input)' -f  $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('        {')
Add-Line('            var data = new {0}{1}OutputModel();' -f  $data.Metadata.Name, $data.Metadata.Prefix)

Add-Line('            var result = _{0}Service.{1}(new {0}{1}InputModel' -f  $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('            {')
Add-Line('                ID_Login = input.ID_Login,')

#sloupce - input
foreach ($column in $data.InputColumns.GetEnumerator())
{  
    if ($column.Value.Name -ne 'ID_Login'){
        Add-Line('                {0} = input.{0},' -f $column.Value.Name)
    }
    # if ($column.Value.Name -eq 'ID')
    # {
    #     Add-Line('                {0} = id,' -f $column.Value.Name)
    # }
}
Add-Line('            });')
Add-Line('')

#sloupce - output
$columns = ($data.OutputColumns.GetEnumerator(), $data.InputColumns.GetEnumerator())[$data.Metadata.OperationType -in ('NEW', 'DEL', 'EDIT')]
foreach ($column in $columns)
{  
    if ($column.Value.Name -ne 'ID_Login')
    {
        Add-Line('            data.{0} = result.Data.{1};' -f $column.Value.Name, $column.Value.Name)
    }
}

Add-Line('')
Add-Line('            return BuildLists(data);')
Add-Line('        }')

# pomocny build
Add-Line('')
Add-Line('        public ModelBuilderResult<{0}{1}OutputModel> BuildLists({0}{1}OutputModel model)' -f  $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('        {')
Add-Line('            /*')
Add-Line('')

$columns = $data.InputColumns.GetEnumerator()
foreach ($column in $columns)
{    
    if ($column.Value.IsFk -eq $true) {
        Add-Line('            model.{1} = _{0}Service.List(new List{0}InputModel' -f $columns.Value.TableName, $column.Value.ListName)
        Add-Line('            {')
        Add-Line('                ID_Login = _loggedUser.ID_Login,')
        Add-Line('            }).Data.Select(x => new System.Web.Mvc.SelectListItem')
        Add-Line('            {')
        Add-Line('                Value = x.ID.ToString(),')
        Add-Line('                Text = x.DisplayName')
        Add-Line('            }).ToList();')
        Add-Line('')

    }
}

Add-Line('            */')
Add-Line('            return this.Success(model);')
Add-Line('        }')


# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder
