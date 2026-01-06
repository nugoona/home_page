"""
슬랙 웹훅 유틸리티 모듈
환경 변수에서 웹훅 URL을 읽어와 슬랙으로 메시지를 전송합니다.
"""
import os
import requests
from typing import Dict, Any, Optional
from dotenv import load_dotenv

# .env 파일 로드 (여러 위치에서 시도)
import os
env_paths = [
    os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env'),
    os.path.expanduser('~/ngn_homepage/.env'),
    os.path.expanduser('~/ngn_board/config/ngn.env'),  # 다른 프로젝트의 .env도 시도
    os.path.expanduser('~/.env'),
]
for env_path in env_paths:
    if os.path.exists(env_path):
        print(f"슬랙 유틸: .env 파일 로드 시도: {env_path}")
        load_dotenv(env_path)
        break
else:
    print("슬랙 유틸: .env 파일을 찾을 수 없습니다. 환경 변수를 직접 설정하세요.")
    # 환경 변수 직접 로드 시도
    load_dotenv()


def get_slack_webhook_url() -> Optional[str]:
    """
    환경 변수에서 슬랙 웹훅 URL을 가져옵니다.
    
    Returns:
        str: 슬랙 웹훅 URL 또는 None
    """
    return os.environ.get("SLACK_WEBHOOK_URL")


def format_survey_message(survey_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    설문 데이터를 슬랙 메시지 형식으로 포맷팅합니다.
    
    Args:
        survey_data: 설문 응답 데이터 딕셔너리
        
    Returns:
        dict: 슬랙 메시지 페이로드
    """
    # 연락처 정보 추출
    contact_info = survey_data.get('contact_info', '미입력')
    site_info = survey_data.get('site_info', '미입력')
    convenient_time = survey_data.get('convenient_time', '미입력')
    communication_method = survey_data.get('communication_method', '미입력')
    
    # 커뮤니케이션 방식 한글 변환
    comm_method_map = {
        'phone': '전화',
        'video_meeting': '화상 온라인 미팅',
        'email': '이메일',
        'contact_later': '직접 다시 연락'
    }
    comm_method_text = comm_method_map.get(communication_method, communication_method)
    
    # 업종 카테고리
    industry = survey_data.get('industry', '미입력')
    industry_map = {
        'fashion': '패션의류/뷰티',
        'food': '식품',
        'household': '생활용품',
        'interior': '홈인테리어',
        'digital': '가전디지털',
        'office': '문구/오피스',
        'other': survey_data.get('industry_other', '기타')
    }
    industry_text = industry_map.get(industry, industry)
    
    # 슬랙 메시지 블록 구성
    blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": "📋 새로운 설문지 제출"
            }
        },
        {
            "type": "divider"
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": f"*이름/연락처:*\n{contact_info}"
                },
                {
                    "type": "mrkdwn",
                    "text": f"*사이트 정보:*\n{site_info}"
                }
            ]
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": f"*업종:*\n{industry_text}"
                },
                {
                    "type": "mrkdwn",
                    "text": f"*커뮤니케이션 방식:*\n{comm_method_text}"
                }
            ]
        }
    ]
    
    # 편한 시간이 있으면 추가
    if convenient_time and convenient_time != '미입력':
        blocks.append({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": f"*편한 시간:*\n{convenient_time}"
            }
        })
    
    # 상세 답변 섹션
    detail_fields = []
    
    # 광고 운영 포인트
    point_answers = []
    for i in range(1, 6):
        point_key = f'point{i}'
        if point_key in survey_data:
            point_value = survey_data[point_key]
            if isinstance(point_value, list):
                point_value = point_value[0] if point_value else None
            if point_value:
                point_map = {
                    'very_important': '매우 중요함',
                    'important': '중요함',
                    'normal': '보통'
                }
                point_text = point_map.get(point_value, point_value)
                point_answers.append(f"포인트 {i}: {point_text}")
    
    # 온라인 광고 경험
    ad_experience = survey_data.get('ad_experience', '미입력')
    ad_experience_map = {
        'none': '진행한 적 없음',
        '6months': '6개월 이하',
        '1year': '1년 이하',
        'over1year': '1년 이상',
        'other': survey_data.get('ad_experience_other', '기타')
    }
    ad_experience_text = ad_experience_map.get(ad_experience, ad_experience)
    
    # 광고 매체
    ad_media = survey_data.get('ad_media', [])
    if isinstance(ad_media, list) and ad_media:
        ad_media_map = {
            'none': '진행한 적 없음',
            'meta': '메타 (인스타, 페이스북)',
            'keyword_search': '키워드 검색광고',
            'shopping_search': '쇼핑 검색광고',
            'portal_image': '포털 이미지 광고',
            'google_ads': '구글애즈',
            'app_ads': '앱광고',
            'other': survey_data.get('ad_media_other', '기타')
        }
        ad_media_text = ', '.join([ad_media_map.get(m, m) for m in ad_media if m != 'other'])
        if 'other' in ad_media and survey_data.get('ad_media_other'):
            ad_media_text += f", {survey_data.get('ad_media_other')}"
    else:
        ad_media_text = '미입력'
    
    # 합리적인 광고비
    reasonable_cost = survey_data.get('reasonable_cost', '미입력')
    cost_map = {
        '5_10_percent': '매출액의 5~10%',
        'under_3_percent': '매출액의 3% 이하',
        '300k_daily': '일 30만원 이상',
        'kpi_based': 'KPI 기준 성과에 따라'
    }
    cost_text = cost_map.get(reasonable_cost, reasonable_cost)
    
    # 상세 정보 필드 추가
    if ad_experience_text != '미입력':
        detail_fields.append({
            "type": "mrkdwn",
            "text": f"*광고 경험:*\n{ad_experience_text}"
        })
    
    if ad_media_text != '미입력':
        detail_fields.append({
            "type": "mrkdwn",
            "text": f"*기존 광고 매체:*\n{ad_media_text}"
        })
    
    if cost_text != '미입력':
        detail_fields.append({
            "type": "mrkdwn",
            "text": f"*합리적인 광고비:*\n{cost_text}"
        })
    
    # 상세 필드가 있으면 추가
    if detail_fields:
        blocks.append({
            "type": "section",
            "fields": detail_fields
        })
    
    # 문의 내용 (전체 답변 요약)
    blocks.append({
        "type": "divider"
    })
    
    # 전체 답변을 텍스트로 정리
    full_response = "=== 설문 응답 요약 ===\n\n"
    full_response += f"업종: {industry_text}\n"
    full_response += f"광고 경험: {ad_experience_text}\n"
    if ad_media_text != '미입력':
        full_response += f"기존 광고 매체: {ad_media_text}\n"
    full_response += f"합리적인 광고비: {cost_text}\n"
    full_response += f"사이트: {site_info}\n"
    full_response += f"연락처: {contact_info}\n"
    full_response += f"커뮤니케이션: {comm_method_text}\n"
    if convenient_time and convenient_time != '미입력':
        full_response += f"편한 시간: {convenient_time}\n"
    
    blocks.append({
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": f"*문의 내용:*\n```{full_response}```"
        }
    })
    
    return {
        "blocks": blocks
    }


def send_slack_message(message_data: Dict[str, Any]) -> bool:
    """
    슬랙 웹훅을 통해 메시지를 전송합니다.
    
    Args:
        message_data: 슬랙 메시지 페이로드
        
    Returns:
        bool: 전송 성공 여부
    """
    webhook_url = get_slack_webhook_url()
    
    if not webhook_url:
        print("ERROR: SLACK_WEBHOOK_URL 환경 변수가 설정되지 않았습니다.")
        print("환경 변수 확인:")
        print(f"  - SLACK_WEBHOOK_URL in os.environ: {'SLACK_WEBHOOK_URL' in os.environ}")
        if 'SLACK_WEBHOOK_URL' in os.environ:
            print(f"  - 값: {os.environ['SLACK_WEBHOOK_URL'][:50]}...")
        return False
    
    print(f"슬랙 웹훅 URL: {webhook_url[:50]}...")
    print(f"전송할 메시지 데이터: {message_data}")
    
    try:
        response = requests.post(
            webhook_url,
            json=message_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"슬랙 응답 상태 코드: {response.status_code}")
        print(f"슬랙 응답 본문: {response.text}")
        
        if response.status_code == 200:
            print("슬랙 메시지 전송 성공!")
            return True
        else:
            print(f"슬랙 메시지 전송 실패: {response.status_code} - {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"슬랙 메시지 전송 중 오류 발생: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def send_survey_notification(survey_data: Dict[str, Any]) -> bool:
    """
    설문 제출 알림을 슬랙으로 전송합니다.
    
    Args:
        survey_data: 설문 응답 데이터
        
    Returns:
        bool: 전송 성공 여부
    """
    message = format_survey_message(survey_data)
    return send_slack_message(message)

