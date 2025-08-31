@echo off
setlocal enabledelayedexpansion

echo 🚀 Starting build process...

REM 디렉토리 설정
set SRC_IMG=static_src\img
set SRC_VID=static_src\videos_src
set OUT_IMG=static\img
set OUT_VID=static\videos

REM 출력 디렉토리 생성
if not exist "%OUT_IMG%" mkdir "%OUT_IMG%"
if not exist "%OUT_VID%" mkdir "%OUT_VID%"

echo.
echo 🖼️  Converting images to WebP...

REM 이미지 변환 (PNG, JPG → WebP)
for /r "%SRC_IMG%" %%f in (*.png *.jpg *.jpeg) do (
    set "src=%%f"
    set "filename=%%~nf"
    set "dst=%OUT_IMG%\!filename!.webp"
    
    if not exist "!dst!" (
        echo   Converting: %%~nxf → !filename!.webp
        cwebp -q 82 -m 6 -mt -af "!src!" -o "!dst!"
        if errorlevel 1 (
            echo   ❌ Failed to convert %%~nxf
        ) else (
            echo   ✅ → !dst!
        )
    ) else (
        echo   ⏭️  Skipped: !filename!.webp (already exists)
    )
)

echo.
echo 🎬 Converting GIFs to video...

REM GIF → MP4/WebM 변환
for /r "%SRC_IMG%" %%f in (*.gif) do (
    set "src=%%f"
    set "filename=%%~nf"
    set "mp4=%OUT_VID%\!filename!.mp4"
    set "webm=%OUT_VID%\!filename!.webm"
    
    if not exist "!mp4!" (
        echo   Converting GIF: %%~nxf → !filename!.mp4
        ffmpeg -y -i "!src!" -vf "scale=720:720:force_original_aspect_ratio=decrease" -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p -movflags +faststart -r 30 "!mp4!"
        if errorlevel 1 (
            echo   ❌ Failed to convert %%~nxf to MP4
        ) else (
            echo   ✅ → !mp4!
        )
    )
    
    if not exist "!webm!" (
        echo   Converting GIF: %%~nxf → !filename!.webm
        ffmpeg -y -i "!src!" -vf "scale=720:720:force_original_aspect_ratio=decrease" -c:v libvpx-vp9 -b:v 0 -crf 32 -row-mt 1 -tile-columns 2 -r 30 "!webm!"
        if errorlevel 1 (
            echo   ❌ Failed to convert %%~nxf to WebM
        ) else (
            echo   ✅ → !webm!
        )
    )
)

echo.
echo 🎥 Converting videos to MP4 + WebM...

REM 비디오 변환 (MP4, MOV → 최적화된 MP4/WebM)
for /r "%SRC_VID%" %%f in (*.mp4 *.mov *.m4v *.webm) do (
    set "src=%%f"
    set "filename=%%~nf"
    set "mp4=%OUT_VID%\!filename!.mp4"
    set "webm=%OUT_VID%\!filename!.webm"
    
    if not exist "!mp4!" (
        echo   Converting: %%~nxf → !filename!.mp4
        ffmpeg -y -i "!src!" -vf "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease" -c:v libx264 -preset slow -crf 23 -g 240 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 128k "!mp4!"
        if errorlevel 1 (
            echo   ❌ Failed to convert %%~nxf to MP4
        ) else (
            echo   ✅ → !mp4!
        )
    ) else (
        echo   ⏭️  Skipped: !filename!.mp4 (already exists)
    )
    
    if not exist "!webm!" (
        echo   Converting: %%~nxf → !filename!.webm
        ffmpeg -y -i "!src!" -vf "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease" -c:v libvpx-vp9 -b:v 0 -crf 32 -row-mt 1 -tile-columns 2 -g 240 -c:a libopus -b:a 96k "!webm!"
        if errorlevel 1 (
            echo   ❌ Failed to convert %%~nxf to WebM
        ) else (
            echo   ✅ → !webm!
        )
    ) else (
        echo   ⏭️  Skipped: !filename!.webm (already exists)
    )
)

echo.
echo ✅ Build completed!
echo.
echo 📊 Results:
if exist "%OUT_IMG%" (
    echo   Images: 
    dir /b "%OUT_IMG%" | find /c /v "" 
    echo   files in %OUT_IMG%
)
if exist "%OUT_VID%" (
    echo   Videos: 
    dir /b "%OUT_VID%" | find /c /v "" 
    echo   files in %OUT_VID%
)

pause