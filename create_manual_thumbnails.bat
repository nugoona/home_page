@echo off
echo 📸 Creating video thumbnails manually...

REM 주요 비디오들의 썸네일 생성
echo Creating main hero video thumbnail...
ffmpeg -y -i "static_src\videos_src\hero\main._ngn.mp4" -ss 00:00:01.000 -vframes 1 -q:v 2 -vf "scale='min(800,iw)':'min(600,ih)':force_original_aspect_ratio=decrease" "static\thumbs\main._ngn.jpg"

echo Creating h1 video thumbnail...
ffmpeg -y -i "static_src\videos_src\hero\h1.mp4" -ss 00:00:01.000 -vframes 1 -q:v 2 -vf "scale='min(800,iw)':'min(600,ih)':force_original_aspect_ratio=decrease" "static\thumbs\h1.jpg"

echo Creating net video thumbnail...
ffmpeg -y -i "static_src\videos_src\hero\net.mp4" -ss 00:00:01.000 -vframes 1 -q:v 2 -vf "scale='min(800,iw)':'min(600,ih)':force_original_aspect_ratio=decrease" "static\thumbs\net.jpg"

echo Creating con_main video thumbnail...
ffmpeg -y -i "static_src\videos_src\portfolio\con_main.mp4" -ss 00:00:01.000 -vframes 1 -q:v 2 -vf "scale='min(800,iw)':'min(600,ih)':force_original_aspect_ratio=decrease" "static\thumbs\con_main.jpg"

echo Creating K-series thumbnails...
ffmpeg -y -i "static_src\videos_src\hero\K1.mp4" -ss 00:00:01.000 -vframes 1 -q:v 2 -vf "scale='min(800,iw)':'min(600,ih)':force_original_aspect_ratio=decrease" "static\thumbs\K1.jpg"
ffmpeg -y -i "static_src\videos_src\hero\k2.mp4" -ss 00:00:01.000 -vframes 1 -q:v 2 -vf "scale='min(800,iw)':'min(600,ih)':force_original_aspect_ratio=decrease" "static\thumbs\k2.jpg"
ffmpeg -y -i "static_src\videos_src\hero\K3.mp4" -ss 00:00:01.000 -vframes 1 -q:v 2 -vf "scale='min(800,iw)':'min(600,ih)':force_original_aspect_ratio=decrease" "static\thumbs\K3.jpg"
ffmpeg -y -i "static_src\videos_src\hero\K4.mp4" -ss 00:00:01.000 -vframes 1 -q:v 2 -vf "scale='min(800,iw)':'min(600,ih)':force_original_aspect_ratio=decrease" "static\thumbs\K4.jpg"

echo Creating d1 thumbnail...
ffmpeg -y -i "static_src\videos_src\hero\d1.mp4" -ss 00:00:01.000 -vframes 1 -q:v 2 -vf "scale='min(800,iw)':'min(600,ih)':force_original_aspect_ratio=decrease" "static\thumbs\d1.jpg"

echo Creating sns1 thumbnail...
ffmpeg -y -i "static_src\videos_src\hero\sns1.mp4" -ss 00:00:01.000 -vframes 1 -q:v 2 -vf "scale='min(800,iw)':'min(600,ih)':force_original_aspect_ratio=decrease" "static\thumbs\sns1.jpg"

echo 🎉 Manual thumbnail creation completed!
echo 📁 Check static\thumbs\ folder for generated thumbnails

pause






