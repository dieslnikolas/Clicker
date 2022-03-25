declare @Sql Note = N'
--Parametry
declare @ID_Company ID = {ID_Company}
declare @ID_Login GUID = ''{ID_Login}''
declare @ID_PostCompanyMenuItem ID = {ID_PostCompanyMenuItem}

--Zavislé parametry
declare @ID_User ID = (select ID_User from SF_Login where ID=@ID_Login)

-- ------------------- Založení formuláře -------------------
declare @ID_CompanyBaseLanguage ID = dbo.IA_CompanyLanguage_Base(@ID_Company)
declare @ID_FormCompanyMenuItem ID
exec IA_CompanyMenuItem_NEW_Company @ID_Login=@ID_Login, @ID_MenuItem=''Form'', @ID_Company=@ID_Company, @ID=@ID_FormCompanyMenuItem out
exec IA_CompanyMenuItemLanguage_NEW_Edit @ID_Login=@ID_Login, @ID_CompanyLanguage=@ID_CompanyBaseLanguage, @ID_CompanyMenuItem=@ID_FormCompanyMenuItem, @DisplayName=''Pozvi kolegu''
declare @ID_CompanyForm ID = (select ID from IA_CompanyForm where ID_CompanyMenuItem=@ID_FormCompanyMenuItem)

-- ------------------- Nastavení formuláře -------------------
update IA_CompanyForm set [Name]=''InviteColleague'', IsInsertEmail=0, IsSaveAuthor=1, EmailInsert=null where ID=@ID_CompanyForm

-- Vytvoření jednotlivých položek
insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
    values(1, @ID_CompanyForm, ''Label'', 0, 1, null, 1)

insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName, [Description])
    values(@@IDENTITY, @ID_CompanyBaseLanguage,N''Jak pozvat kolegu? 🧐'', ''Vyplňte jméno, příjmení, osobní číslo a e-mailovou adresu kolegy, kterého chcete do JOBky pozvat. Systém ověří zadané údaje a zašle přihlašovací e-mail. E-mailová schránka kolegy může být pracovní nebo soukromá.'')

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
    values(1, @ID_CompanyForm, ''Entry'', 1, 2, ''InviteColleaqueName'', 1)

insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@@IDENTITY, @ID_CompanyBaseLanguage,''Jméno'')

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
    values(1, @ID_CompanyForm, ''Entry'', 1, 3, ''InviteColleaquePersonalNumber'', 1)

insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@@IDENTITY, @ID_CompanyBaseLanguage,''Osobní číslo'')

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
    values(1, @ID_CompanyForm, ''Entry'', 1, 4, ''InviteColleaqueEmail'', 1)

insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@@IDENTITY, @ID_CompanyBaseLanguage,''Email'')

-- Nastavení validační procedury na formuláři
update IA_CompanyForm set IA_CompanyForm.ProcedureValidate=''IA_Data_VALIDATE_InviteColleague'' where IA_CompanyForm.ID=@ID_CompanyForm
--Nastavení pocedury která se volá po založení odpovědi na formulář
update IA_CompanyForm set IA_CompanyForm.ProcedureInsert=''IA_Data_OTHER_InviteColleague'' where IA_CompanyForm.ID=@ID_CompanyForm

-- ------------------- Vytvoření postu -------------------
declare @ID_PostList ID = (select ID from IA_PostList where ID_CompanyMenuItem=@ID_PostCompanyMenuItem)

-- Vložení záznamu do tabulky
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

-- Vytvoření překladu
declare @ID_Post ID = @@IDENTITY
insert into IA_PostLanguage(ID_Post, ID_CompanyLanguage, DisplayName, [Text])
            values(@ID_Post, @ID_CompanyBaseLanguage, N''📣 Důležité: Pozvi kolegu'', 
            N''Vážení kolegové,

situace v České republice se mění každý den. Nyní potřebujeme více než dříve udržovat vzájemný kontakt se všemi zaměstnanci.

Přidali jsme do JOBky modul Pozvi kolegu, díky kterému můžete bezpečně pozvat kolegu k registraci do JOBky, aniž by musel chodit na HR oddělení. Registrace se tak velmi zjednodušuje.

Rozšiřte prosím JOBku mezi ostatní kolegy pomocí tohoto modulu - je to nyní velmi důležité!

Přes JOBku 📢 budeme přednostně publikovat důležité informace, podklady, potvrzení a další informace.

S pozdravem,

Vaše HR oddělení.'')'

declare @Note Note = '- Pro instalaci tohoto modulu nemusíte v BO nic připravovat, stačí jej spustit
- Založí formulář který umožní uživateli pozvat kolegu
- Založí sdělení informující o přidání tohoto formuláře
- Formulář se v BO v bočním menu nemusí hned zobrazit, v nastavení menu jej ale uvidíte hned
- Sdělení je založeno ve stavu koncept'

insert into IA_Package (DisplayName, Script, Note)
    values('Pozvi kolegu', @Sql, @Note)
declare @ID_Package ID = @@IDENTITY

insert into IA_PackageParameter(ID_Package, [Key], DefaultValue, Note, ID_ParameterType)
    values(@ID_Package, 'ID_PostCompanyMenuItem', null, 'ID položky menu pod kterou se nachází sdělení. Nové sdělení bude založeno právě do této položky', 'ID_CompanyMenuItem')