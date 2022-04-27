param (
    [Parameter(ValueFromPipeline = $true)]$data
)

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateLine $data

$lowerName = [Regex]::Replace($data.Metadata.Name , '\b.', {  $args[0].Value.Tolower() })
$lowerPluralName = [Regex]::Replace($data.Metadata.PluralName , '\b.', {  $args[0].Value.Tolower() })

# hlavicka
Add-Line('namespace {0}.Validators' -f $data.Metadata.DataServiceNamespace, $data.Metadata.Modules, $data.Metadata.Name)
Add-Line('{')

# usingy
Add-Line('    using Codelists;')
Add-Line('    using DataServiceBase;')
Add-Line('    using {0}.Entities;'  -f $data.Metadata.DataLayerNamespace, $data.Metadata.Modules, $data.Metadata.Name)
Add-Line('    using Models;'  -f $data.Metadata.DataServiceNamespace, $data.Metadata.Modules, $data.Metadata.Name)

Add-Line('')

Add-Line('    /// <summary>')
Add-Line('    /// {0} user restriction validator' -f $data.Metadata.Name, $lowerName)
Add-Line('    /// </summary>')
Add-Line('    public class {0}UserRestrictionValidator : BaseUserRestrictionValidator<{0}>' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('    {')
Add-Line('        public {0}UserRestrictionValidator(ICurrentUserAccessor<CurrentUserModel> currentUserAccessor)' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('            : base(PermissionCodelistValues.{0}, currentUserAccessor)' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('        {')
Add-Line('        }')

# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder