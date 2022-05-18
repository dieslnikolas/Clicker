--declare @ID_Action IDVC = 'IA_CompanyForm_NEW'
--declare @DisplayName DN = 'Založení záznamu v tabulce IA_CompanyForm'
--declare @ID_Table IDVC = 'IA_CompanyForm'
--declare @ActionType IDVC = 'new'
--declare @RequiresRecord bit = 1

declare @Message Note

if exists (select 1 from SF_Action where SF_Action.[ID] = @ID_Action)
begin
	update SF_Action
	set 
		SF_Action.[DisplayName] = @DisplayName,
		SF_Action.[ID_Table] = @ID_Table,
		SF_Action.[ID_ActionType] = @ActionType,
		SF_Action.[RequiresRecord] = @RequiresRecord
	where SF_Action.[ID] = @ID_Action
	select @Message = 'Action updated'

end else begin
	insert into SF_Action ([ID], [DisplayName], [ID_Table], [ID_TableRelated], [ID_ActionType], [RequiresRecord], [IsAnonymous])
	values(@ID_Action, @DisplayName, @ID_Table, NULL, @ActionType, @RequiresRecord, 0)
	select @Message = 'Action created'
end

select @Message