@echo off
echo 파일 구조 수정 중...

REM 이미지 파일들을 올바른 위치로 이동
move "static_src\img\images\*" "static_src\img\"
rmdir "static_src\img\images"

REM 비디오 파일들을 올바른 위치로 이동  
move "static_src\videos_src\videos\*" "static_src\videos_src\"
rmdir "static_src\videos_src\videos"

echo 구조 수정 완료!
pause










