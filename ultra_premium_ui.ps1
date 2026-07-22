$css = Get-Content "src\main\resources\static\css\ide.css" -Raw

$premiumCSS = @"

/* === ULTRA PREMIUM UI OVERHAUL === */

#video-toolwindow {
    background: linear-gradient(135deg, rgba(20,20,30,0.85) 0%, rgba(35,35,50,0.9) 100%) !important;
    backdrop-filter: blur(40px) saturate(150%) !important;
    -webkit-backdrop-filter: blur(40px) saturate(150%) !important;
    border: 1px solid rgba(255,255,255,0.1) !important;
    box-shadow: 0 20px 50px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.05) !important;
    border-radius: 20px !important;
    overflow: hidden !important;
}

.toolwindow-header {
    background: linear-gradient(to right, rgba(99,102,241,0.1), rgba(236,72,153,0.1)) !important;
    border-bottom: 1px solid rgba(255,255,255,0.05) !important;
}

.video-info {
    padding: 25px 20px 15px !important;
    position: relative !important;
}

.video-title {
    font-size: 15px !important;
    font-weight: 700 !important;
    background: linear-gradient(90deg, #fff, #a5b4fc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 2px 10px rgba(99,102,241,0.3) !important;
    margin-bottom: 8px !important;
}

.video-time {
    font-size: 11px !important;
    letter-spacing: 1px !important;
    color: rgba(255,255,255,0.5) !important;
    background: rgba(0,0,0,0.3) !important;
    display: inline-block !important;
    padding: 3px 10px !important;
    border-radius: 10px !important;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.5) !important;
}

.video-controls button {
    background: rgba(255,255,255,0.03) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    width: 44px !important;
    height: 44px !important;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2) !important;
}

.video-controls button:hover {
    background: rgba(255,255,255,0.1) !important;
    border-color: rgba(255,255,255,0.2) !important;
    color: #fff !important;
    transform: translateY(-2px) scale(1.1) !important;
}

.video-controls #video-play {
    width: 56px !important;
    height: 56px !important;
    font-size: 20px !important;
    background: linear-gradient(135deg, #6366f1, #ec4899) !important;
    border: none !important;
    box-shadow: 0 8px 25px rgba(236,72,153,0.4) !important;
    position: relative !important;
}

.video-controls #video-play::before {
    content: '';
    position: absolute;
    top: -2px; left: -2px; right: -2px; bottom: -2px;
    background: linear-gradient(135deg, #6366f1, #ec4899);
    z-index: -1;
    border-radius: 50%;
    filter: blur(10px);
    opacity: 0;
    transition: opacity 0.3s;
}

.video-controls #video-play:hover::before {
    opacity: 1 !important;
}

.video-controls #video-play:hover {
    transform: scale(1.15) translateY(-2px) !important;
    box-shadow: 0 12px 30px rgba(236,72,153,0.6) !important;
}

.video-eq {
    background: rgba(0,0,0,0.25) !important;
    border-top: 1px solid rgba(0,0,0,0.5) !important;
    border-bottom: 1px solid rgba(0,0,0,0.5) !important;
    padding: 20px !important;
    gap: 18px !important;
}

.eq-control label {
    font-weight: 700 !important;
    color: rgba(255,255,255,0.6) !important;
    font-size: 9px !important;
}

.eq-control input[type="range"] {
    height: 8px !important;
    background: rgba(0,0,0,0.5) !important;
    border-radius: 4px !important;
    box-shadow: inset 0 1px 4px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.1) !important;
}

.eq-control input[type="range"]::-webkit-slider-thumb {
    width: 16px !important;
    height: 16px !important;
    background: linear-gradient(180deg, #fff, #d1d5db) !important;
    box-shadow: 0 2px 5px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.1) !important;
}

.eq-control input[type="range"]::-webkit-slider-thumb:hover {
    background: #fff !important;
    box-shadow: 0 0 15px #6366f1, 0 0 0 4px rgba(99,102,241,0.2) !important;
    transform: scale(1.2) !important;
}

.video-progress input[type="range"] {
    height: 6px !important;
    background: rgba(0,0,0,0.4) !important;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.1) !important;
}

.video-progress input[type="range"]::-webkit-slider-thumb {
    background: #ec4899 !important;
    box-shadow: 0 0 10px #ec4899 !important;
    width: 16px !important;
    height: 16px !important;
}

.video-progress input[type="range"]::-webkit-slider-thumb:hover {
    box-shadow: 0 0 20px #ec4899, 0 0 0 6px rgba(236,72,153,0.2) !important;
    transform: scale(1.2) !important;
}

.video-playlist-header {
    background: rgba(255,255,255,0.02) !important;
    color: rgba(255,255,255,0.8) !important;
    padding: 12px 20px !important;
}

.playlist-item {
    padding: 10px 15px !important;
    margin: 4px 10px !important;
    background: rgba(0,0,0,0.2) !important;
    border: 1px solid transparent !important;
}

.playlist-item:hover {
    background: rgba(255,255,255,0.08) !important;
    border-color: rgba(255,255,255,0.1) !important;
    transform: translateX(5px) scale(1.02) !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
}

.playlist-item.playing {
    background: linear-gradient(90deg, rgba(99,102,241,0.2), rgba(236,72,153,0.1)) !important;
    border-color: rgba(99,102,241,0.3) !important;
    box-shadow: inset 4px 0 0 #ec4899 !important;
    color: #fff !important;
}

"@

$css = $css + "`n" + $premiumCSS
[System.IO.File]::WriteAllText("src\main\resources\static\css\ide.css", $css, [System.Text.Encoding]::UTF8)

# Update HTML icons to look better
$html = Get-Content "src\main\resources\templates\ide.html" -Raw
$html = $html -replace '<label>Bass</label>', '<label><i class="fas fa-wave-square"></i> Bass</label>'
$html = $html -replace '<label>Treble</label>', '<label><i class="fas fa-sliders-h"></i> Treb</label>'
$html = $html -replace '<label>Blur</label>', '<label><i class="fas fa-tint"></i> Blur</label>'
[System.IO.File]::WriteAllText("src\main\resources\templates\ide.html", $html, [System.Text.Encoding]::UTF8)

