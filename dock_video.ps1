$html = Get-Content "src\main\resources\templates\ide.html" -Raw

# 1. Remove the floating button
$html = $html -replace '(?s)<div id="video-float-btn".*?</div>', ''

# Update cache buster for CSS
$html = $html -replace 'href="static/css/ide.css\?v=\d+"', 'href="static/css/ide.css?v=4"'

[System.IO.File]::WriteAllText("src\main\resources\templates\ide.html", $html, [System.Text.Encoding]::UTF8)

# 2. Update JS
$js = Get-Content "src\main\resources\static\js\ide.js" -Raw
$js = $js -replace '(?s)\s*const floatBtn = document\.getElementById\(''video-float-btn''\);\s*if \(floatBtn\) \{\s*floatBtn\.addEventListener\(''click'', \(\) => \{\s*const vw = document\.getElementById\(''video-toolwindow''\);\s*if \(vw\.style\.display === ''none'' \|\| vw\.style\.display === ''''\) \{\s*vw\.style\.display = ''flex'';\s*\} else \{\s*vw\.style\.display = ''none'';\s*\}\s*\}\);\s*\}', ''
[System.IO.File]::WriteAllText("src\main\resources\static\js\ide.js", $js, [System.Text.Encoding]::UTF8)

# 3. Update CSS to dock the video player
$css = Get-Content "src\main\resources\static\css\ide.css" -Raw

$dockCss = @"

/* Override floating styles back to docked sidebar layout */
#video-toolwindow {
    position: relative !important;
    bottom: auto !important;
    right: auto !important;
    width: 320px !important;
    max-height: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    z-index: 10 !important;
    border: none !important;
    border-left: 1px solid rgba(255,255,255,0.1) !important;
    animation: none !important;
    flex-shrink: 0 !important;
}

#video-panel {
    overflow-y: auto !important;
}

"@

$css = $css + "`n" + $dockCss
[System.IO.File]::WriteAllText("src\main\resources\static\css\ide.css", $css, [System.Text.Encoding]::UTF8)
