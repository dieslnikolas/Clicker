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
Add-Line('namespace {0}.Services' -f $data.Metadata.DataServiceNamespace, $data.Metadata.Modules, $data.Metadata.Name)
Add-Line('{')

# usingy

Add-Line('    using ApiFoundations.Wrappers;')
Add-Line('    using Codelists;')
Add-Line('    using {0}.Entities;' -f $data.Metadata.DataLayerNamespace, $data.Metadata.Modules, $data.Metadata.Name)
Add-Line('    using Microsoft.EntityFrameworkCore;')
Add-Line('    using Models.{0}.Input;' -f $data.Metadata.Name)
Add-Line('    using System;')
Add-Line('    using System.Threading.Tasks;')
Add-Line('    using System.Collections.Generic;')
Add-Line('    using System.Linq;')
Add-Line('    using System.Net;')
Add-Line('')

Add-Line('    /// <summary>')
Add-Line('    /// Manage {0}' -f $lowerPluralName)
Add-Line('    /// </summary>')
Add-Line('    public partial class {0}Service : BaseService<{0}>, I{0}Service' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('    {')

# Validate
Add-Line('        /// <summary>')
Add-Line('        /// Check pre-validation which can by suppressed')
Add-Line('        /// </summary>')
Add-Line('        /// <param name="id">id of DB row</param>')
Add-Line('        /// <param name="inputModel">input model from client</param>')
Add-Line('        /// <param name="{1}Entity">entity from db</param>' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('        /// <returns>throws exception if invalid</returns>')
Add-Line('        public async Task CheckWarningsAsync(Guid? id, Input{0}ModuleModel inputModel, {0} {1}Entity)' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('        {')
Add-Line('            var validationErrors = new List<ValidationError>();')
Add-Line('')
Add-Line('            // check if somebody edited row before i saved')
Add-Line('            inputModel.{0}.UserConflictValidation({1}Entity, validationErrors);' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('')
Add-Line('            Utils.ThrowWarningsErrors(validationErrors);')
Add-Line('        }')
Add-Line('')
Add-Line('        /// <summary>')
Add-Line('        /// Check validation')
Add-Line('        /// </summary>')
Add-Line('        /// <param name="inputModel">input model from client</param>')
Add-Line('        /// <param name="{1}Entity">entity from db</param>' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('        private async Task CheckErrorsAsync(Input{0}ModuleModel inputModel, {0} {1}Entity)' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('        {')
Add-Line('            var validationErrors = new List<ValidationError>();')
Add-Line('')
Add-Line('            // validate codelists')
Add-Line('            await Utils.ValidateCodelistValueAsync(codelistClient, CodelistNames.Company, {1}Entity.CompanyId, nameof(Input{0}Model.CompanyId), validationErrors);' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('')
Add-Line('            // TODO: Custom Validations')
Add-Line('')
Add-Line('            // Check validations')
Add-Line('            Utils.ThrowWarningsErrors(validationErrors);')
Add-Line('        }')
Add-Line('')

# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder
