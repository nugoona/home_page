# Makefile for static asset optimization
# Windows용 - PowerShell 명령어 사용

.PHONY: build images videos clean help

# 디렉토리 설정
SRC_IMG = static_src/img
SRC_VID = static_src/videos_src
OUT_IMG = static/img
OUT_VID = static/videos

# 기본 타겟
all: build

# 전체 빌드
build: images videos
	@echo "✅ Build completed!"

# 이미지 최적화 (PNG/JPG → WebP)
images:
	@echo "🖼️  Converting images to WebP..."
	@if not exist "$(OUT_IMG)" mkdir "$(OUT_IMG)"
	@for /r "$(SRC_IMG)" %%f in (*.png *.jpg *.jpeg) do ( \
		set "src=%%f" && \
		set "dst=$(OUT_IMG)\%%~nf.webp" && \
		if not exist "!dst!" ( \
			cwebp -q 82 -m 6 -mt -af "!src!" -o "!dst!" && \
			echo "  → !dst!" \
		) else if "!src!" neq "!dst!" ( \
			cwebp -q 82 -m 6 -mt -af "!src!" -o "!dst!" && \
			echo "  → !dst! (updated)" \
		) \
	)

# GIF를 비디오로 변환
gif-to-video:
	@echo "🎬 Converting GIFs to video..."
	@for /r "$(SRC_IMG)" %%f in (*.gif) do ( \
		set "src=%%f" && \
		set "mp4=$(OUT_VID)\%%~nf.mp4" && \
		set "webm=$(OUT_VID)\%%~nf.webm" && \
		if not exist "!mp4!" ( \
			ffmpeg -i "!src!" -vf "scale=720:720:force_original_aspect_ratio=decrease" \
				-c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p -movflags +faststart \
				-r 30 "!mp4!" && \
			echo "  → !mp4!" \
		) && \
		if not exist "!webm!" ( \
			ffmpeg -i "!src!" -vf "scale=720:720:force_original_aspect_ratio=decrease" \
				-c:v libvpx-vp9 -b:v 0 -crf 32 -row-mt 1 -tile-columns 2 \
				-r 30 "!webm!" && \
			echo "  → !webm!" \
		) \
	)

# 비디오 최적화 (MP4/MOV → MP4 + WebM)
videos: gif-to-video
	@echo "🎥 Converting videos to MP4 + WebM..."
	@if not exist "$(OUT_VID)" mkdir "$(OUT_VID)"
	@for /r "$(SRC_VID)" %%f in (*.mp4 *.mov *.m4v *.webm) do ( \
		set "src=%%f" && \
		set "mp4=$(OUT_VID)\%%~nf.mp4" && \
		set "webm=$(OUT_VID)\%%~nf.webm" && \
		if not exist "!mp4!" ( \
			ffmpeg -i "!src!" -vf "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease" \
				-c:v libx264 -preset slow -crf 23 -g 240 -pix_fmt yuv420p -movflags +faststart \
				-c:a aac -b:a 128k "!mp4!" && \
			echo "  → !mp4!" \
		) && \
		if not exist "!webm!" ( \
			ffmpeg -i "!src!" -vf "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease" \
				-c:v libvpx-vp9 -b:v 0 -crf 32 -row-mt 1 -tile-columns 2 -g 240 \
				-c:a libopus -b:a 96k "!webm!" && \
			echo "  → !webm!" \
		) \
	)

# CSS/JS 복사
assets:
	@echo "📄 Copying CSS/JS assets..."
	@if not exist "static\css" mkdir "static\css"
	@if not exist "static\js" mkdir "static\js"
	@copy /Y "css\*" "static\css\"
	@copy /Y "js\*" "static\js\"

# 정리
clean:
	@echo "🧹 Cleaning static directory..."
	@if exist "static" rmdir /s /q "static"
	@mkdir "static"
	@echo "✅ Clean completed!"

# 도움말
help:
	@echo "Available commands:"
	@echo "  make build    - Build all optimized assets"
	@echo "  make images   - Convert images to WebP"
	@echo "  make videos   - Convert videos to MP4+WebM"
	@echo "  make assets   - Copy CSS/JS files"
	@echo "  make clean    - Clean static directory"
	@echo "  make help     - Show this help"

# 테스트
test:
	@echo "🧪 Testing generated files..."
	@echo "Images in static/img:"
	@if exist "static\img" dir "static\img" /b
	@echo "Videos in static/videos:"
	@if exist "static\videos" dir "static\videos" /b
	@echo "Testing video info (first MP4):"
	@for %%f in (static\videos\*.mp4) do ( \
		ffprobe -v quiet -print_format json -show_format -show_streams "%%f" && \
		goto :done \
	)
	:done