param (
    [Parameter(ValueFromPipeline = $true)]$data
)

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateLine $data

# hlavicka
Add-Line('namespace {0}.Models.{2}.Output' -f $data.Metadata.DataServiceNamespace, $data.Metadata.Modules, $data.Metadata.Name)
Add-Line('{')

# usingy
Add-Line('    using Geis.Annotations;')
Add-Line('    using System;')
Add-Line('    using System.Collections.Generic;')
Add-Line('')

# usingy
Add-Line('    /// <summary>')
Add-Line('    /// <see cref="Output{1}{0}ModuleModel"/>' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('    /// </summary>')
Add-Line('    public class Output{1}{0}ModuleModel' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('    {')

Add-Line('        /// <summary>')
Add-Line('        /// <see cref="Output{1}{0}Model"/>' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('        /// </summary>')
Add-Line('        public Output{1}{0}Model {1}{0} {{ get; set; }}' -f $data.Metadata.Name, $data.Metadata.Prefix)


# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder
