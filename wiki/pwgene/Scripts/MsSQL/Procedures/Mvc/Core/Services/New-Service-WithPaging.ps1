param (
    [Parameter(ValueFromPipeline = $true)]$data
)

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateLine $data

# usingy
#Add-Line('using Dapper;' -f $data.Metadata.CoreNamespace, $data.Metadata.Modules)
#Add-Line('using {0}.Domains.Services.Common;' -f $data.Metadata.CoreNamespace)
Add-Line('using {0}.Code;' -f $data.Metadata.UtilsNamespace)
Add-Line('using {0}.Results;' -f $data.Metadata.FrameworkNamespace)
Add-Line('using System;')
Add-Line('using System.Collections.Generic;')
Add-Line('using System.Data.SqlClient;')
Add-Line('using System.Linq;')
Add-Line('using System.Data;')

Add-Line('')

# hlavicka
#Add-Line('namespace {0}.Services{1}{2}' -f $data.Metadata.CoreNamespace, ('.',('.{0}.'-f $data.Metadata.Modules))[![string]::IsNullOrEmpty($data.Metadata.Modules)], $data.Metadata.PluralName)
Add-Line('namespace {0}.Services' -f $data.Metadata.CoreNamespace, ('.',('.{0}.'-f $data.Metadata.Modules))[![string]::IsNullOrEmpty($data.Metadata.Modules)], $data.Metadata.PluralName)

Add-Line('{')
Add-Line('    /// <summary>')
Add-Line('    /// Implementace služby pro entitu - {0}' -f $data.Metadata.Description)
Add-Line('    /// </summary>')
Add-Line('    public partial class {0}Service : I{0}Service' -f $data.Metadata.Name)
Add-Line('    {')

if ($data.Metadata.OperationType -ne 'BLANK') {

if ($data.Metadata.OperationType -eq 'ALL') {
    Add-Line('        /// <summary>')
    Add-Line('        /// {0}' -f $data.Metadata.ProcedureDescription)
    Add-Line('        /// </summary>')
    Add-Line('        /// <param name="input">vstupní objekt</param>')
    Add-Line('        /// <returns>kolekce výstupních objektů</returns>')
    Add-Line('        public ModelCoreResult<{0}{1}OutputModel> {1}({0}{1}InputModel input)' -f $data.Metadata.Name, $data.Metadata.Prefix)
    Add-Line('        {')
    Add-Line('            // zalozim result')
    Add-Line('            var result = new ModelCoreResult<ICollection<{0}{1}OutputModel>>();' -f $data.Metadata.Name, $data.Metadata.Prefix)
    Add-Line('            result.Data = new List<{0}{1}OutputModel>();' -f $data.Metadata.Name, $data.Metadata.Prefix)
}
else {
    Add-Line('        /// <summary>')
    Add-Line('        /// {0}' -f $data.Metadata.ProcedureDescription)
    Add-Line('        /// </summary>')
    Add-Line('        /// <param name="input">vstupní objekt</param>')
    Add-Line('        /// <returns>výstupní objekt</returns>')
    Add-Line('        public ModelCoreResult<{0}{1}OutputModel> {1}({0}{1}InputModel input)' -f $data.Metadata.Name, $data.Metadata.Prefix)
    Add-Line('        {')
    Add-Line('            // zalozim result')
    Add-Line('            var result = new ModelCoreResult<{0}{1}OutputModel>();' -f $data.Metadata.Name, $data.Metadata.Prefix)
}

Add-Line('')
Add-Line('            using (var db = new Db("{0}"))'-f $data.Metadata.ProcedureName)
Add-Line('            {')

#sloupce - input
foreach ($column in $data.InputColumns.GetEnumerator())
{  
         
    if ($column.Value.IsOutput -eq $true) {
        Add-Line('                db.Parameters.Add("@{0}", SqlDbType.{1}).Direction = ParameterDirection.Output;' -f $column.Value.Name, $column.Value.DbType)
    } else {
        Add-Line('                {2}db.Parameters.AddWithValue("@{0}", DbCommon.NullableToSql(input.{0}));'  -f $column.Value.Name, $column.Value.DbType, ('', '//')[$column.Value.Name -eq 'Top'])
    }
}

Add-Line('')
Add-Line('                try')
Add-Line('                {')
Add-Line('                    // exec')



if ($data.Metadata.OperationType -eq 'NEW') {
Add-Line('                    db.ExecuteNonQuery();')
Add-Line('                    // vytazeni output parametru')
Add-Line('                    result.Data = new {0}{1}OutputModel' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('                    {')

    #sloupce - output
    foreach ($column in $data.OutputColumns.GetEnumerator())
    {  
        if ($column.Value.IsOutput -eq $true) {
            Add-Line('                        {0} = db.Parameters["@{0}"].Value is DBNull ? null : ({1})db.Parameters["@{0}"].Value,' -f $column.Value.Name, $column.Value.Type)
        }
    }

    Add-Line('                    };')
} elseif ($data.Metadata.OperationType -eq 'ALL') {
    Add-Line('                    db.ExecuteReader();')
    Add-Line('')
    Add-Line('                    while (db.Read())')
    Add-Line('                    {')
    Add-Line('                        var item = new {0}{1}OutputModel();' -f $data.Metadata.Name, $data.Metadata.Prefix)
    Add-Line('')

    #sloupce - output
    foreach ($column in $data.OutputColumns.GetEnumerator())
    {  
        $type = '{1}{0}' -f $column.Value.UtilsType, ('','Nullable')[$column.Value.IsNullable]#[$column.Value.Type -in ('Guid', 'string', 'bool')]
        # todo typ
        if ($column.Value.IsOutput -ne $true) {
            Add-Line('                        item.{0} = db.Get{1}("{0}");' -f $column.Value.Name, $type)
        }
    }

    Add-Line('')
    Add-Line('                        result.Data.Add(item);' -f $data.Metadata.Name, $data.Metadata.Prefix)
    Add-Line('                    }')
} elseif ($data.Metadata.OperationType -eq 'DETAIL') {
    Add-Line('                    db.ExecuteReaderAndRead();')
    Add-Line('')
    Add-Line('                    var item = new {0}{1}OutputModel();' -f $data.Metadata.Name, $data.Metadata.Prefix)
    Add-Line('')

    #sloupce - output
    foreach ($column in $data.OutputColumns.GetEnumerator())
    {  
        $type = '{1}{0}' -f $column.Value.UtilsType, ('','Nullable')[$column.Value.IsNullable]#[$column.Value.Type -in ('Guid', 'string', 'bool')]
        # todo typ
        if ($column.Value.IsOutput -ne $true) {
            Add-Line('                    item.{0} = db.Get{1}("{0}");' -f $column.Value.Name, $type)
        }
    }
    Add-Line('                    result.Data = item;' -f $data.Metadata.Name, $data.Metadata.Prefix)
} else {
    Add-Line('                    db.ExecuteNonQuery();')
}

Add-Line('                }')
Add-Line('                // kontrola validaci')
Add-Line('                catch (Exception ex)')
Add-Line('                {')
if($data.Metadata.Suffix -eq 'WS'){
    # WebService - Localization by login
    Add-Line('                    //result.ValidationMessages = Skeleton.Framework.Utils.Validation.GetMessages(ex);')
    Add-Line('                    result.ValidationMessages = Skeleton.Framework.Utils.Validation.GetMessagesByLogin(ex, input.ID_Login);')
}else{
    Add-Line('                    result.ValidationMessages = Skeleton.Framework.Utils.Validation.GetMessages(ex);')
    Add-Line('                    //result.ValidationMessages = Skeleton.Framework.Utils.Validation.GetMessagesByLogin(ex, input.ID_Login);')
}
Add-Line('                }')
Add-Line('            }')
Add-Line('            ')
Add-Line('            return result;')
Add-Line('        }')
Add-Line('')

}

# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder
