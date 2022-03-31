--declare @name DN = 'IA_Company'
declare @Columns nvarchar(max) = '' 
declare @Values nvarchar(max) = ''
declare @Select nvarchar(max) = ''
declare @Descriptions nvarchar(max) = ''
DECLARE @NewLineChar AS CHAR(2) = CHAR(13) + CHAR(10)


-- SELECT 
--     sys.objects.name AS TableName, 
--     sys.columns.name AS ColumnName,
--     ep.name AS PropertyName, 
--     ep.value AS Description
-- FROM sys.objects
-- INNER JOIN sys.columns ON sys.objects.object_id = sys.columns.object_id
-- CROSS APPLY fn_listextendedproperty(default,
--                   'SCHEMA', schema_name(schema_id),
--                   'TABLE', sys.objects.name, 'COLUMN', sys.columns.name) ep
-- where sys.objects.name=@name 
-- ORDER BY sys.objects.name, sys.columns.column_id

SELECT 
    @Columns = @Columns
    + QUOTENAME(sys.columns.name) + ', '
    --',  ' + Convert(nvarchar(max), ep.Value) 
    + @NewLineChar,

    @Select = @Select
    --+ '--'
    + QUOTENAME(sys.columns.name) + ','
    + '-- ' + Convert(nvarchar(max), isnull(ep.Value, 'NULL')) 
    + @NewLineChar,

    @Values = @Values
    + '-- '
    + '@' +sys.columns.name + ','
    + '-- ' + Convert(nvarchar(max), isnull(ep.Value, 'NULL')) 
    + @NewLineChar,

    @Descriptions = @Descriptions
    + '-- '
    + Convert(nvarchar(max), isnull(ep.Value, 'NULL')) 
    + ','
    + @NewLineChar
    -- sys.objects.name AS TableName, 
    -- sys.columns.name AS ColumnName,
    -- ep.name AS PropertyName, 
    -- ep.value AS Description
FROM sys.objects
INNER JOIN sys.columns ON sys.objects.object_id = sys.columns.object_id
OUTER APPLY fn_listextendedproperty(default,
                  'SCHEMA', schema_name(schema_id),
                  'TABLE', sys.objects.name, 'COLUMN', sys.columns.name) ep
where sys.objects.name=@name
ORDER BY sys.objects.name, sys.columns.column_id

-- select @Columns = @Columns + QUOTENAME(sys.columns.name) + ', ' + @NewLineChar
-- from 
--     sys.columns 
--     inner join sys.tables on sys.tables.object_id=sys.columns.object_id
-- where 
--     sys.tables.name=@name 

--select @Columns

select @Columns = LEFT(@Columns, LEN(@Columns) - 1)
select @Select = LEFT(@Select, LEN(@Select) - 1)
select @Descriptions = LEFT(@Descriptions, LEN(@Descriptions) - 1)

select top 1 'insert into ' + @name + ' (' + @NewLineChar + @Columns + ')' + @NewLineChar
+ 'values ('
+ @NewLineChar
+ @Values
+')' + 
+ @NewLineChar + @NewLineChar
+ 'select *'+ @NewLineChar 
+ @Select
+'from ' + @name 
as definition
 
