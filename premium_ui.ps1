$css = Get-Content "src\main\resources\static\css\ide.css" -Raw

$betterUICss = @"

/* === Premium Video Player UI === */

.video-info {
    text-align: center !important;
    padding: 20px 20px 10px !important;
}

.video-title {
    font-weight: 600 !important;
    color: #ffffff !important;
    font-size: 14px !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    margin-bottom: 6px !important;
    text-shadow: 0 2px 5px rgba(0,0,0,0.5) !important;
    letter-spacing: 0.3px !important;
}

.video-time {
    font-size: 12px !important;
    color: rgba(255,255,255,0.5) !important;
    font-family: var(--font-mono) !important;
    font-weight: 500 !important;
}

.video-progress {
    padding: 10px 20px !important;
}

.video-controls {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    gap: 20px !important;
    padding: 10px 0 25px !important;
}

.video-controls button {
    background: rgba(255,255,255,0.05) !important;
    border: 1px solid rgba(255,255,255,0.1) !important;
    color: rgba(255,255,255,0.8) !important;
    font-size: 14px !important;
    width: 36px !important;
    height: 36px !important;
    border-radius: 50% !important;
    cursor: pointer !important;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

.video-controls button:hover {
    background: var(--accent) !important;
    color: white !important;
    border-color: var(--accent) !important;
    transform: scale(1.1) !important;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3) !important;
}

.video-controls button:active {
    transform: scale(0.95) !important;
}

.video-controls #video-play {
    width: 48px !important;
    height: 48px !important;
    font-size: 18px !important;
    background: var(--accent) !important;
    color: white !important;
    border-color: var(--accent) !important;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3) !important;
}

.video-controls #video-play:hover {
    box-shadow: 0 0 20px var(--accent) !important;
    transform: scale(1.1) !important;
}

.video-eq {
    padding: 15px 20px !important;
    background: rgba(0,0,0,0.2) !important;
    border-top: 1px solid rgba(255,255,255,0.05) !important;
    border-bottom: 1px solid rgba(255,255,255,0.05) !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 15px !important;
}

.eq-control {
    display: flex !important;
    align-items: center !important;
    gap: 15px !important;
}

.eq-control label {
    width: 45px !important;
    text-align: right !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
    font-size: 10px !important;
    color: rgba(255,255,255,0.5) !important;
    font-weight: 600 !important;
}

.eq-control input[type="range"] {
    flex: 1 !important;
    height: 6px !important;
    border-radius: 3px !important;
    -webkit-appearance: none !important;
    background: rgba(255,255,255,0.1) !important;
    outline: none !important;
    cursor: pointer !important;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.3) !important;
}

.eq-control input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none !important;
    width: 14px !important;
    height: 14px !important;
    border-radius: 50% !important;
    background: rgba(255,255,255,0.8) !important;
    cursor: pointer !important;
    box-shadow: 0 2px 5px rgba(0,0,0,0.5) !important;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.eq-control input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.3) !important;
    background: var(--accent) !important;
    box-shadow: 0 0 12px var(--accent) !important;
}
"@

$css = $css + "`n" + $betterUICss
[System.IO.File]::WriteAllText("src\main\resources\static\css\ide.css", $css, [System.Text.Encoding]::UTF8)
