param(
    [string] $source,
    [string] $target
)

Write-Host ("Source: "+$source)
Write-Host ("Target: "+$target)

Write-Host "Copying..."

robocopy $source $target /E /XO /COPYALL

Write-Host "Copy done"
Read-Host