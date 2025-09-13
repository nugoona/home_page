@echo off
echo CSS 파일 동기화 중...
Copy-Item .\css\*.css .\static\css\ -Force
echo 동기화 완료!
pause


