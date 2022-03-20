param (
    [Parameter(ValueFromPipeline = $true)]$data
)

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateLine $data

Add-Line('')

Add-Line('# Jak na registraci List procedury')
Add-Line('Funkce "list procedure" vygeneruje proceduru a k ní entitu.')
Add-Line('Pro její korektní použití je nutné ji zaregistrovat:')
Add-Line('')

Add-Line('## IT2021DbContext.cs')
Add-Line('')
Add-Line('Přidat registraci DbSetu do regionu DbSets:')
Add-Line('')
Add-Line('~~~')
Add-Line('        public DbSet<{1}{0}List> {1}{0}List {{ get; set; }}' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('~~~')

Add-Line('## IDbContext.cs')
Add-Line('')
Add-Line('Analogicky pridat do interfacu:')
Add-Line('')
Add-Line('~~~')
Add-Line('        DbSet<{1}{0}List> {1}{0}List {{ get; set; }}' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('~~~')

Add-Line('## Db migrace')
Add-Line('')

Add-Line('V "Package Manager Console" je potřeba nejprve srovnat DB.')
Add-Line('Nejprve je potřeba přepnout "Default project" na DataLayer a poté:')
Add-Line('')

Add-Line('~~~')
Add-Line('update-database')
Add-Line('~~~')
Add-Line('')

Add-Line('Následně vytvořit migraci:')
Add-Line('~~~')
Add-Line('add-migration -name "Add{1}{0}List"' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('~~~')
Add-Line('')

Add-Line('Tu je potřeba ručně upravit:  ')
Add-Line('~~~')
Add-Line('        protected override void Up(MigrationBuilder migrationBuilder)')
Add-Line('        {')
Add-Line('            migrationBuilder.SqlProcedure("{1}{0}List001.sql");' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('        }')
Add-Line('')

Add-Line('        protected override void Down(MigrationBuilder migrationBuilder)')
Add-Line('        {')
Add-Line('            migrationBuilder.Sql("DROP PROC {1}{0}List");' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('        }')
Add-Line('~~~')
Add-Line('')

Add-Line('A následně opět srovnat DB:')

Add-Line('~~~')
Add-Line('update-database')
Add-Line('~~~')

Add-Line('')
# vypisu builder do hostu
Out-Builder
