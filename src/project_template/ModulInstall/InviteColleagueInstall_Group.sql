--Procedury: 
--IA_Data_NEW_DataItems
--IA_Data_NEW_DataItems_WS
--IA_Employee_OTHER_Invite
--IA_Data_VALIDATE_InviteColleague
--IA_Data_OTHER_InviteColleague
--IA_Company_ACTION

begin tran

IF OBJECT_ID('tempdb..#Import_Temp') IS NOT NULL
    DROP TABLE #Import_Temp

create table #Import_Temp(
	[ID_CompanyForm] int
)

-----------------------------------NAHRADIT----------------------------------
declare @ClearForm bit = 1 --Určuje zda se má formulář před instalací modulu vymazat
insert into #Import_Temp(ID_CompanyForm) values(256) --Varnsdorf TOS
insert into #Import_Temp(ID_CompanyForm) values(265) --C.S.O.

declare @IsError bit = 0
declare @ID_Company ID
declare @CompanyDisplayName DN
declare @ID_CompanyForm ID
declare @ID_CompanyLanguage ID
declare Import_Cursor cursor for 
	select ID_CompanyForm
		from #Import_Temp
open Import_Cursor

fetch next from Import_Cursor
	into @ID_CompanyForm

while @@FETCH_STATUS=0 and @IsError=0
begin
    set @ID_Company = (select IA_CompanyMenuItem.ID_Company from IA_CompanyForm
                        inner join IA_CompanyMenuItem on IA_CompanyMenuItem.ID=IA_CompanyForm.ID_CompanyMenuItem
                      where IA_CompanyForm.ID=@ID_CompanyForm)
    set @CompanyDisplayName = (select DisplayName from IA_Company where ID=@ID_Company)
    set @ID_CompanyLanguage = dbo.IA_CompanyLanguage_Base(@ID_Company)

    update IA_CompanyForm set [Name]='InviteColleague', IsEmail=0, IsSaveAuthor=1, Email=null where ID=@ID_CompanyForm
    if @@error <> 0
		  set @IsError=1 

    -- ------------------- Vyčistí formulář ---------------------------------
    if @ClearForm = 1
    begin
      delete IA_FormItemLanguage from IA_FormItem
        inner join IA_FormItemLanguage on IA_FormItemLanguage.ID_FormItem=IA_FormItem.ID
        where ID_CompanyForm=@ID_CompanyForm
      if @@error <> 0
        set @IsError=1 
      
      delete IA_FormItem where ID_CompanyForm=@ID_CompanyForm
      if @@error <> 0
        set @IsError=1 
    end

    -- -------------------Vytvoření jednotlivých položek----------
    insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
        values(1, @ID_CompanyForm, 'Label', 1, 1, null, 1)
    if @@error <> 0
		set @IsError=1 

    insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName, [Description])
        values(@@IDENTITY, @ID_CompanyLanguage,N'Jak pozvat kolegu? 🧐', 'Vyplňte jméno, příjmení, osobní číslo a e-mailovou adresu kolegy, kterého chcete do JOBky pozvat. Systém ověří zadané údaje a zašle přihlašovací e-mail. E-mailová schránka kolegy může být pracovní nebo soukromá.')
    if @@error <> 0
		set @IsError=1 

    insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
        values(1, @ID_CompanyForm, 'Entry', 1, 2, 'InviteColleaqueName', 1)
    if @@error <> 0
		set @IsError=1 

    insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
        values(@@IDENTITY, @ID_CompanyLanguage,'Jméno')
    if @@error <> 0
		set @IsError=1 

    insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
        values(1, @ID_CompanyForm, 'Entry', 1, 3, 'InviteColleaquePersonalNumber', 1)
    if @@error <> 0
		set @IsError=1

    insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
        values(@@IDENTITY, @ID_CompanyLanguage,'Osobní číslo')
    if @@error <> 0
		set @IsError=1

    insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
        values(1, @ID_CompanyForm, 'Entry', 1, 4, 'InviteColleaqueEmail', 1)
    if @@error <> 0
		set @IsError=1
    
    insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
        values(@@IDENTITY, @ID_CompanyLanguage,'Email')
    if @@error <> 0
		set @IsError=1

    -------------------Nastavení validační procedury na formuláři------------------
    --insert into IA_CustomProcedure (DisplayName, ID_CustomProcedureType, [Procedure], ParameterNote, Note)
    --    values('Pozvat kolegu: Validace', 'form_validate', 'IA_Data_VALIDATE_InviteColleague', null, 'tasid#57742')
    update IA_CompanyForm set IA_CompanyForm.ProcedureValidate='IA_Data_VALIDATE_InviteColleague' where IA_CompanyForm.ID=@ID_CompanyForm
    if @@error <> 0
		set @IsError=1

    -------------------Nastavení pocedury která se volá po založení odpovědi na formulář------------------
    --insert into IA_CustomProcedure (DisplayName, ID_CustomProcedureType, [Procedure], ParameterNote, Note)
    --    values('Pozvat kolegu: Odeslání pozvánky', 'form_insert', 'IA_Data_OTHER_InviteColleague', null, 'tasid#57742')
    update IA_CompanyForm set IA_CompanyForm.ProcedureInsert='IA_Data_OTHER_InviteColleague' where IA_CompanyForm.ID=@ID_CompanyForm
    if @@error <> 0
		set @IsError=1

    print 'Formulář nastaven. Firma: ' + @CompanyDisplayName

    fetch next from Import_Cursor
        into @ID_CompanyForm
end
close Import_Cursor
deallocate Import_Cursor

drop table #Import_Temp -- Dispose of temp table (will be disposed of at the end anyway - end of session)

if @IsError=0
    commit tran
else
    rollback tran