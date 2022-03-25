declare @Sql Note = N'
--Parametry
declare @ID_FormItem_SelectReceiverItem ID = {ID_SelectReceiverItem} --Položka výběr z formuláře který obsahuje položku s emailem
declare @ID_FormItem_Email ID = {ID_EmailItem} --Položka která skutečně obsahuje emailovou adresu

declare @ID_CompanyForm ID = (select ID_CompanyForm from IA_FormItem where ID=@ID_FormItem_SelectReceiverItem)
update IA_FormItem set [Name] = ''SelectReceiver'' where ID=@ID_FormItem_SelectReceiverItem and ID_FormItemType=''FormSelect''
update IA_FormItem set [Name] = ''Email'' where ID=@ID_FormItem_Email and ID_FormItemType=''Entry''
update IA_CompanyForm set IA_CompanyForm.ProcedureInsert=''IA_Data_OTHER_SelectReceiver'', IsInsertEmail=1 where IA_CompanyForm.ID=@ID_CompanyForm'

declare @Note Note = '- Pro instalaci tohoto modulu musíte mít v BO připravené dva formuláře
    - Formulář 1 - Formulář obsahující emailové adresy (například seznam oddělení)
    - Formulář 2 - Formulář pro zadávání záznamů (závad, nápadů, stížností) který obsahuje položku "výběr z formuláře" kde se vybírá z výše uvedeného formuláře'

insert into IA_Package (DisplayName, Script, Note)
    values('Email podle oddělení', @Sql, @Note)
declare @ID_Package ID = @@IDENTITY

insert into IA_PackageParameter(ID_Package, [Key], DefaultValue, Note, ID_ParameterType)
    values
        (@ID_Package, 'ID_EmailItem', null, 'ID položky Formuláře 1, ve které jsou uložené emailové adresy na které se má email odeslat', 'ID_FormItem'), 
        (@ID_Package, 'ID_SelectReceiverItem', null, 'ID položky Formuláře 2, kde si uživatel vybírá oddělení (Výběr z Formuláře 1)', 'ID_FormItem')
