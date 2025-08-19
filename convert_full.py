import cv2
import numpy as np
from PIL import Image
import os

def convert_mp4_to_gif_full(input_path, output_path):
    try:
        # OpenCV로 비디오 로드
        cap = cv2.VideoCapture(input_path)
        
        # 비디오 정보 가져오기
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration = total_frames / fps
        
        print(f"원본 비디오 정보:")
        print(f"- FPS: {fps}")
        print(f"- 총 프레임: {total_frames}")
        print(f"- 재생 시간: {duration:.2f}초")
        
        frames = []
        frame_count = 0
        
        # 모든 프레임 추출
        while True:
            ret, frame = cap.read()
            if not ret:
                break
                
            # BGR에서 RGB로 변환
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # 크기 조정
            height, width = frame_rgb.shape[:2]
            if width > 400:
                scale = 400 / width
                new_width = int(width * scale)
                new_height = int(height * scale)
                frame_rgb = cv2.resize(frame_rgb, (new_width, new_height), interpolation=cv2.INTER_LANCZOS4)
            
            # PIL Image로 변환
            pil_image = Image.fromarray(frame_rgb)
            frames.append(pil_image)
            
            frame_count += 1
            
            # 진행상황 출력
            if frame_count % 10 == 0:
                print(f"프레임 처리 중: {frame_count}/{total_frames}")
        
        cap.release()
        
        if frames:
            # 프레임 간격 계산 (30fps로 설정)
            frame_duration = int(1000 / 30)  # 밀리초 단위
            
            print(f"GIF 정보:")
            print(f"- 추출된 프레임: {len(frames)}")
            print(f"- 프레임당 지속시간: {frame_duration}ms")
            print(f"- 예상 재생시간: {len(frames) * frame_duration / 1000:.2f}초")
            
            # GIF로 저장
            frames[0].save(
                output_path,
                save_all=True,
                append_images=frames[1:],
                duration=frame_duration,
                loop=0,
                optimize=False,
                quality=95
            )
            print(f"GIF 변환 완료: {output_path}")
            return True
        else:
            print("프레임을 추출할 수 없습니다.")
            return False
            
    except Exception as e:
        print(f"변환 오류: {e}")
        return False

# 변환 실행
input_file = "videos/누구나타이틀.mp4"
output_file = "app/static/video/누구나타이틀.gif"

if os.path.exists(input_file):
    success = convert_mp4_to_gif_full(input_file, output_file)
    if success:
        print("GIF 파일이 성공적으로 생성되었습니다!")
    else:
        print("변환에 실패했습니다.")
else:
    print(f"입력 파일을 찾을 수 없습니다: {input_file}")