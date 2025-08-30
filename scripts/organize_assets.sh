#!/usr/bin/env bash
set -euo pipefail

# === 폴더 정의 ===
ROOT="$(pwd)"
APP_DIR="./app"
TEMPLATES_DIR="."
STATIC_DIR="./static"
CSS_SRC="./css"
JS_SRC="./js"
IMG_SRC="./images"
VID_SRC="./videos"

CSS_DST="${STATIC_DIR}/css"
JS_DST="${STATIC_DIR}/js"
IMG_DST="${STATIC_DIR}/img"
VID_SRC_DST="${STATIC_DIR}/videos_src"   # 원본 보관
VID_DST="${STATIC_DIR}/videos"           # 재인코딩 배포용
THUMB_DST="${STATIC_DIR}/thumbs"
LOG_FILE="${STATIC_DIR}/ffmpeg.log"

# 도구 확인
command -v /usr/bin/ffmpeg >/dev/null || { echo "ffmpeg 필요: sudo apt-get update && sudo apt-get install -y ffmpeg"; exit 1; }
command -v cwebp  >/dev/null || { echo "cwebp 필요: sudo apt-get install -y webp"; exit 1; }

echo "== 0) static 디렉토리 생성"
mkdir -p "${CSS_DST}" "${JS_DST}" "${IMG_DST}" "${VID_SRC_DST}" "${VID_DST}" "${THUMB_DST}"
: > "${LOG_FILE}"   # 로그 초기화

echo "== 1) CSS/JS/이미지 이동 (원본 유지, 스페이스 등 파일명 정리)"
move_and_clean() {
  local src="$1" dst="$2"
  [ -d "${src}" ] || return 0
  rsync -a "${src}/" "${dst}/"
  # 공백/괄호 → 하이픈 치환
  find "${dst}" -depth -name "* *" -exec bash -c 'for p; do mv "$p" "${p// /-}"; done' _ {} +
  find "${dst}" -depth -name "*(*" -exec bash -c 'for p; do mv "$p" "$(echo "$p" | tr "()" "--")"; done' _ {} +
}
move_and_clean "${CSS_SRC}" "${CSS_DST}"
move_and_clean "${JS_SRC}"  "${JS_DST}"
move_and_clean "${IMG_SRC}" "${IMG_DST}"

echo "== 2) videos 전체를 static/videos_src 로 보존 이동"
if [ -d "${VID_SRC}" ]; then
  rsync -a "${VID_SRC}/" "${VID_SRC_DST}/"
fi
# images 밑에 잘못 들어간 mp4도 videos_src로 이동
find "${IMG_DST}" -type f -iname "*.mp4" -exec bash -c '
  for f; do
    dst="${f/static\/img/static\/videos_src}"
    mkdir -p "$(dirname "$dst")"
    mv "$f" "$dst"
  done
' _ {} +

echo "== 3) 영상 재인코딩(mp4 h264 + faststart) + webm + 썸네일"
find "${VID_SRC_DST}" -type f \( -iname '*.mp4' -o -iname '*.mov' -o -iname '*.m4v' \) | while IFS= read -r f; do
  rel="${f#"${VID_SRC_DST}/"}"
  noext="${rel%.*}"
  out_mp4="${VID_DST}/${noext}.mp4"
  out_webm="${VID_DST}/${noext}.webm"
  out_thumb="${THUMB_DST}/${noext}.jpg"
  mkdir -p "$(dirname "${out_mp4}")" "$(dirname "${out_thumb}")"

  if [ ! -f "${out_mp4}" ]; then
    echo "  -> mp4: ${out_mp4}"
    /usr/bin/ffmpeg -y -i "${f}" -c:v libx264 -preset fast -crf 23 \
      -c:a aac -b:a 128k -movflags +faststart "${out_mp4}" \
      </dev/null >>"${LOG_FILE}" 2>&1
  fi
  if [ ! -f "${out_webm}" ]; then
    echo "  -> webm: ${out_webm}"
    /usr/bin/ffmpeg -y -i "${f}" -c:v libvpx-vp9 -b:v 0 -crf 30 -c:a libopus "${out_webm}" \
      </dev/null >>"${LOG_FILE}" 2>&1
  fi
  if [ ! -f "${out_thumb}" ]; then
    echo "  -> thumb: ${out_thumb}"
    /usr/bin/ffmpeg -y -i "${out_mp4}" -ss 00:00:01 -vframes 1 -qscale:v 2 "${out_thumb}" \
      </dev/null >>"${LOG_FILE}" 2>&1
  fi
done

echo "== 4) 이미지 WebP 추가 생성(q=80, 기존 jpg/png 보존)"
find "${IMG_DST}" -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' \) | while IFS= read -r img; do
  out="${img%.*}.webp"
  [ -f "${out}" ] || cwebp -q 80 "${img}" -o "${out}" >/dev/null 2>&1 || true
done

echo "== 5) 의심/불필요 파일 안내 (삭제는 수동)"
echo "다음 파일(혹은 비슷한 이름)은 실수로 생긴 것 같음. 필요 없으면 삭제하세요:"
ls -1 | grep -E 'how HEAD|tatus' || true

echo "== 6) 요약 리포트"
du -sh "${STATIC_DIR}" || true
echo "Top 15 큰 파일:"
du -ah "${STATIC_DIR}" | sort -h | tail -n 15 || true
echo "Tree (static, 3단계):"
tree -L 3 --dirsfirst "${STATIC_DIR}" || true

echo "== 7) 안내"
echo "ffmpeg 실행 로그는 ${LOG_FILE} 에 저장됨"
echo "HTML 경로는 /static 하위로 바뀝니다. (예: images/foo.png -> /static/img/foo.png)"
echo "템플릿(Jinja)라면 url_for('static', filename='img/foo.png') 형식 권장."
