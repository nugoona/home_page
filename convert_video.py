from moviepy.editor import VideoFileClip
import os

def convert_mp4_to_gif(input_path, output_path):
    try:
        # MP4 파일 로드
        video = VideoFileClip(input_path)
        
        # GIF로 변환 (크기 조정 및 품질 설정)
        video.write_gif(output_path, fps=10, resize_algorithm='bicubic')
        
        # 리소스 정리
        video.close()
        
        print(f"변환 완료: {output_path}")
        return True
    except Exception as e:
        print(f"변환 오류: {e}")
        return False

# 변환 실행
input_file = "videos/누구나타이틀.mp4"
output_file = "app/static/video/누구나타이틀.gif"

if os.path.exists(input_file):
    success = convert_mp4_to_gif(input_file, output_file)
    if success:
        print("GIF 파일이 성공적으로 생성되었습니다!")
    else:
        print("변환에 실패했습니다.")
else:
    print(f"입력 파일을 찾을 수 없습니다: {input_file}") 