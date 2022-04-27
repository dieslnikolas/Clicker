param (
    [Parameter(ValueFromPipeline = $true)]$data
)

$guid = New-Guid

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateLine $data

# Nadpis
Add-Line('# Replikace')
Add-Line('')

# Info
Add-Line('Info: ')
Add-Line('- Zatím se replikuje směrem z CodeListService do ostatních Service')
Add-Line('- to zda se exportuje, nebo příjimá se nastavuje v {1}/ModelBuilderExtension.cs, je to propertou Export = true/false' -f $data.Metadata.Name, $data.Metadata.DataLayerNamespace)
Add-Line('')

# Postup
Add-Line('## Do služby')
Add-Line('_(V EF Projektu)_')
Add-Line('1) V {0}/Entities/ReplEntities vygenerována replikační tabulka' -f $data.Metadata.DataLayerNamespace)
Add-Line('2) Registrace tabulky z bodu 1) do {0}/IT2021DbContext.cs a {0}/IDbContext.cs' -f $data.Metadata.DataLayerNamespace)
Add-Line('3) Je potřeba k tomu vytvořit ID v {0}/ReplQueueSettingsIds' -f $data.Metadata.DataLayerNamespace)
Add-Line('    ~~~     ')
Add-Line('        public static Guid {0} = new Guid("{2}");'  -f $data.Metadata.Name, $data.Metadata.DataServiceNamespace, $guid)
Add-Line('    ~~~     ')
Add-Line('4) Do souboru {0}/ModelBuilderExtension.cs zapíšu záznam do sekce ReplicationQueueSettings, viz ostatní záznamy v .HasData() => důležitý je Export = false' -f $data.Metadata.DataLayerNamespace)
Add-Line('    ~~~     ')
Add-Line('        new ReplicationQueueSettings {{ ReplicationQueueSettingsId = ReplQueueSettingsIds.{0}, TableName = "{0}", Export = false, ExchangeName = "ReplicationCodelistExchange", CreatedBy = SystemUsers.SystemAdmin, Created = created_27_9_2019 }},'  -f $data.Metadata.Name, $data.Metadata.DataServiceNamespace)
Add-Line('    ~~~     ')
Add-Line('')
Add-Line('_(Ve webapi)_')
Add-Line('')
Add-Line('5) V {0}/Services/ReplicationQueueService.cs vytvořit metodu pro naplnění dané DB (obrovský SWITCH)' -f $data.Metadata.DataServiceNamespace)
Add-Line('    ~~~')
Add-Line('        case "{0}":' -f $data.Metadata.Name, $data.Metadata.DataServiceNamespace)
Add-Line('            var res{0} = await replClient.Get{0}Async(Guid.Parse(pkValue));' -f $data.Metadata.Name, $data.Metadata.DataServiceNamespace)
Add-Line('            if (!ProcessResult(res{0}))' -f $data.Metadata.Name, $data.Metadata.DataServiceNamespace)
Add-Line('            {')
Add-Line('                return res{0}.StatusCode;' -f $data.Metadata.Name, $data.Metadata.DataServiceNamespace)
Add-Line('            }')
Add-Line('')
Add-Line('            await SynchronizeGenericDataAsync<ReplicationServiceModel, {0}>(res{0}.Result);' -f $data.Metadata.Name, $data.Metadata.DataServiceNamespace)
Add-Line('')
Add-Line('            break;')
Add-Line('    ~~~')

# Spouštění
Add-Line('## Spouštění replikace')
Add-Line('1) Zapnu RabitMQ')
Add-Line('2) Zapnu "z" a "do" službu')
Add-Line('3) Zapnu IT2021.ReplicationQueueSenderService.sln')
Add-Line('4) Pak by mělo být vidět v rabbitu jak v záložce Queues tečou data (http://localhost:15672/)')
Add-Line('')

# FAQ
Add-Line('## FAQ')
Add-Line('1) Neunguje to a píše to "Null reference ..."')
Add-Line('    - nemáš správně vystavené API pro replikaci (skládá se tam automaticky název api/replication/{automatickyNazev})')
Add-Line('2) Služba projde, ale vrací 500')
Add-Line('    - Může ti chybět mapování, nebo objekt Replication{Entity}Model je špatně. Zajímavý je v service kam to míří si zkusit co se děje v metodě SynchronizeGenericDataAsync<T, T>(T data)')
Add-Line('3) Kde mám hledat chybovou hlášku')
Add-Line('    - v outputu (u queue, i service)')
Add-Line('    - v logu v DB (z "výstupní" i "vstupní" služby)')

# vypisu builder do hostu
Out-Builder
