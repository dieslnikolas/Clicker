-- declare @name DN = 'ID_Employee'

select distinct * from
(select 'name'=sys.tables.name, 'type'='Table', 'date'=sys.tables.modify_date
from sys.tables inner join sys.columns on tables.object_id=sys.columns.object_id 
where sys.tables.name like '%' + @name + '%' or sys.columns.name like '%' + @name + '%'
union

select 'name'=name, 'type'='Procedure', 'date'=sys.procedures.modify_date
from sys.procedures where name like '%' + @name + '%'
union 

select 'name'=name, 'type'='View', 'date'=sys.views.modify_date
from sys.views where name like '%' + @name + '%'
union 

select 'name'=name, 'type'='UserType', 'date'=null
from sys.types where is_user_defined = 1 and name like '%' + @name + '%'
union

select 'name'=sys.objects.name, 'type'='Function', 'date'=sys.objects.modify_date
from
  sys.objects
where
  sys.objects.type in ('FN','IF','TF')
  and sys.objects.name not like 'FN%'
  and sys.objects.name like '%' + @name + '%'
union

select 'name'=sys.objects.name, 'type'='Trigger', 'date'=sys.objects.modify_date
from
  sys.objects
where
  sys.objects.type='TR'
  and sys.objects.name not like 'FN%'
  and sys.objects.name like '%' + @name + '%'

union
select 'name'=sys.objects.name, 
	'type'=case when sys.objects.type='P' then 'Procedure' when sys.objects.type='V' then 'View' else 'Function' end,
	'date'=sys.objects.modify_date
from  sys.objects 
  inner join sys.sql_modules on sys.sql_modules.object_id = sys.objects.object_id
where sys.sql_modules.definition like '%' + @name + '%' and sys.objects.type in ('P', 'IF', 'FN', 'TF', 'V')

union
select
	'name'=Objects.name,
    'type'='Trigger',
	'date'=Objects.modify_date
from sys.objects Objects 
	INNER JOIN syscomments ON Objects.object_id = syscomments.id
where Objects.type='TR'
	and syscomments.text like '%' + @name + '%'
	) dbObject
order by name 