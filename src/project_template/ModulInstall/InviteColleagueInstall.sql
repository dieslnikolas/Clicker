--Procedury: 
--IA_Data_NEW_DataItems
--IA_Data_NEW_DataItems_WS
--IA_Employee_OTHER_Invite
--IA_Data_VALIDATE_InviteColleague
--IA_Data_OTHER_InviteColleague
--IA_Company_ACTION

--select * from IA_Company where ID=153
declare @ID_Company ID = 153 --NAHRADIT!!!!!!!!!!!!!!!
declare @ID_CompanyForm ID = 128 --NAHRADIT!!!!!!!!!!!!!!!
declare @ID_CompanyLanguage ID = dbo.IA_CompanyLanguage_Base(@ID_Company)

update IA_CompanyForm set [Name]='InviteColleague', IsEmail=0, IsSaveAuthor=1, Email=null where ID=@ID_CompanyForm

-- -------------------Vytvoření jednotlivých položek----------
insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
    values(1, @ID_CompanyForm, 'Label', 1, 1, null, 1)
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName, [Description])
    values(@@IDENTITY, @ID_CompanyLanguage,N'Jak pozvat kolegu? 🧐', 'Vyplňte jméno, příjmení, osobní číslo a e-mailovou adresu kolegy, kterého chcete do JOBky pozvat. Systém ověří zadané údaje a zašle přihlašovací e-mail. E-mailová schránka kolegy může být pracovní nebo soukromá.')

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
    values(1, @ID_CompanyForm, 'Entry', 1, 1, 'InviteColleaqueName', 1)
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@@IDENTITY, @ID_CompanyLanguage,'Jméno')
insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
    values(1, @ID_CompanyForm, 'Entry', 1, 2, 'InviteColleaquePersonalNumber', 1)
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@@IDENTITY, @ID_CompanyLanguage,'Osobní číslo')
insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
    values(1, @ID_CompanyForm, 'Entry', 1, 3, 'InviteColleaqueEmail', 1)
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@@IDENTITY, @ID_CompanyLanguage,'Email')

-------------------Nastavení validační procedury na formuláři------------------
--insert into IA_CustomProcedure (DisplayName, ID_CustomProcedureType, [Procedure], ParameterNote, Note)
--    values('Pozvat kolegu: Validace', 'form_validate', 'IA_Data_VALIDATE_InviteColleague', null, 'tasid#57742')
update IA_CompanyForm set IA_CompanyForm.ProcedureValidate='IA_Data_VALIDATE_InviteColleague' where IA_CompanyForm.ID=@ID_CompanyForm

-------------------Nastavení pocedury která se volá po založení odpovědi na formulář------------------
--insert into IA_CustomProcedure (DisplayName, ID_CustomProcedureType, [Procedure], ParameterNote, Note)
--    values('Pozvat kolegu: Odeslání pozvánky', 'form_insert', 'IA_Data_OTHER_InviteColleague', null, 'tasid#57742')
update IA_CompanyForm set IA_CompanyForm.ProcedureInsert='IA_Data_OTHER_InviteColleague' where IA_CompanyForm.ID=@ID_CompanyForm