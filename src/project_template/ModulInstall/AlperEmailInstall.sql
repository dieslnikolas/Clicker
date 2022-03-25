--Procedury: 
--IA_Data_OTHER_Alper_ReportIssue
--IA_Data_NEW_DataItems
--IA_Data_Email

--select * from IA_Company where ID=113
declare @ID_Company ID = 113 --NAHRADIT!!!!!!!!!!!!!!!
declare @ID_CompanyForm ID = 124 --NAHRADIT!!!!!!!!!!!!!!!
--select * from IA_FormItem where ID_CompanyForm=@ID_CompanyForm
declare @ID_FormItem ID = 3154 --NAHRADIT!!!!!!!!!!!!!!!!
declare @ID_CompanyLanguage ID = dbo.IA_CompanyLanguage_Base(@ID_Company)

update IA_CompanyForm set [Name]='AlperReportIssue', IsEmail=1, Email='kristyna.bartonova@alper.cz' where ID=@ID_CompanyForm
update IA_FormItem set [Name]='AlperReportIssueSelect' where ID=@ID_FormItem
update IA_FormItemOption set [Name]='AlperReportIssueOptionSplitting' where ID_FormItem=@ID_FormItem and DisplayName like '%Dělení%'
update IA_FormItemOption set [Name]='AlperReportIssueOptionExpedition' where ID_FormItem=@ID_FormItem and DisplayName like '%Expedice%'
update IA_FormItemOption set [Name]='AlperReportIssueOptionOffice' where ID_FormItem=@ID_FormItem and DisplayName like '%Kanceláře%'
update IA_FormItemOption set [Name]='AlperReportIssueOptionBlacksmith' where ID_FormItem=@ID_FormItem and DisplayName like '%Kovárna%'
update IA_FormItemOption set [Name]='AlperReportIssueOptionQuality' where ID_FormItem=@ID_FormItem and DisplayName like '%Kvalita%'
update IA_FormItemOption set [Name]='AlperReportIssueOptionToolroom' where ID_FormItem=@ID_FormItem and DisplayName like '%Nástrojárna%'
update IA_FormItemOption set [Name]='AlperReportIssueOptionThermicProcessing' where ID_FormItem=@ID_FormItem and DisplayName like '%Tepelné zpracování%'
update IA_FormItemOption set [Name]='AlperReportIssueOptionMaintenance' where ID_FormItem=@ID_FormItem and DisplayName like '%Údržba%'
update IA_FormItemOption set [Name]='AlperReportIssueOptionOutside' where ID_FormItem=@ID_FormItem and DisplayName like '%Venkovní prostory%'

-------------------Nastavení pocedury která se volá po založení odpovědi na formulář------------------
-- insert into IA_CustomProcedure (DisplayName, ID_CustomProcedureType, [Procedure], ParameterNote, Note)
--     values('Data formuláře: Zaslání mailu podle místa incidentu ve firmě', 'form_insert', 'IA_Data_OTHER_Alper_ReportIssue', null, 'tasid#58330')
update IA_CompanyForm set IA_CompanyForm.ProcedureInsert='IA_Data_OTHER_Alper_ReportIssue' where IA_CompanyForm.ID=@ID_CompanyForm