@echo off
echo 🚀 간단 빌드 시작...

REM 출력 폴더 생성
if not exist "static" mkdir static
if not exist "static\img" mkdir static\img  
if not exist "static\videos" mkdir static\videos

echo 🖼️  이미지 복사 중 (WebP 변환은 cwebp 설치 후)...
xcopy "static_src\img\*.png" "static\img\" /Y /Q >nul 2>&1
xcopy "static_src\img\*.jpg" "static\img\" /Y /Q >nul 2>&1
xcopy "static_src\img\*.jpeg" "static\img\" /Y /Q >nul 2>&1
xcopy "static_src\img\*.ico" "static\img\" /Y /Q >nul 2>&1
xcopy "static_src\img\favicons\*" "static\img\favicons\" /Y /S /Q >nul 2>&1

echo 🎬 비디오 복사 중 (최적화는 ffmpeg 설치 후)...
xcopy "static_src\videos_src\*.mp4" "static\videos\" /Y /S /Q >nul 2>&1
xcopy "static_src\videos_src\*.gif" "static\videos\" /Y /S /Q >nul 2>&1

echo ✅ 기본 복사 완료!
echo.
echo 📝 다음 단계:
echo   1. cwebp 설치 후 PNG/JPG → WebP 변환
echo   2. ffmpeg 설치 후 비디오 최적화
echo   3. HTML에서 asset() 매크로로 경로 수정
pause



