-- (SF_Action.ID_TableRelation=SF_Table.ID or SF_Action.ID_Table=SF_Table.ID)
--declare @table DN = 'IA_Post', @action DN = 'IA_Post_All_Company'
select top 1 * from
(
select 
	SF_Table.ID, 
	SF_Table.DisplayName as TableName, 
	SF_Action.DisplayName as ActionName, 
	SF_Table.ID_Module as Module, 
	SF_Action.[ID_Table] as ActionTable,
	SF_Action.ID_TableRelated, 
	1 as [Priority]
from SF_Table
	left join SF_Action on (SF_Action.ID_TableRelated=SF_Table.ID or SF_Action.ID_Table=SF_Table.ID) 
		and @action is not null
where SF_Table.ID = @table and
	 SF_Action.ID=@action
union 
select 
	SF_Table.ID, 
	SF_Table.DisplayName as TableName, 
	SF_Action.DisplayName as ActionName, 
	SF_Table.ID_Module as Module, 
	SF_Action.[ID_Table] as ActionTable,
	SF_Action.ID_TableRelated as ID_TableRelation, 
	2 as [Priority]
from SF_Table
	left join SF_Action on SF_Action.ID_Table=SF_Table.ID 
		and @action is not null
	left join SF_Table as SF_TableRelation on SF_TableRelation.ID=SF_Action.ID_TableRelated
where -- SF_Table.ID = @table and
	 SF_Action.ID=@action

union
select 
	SF_Table.ID, 
	SF_Table.DisplayName as TableName, 
	null as ActionName, 
	SF_Table.ID_Module as Module, 
	null as ActionTable,
	SF_Table.ID_TableParent as ID_TableRelation, 
	3 as [Priority]
from SF_Table
where SF_Table.ID = @table
) x
order by [Priority]