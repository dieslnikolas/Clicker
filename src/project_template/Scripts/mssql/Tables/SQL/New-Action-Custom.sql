
--declare @ID_Action IDVC = 'IA_CompanyForm_ALL'
--declare @DisplayName DN = 'Jmeno'
--declare @ID_Table IDVC = 'IA_CompanyForm'
--declare @ID_ActionType IDVC = 'all'
--declare @RequiresRecord bit = 0
--declare @IsAnonymous bit = 0
--declare @ID_TableRelated IDVC = 'NULL'

declare @NewLineChar AS CHAR(2) = CHAR(13) + CHAR(10)
declare @Select Note = 'select * from SF_Action where SF_Action.[ID] = ' + ''''+@ID_Action+'''' + @NewLineChar

if EXISTS(select 1 from SF_Action where SF_Action.[ID] = @ID_Action)
begin
	-- Update existing action
	select top 1 '-- Original values are in comments' + @NewLineChar + @NewLineChar +
'update SF_Action
set ' + @NewLineChar +
'	SF_Action.[DisplayName] = ' + '''' + @DisplayName + ''',	-- '+SF_Action.[DisplayName] + @NewLineChar +
'	SF_Action.[ID_TableRelated] = ' + @ID_TableRelated + ',	-- '+ ISNULL(SF_Action.[ID_TableRelated], 'NULL') + @NewLineChar +
'	SF_Action.[ID_ActionType] = ' + '''' + @ID_ActionType + ''',	-- '+SF_Action.[ID_ActionType] + @NewLineChar +
'	SF_Action.[RequiresRecord] = ' + '''' + CAST(@RequiresRecord as nvarchar(1)) + ''',	-- '+CAST(SF_Action.[RequiresRecord] as nvarchar(1)) + @NewLineChar +
'	SF_Action.[IsAnonymous] = ' + '''' + CAST(@IsAnonymous as nvarchar(1)) + '''	-- '+CAST(SF_Action.[IsAnonymous] as nvarchar(1)) + @NewLineChar +
'where SF_Action.[ID] = ' + '''' + @ID_Action + '''' + @NewLineChar +
@NewLineChar + @Select as definition
	from SF_Action
	where SF_Action.[ID] = @ID_Action
end else begin
	-- Insert new action
	select top 1 
'insert into SF_Action ([ID], [DisplayName], [ID_Table], [ID_TableRelated], [ID_ActionType], [RequiresRecord], [IsAnonymous])' + @NewLineChar +
'values
('+ @NewLineChar +
'	'''+@ID_Action+''','+'	-- ID_Action'+ @NewLineChar +
'	'''+@DisplayName+''','+'	-- DisplayName'+ @NewLineChar +
'	'''+@ID_Table+''','+'	-- ID_Table'+ @NewLineChar +
'	'+@ID_TableRelated+','+'	-- ID_TableRelated'+ @NewLineChar +
'	'''+@ID_ActionType+''','+'	-- ID_ActionType'+ @NewLineChar +
'	'''+CAST(@RequiresRecord as nvarchar(1))+''','+'	-- RequiresRecord'+ @NewLineChar +
'	'''+CAST(@IsAnonymous as nvarchar(1))+''''+'	-- IsAnonymous'+ @NewLineChar +')'+ 
@NewLineChar + @Select
	as definition
end


