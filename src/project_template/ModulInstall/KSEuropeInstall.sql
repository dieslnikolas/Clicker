declare @ID_Company ID = 143 --NAHRADIT!!!!!!!!!!!!!!!
declare @ID_PluginName DN = 'Krimice'
declare @Email DN = 'fischer@skeleton.cz'
-------------------Založit formuláře----------------------- PROVÉST RUČNĚ!!!!!!!!!!!!!!!
    --Termín
    declare @ID_DoctorDayForm ID = 291 --NAHRADIT!!!!!!!!!!!!!!!
    --Časové okno
    declare @ID_DoctorTimeForm ID = 292 --NAHRADIT!!!!!!!!!!!!!!!
    --Objednávkový formulář
    declare @ID_DoctorOrderForm ID = 293 --NAHRADIT!!!!!!!!!!!!!!!

-------------------Vytvoření jednotlivých položek - termín-
declare @ID_CompanyLanguage ID = dbo.IA_CompanyLanguage_Base(@ID_Company)
declare @ID_CompanyForm ID = @ID_DoctorDayForm

update IA_CompanyForm set [Name]='DoctorDay'+@ID_PluginName where ID=@ID_CompanyForm

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
    values(1, @ID_CompanyForm, 'Date', 1, 1, 'DoctorDayDate'+@ID_PluginName, 1)
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@@IDENTITY, @ID_CompanyLanguage,'Den')

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
    values(1, @ID_CompanyForm, 'Date', 1, 2, 'DoctorDayCloseDate'+@ID_PluginName, 1)
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@@IDENTITY, @ID_CompanyLanguage,'Uzavření objednávek (datum)')

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
    values(1, @ID_CompanyForm, 'Time', 1, 3, 'DoctorDayCloseTime'+@ID_PluginName, 1)
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@@IDENTITY, @ID_CompanyLanguage,'Uzavření objednávek (čas)')

-------------------Vytvoření jednotlivých položek - časové okno
set @ID_CompanyForm=@ID_DoctorTimeForm
update IA_CompanyForm set [Name]='DoctorTime'+@ID_PluginName where ID=@ID_CompanyForm

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
    values(1, @ID_CompanyForm, 'FormSelect', 1, 1, 'DoctorTimeDay'+@ID_PluginName, 1)
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@@IDENTITY, @ID_CompanyLanguage,'Termín')

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
    values(1, @ID_CompanyForm, 'Entry', 1, 2, 'DoctorTimeDisplayName'+@ID_PluginName, 1)
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@@IDENTITY, @ID_CompanyLanguage,'Čas')

-------------------Vytvoření jednotlivých položek - objednávky
set @ID_CompanyForm=@ID_DoctorOrderForm
update IA_CompanyForm set [Name]='DoctorOrder'+@ID_PluginName where ID=@ID_CompanyForm

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
    values(1, @ID_CompanyForm, 'FormSelect', 1, 1, 'DoctorOrderDay'+@ID_PluginName, 1)
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@@IDENTITY, @ID_CompanyLanguage,'Termín')

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
    values(1, @ID_CompanyForm, 'FormSelect', 1, 2, 'DoctorOrderTime'+@ID_PluginName, 1)
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@@IDENTITY, @ID_CompanyLanguage,'Čas')

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
    values(1, @ID_CompanyForm, 'Entry', 1, 3, 'DoctorOrderDisplayName'+@ID_PluginName, 1)
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@@IDENTITY, @ID_CompanyLanguage,'Jméno a přijmení')

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
    values(1, @ID_CompanyForm, 'Entry', 0, 4, 'DoctorOrderPersonalNumber'+@ID_PluginName, 1)
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@@IDENTITY, @ID_CompanyLanguage,'Osobní číslo')

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
    values(1, @ID_CompanyForm, 'Select', 1, 5, 'DoctorOrderDepartment'+@ID_PluginName, 1)
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@@IDENTITY, @ID_CompanyLanguage,'Středisko')

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
    values(1, @ID_CompanyForm, 'Entry', 0, 6, 'DoctorOrderManager'+@ID_PluginName, 1)
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@@IDENTITY, @ID_CompanyLanguage,'Vedoucí')

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
    values(1, @ID_CompanyForm, 'Entry', 1, 7, 'DoctorOrderJob'+@ID_PluginName, 1)
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@@IDENTITY, @ID_CompanyLanguage,'Pracovní pozice')

insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced)
    values(1, @ID_CompanyForm, 'Select', 1, 8, 'DoctorOrderType'+@ID_PluginName, 1)
declare @ID_DoctorOrderTypeFormItem ID = @@IDENTITY
insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
    values(@ID_DoctorOrderTypeFormItem, @ID_CompanyLanguage,'Typ lékařské prohlídky')
insert into IA_FormItemOption (ID_FormItem, DisplayName, IsSynced, IsActive, [Name])
    values(@ID_DoctorOrderTypeFormItem, 'Vstupní', 1, 1, 'DoctorOrderTypeOptionIn'+@ID_PluginName)
insert into IA_FormItemOptionLanguage (ID_FormItemOption, ID_CompanyLanguage, Displayname)
    values(@@IDENTITY, @ID_CompanyLanguage, 'Vstupní')
insert into IA_FormItemOption (ID_FormItem, DisplayName, IsSynced, IsActive, [Name])
    values(@ID_DoctorOrderTypeFormItem, 'Výstupní', 1, 1, 'DoctorOrderTypeOptionOut'+@ID_PluginName)
insert into IA_FormItemOptionLanguage (ID_FormItemOption, ID_CompanyLanguage, Displayname)
    values(@@IDENTITY, @ID_CompanyLanguage, 'Výstupní')
insert into IA_FormItemOption (ID_FormItem, DisplayName, IsSynced, IsActive, [Name])
    values(@ID_DoctorOrderTypeFormItem, 'Mimořádná', 1, 1, 'DoctorOrderTypeOptionSpecial'+@ID_PluginName)
insert into IA_FormItemOptionLanguage (ID_FormItemOption, ID_CompanyLanguage, Displayname)
    values(@@IDENTITY, @ID_CompanyLanguage, 'Mimořádná')
insert into IA_FormItemOption (ID_FormItem, DisplayName, IsSynced, IsActive, [Name])
    values(@ID_DoctorOrderTypeFormItem, 'Periodická', 1, 1, 'DoctorOrderTypeOptionPeriodic'+@ID_PluginName)
insert into IA_FormItemOptionLanguage (ID_FormItemOption, ID_CompanyLanguage, Displayname)
    values(@@IDENTITY, @ID_CompanyLanguage, 'Periodická')

-------------------Nastavení výběru z formuláře------------
update item set item.ID_FormItemSource=source.ID
from IA_FormItem item
    inner join IA_FormItem source on source.Name=('DoctorDayDate'+@ID_PluginName) and source.IsActive=1
where item.Name=('DoctorTimeDay'+@ID_PluginName) and item.IsActive=1

update item set item.ID_FormItemSource=source.ID
from IA_FormItem item
    inner join IA_FormItem source on source.Name=('DoctorDayDate'+@ID_PluginName) and source.IsActive=1
where item.Name=('DoctorOrderDay'+@ID_PluginName) and item.IsActive=1

update item set item.ID_FormItemSource=source.ID
from IA_FormItem item
    inner join IA_FormItem source on source.Name=('DoctorTimeDisplayName'+@ID_PluginName) and source.IsActive=1
where item.Name=('DoctorOrderTime'+@ID_PluginName) and item.IsActive=1

-------------------Nastavení vazeb-------------------------
update item set item.ID_FormItemParent=parent.ID
from IA_FormItem item
    inner join IA_FormItem parent on parent.Name=('DoctorOrderDay'+@ID_PluginName) and parent.IsActive=1
where item.Name=('DoctorOrderTime'+@ID_PluginName) and item.IsActive=1

update item set item.ID_FormItemParentFilter=parentFilter.ID
from IA_FormItem item
    inner join IA_FormItem parentFilter on parentFilter.Name=('DoctorTimeDay'+@ID_PluginName) and parentFilter.IsActive=1
where item.Name=('DoctorOrderTime'+@ID_PluginName) and item.IsActive=1

-------------------Nastavení FilterSQL-------------------------
update IA_FormItem set IA_FormItem.FilterSql='dbo.IA_DataItem_Filter_KSEurope_DoctorOrder_IsDayOpen(IA_DataItem.ID_Data, @ID_CompanyLanguage)=1'
where IA_FormItem.Name='DoctorOrderDay'+@ID_PluginName and IA_FormItem.IsActive=1

update IA_FormItem set IA_FormItem.FilterSql='dbo.IA_DataItem_Filter_KSEurope_DoctorOrder_IsTimeFree(@ID_FormItem, IA_DataItem.ID, @ID_DataFilterException)=1'
where IA_FormItem.Name='DoctorOrderTime'+@ID_PluginName and IA_FormItem.IsActive=1

-------------------Nastavení validační procedury na formuláři------------------
update IA_CompanyForm set IA_CompanyForm.ProcedureValidate='IA_Data_VALIDATE_KSEurope_DoctorOrder' where IA_CompanyForm.Name='DoctorOrder'+@ID_PluginName

-------------------Založení CompanyPlugin------------------
insert into IA_CompanyPlugin(DisplayName, ID_Company, [Procedure], Note, ID_Schedule, ScheduleCount, ScheduleTime)
    values('Procedura pro generování termínu', @ID_Company, 'IA_Data_NEW_DataItems_KSEurope', 'Plugin který v pravidelných intervalech generuje nové termíny taskid#54327', 'day', 1, '16:00')
---Nastavení parametrů
declare @ID_CompanyPlugin ID = @@IDENTITY
insert into IA_CompanyPluginParameter(ID_CompanyPlugin, [Key], [Value])
    values 
        (@ID_CompanyPlugin, 'DoctorPluginName', @ID_PluginName),
        (@ID_CompanyPlugin, 'DoctorDayCloseTimeValue', '09:59'), --UTC!! '22:00' | '09:59'
        (@ID_CompanyPlugin, 'DoctorDayCloseDayCount', '1'), --'4' | '1'
        (@ID_CompanyPlugin, 'TimeStart', '13:00'),  --'13:00' | '13:00'
        (@ID_CompanyPlugin, 'TimeEnd', '16:00'),  --'15:00' | '16:00'
        (@ID_CompanyPlugin, 'NextDayID', '2')  --'0' | '2'

-------------------Naplánovat první spuštění--------------- PROVÉST RUČNĚ!!!!!!!!!!!!!!!
-- declare @ID_CompanyPlugin ID = 9
-- select * from SF_ServiceRequest where ID_ServiceRequestType='ia_companyPluginExecute'
-- exec IA_CompanyPlugin_DETAIL_Schedule 
--     @ID_Login='f702283d-eae5-4548-8c28-0a7a135a7725', --NAHRADIT!!!!!!!!!!!!!!!
--     @ID=@ID_CompanyPlugin --NAHRADIT!!!!!!!!!!!!!!!
-- select * from SF_ServiceRequest where ID_ServiceRequestType='ia_companyPluginExecute'
-- update SF_ServiceRequest set RequestTime='2021-02-8 11:02' where SF_ServiceRequest.ID_ServiceRequestType='ia_companyPluginExecute' and DateDone is null and ErrorMessage is null and ID_Object=@ID_CompanyPlugin --NAHRADIT!!!!!!!!!!!!!!!
-- select * from SF_ServiceRequest where ID_ServiceRequestType='ia_companyPluginExecute'

-------------------Založení Exportu------------------------
insert into IA_Export (DisplayName, ID_Company, [Procedure], Note, ID_Schedule, ScheduleCount, ScheduleTime, ID_EmailType, ID_EmailTemplate, Email)
    values('Objednávání k lékaři pro firmu KS EUROPE', @ID_Company, 'IA_CompanyForm_EXPORT_KSEurope', 'taskid#54327', 'day', 1, '14:50', 'ia_export', null, @Email)
---Nastavení parametrů
declare @ID_Export ID = @@IDENTITY
insert into IA_ExportParameter(ID_Export, [Key], [Value], [Note])
    values
    (@ID_Export, 'DoctorExportName', @ID_PluginName, null),
    (@ID_Export, 'DoctorExportDayID', cast(2 as varchar), 'Určuje pro který den v týdnu má export probíhat - viz procedura'),
    (@ID_Export, 'DoctorExportDisplayName', 'Křimice', 'Jméno provozu které se objeví v exportu')

-------------------Naplánovat první spuštění--------------- PROVÉST RUČNĚ!!!!!!!!!!!!!!!
-- select * from IA_Export
-- select * from SF_ServiceRequest where ID_ServiceRequestType='ia_exportExecute'
-- exec IA_Export_DETAIL_Schedule 
--     @ID_Login='f702283d-eae5-4548-8c28-0a7a135a7725', --NAHRADIT!!!!!!!!!!!!!!!
--     @ID=4 --NAHRADIT!!!!!!!!!!!!!!!
-- select * from SF_ServiceRequest where ID_ServiceRequestType='ia_exportExecute'
-- update SF_ServiceRequest set RequestTime='2021-02-08 11:08' where SF_ServiceRequest.ID_ServiceRequestType='ia_exportExecute' and DateDone is null and ErrorMessage is null and ID_Object=1 --NAHRADIT!!!!!!
-- select * from SF_ServiceRequest where ID_ServiceRequestType='ia_exportExecute'
-- select * from SF_Document where SF_Document.ID_DocumentClass='sf_emaildocument'
-- select * from SF_Email where SF_Email.ID_EmailType='ia_export'

------------------Korekce parametrů--------------------- PROVÉST RUČNĚ!!!!!!!!!!!!!!!
-- declare @ID_PluginName DN = 'Stahlavy'
-- declare @ID_CompanyPlugin ID = 12

-- select * from IA_CompanyPluginParameter where ID_CompanyPlugin=@ID_CompanyPlugin
-- delete IA_CompanyPluginParameter where ID_CompanyPlugin=@ID_CompanyPlugin
-- insert into IA_CompanyPluginParameter(ID_CompanyPlugin, [Key], [Value])
--     values 
--         (@ID_CompanyPlugin, 'DoctorPluginName', @ID_PluginName),
--         (@ID_CompanyPlugin, 'DoctorDayCloseTimeValue', '22:00'), --UTC!! '22:00' | '09:59'
--         (@ID_CompanyPlugin, 'DoctorDayCloseDayCount', '4'), --'4' | '1'
--         (@ID_CompanyPlugin, 'TimeStart', '13:00'),  --'13:00' | '13:00'
--         (@ID_CompanyPlugin, 'TimeEnd', '15:00'),  --'15:00' | '16:00'
--         (@ID_CompanyPlugin, 'NextDayID', '0')  --'0' | '2'

-- select * from IA_CompanyPluginParameter where ID_CompanyPlugin=@ID_CompanyPlugin



