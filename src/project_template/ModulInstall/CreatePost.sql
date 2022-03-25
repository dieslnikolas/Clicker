begin tran

IF OBJECT_ID('tempdb..#Import_Temp') IS NOT NULL
    DROP TABLE #Import_Temp

create table #Import_Temp(
	[ID_CompanyMenuItem] int
)

--NASTAVIT!!!!!!!!!!!!!!!!!!!!
insert into #Import_Temp (ID_CompanyMenuItem) values (4657)

declare @IsError bit = 0
declare @ID_Post ID
declare @ID_Company ID
declare @CompanyDisplayName DN
declare @ID_CompanyMenuItem ID
declare @ID_CompanyLanguage ID
declare Import_Cursor cursor for 
	select ID_CompanyMenuItem
		from #Import_Temp
open Import_Cursor

fetch next from Import_Cursor
	into @ID_CompanyMenuItem

while @@FETCH_STATUS=0 and @IsError=0
begin
        set @ID_Company = (select ID_Company from IA_CompanyMenuItem where ID=@ID_CompanyMenuItem)
        set @ID_CompanyLanguage = dbo.IA_CompanyLanguage_Base(@ID_Company)
        set @CompanyDisplayName = (select DisplayName from IA_Company where ID=@ID_Company)

        -- vložení záznamu do tabulky
        insert into IA_Post ([ID_UserInsert], [ID_Company], [ID_PostState], [ID_CompanyMenuItem], [ID_Document], [ID_UserUpdate], [DateUpdate], [DateExpire])
        values (
            5696, 
            @ID_Company, 
            'draft', 
            @ID_CompanyMenuItem,
            null,
            5696,
            GETDATE(),
            null
        )

        if @@error <> 0
            set @IsError=1
        else
        begin
            set @ID_Post=@@IDENTITY

            insert into IA_PostLanguage(ID_Post, ID_CompanyLanguage, DisplayName, [Text])
            values(@ID_Post, @ID_CompanyLanguage, N'📣 Důležité: Pozvi kolegu', 
            N'Vážení kolegové,

situace v České republice se mění každý den. Nyní potřebujeme více než dříve udržovat vzájemný kontakt se všemi zaměstnanci.

Přidali jsme do JOBky modul Pozvi kolegu, díky kterému můžete bezpečně pozvat kolegu k registraci do JOBky, aniž by musel chodit na HR oddělení. Registrace se tak velmi zjednodušuje.

Rozšiřte prosím JOBku mezi ostatní kolegy pomocí tohoto modulu - je to nyní velmi důležité!

Přes JOBku 📢 budeme přednostně publikovat důležité informace, podklady, potvrzení a další informace.
Zaměstnanec, přes kterého se zaregistruje nejvíce kolegů ke dni 31.3. získá dárek ve formě zlaté JOBka Benefit Card 💳.
S pozdravem,

Vaše HR oddělení.')
        end
        if @@error <> 0
            set @IsError=1

    if @IsError = 0
        print 'Sdělení vytvořeno. Firma: ' + @CompanyDisplayName

    fetch next from Import_Cursor
        into @ID_CompanyMenuItem
end
close Import_Cursor
deallocate Import_Cursor

drop table #Import_Temp -- Dispose of temp table (will be disposed of at the end anyway - end of session)

if @IsError=0
    commit tran
else
    rollback tran