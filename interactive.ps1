$html = Get-Content "src\main\resources\templates\ide.html" -Raw

$floatBtn = @"
    <div id="video-float-btn" title="Toggle Video Player" style="position: fixed; bottom: 20px; right: 20px; width: 56px; height: 56px; border-radius: 50%; background: var(--accent); color: white; display: flex; align-items: center; justify-content: center; font-size: 22px; cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,0.5); z-index: 5000; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
        <i class="fas fa-play"></i>
    </div>
</body>
"@

$html = $html.Replace("</body>", $floatBtn)

[System.IO.File]::WriteAllText("src\main\resources\templates\ide.html", $html, [System.Text.Encoding]::UTF8)

$css = Get-Content "src\main\resources\static\css\ide.css" -Raw

$customCSS = @"

/* Very Interactive UI Additions */
#video-float-btn:hover {
    transform: scale(1.1) translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.6);
}
#video-float-btn:active {
    transform: scale(0.95);
}

#video-toolwindow {
    position: fixed !important;
    bottom: 90px !important;
    right: 20px !important;
    width: 340px !important;
    max-height: calc(100vh - 120px) !important;
    border-radius: 16px !important;
    box-shadow: 0 15px 40px rgba(0,0,0,0.7) !important;
    z-index: 5000 !important;
    background: rgba(20, 20, 30, 0.7) !important;
    backdrop-filter: blur(30px) !important;
    -webkit-backdrop-filter: blur(30px) !important;
    border: 1px solid rgba(255,255,255,0.15) !important;
    border-left: 1px solid rgba(255,255,255,0.15) !important;
    animation: slideUpFade 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

@keyframes slideUpFade {
    from { opacity: 0; transform: translateY(20px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}

.toolwindow-header {
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    background: rgba(255,255,255,0.05) !important;
    border-bottom: 1px solid rgba(255,255,255,0.05) !important;
}

.video-progress input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.3) !important;
    box-shadow: 0 0 10px var(--accent) !important;
}

.video-playlist {
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
}

.playlist-item {
    padding: 8px 12px !important;
    margin: 2px 8px !important;
    border-radius: 6px !important;
    transition: all 0.2s !important;
}
.playlist-item:hover {
    background: rgba(255,255,255,0.1) !important;
    transform: translateX(4px);
}

.resizer-v {
    height: 8px !important;
    background: rgba(255,255,255,0.05) !important;
    border-top: 1px solid rgba(255,255,255,0.1) !important;
    border-bottom: 1px solid rgba(0,0,0,0.5) !important;
    cursor: row-resize !important;
    transition: background 0.2s, height 0.2s !important;
    z-index: 10 !important;
    flex-shrink: 0 !important;
}
.resizer-v:hover, .resizer-v.dragging {
    background: var(--accent) !important;
    box-shadow: 0 0 10px var(--accent);
}
"@

$css = $css + "`n" + $customCSS

[System.IO.File]::WriteAllText("src\main\resources\static\css\ide.css", $css, [System.Text.Encoding]::UTF8)

$js = Get-Content "src\main\resources\static\js\ide.js" -Raw

$eventListener = @"
        const floatBtn = document.getElementById('video-float-btn');
        if (floatBtn) {
            floatBtn.addEventListener('click', () => {
                const vw = document.getElementById('video-toolwindow');
                if (vw.style.display === 'none' || vw.style.display === '') {
                    vw.style.display = 'flex';
                } else {
                    vw.style.display = 'none';
                }
            });
        }
"@

$js = $js.Replace("document.getElementById('video-blur').addEventListener('input', (e) => {", "$eventListener`n`n        document.getElementById('video-blur').addEventListener('input', (e) => {")

[System.IO.File]::WriteAllText("src\main\resources\static\js\ide.js", $js, [System.Text.Encoding]::UTF8)
