declare @ID_CompanyForm ID = 279
declare @ID_DateFormItem ID = 3959
declare @ID_ResultFormItem ID = 3960
declare @ID_ValidToFormItem ID = 3964

--select * from IA_FormItemOption where ID_FormItem=3964
declare @ID_NegativeOption ID = 2771
declare @ID_PositiveOption ID = 2772
declare @ID_AntigenTestOption ID = 2775
declare @ID_SickOption ID = 2776

update IA_FormItem set [Name]='TestDate' where ID = @ID_DateFormItem and ID_CompanyForm=@ID_CompanyForm
update IA_FormItem set [Name]='TestResult' where ID = @ID_ResultFormItem and ID_CompanyForm=@ID_CompanyForm
update IA_FormItem set [Name]='TestValidTo' where ID = @ID_ValidToFormItem and ID_CompanyForm=@ID_CompanyForm

update IA_FormItemOption set [Name]='TestResultNegativeOption' where ID = @ID_NegativeOption
update IA_FormItemOption set [Name]='TestResultPositiveOption' where ID = @ID_PositiveOption
update IA_FormItemOption set [Name]='TestValidToAntigenOption' where ID = @ID_AntigenTestOption
update IA_FormItemOption set [Name]='TestValidToSickOption' where ID = @ID_SickOption

update IA_CompanyForm set ProcedureInsert='IA_Data_OTHER_CovidNotification' where ID=@ID_CompanyForm

-- select * from IA_FormItemOption where ID_FormItem = 3960
-- select * from IA_FormItemOption where ID_FormItem = 3964