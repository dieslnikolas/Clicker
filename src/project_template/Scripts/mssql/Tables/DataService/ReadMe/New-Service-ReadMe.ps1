param (
    [Parameter(ValueFromPipeline = $true)]$data
)

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateLine $data
$newGuid = [guid]::NewGuid()

Add-Line('')

Add-Line('# Jak na registraci služby')
Add-Line('Funkce "dataService service" vygeneruje službu a interface k dané tabulce.')
Add-Line('')

Add-Line('## Startup.cs')
Add-Line('')
Add-Line('Soubor se nachází v rootu aplikace a je potřeba přidat registraci do metody "ConfigureServices":')
Add-Line('')
Add-Line('~~~')
Add-Line('           services.AddScoped<I{0}Service, {0}Service>();' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('~~~')

Add-Line('')
Add-Line('# Trasování historie')
Add-Line('')
Add-Line('## ModelBuilderExtensions.cs')
Add-Line('')
Add-Line('Historii je potřeba "zapnout". V {0}Layer/ModelBuilderExtensions.cs přidat řádky do AuditLog')
Add-Line('')

Add-Line('~~~')
Add-Line('// AuditLog')
Add-Line('modelBuilder.Entity<AuditLogSetting>().HasData(')
Add-Line('   new AuditLogSetting() {{ Id = new Guid("{2}"), TableName = nameof({0}) }},' -f $data.Metadata.Name, $data.Metadata.Prefix, $newGuid)
Add-Line(');')
Add-Line('~~~')

Add-Line('')
Add-Line('## Databáze')
Add-Line('')
Add-Line('Potom by mělo stačit buď přidat ručně řádky, nebo rovnou vytvořit migraci přes Add-Migration (ta se musí dělat stejně) to by mělo vygenerovat něco jako:')
Add-Line('')

Add-Line('~~~')
Add-Line('using System;')
Add-Line('using Microsoft.EntityFrameworkCore.Migrations;')
Add-Line('')
Add-Line('namespace {0}Layer.Migrations'  -f $data.Metadata.DataServiceNamespace)
Add-Line('{')
Add-Line('    public partial class {0}History : Migration' -f $data.Metadata.Name, $data.Metadata.Prefix, $newGuid)
Add-Line('    {')
Add-Line('        protected override void Up(MigrationBuilder migrationBuilder)')
Add-Line('        {')

Add-Line('            migrationBuilder.InsertData(')
Add-Line('                table: "AuditLogSetting",')
Add-Line('                columns: new[] { "Id", "TableName" },')
Add-Line('                values: new object[] {{ new Guid("{2}"), "{0}" }});' -f $data.Metadata.Name, $data.Metadata.Prefix, $newGuid)
Add-Line('')
Add-Line('        }')
Add-Line('')
Add-Line('        protected override void Down(MigrationBuilder migrationBuilder)')
Add-Line('        {')
Add-Line('            // settings for history')
Add-Line('            migrationBuilder.DeleteData(')
Add-Line('                table: "AuditLogSetting",')
Add-Line('                keyColumn: "Id",')
Add-Line('                keyValue: new Guid("{2}"));' -f $data.Metadata.Name, $data.Metadata.Prefix, $newGuid) 
Add-Line('')
Add-Line('        }')
Add-Line('    }')
Add-Line('}')
Add-Line('~~~')
Add-Line('')

# vypisu builder do hostu
Out-Builder
