import cv2
import numpy as np
from PIL import Image
import os

def convert_mp4_to_gif_simple(input_path, output_path):
    try:
        # OpenCV로 비디오 로드
        cap = cv2.VideoCapture(input_path)
        
        frames = []
        frame_count = 0
        max_frames = 30  # 최대 30프레임만 추출
        
        while True:
            ret, frame = cap.read()
            if not ret or frame_count >= max_frames:
                break
                
            # BGR에서 RGB로 변환
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # 크기 조정 (너무 크면 GIF 파일이 커짐)
            height, width = frame_rgb.shape[:2]
            if width > 400:
                scale = 400 / width
                new_width = int(width * scale)
                new_height = int(height * scale)
                frame_rgb = cv2.resize(frame_rgb, (new_width, new_height))
            
            # PIL Image로 변환
            pil_image = Image.fromarray(frame_rgb)
            frames.append(pil_image)
            
            frame_count += 1
        
        cap.release()
        
        if frames:
            # GIF로 저장
            frames[0].save(
                output_path,
                save_all=True,
                append_images=frames[1:],
                duration=100,  # 100ms per frame
                loop=0
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
    success = convert_mp4_to_gif_simple(input_file, output_file)
    if success:
        print("GIF 파일이 성공적으로 생성되었습니다!")
    else:
        print("변환에 실패했습니다.")
else:
    print(f"입력 파일을 찾을 수 없습니다: {input_file}") 