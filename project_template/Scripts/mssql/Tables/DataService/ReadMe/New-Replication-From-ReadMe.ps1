param (
    [Parameter(ValueFromPipeline = $true)]$data
)

## guid 
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
Add-Line('- to zda se exportuje, nebo příjimá se nastavuje v IT2021.CodelistDataLayer/ModelBuilderExtension.cs, je to propertou Export = true/false' -f $data.Metadata.Name, $data.Metadata.DataLayerNamespace)
Add-Line('')

# Postup
Add-Line('## Ze služby')
Add-Line('_(Ve webapi)_')
Add-Line('1) Do souboru IT2021.CodelistDataLayer/ModelBuilderExtension.cs zapíšu záznam do sekce ReplicationQueueSettings, viz ostatní záznamy v .HasData() => důležitý je Export = true')
Add-Line('    ~~~     ')
Add-Line('        new ReplicationQueueSettings {{ ReplicationQueueSettingsId = ReplQueueSettingsIds.{0}, TableName = "{0}", QueueTableName = "ReplicationQueue", Export = true, ExchangeName = "ReplicationCodelistExchange", CreatedBy = SystemUsers.SystemAdmin, Created = created14122020 }},'  -f $data.Metadata.Name, $data.Metadata.DataServiceNamespace)
Add-Line('    ~~~     ')

Add-Line('_(V EF Projektu)_')
Add-Line('')
Add-Line('2) Je potřeba k tomu vytvořit ID v IT2021.CodelistDataLayer/ReplQueueSettingsIds')
Add-Line('    ~~~     ')
Add-Line('        public static Guid {0} = new Guid("{2}");'  -f $data.Metadata.Name, $data.Metadata.DataServiceNamespace, $guid)
Add-Line('    ~~~     ')

Add-Line('_(Ve webapi)_')
Add-Line('')
Add-Line('3) Zkontrolovat si si replikační model v IT2021.CodelistDataService/Models/Replication/Replication{0}Model.cs - vygenerováno' -f $data.Metadata.Name, $data.Metadata.DataServiceNamespace)
Add-Line('4) Přidám mapování do MappingProfile.cs')
Add-Line('    ~~~')
Add-Line('        CreateMap<{0}, Replication{0}Model>();' -f $data.Metadata.Name, $data.Metadata.DataServiceNamespace)
Add-Line('    ~~~')
Add-Line('5) Vytvořím v ReplicationController.cs akci viz kód níže')
Add-Line('    ~~~     ')
Add-Line('        [HttpGet]')
Add-Line('        [ProducesResponseType(typeof(Replication{0}Model), StatusCodes.Status200OK)]' -f $data.Metadata.Name, $data.Metadata.DataServiceNamespace)
Add-Line('        [Route("Get{0}")]' -f $data.Metadata.Name, $data.Metadata.DataServiceNamespace)
Add-Line('        public async Task<Replication{0}Model> Get{0}Async(Guid primaryKeyValue)' -f $data.Metadata.Name, $data.Metadata.DataServiceNamespace)
Add-Line('        {')
Add-Line('            return await genericService.GetDataAsync<{0}, Replication{0}Model>(primaryKeyValue);' -f $data.Metadata.Name, $data.Metadata.DataServiceNamespace)
Add-Line('        }')
Add-Line('    ~~~')
Add-Line('6) Je k tomu potřeba ještě do migrace dát nějakou počáteční frontu (pak už se to děje samo při SaveChanges ve WebApi)')
Add-Line('    ~~~')
Add-Line('    migrationBuilder.Sql($@"INSERT INTO ReplicationQueue(ReplicationQueueId, CreatedBy, Created, Deleted, PrimaryKeyValue, ReplicationQueueSettingsId)')
Add-Line('                        SELECT NEWID(), N''{{SystemUsers.SystemAdmin}}'', SYSDATETIMEOFFSET(), 0, [{0}].{0}Id, N''{{ReplQueueSettingsIds.ServiceAlocatorType}}''' -f $data.Metadata.Name, $data.Metadata.DataServiceNamespace)
Add-Line('                        FROM [{0}]");    ' -f $data.Metadata.Name, $data.Metadata.DataServiceNamespace)
Add-Line('    ~~~')
Add-Line('7) Rebuildnu NSWAG pro ApiClient i ApiClient.Advance (ale prakticky stačí jen ApiClient)')

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
