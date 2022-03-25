$clpbrd = Get-Clipboard

$lines = $clpbrd.Split([System.Environment]::NewLine)

$clausula = 'in ('

foreach ($line in $lines) {
    $words = $line.Split("`t")
    foreach ($word in $words) {
        $clausula += ("'{0}'," -f $word)
    }
}

$clausula = $clausula.Substring( 0, $clausula.Length -1)
$clausula += ')'

Set-Clipboard $clausula