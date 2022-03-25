---------------------- Konfigurace --------------------------
declare @ID_Company ID = 14
--select * from IA_Company where ID=@ID_Company
declare @ID_Login GUID = 'ead48c53-556e-48ff-b35f-50233ff65705'
declare @FolderName DN = 'Úkoly'
declare @UserFormName DN = 'Uživatelé'
declare @TaskFormName DN = 'Úkoly'
declare @LineFormName DN = 'Linka'
declare @WorkstationFormName DN = 'Pracoviště'
declare @ActiveListName DN = 'Aktivní úkoly'
declare @ArchiveListName DN = 'Archiv úkolů'
declare @UserListName DN = 'Uživatelé'

declare @ID_CompanyBaseLanguage ID = dbo.IA_CompanyLanguage_Base(@ID_Company)

--------------------- Založení formuláře -------------------
declare @ID_FolderCompanyMenuItem ID
exec IA_CompanyMenuItem_NEW_Company @ID_Login=@ID_Login, @ID_MenuItem='Folder', @ID_Company=@ID_Company, @ID=@ID_FolderCompanyMenuItem out
exec IA_CompanyMenuItemLanguage_NEW_Edit @ID_Login=@ID_Login, @ID_CompanyLanguage=@ID_CompanyBaseLanguage, @ID_CompanyMenuItem=@ID_FolderCompanyMenuItem, @DisplayName=@FolderName

declare @ID_UserCompanyMenuItem ID
exec IA_CompanyMenuItem_NEW_Company @ID_Login=@ID_Login, @ID_MenuItem='Form', @ID_Company=@ID_Company, @ID=@ID_UserCompanyMenuItem out
exec IA_CompanyMenuItemLanguage_NEW_Edit @ID_Login=@ID_Login, @ID_CompanyLanguage=@ID_CompanyBaseLanguage, @ID_CompanyMenuItem=@ID_UserCompanyMenuItem, @DisplayName=@UserFormName
declare @ID_UserForm ID = (select ID from IA_CompanyForm where ID_CompanyMenuItem=@ID_UserCompanyMenuItem)
update IA_CompanyMenuItem set ID_CompanyMenuItemParent=@ID_FolderCompanyMenuItem where ID=@ID_UserCompanyMenuItem
update IA_CompanyForm set IsInsertEmail=0, [Name]='TodoUser'where ID=@ID_UserForm

declare @ID_TaskCompanyMenuItem ID
exec IA_CompanyMenuItem_NEW_Company @ID_Login=@ID_Login, @ID_MenuItem='Form', @ID_Company=@ID_Company, @ID=@ID_TaskCompanyMenuItem out
exec IA_CompanyMenuItemLanguage_NEW_Edit @ID_Login=@ID_Login, @ID_CompanyLanguage=@ID_CompanyBaseLanguage, @ID_CompanyMenuItem=@ID_TaskCompanyMenuItem, @DisplayName=@TaskFormName
declare @ID_TaskForm ID = (select ID from IA_CompanyForm where ID_CompanyMenuItem=@ID_TaskCompanyMenuItem)
update IA_CompanyMenuItem set ID_CompanyMenuItemParent=@ID_FolderCompanyMenuItem where ID=@ID_TaskCompanyMenuItem
update IA_CompanyForm set IsInsertEmail=0, [Name]='TodoTask' where ID=@ID_TaskForm

declare @ID_LineCompanyMenuItem ID
exec IA_CompanyMenuItem_NEW_Company @ID_Login=@ID_Login, @ID_MenuItem='Form', @ID_Company=@ID_Company, @ID=@ID_LineCompanyMenuItem out
exec IA_CompanyMenuItemLanguage_NEW_Edit @ID_Login=@ID_Login, @ID_CompanyLanguage=@ID_CompanyBaseLanguage, @ID_CompanyMenuItem=@ID_LineCompanyMenuItem, @DisplayName=@LineFormName
declare @ID_LineForm ID = (select ID from IA_CompanyForm where ID_CompanyMenuItem=@ID_LineCompanyMenuItem)
update IA_CompanyMenuItem set ID_CompanyMenuItemParent=@ID_FolderCompanyMenuItem where ID=@ID_LineCompanyMenuItem
update IA_CompanyForm set IsInsertEmail=0, [Name]='TodoLine' where ID=@ID_LineForm

declare @ID_WorkstationCompanyMenuItem ID
exec IA_CompanyMenuItem_NEW_Company @ID_Login=@ID_Login, @ID_MenuItem='Form', @ID_Company=@ID_Company, @ID=@ID_WorkstationCompanyMenuItem out
exec IA_CompanyMenuItemLanguage_NEW_Edit @ID_Login=@ID_Login, @ID_CompanyLanguage=@ID_CompanyBaseLanguage, @ID_CompanyMenuItem=@ID_WorkstationCompanyMenuItem, @DisplayName=@WorkstationFormName
declare @ID_WorkstationForm ID = (select ID from IA_CompanyForm where ID_CompanyMenuItem=@ID_WorkstationCompanyMenuItem)
update IA_CompanyMenuItem set ID_CompanyMenuItemParent=@ID_FolderCompanyMenuItem where ID=@ID_WorkstationCompanyMenuItem
update IA_CompanyForm set IsInsertEmail=0, [Name]='TodoWorkstation' where ID=@ID_WorkstationForm

--------------------- Položky formuláře Uživatel --------------------
insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
    values(1, @ID_UserForm, 'Entry', 1, 1, 'UserName', 1)
declare @ID_UserNameFormItem ID = @@IDENTITY
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@ID_UserNameFormItem, @ID_CompanyBaseLanguage,'Jméno uživatele')

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
    values(1, @ID_UserForm, 'Entry', 1, 2, 'PersonalNumber', 1)
declare @ID_PersonalNumberFormItem ID = @@IDENTITY
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@ID_PersonalNumberFormItem, @ID_CompanyBaseLanguage,'Osobní číslo uživatele')

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
    values(1, @ID_UserForm, 'Checkbox', 1, 3, 'CanCreate', 1)
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@@IDENTITY, @ID_CompanyBaseLanguage,'Může založit úkol')

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
    values(1, @ID_UserForm, 'Checkbox', 1, 4, 'CanApprove', 1)
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@@IDENTITY, @ID_CompanyBaseLanguage,'Může schválit úkol')

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
    values(1, @ID_UserForm, 'Checkbox', 1, 5, 'CanMarkAsSolve', 1)
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@@IDENTITY, @ID_CompanyBaseLanguage,'Může označit úkol jako vyřešený')

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
    values(1, @ID_UserForm, 'Checkbox', 1, 6, 'CanMarkAsUnsolve', 1)
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@@IDENTITY, @ID_CompanyBaseLanguage,'Může označit úkol jako nevyřešený')
    

--------------------- Položky formuláře Linka --------------------
insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
    values(1, @ID_LineForm, 'Entry', 1, 1, null, 1)
declare @ID_LineFormItem ID = @@IDENTITY
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@ID_LineFormItem, @ID_CompanyBaseLanguage,'Název')

--------------------- Položky formuláře Pracoviště --------------------
insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
    values(1, @ID_WorkstationForm, 'Entry', 1, 1, null, 1)
declare @ID_WorkstationFormItem ID = @@IDENTITY
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@ID_WorkstationFormItem, @ID_CompanyBaseLanguage,'Název')

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, ID_FormItemSource)
    values(1, @ID_WorkstationForm, 'FormSelect', 1, 2, null, 1, @ID_LineFormItem)
declare @ID_LineWorkstationFormItem ID = @@IDENTITY
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@ID_LineWorkstationFormItem, @ID_CompanyBaseLanguage,'Linka')

--------------------- Položky formuláře Úkol -------------------- 
insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, ID_FormItemSource)
    values(1, @ID_TaskForm, 'FormSelect', 1, 1, 'Line', 1, @ID_LineFormItem)
declare @ID_LineSelectFormItem ID = @@IDENTITY
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@ID_LineSelectFormItem, @ID_CompanyBaseLanguage,'Linka')   

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, ID_FormItemSource, ID_FormItemParent, ID_FormItemParentFilter)
    values(1, @ID_TaskForm, 'FormSelect', 1, 2, 'Workstation', 1, @ID_WorkstationFormItem, @ID_LineSelectFormItem, @ID_LineWorkstationFormItem)
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@@IDENTITY, @ID_CompanyBaseLanguage,'Pracoviště')

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
    values(1, @ID_TaskForm, 'Editor', 0, 3, 'Description', 1)
declare @ID_DescriptionFormItem ID = @@IDENTITY
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@ID_DescriptionFormItem, @ID_CompanyBaseLanguage,'Popis')

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
    values(1, @ID_TaskForm, 'Photo', 1, 4, 'Photo', 1)
declare @ID_PhotoFormItem ID = @@IDENTITY
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@ID_PhotoFormItem, @ID_CompanyBaseLanguage,'Fotografie')

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, IsInsert, IsUpdate)
    values(1, @ID_TaskForm, 'Entry', 0, 5, 'DateCreated', 1, 0, 0)
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@@IDENTITY, @ID_CompanyBaseLanguage,'Datum zadání')

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, ID_FormItemSource, IsInsert, IsUpdate)
    values(1, @ID_TaskForm, 'FormSelect', 0, 6, 'UserCreated', 1, @ID_UserNameFormItem, 0, 0)
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@@IDENTITY, @ID_CompanyBaseLanguage,'Zadal')

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, IsInsert, IsUpdate)
    values(1, @ID_TaskForm, 'Entry', 0, 7, 'DateApproved', 1, 0, 0)
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@@IDENTITY, @ID_CompanyBaseLanguage,'Datum přijetí')

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, ID_FormItemSource, IsInsert, IsUpdate)
    values(1, @ID_TaskForm, 'FormSelect', 0, 8, 'UserApproved', 1, @ID_UserNameFormItem, 0, 0)
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@@IDENTITY, @ID_CompanyBaseLanguage,'Přijal')

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, ID_FormItemSource, IsInsert, IsUpdate)
    values(1, @ID_TaskForm, 'FormSelect', 0, 9, 'UserSolver', 1, @ID_UserNameFormItem, 0, 1)
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@@IDENTITY, @ID_CompanyBaseLanguage,'Řešitel')

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, IsInsert, IsUpdate)
    values(1, @ID_TaskForm, 'Entry', 0, 10, 'DateClosed', 1, 0, 0)
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@@IDENTITY, @ID_CompanyBaseLanguage,'Datum uzavření')

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, ID_FormItemSource, IsInsert, IsUpdate)
    values(1, @ID_TaskForm, 'FormSelect', 0, 11, 'UserClosed', 1, @ID_UserNameFormItem, 0, 0)
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@@IDENTITY, @ID_CompanyBaseLanguage,'Uzavřel')

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, IsInsert, IsUpdate)
    values(1, @ID_TaskForm, 'Editor', 0, 12, 'UnsolvedNote', 1, 0, 1)
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@@IDENTITY, @ID_CompanyBaseLanguage,'Důvod nesplnění')

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, IsInsert, IsUpdate)
    values(1, @ID_TaskForm, 'Select', 0, 13, 'State', 1, 0, 1)
declare @ID_StateFormItem ID = @@IDENTITY
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@ID_StateFormItem, @ID_CompanyBaseLanguage,'Stav')

    insert into IA_FormItemOption (ID_FormItem, DisplayName, IsSynced, IsActive, [Name])
        values(@ID_StateFormItem, 'Nový', 1, 1, 'New')
    insert into IA_FormItemOptionLanguage (ID_FormItemOption, ID_CompanyLanguage, Displayname)
        values(@@IDENTITY, @ID_CompanyBaseLanguage, 'Nový')

    insert into IA_FormItemOption (ID_FormItem, DisplayName, IsSynced, IsActive, [Name])
        values(@ID_StateFormItem, 'Přijato', 1, 1, 'Approved')
    insert into IA_FormItemOptionLanguage (ID_FormItemOption, ID_CompanyLanguage, Displayname)
        values(@@IDENTITY, @ID_CompanyBaseLanguage, 'Přijato')

    insert into IA_FormItemOption (ID_FormItem, DisplayName, IsSynced, IsActive, [Name])
        values(@ID_StateFormItem, 'Splněno', 1, 1, 'Solved')
    insert into IA_FormItemOptionLanguage (ID_FormItemOption, ID_CompanyLanguage, Displayname)
        values(@@IDENTITY, @ID_CompanyBaseLanguage, 'Splněno')

    insert into IA_FormItemOption (ID_FormItem, DisplayName, IsSynced, IsActive, [Name])
        values(@ID_StateFormItem, 'Nesplněno', 1, 1, 'Unsolved')
    insert into IA_FormItemOptionLanguage (ID_FormItemOption, ID_CompanyLanguage, Displayname)
        values(@@IDENTITY, @ID_CompanyBaseLanguage, 'Nesplněno')

    insert into IA_FormItemOption (ID_FormItem, DisplayName, IsSynced, IsActive, [Name])
        values(@ID_StateFormItem, 'Zrušeno', 1, 1, 'Canceled')
    insert into IA_FormItemOptionLanguage (ID_FormItemOption, ID_CompanyLanguage, Displayname)
        values(@@IDENTITY, @ID_CompanyBaseLanguage, 'Zrušeno')

--------------------- Použití procedur -------------------- 
update IA_CompanyForm set ProcedureValidate='IA_Data_VALIDATE_TODO_User' where ID=@ID_UserForm

update IA_CompanyForm set ProcedureValidate='IA_Data_VALIDATE_TODO_Task' where ID=@ID_TaskForm
update IA_CompanyForm set ProcedureInsert='IA_Data_OTHER_TODO_Task' where ID=@ID_TaskForm
update IA_CompanyForm set ProcedureUpdate='IA_Data_OTHER_TODO_Task' where ID=@ID_TaskForm


--------------------- Přehled aktivní -------------------- 
declare @DisplayNameSql Note = 
'dbo.IA_DataItem_Name_FormatOutputValue(@ID_Login, IA_Data.ID, ''Line'', @ID_CompanyLanguage) + '' - ''
+ dbo.IA_DataItem_Name_FormatOutputValue(@ID_Login, IA_Data.ID, ''Workstation'', @ID_CompanyLanguage)'

declare @ActiveFilterSql Note = '
(dbo.IA_DataItem_Name(@ID_Login, IA_Data.ID, ''State'') = dbo.IA_FormItemOption_Name(@ID_Login, IA_Data.ID, ''State'', ''New''))
or
(dbo.IA_DataItem_Name(@ID_Login, IA_Data.ID, ''State'') = dbo.IA_FormItemOption_Name(@ID_Login, IA_Data.ID, ''State'', ''Approved''))'

declare @ID_ActiveListCompanyMenuItem ID
exec IA_CompanyMenuItem_NEW_Company @ID_Login=@ID_Login, @ID_MenuItem='List', @ID_Company=@ID_Company, @ID=@ID_ActiveListCompanyMenuItem out
exec IA_CompanyMenuItemLanguage_NEW_Edit @ID_Login=@ID_Login, @ID_CompanyLanguage=@ID_CompanyBaseLanguage, @ID_CompanyMenuItem=@ID_ActiveListCompanyMenuItem, @DisplayName=@ActiveListName
declare @ID_ActiveList ID = (select ID from IA_List where ID_CompanyMenuItem=@ID_ActiveListCompanyMenuItem)
update IA_CompanyMenuItem set ID_CompanyMenuItemParent=@ID_FolderCompanyMenuItem where ID=@ID_ActiveListCompanyMenuItem
update IA_List set 
    ID_CompanyForm=@ID_TaskForm,
    DisplayNameSql = @DisplayNameSql,
    FilterSql = @ActiveFilterSql,
    ID_FormItemDescription = @ID_DescriptionFormItem,
    ID_FormItemPicture = @ID_PhotoFormItem,
    ID_ListType = 'SmallPicture',
    IsDateVisible = 1
where ID=@ID_ActiveList

declare @ArchiveFilterSql Note = '
(dbo.IA_DataItem_Name(@ID_Login, IA_Data.ID, ''State'') = dbo.IA_FormItemOption_Name(@ID_Login, IA_Data.ID, ''State'', ''solved''))
or
(dbo.IA_DataItem_Name(@ID_Login, IA_Data.ID, ''State'') = dbo.IA_FormItemOption_Name(@ID_Login, IA_Data.ID, ''State'', ''unsolved''))
or
(dbo.IA_DataItem_Name(@ID_Login, IA_Data.ID, ''State'') = dbo.IA_FormItemOption_Name(@ID_Login, IA_Data.ID, ''State'', ''canceled''))
'

declare @ID_ArchiveListCompanyMenuItem ID
exec IA_CompanyMenuItem_NEW_Company @ID_Login=@ID_Login, @ID_MenuItem='List', @ID_Company=@ID_Company, @ID=@ID_ArchiveListCompanyMenuItem out
exec IA_CompanyMenuItemLanguage_NEW_Edit @ID_Login=@ID_Login, @ID_CompanyLanguage=@ID_CompanyBaseLanguage, @ID_CompanyMenuItem=@ID_ArchiveListCompanyMenuItem, @DisplayName=@ArchiveListName
declare @ID_ArchiveList ID = (select ID from IA_List where ID_CompanyMenuItem=@ID_ArchiveListCompanyMenuItem)
update IA_CompanyMenuItem set ID_CompanyMenuItemParent=@ID_FolderCompanyMenuItem where ID=@ID_ArchiveListCompanyMenuItem
update IA_List set 
    ID_CompanyForm=@ID_TaskForm,
    DisplayNameSql = @DisplayNameSql,
    FilterSql = @ArchiveFilterSql,
    ID_FormItemDescription = @ID_DescriptionFormItem,
    ID_FormItemPicture = @ID_PhotoFormItem,
    ID_ListType = 'SmallPicture',
    IsDateVisible = 1
where ID=@ID_ArchiveList

declare @ID_UserListCompanyMenuItem ID
exec IA_CompanyMenuItem_NEW_Company @ID_Login=@ID_Login, @ID_MenuItem='List', @ID_Company=@ID_Company, @ID=@ID_UserListCompanyMenuItem out
exec IA_CompanyMenuItemLanguage_NEW_Edit @ID_Login=@ID_Login, @ID_CompanyLanguage=@ID_CompanyBaseLanguage, @ID_CompanyMenuItem=@ID_UserListCompanyMenuItem, @DisplayName=@UserListName
declare @ID_UserList ID = (select ID from IA_List where ID_CompanyMenuItem=@ID_UserListCompanyMenuItem)
update IA_CompanyMenuItem set ID_CompanyMenuItemParent=@ID_FolderCompanyMenuItem where ID=@ID_UserListCompanyMenuItem
update IA_List set 
    ID_ListType='Plain',
    ID_CompanyForm=@ID_UserForm,
    ID_FormItemDisplayName = @ID_PersonalNumberFormItem,
    ID_FormItemDescription = @ID_UserNameFormItem,
    IsDateVisible = 0
where ID=@ID_UserList









   

