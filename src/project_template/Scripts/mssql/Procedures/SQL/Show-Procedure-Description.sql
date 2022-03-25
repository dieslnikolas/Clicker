--declare @ProcedureName IDVC = 'IA_Data_NEW_DataItems_WS'

declare @Content Note = (
	SELECT definition 
	FROM sys.sql_modules 
	WHERE object_id = object_id(@ProcedureName)
	)
declare @CreateIndex int = CHARINDEX('CREATE', @Content)
select @Content = Substring(@Content, 0, @CreateIndex)

declare @OpenComment int = CHARINDEX('/*', @Content) + 2
declare @LengthComment int = CHARINDEX('*/', @Content) - @OpenComment

select Substring(@Content, @OpenComment, @LengthComment) as description
