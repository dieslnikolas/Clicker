param (
    [Parameter(ValueFromPipeline = $true)]$data
)

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateLine $data

# hlavicka
Add-Line('namespace {0}.Context.Contract' -f $data.Metadata.AppNamespace, $data.Metadata.Modules, $data.Metadata.Name)

Add-Line('{')

# usingy


Add-Line('')

Add-Line('    /// <summary>')
Add-Line('    /// Context contract for module {0}' -f $data.Metadata.Name)
Add-Line('    /// </summary>')
Add-Line('    public interface I{0}Context : ICommonContext' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('    {')

Add-Line('        /// <summary>')
Add-Line('        /// Gets a client for autocomplete')
Add-Line('        /// </summary>')
Add-Line('        CodelistDataService.ApiClient.Advanced.IAutoCompleteClient AutoCompleteClient { get; }')
Add-Line('')

Add-Line('        /// <summary>')
Add-Line('        /// Gets a client for codelists')
Add-Line('        /// </summary>')
Add-Line('        CodelistDataService.ApiClient.Advanced.ICodelistClient CodelistClient { get; }')
Add-Line('')

Add-Line('        /// <summary>')
Add-Line('        /// Gets a client for {0}' -f $data.Metadata.Name)
Add-Line('        /// </summary>')
Add-Line('        SaleDataService.ApiClient.Advanced.I{0}Client {0}Client {{ get; }}' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('')

# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder
