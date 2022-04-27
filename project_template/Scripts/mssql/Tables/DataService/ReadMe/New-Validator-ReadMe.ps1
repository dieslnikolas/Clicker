param (
    [Parameter(ValueFromPipeline = $true)]$data
)

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateLine $data

Add-Line('')

Add-Line('# Jak na registraci validatorů')
Add-Line('Funkce "dataService validator" vygeneruje validátor k dané tabulce. To je následně nutné registrovat ve startupu.')
Add-Line('')

Add-Line('## Startup.cs')
Add-Line('')
Add-Line('Přidat do metody ConfigureServices:')
Add-Line('')
Add-Line('~~~')
Add-Line('            services.AddScoped<IConditionalUserRestrictionValidator<{0}>, {0}UserRestrictionValidator>();' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('~~~')



Add-Line('')
# vypisu builder do hostu
Out-Builder
