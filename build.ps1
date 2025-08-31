#!/usr/bin/env pwsh
# 로컬 개발 환경 자동화 빌드 스크립트

param(
    [string]$Command = "build"
)

$SRC_IMG = "static_src/img"
$SRC_VID = "static_src/videos_src"
$OUT_IMG = "static/img"
$OUT_VID = "static/videos"

function Build-Images {
    Write-Host "🖼️  이미지 최적화 중..." -ForegroundColor Cyan
    
    if (!(Test-Path $OUT_IMG)) { 
        New-Item -ItemType Directory -Force -Path $OUT_IMG | Out-Null 
    }
    
    Get-ChildItem -Path $SRC_IMG -Recurse -Include '*.png','*.jpg','*.jpeg' | ForEach-Object {
        $relPath = $_.FullName.Replace("$PWD\$SRC_IMG", "").TrimStart('\')
        $outPath = "$OUT_IMG\" + $relPath.Substring(0, $relPath.LastIndexOf('.')) + '.webp'
        $outDir = Split-Path -Parent $outPath
        
        if (!(Test-Path $outDir)) { 
            New-Item -ItemType Directory -Force -Path $outDir | Out-Null 
        }
        
        if (!(Test-Path $outPath) -or ($_.LastWriteTime -gt (Get-Item $outPath -ErrorAction SilentlyContinue).LastWriteTime)) {
            Write-Host "압축 중: $relPath" -ForegroundColor Yellow
            
            # cwebp 명령어 실행
            $result = Start-Process -FilePath "cwebp" -ArgumentList "-q 82 -m 6 -mt -af `"$($_.FullName)`" -o `"$outPath`"" -Wait -PassThru -WindowStyle Hidden
            
            if ($result.ExitCode -eq 0) {
                Write-Host "→ $outPath" -ForegroundColor Green
            } else {
                Write-Host "❌ 실패: $relPath (cwebp 설치 확인 필요)" -ForegroundColor Red
            }
        } else {
            Write-Host "⏭️  건너뜀: $relPath (최신)" -ForegroundColor Gray
        }
    }
}

function Build-Videos {
    Write-Host "🎬 비디오 최적화 중..." -ForegroundColor Cyan
    
    if (!(Test-Path $OUT_VID)) { 
        New-Item -ItemType Directory -Force -Path $OUT_VID | Out-Null 
    }
    
    Get-ChildItem -Path $SRC_VID -Recurse -Include '*.mp4','*.mov','*.m4v','*.avi','*.webm','*.mkv' | ForEach-Object {
        $base = [System.IO.Path]::GetFileNameWithoutExtension($_.Name)
        $relDir = Split-Path -Parent ($_.FullName.Replace("$PWD\$SRC_VID", "").TrimStart('\'))
        $outDir = if ($relDir) { "$OUT_VID\$relDir" } else { $OUT_VID }
        
        if (!(Test-Path $outDir)) { 
            New-Item -ItemType Directory -Force -Path $outDir | Out-Null 
        }
        
        $mp4Out = "$outDir\$base.mp4"
        $webmOut = "$outDir\$base.webm"
        
        # MP4 최적화
        if (!(Test-Path $mp4Out) -or ($_.LastWriteTime -gt (Get-Item $mp4Out -ErrorAction SilentlyContinue).LastWriteTime)) {
            Write-Host "MP4 최적화: $base" -ForegroundColor Yellow
            
            $ffmpegArgs = @(
                "-y", "-i", "`"$($_.FullName)`"",
                "-vf", "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease",
                "-c:v", "libx264", "-preset", "slow", "-crf", "23",
                "-g", "240", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
                "-c:a", "aac", "-b:a", "128k",
                "`"$mp4Out`""
            )
            
            $result = Start-Process -FilePath "ffmpeg" -ArgumentList $ffmpegArgs -Wait -PassThru -WindowStyle Hidden
            
            if ($result.ExitCode -eq 0) {
                Write-Host "→ $mp4Out" -ForegroundColor Green
            } else {
                Write-Host "❌ 실패: $base.mp4 (ffmpeg 설치 확인 필요)" -ForegroundColor Red
            }
        }
        
        # WebM 최적화
        if (!(Test-Path $webmOut) -or ($_.LastWriteTime -gt (Get-Item $webmOut -ErrorAction SilentlyContinue).LastWriteTime)) {
            Write-Host "WebM 최적화: $base" -ForegroundColor Yellow
            
            $ffmpegArgs = @(
                "-y", "-i", "`"$($_.FullName)`"",
                "-vf", "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease",
                "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "32",
                "-row-mt", "1", "-tile-columns", "2", "-g", "240",
                "-c:a", "libopus", "-b:a", "96k",
                "`"$webmOut`""
            )
            
            $result = Start-Process -FilePath "ffmpeg" -ArgumentList $ffmpegArgs -Wait -PassThru -WindowStyle Hidden
            
            if ($result.ExitCode -eq 0) {
                Write-Host "→ $webmOut" -ForegroundColor Green
            } else {
                Write-Host "❌ 실패: $base.webm (ffmpeg 설치 확인 필요)" -ForegroundColor Red
            }
        }
    }
}

function Build-Gifs {
    Write-Host "🎞️  GIF → WebM/MP4 변환 중..." -ForegroundColor Cyan
    
    if (!(Test-Path $OUT_VID)) { 
        New-Item -ItemType Directory -Force -Path $OUT_VID | Out-Null 
    }
    
    Get-ChildItem -Path $SRC_IMG -Recurse -Include '*.gif' | ForEach-Object {
        $base = [System.IO.Path]::GetFileNameWithoutExtension($_.Name)
        $relDir = Split-Path -Parent ($_.FullName.Replace("$PWD\$SRC_IMG", "").TrimStart('\'))
        $outDir = if ($relDir) { "$OUT_VID\$relDir" } else { $OUT_VID }
        
        if (!(Test-Path $outDir)) { 
            New-Item -ItemType Directory -Force -Path $outDir | Out-Null 
        }
        
        $webmOut = "$outDir\$base.webm"
        $mp4Out = "$outDir\$base.mp4"
        
        # GIF → WebM
        if (!(Test-Path $webmOut) -or ($_.LastWriteTime -gt (Get-Item $webmOut -ErrorAction SilentlyContinue).LastWriteTime)) {
            Write-Host "GIF → WebM: $base" -ForegroundColor Yellow
            
            $ffmpegArgs = @(
                "-y", "-i", "`"$($_.FullName)`"",
                "-vf", "scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease",
                "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "32",
                "-row-mt", "1", "-tile-columns", "2", "-r", "30",
                "`"$webmOut`""
            )
            
            $result = Start-Process -FilePath "ffmpeg" -ArgumentList $ffmpegArgs -Wait -PassThru -WindowStyle Hidden
            
            if ($result.ExitCode -eq 0) {
                Write-Host "→ $webmOut" -ForegroundColor Green
            }
        }
        
        # GIF → MP4
        if (!(Test-Path $mp4Out) -or ($_.LastWriteTime -gt (Get-Item $mp4Out -ErrorAction SilentlyContinue).LastWriteTime)) {
            Write-Host "GIF → MP4: $base" -ForegroundColor Yellow
            
            $ffmpegArgs = @(
                "-y", "-i", "`"$($_.FullName)`"",
                "-vf", "scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease",
                "-c:v", "libx264", "-preset", "medium", "-crf", "28",
                "-pix_fmt", "yuv420p", "-r", "30", "-movflags", "+faststart",
                "`"$mp4Out`""
            )
            
            $result = Start-Process -FilePath "ffmpeg" -ArgumentList $ffmpegArgs -Wait -PassThru -WindowStyle Hidden
            
            if ($result.ExitCode -eq 0) {
                Write-Host "→ $mp4Out" -ForegroundColor Green
            }
        }
    }
}

function Clean-Build {
    Write-Host "🧹 빌드 산출물 정리 중..." -ForegroundColor Cyan
    
    if (Test-Path "static") {
        Remove-Item -Recurse -Force static/* -ErrorAction SilentlyContinue
        Write-Host "✅ static/ 폴더 정리 완료" -ForegroundColor Green
    } else {
        Write-Host "⏭️  static/ 폴더가 없습니다" -ForegroundColor Gray
    }
}

function Test-Build {
    Write-Host "🧪 빌드 결과 테스트 중..." -ForegroundColor Cyan
    
    Write-Host "=== 이미지 최적화 결과 ===" -ForegroundColor Cyan
    if (Test-Path $OUT_IMG) {
        $webpCount = (Get-ChildItem -Path $OUT_IMG -Recurse -Include '*.webp' | Measure-Object).Count
        Write-Host "WebP 파일: $webpCount 개" -ForegroundColor Green
    }
    
    Write-Host "=== 비디오 최적화 결과 ===" -ForegroundColor Cyan
    if (Test-Path $OUT_VID) {
        $mp4Count = (Get-ChildItem -Path $OUT_VID -Recurse -Include '*.mp4' | Measure-Object).Count
        $webmCount = (Get-ChildItem -Path $OUT_VID -Recurse -Include '*.webm' | Measure-Object).Count
        Write-Host "MP4 파일: $mp4Count 개" -ForegroundColor Green
        Write-Host "WebM 파일: $webmCount 개" -ForegroundColor Green
    }
    
    Write-Host "=== 폴더 크기 비교 ===" -ForegroundColor Cyan
    if (Test-Path $SRC_IMG) {
        $srcSize = (Get-ChildItem -Path $SRC_IMG -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
        Write-Host "원본 이미지: $($srcSize.ToString('F1')) MB" -ForegroundColor Yellow
    }
    if (Test-Path $OUT_IMG) {
        $outSize = (Get-ChildItem -Path $OUT_IMG -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
        Write-Host "최적화 이미지: $($outSize.ToString('F1')) MB" -ForegroundColor Green
        if ($srcSize -gt 0) {
            $ratio = ($outSize / $srcSize * 100)
            $color = if ($ratio -lt 70) { "Green" } else { "Yellow" }
            Write-Host "압축률: $($ratio.ToString('F1'))%" -ForegroundColor $color
        }
    }
}

function Show-Help {
    Write-Host "사용 가능한 명령어:" -ForegroundColor Cyan
    Write-Host "  .\build.ps1 build    - 전체 빌드 (이미지 + 비디오 + GIF)" -ForegroundColor White
    Write-Host "  .\build.ps1 images   - 이미지만 WebP로 변환" -ForegroundColor White
    Write-Host "  .\build.ps1 videos   - 비디오만 MP4/WebM으로 변환" -ForegroundColor White
    Write-Host "  .\build.ps1 gifs     - GIF만 WebM/MP4로 변환" -ForegroundColor White
    Write-Host "  .\build.ps1 clean    - 빌드 산출물 삭제" -ForegroundColor White
    Write-Host "  .\build.ps1 test     - 빌드 결과 테스트" -ForegroundColor White
    Write-Host "  .\build.ps1 help     - 도움말 표시" -ForegroundColor White
}

# 메인 실행 로직
switch ($Command.ToLower()) {
    "build" {
        Clean-Build
        Build-Images
        Build-Videos
        Build-Gifs
        Write-Host "✅ 빌드 완료!" -ForegroundColor Green
    }
    "images" { Build-Images }
    "videos" { Build-Videos }
    "gifs" { Build-Gifs }
    "clean" { Clean-Build }
    "test" { Test-Build }
    "help" { Show-Help }
    default {
        Write-Host "Unknown command: $Command" -ForegroundColor Red
        Show-Help
    }
}
