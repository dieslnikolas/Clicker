declare @Sql Note = '
declare @IsError bit = 0
declare @ID_User ID = 5696
declare @ID_Post ID
declare @ID_CompanyMenuItem ID = {ID_PostCompanyMenuItem}
declare @ID_PostList ID = (select ID from IA_PostList where ID_CompanyMenuItem=@ID_CompanyMenuItem)
declare @ID_Company ID = (select ID_Company from IA_CompanyMenuItem where ID=@ID_CompanyMenuItem)
declare @ID_CompanyLanguage ID = dbo.IA_CompanyLanguage_Base(@ID_Company)
declare @CompanyDisplayName DN = (select DisplayName from IA_Company where ID=@ID_Company)


-- vložení záznamu do tabulky
insert into IA_Post ([ID_PostList], [DateCreated], [ID_UserInsert], [ID_PostState], [ID_Document], [ID_UserUpdate], [DateUpdate], [DateExpire])
values (
    @ID_PostList,
    GETDATE(),
    @ID_User, 
    ''draft'', 
    null,
    @ID_User,
    GETDATE(),
    null
)

if @@error <> 0
    set @IsError=1
else
begin
    set @ID_Post = @@IDENTITY

    insert into IA_PostLanguage(ID_Post, ID_CompanyLanguage, DisplayName, [Text])
                values(@ID_Post, @ID_CompanyLanguage, N''📣 Důležité: Pozvi kolegu'', 
                N''Vážení kolegové,

    situace v České republice se mění každý den. Nyní potřebujeme více než dříve udržovat vzájemný kontakt se všemi zaměstnanci.

    Přidali jsme do JOBky modul Pozvi kolegu, díky kterému můžete bezpečně pozvat kolegu k registraci do JOBky, aniž by musel chodit na HR oddělení. Registrace se tak velmi zjednodušuje.

    Rozšiřte prosím JOBku mezi ostatní kolegy pomocí tohoto modulu - je to nyní velmi důležité!

    Přes JOBku 📢 budeme přednostně publikovat důležité informace, podklady, potvrzení a další informace.
    Zaměstnanec, přes kterého se zaregistruje nejvíce kolegů ke dni 31.3. získá dárek ve formě zlaté JOBka Benefit Card 💳.
    S pozdravem,

    Vaše HR oddělení.'')
end
if @@error <> 0
    set @IsError=1

if @IsError = 0
    print ''Sdělení vytvořeno. Firma: '' + @CompanyDisplayName'

insert into IA_Package (DisplayName, Script, Note)
    values('Pozvi kolegu - sdělení', @Sql, 'Založení sdělení které informuje o instalaci modulu pozvi kolegu')
declare @ID_Package ID = @@IDENTITY

insert into IA_PackageParameter(ID_Package, [Key], DefaultValue, Note, ID_ParameterType)
    values(@ID_Package, 'ID_PostCompanyMenuItem', null, 'ID menu itemu pro který má být sdělení založeno', 'ID_CompanyMenuItem')