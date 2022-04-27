param (
    [Parameter(ValueFromPipeline = $true)]$data
)

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateLine $data

Add-Line('# Jak na registraci resources')
Add-Line('Ke správné funkci tabů je potřeba přidat resouces do *App.xaml*.')
Add-Line('')

Add-Line('## ResourceDictionary')
Add-Line('')
Add-Line('Přidat do *ResourceDictionary.MergedDictionaries*:')
Add-Line('')
Add-Line('~~~')
Add-Line('        <ResourceDictionary Source="Resources/{0}.xaml" />' -f $data.Metadata.Name, $data.Metadata.DataServiceNamespace)
Add-Line('~~~')
Add-Line('')

Add-Line('## ResourceKeySelector.cs')
Add-Line('')
Add-Line('Přidat do konstantu:')
Add-Line('')
Add-Line('~~~')

Add-Line('        public const string {0}DetailViewTabItemTemplate = "{0}DetailViewTabItemTemplate";' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('~~~')
Add-Line('')

Add-Line('')
# vypisu builder do hostu
Out-Builder
