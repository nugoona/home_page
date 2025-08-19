import cv2
import numpy as np
from PIL import Image
import os

def convert_mp4_to_gif_new(input_path, output_path):
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
        max_frames = 100  # 더 많은 프레임 추출
        
        # 프레임 간격 계산 (전체 영상을 균등하게 분할)
        frame_interval = max(1, total_frames // max_frames)
        
        while True:
            ret, frame = cap.read()
            if not ret or frame_count >= max_frames:
                break
                
            # BGR에서 RGB로 변환
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # 크기 조정 (더 작은 크기로)
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
            
            # 프레임 건너뛰기
            for _ in range(frame_interval - 1):
                cap.read()
        
        cap.release()
        
        if frames:
            # 재생 시간 계산 (원본과 비슷하게)
            target_duration = duration * 1000  # 밀리초로 변환
            frame_duration = target_duration / len(frames)
            
            print(f"GIF 정보:")
            print(f"- 추출된 프레임: {len(frames)}")
            print(f"- 프레임당 지속시간: {frame_duration:.1f}ms")
            print(f"- 예상 재생시간: {len(frames) * frame_duration / 1000:.2f}초")
            
            # GIF로 저장
            frames[0].save(
                output_path,
                save_all=True,
                append_images=frames[1:],
                duration=int(frame_duration),
                loop=0,
                optimize=True
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
    success = convert_mp4_to_gif_new(input_file, output_file)
    if success:
        print("새로운 GIF 파일이 성공적으로 생성되었습니다!")
    else:
        print("변환에 실패했습니다.")
else:
    print(f"입력 파일을 찾을 수 없습니다: {input_file}")