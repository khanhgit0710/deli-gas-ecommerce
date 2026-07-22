$files = Get-ChildItem -Path 'd:\Front-end\gas-delivery-hub' -Include *.html,*.js -Recurse
foreach ($f in $files) {
    $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    $content = $content -replace '"ve-chung-toi.html"', '"index-new.html"'
    $content = $content -replace '"/ve-chung-toi.html"', '"/index-new.html"'
    $content = $content -replace '"index.html"', '"trang-chu.html"'
    $content = $content -replace '"/index.html"', '"/trang-chu.html"'
    $content = $content -replace '"index-new.html"', '"index.html"'
    $content = $content -replace '"/index-new.html"', '"/index.html"'
    
    $utf8NoBom = New-Object System.Text.UTF8Encoding $False
    [System.IO.File]::WriteAllText($f.FullName, $content, $utf8NoBom)
}
Rename-Item -Path d:\Front-end\gas-delivery-hub\index.html -NewName trang-chu.html
Rename-Item -Path d:\Front-end\gas-delivery-hub\ve-chung-toi.html -NewName index.html
