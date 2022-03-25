--Procedury
   --IA_Data_OTHER_SelectReceiver

select IA_FormItem.ID, IA_FormItemLanguage.DisplayName, IA_FormItem.Name
from IA_FormItem 
    inner join IA_FormItemLanguage on IA_FormItem.ID=IA_FormItemLanguage.ID_FormItem    
where ID_CompanyForm=74

-----------------NASTAVENÍ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
declare @ID_FormItem_SelectReceiverItem ID = 3847 --Položka výběr z formuláře který obsahuje položku s emailem
declare @ID_FormItem_Email ID = 3839 --Položka která skutečně obsahuje emailovou adresu

declare @ID_CompanyForm ID = (select ID_CompanyForm from IA_FormItem where ID=@ID_FormItem_SelectReceiverItem)

update IA_FormItem set [Name] = 'SelectReceiver' where ID=@ID_FormItem_SelectReceiverItem and ID_FormItemType='FormSelect'
if @@ROWCOUNT = 0
begin
    print 'Nebyl nalezen výběr z formuláře se zadaným ID'
    goto failed
end

update IA_FormItem set [Name] = 'Email' where ID=@ID_FormItem_Email and ID_FormItemType='Entry'
if @@ROWCOUNT = 0
begin
    print 'Nebylo nalezeno textové pole formuláře se zadaným ID'
    goto failed
end

-- insert into IA_CustomProcedure(DisplayName, ID_CustomProcedureType, [Procedure], ParameterNote, [Note])
--     values('Přijemce emailu podle kategorie', 'form_insert', 'IA_Data_OTHER_SelectReceiver', NULL, 'taskid#58367')
update IA_CompanyForm set IA_CompanyForm.ProcedureInsert='IA_Data_OTHER_SelectReceiver', IsEmail=1 where IA_CompanyForm.ID=@ID_CompanyForm

failed: