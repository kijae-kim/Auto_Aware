import os
import cv2
import time
import sys
import numpy as np
from io import BytesIO
from scipy.spatial import distance as dist

# 현재 스크립트의 위치를 기준으로 상대 경로 설정
base_dir = os.path.dirname(os.path.abspath(__file__))

# 상대 경로로 모듈 경로 추가
sys.path.append(base_dir)
sys.path.append(os.path.join(base_dir, 'project_dms'))
sys.path.append(os.path.join(base_dir, 'project_dms', 'fd'))
sys.path.append(os.path.join(base_dir, 'project_dms', 'fl'))

# 외부 모듈 임포트
import face_detection
from project_dms.fl import face_landmark_detection

# 얼굴 측정 지표를 계산하는 함수들 정의
def ear(pts):
    A = dist.euclidean(pts[1], pts[7])
    B = dist.euclidean(pts[3], pts[5])
    C = dist.euclidean(pts[0], pts[4])
    return (A + B) / (2.0 * C)

def head_rate(pts):
    A = dist.euclidean(pts[51], pts[54])
    B = dist.euclidean(pts[54], pts[16])
    return A / B

def stir_rate(pts):
    A = dist.euclidean(pts[4], pts[54])
    B = dist.euclidean(pts[28], pts[54])
    return A / B

def face_metric(pts):
    left_EAR = ear(pts[60:68])
    right_EAR = ear(pts[68:76])
    EAR_avg = (left_EAR + right_EAR) / 2
    HR = head_rate(pts)
    SR = stir_rate(pts)
    return EAR_avg, HR, SR

# 상대 경로로 모델 가중치 파일 경로 설정
landmark_detection_weight = os.path.join(base_dir, 'project_dms', 'fl', 'checkpoint_epoch_313.pth.tar')
face_detection_weight = os.path.join(base_dir, 'project_dms', 'fd', 'weights', 'mobilenet0.25_epoch_240.pth')

# 임계값 설정
time_th = 2.0
vis_thresh = 0.6
EAR_Thresh = 0.25
HR_Thresh = (0.7, 0.95)
SR_Thresh = (0.5, 2)

# 상태 변수 초기화
ear_status = False
head_status = False
face_detection_n = False
ear_status_warning = False
head_status_warning = False
face_detection_n_warning = False
fd_time = 0
head_time = 0
ear_time = 0
sleep_num = 0 # 24.09.03 이모지를 위한 변수
inconcentrate_num = 0 # 24.09.03 이모지를 위한 변수

# 24.09.03 이모지 파일 경로
warning_message = 'normal'
normal = os.path.join(base_dir, 'imoji', 'normal.png')
sleep = os.path.join(base_dir, 'imoji', 'sleep.png')
inconcentrate = os.path.join(base_dir, 'imoji', 'inconcentrate.png')

def process_frame_sleep(img, imoji='false'):
    global ear_status, head_status, face_detection_n
    global ear_status_warning, head_status_warning, face_detection_n_warning
    global fd_time, head_time, ear_time, sleep_num, inconcentrate_num
    
    # 얼굴 감지 수행
    dets = face_detection.detection(img, face_detection_weight)
    cr = time.time()

    if len(dets) == 0 or dets[0][4] < vis_thresh:
        if not face_detection_n:
            fd_time = cr
            face_detection_n = True
        elif face_detection_n and cr - fd_time > time_th:
            face_detection_n_warning = True
            cv2.rectangle(img, (0,0), (300, 100), (255,0,0), -1, cv2.LINE_AA)
            cv2.putText(img, 'Warning!', (5,70), cv2.FONT_HERSHEY_DUPLEX, 2, (255,255,255), thickness=3, lineType=cv2.LINE_AA)
        return img

    face_detection_n = False
    face_detection_n_warning = False

    # 얼굴 랜드마크 감지 및 EAR, HR, SR 계산
    points = face_landmark_detection.landmark_detection(img, dets[0], landmark_detection_weight)
    EAR, HR, SR = face_metric(points)

    # EAR 이상 확인
    if EAR < EAR_Thresh:
        cr = time.time()
        if not ear_status:
            ear_time = cr
            ear_status = True
        elif ear_status and cr - ear_time > time_th:
            ear_status_warning = True
    else:
        ear_status = False
        ear_status_warning = False

    # 고개 이상 확인
    if (HR_Thresh[0] < HR < HR_Thresh[1]) or not (SR_Thresh[0] <= SR <= SR_Thresh[1]):
        cr = time.time()
        if not head_status:
            head_time = cr
            head_status = True
        elif head_status and cr - head_time > time_th:
            head_status_warning = True
    else:
        head_status = False
        head_status_warning = False

    # 졸음 감지 시 경고 출력
    if ear_status_warning or head_status_warning:
        warning_message = "Blink Warning! " if ear_status_warning else "Head rotation warning! "

        cv2.rectangle(img, (10, img.shape[0] - 70), (410, img.shape[0] - 10), (255, 0, 0), -1, cv2.LINE_AA)
        cv2.putText(img, 'Warning!', (20, img.shape[0] - 50), cv2.FONT_HERSHEY_DUPLEX, 1, (255, 255, 255), thickness=2, lineType=cv2.LINE_AA)
        cv2.putText(img, warning_message, (20, img.shape[0] - 25), cv2.FONT_HERSHEY_DUPLEX, 0.7, (255, 255, 255), thickness=1, lineType=cv2.LINE_AA)
    else:
        warning_message = "normal"
    # print(warning_message)

    # EAR, SR, HR 값 화면에 표시
    cv2.putText(img, f'EAR:{EAR:.2f}', (10, 30), cv2.FONT_HERSHEY_DUPLEX, 0.7, (0,0,255), thickness=2, lineType=cv2.LINE_AA)
    cv2.putText(img, f'SR:{SR:.2f}', (10, 60), cv2.FONT_HERSHEY_DUPLEX, 0.7, (0,0,255), thickness=2, lineType=cv2.LINE_AA)
    cv2.putText(img, f'HR:{HR:.2f}', (10, 90), cv2.FONT_HERSHEY_DUPLEX, 0.7, (0,0,255), thickness=2, lineType=cv2.LINE_AA)

    # 24.09.03 이모지 및 이미지 보내기 위한 조건문
    if imoji == 'false':
        return img
    else:
        if warning_message == "Blink Warning! ":
            file_path = sleep
            sleep_num = sleep_num +1
            inconcentrate_num = 0
        elif warning_message == "Head rotation warning! ":
            file_path = inconcentrate
            inconcentrate_num = inconcentrate_num +1
            sleep_num = 0
        else:
            file_path = normal

        if sleep_num>=5 or inconcentrate_num>=5:
            print(warning_message)
            # 24.09.03 프린트 대신 알람 울림
            sleep_num = 0
            inconcentrate_num = 0
        # 24.09.03 연속 횟수 5번이상 시 메세지 출력

        # 24.09.03 이미지 파일 열기
        with open(file_path, 'rb') as file:
            chunk = file.read()
            # 24.09.03 이미지를 byte에서 메모리처럼 읽을 수 있게 변환
            image_stream = BytesIO(chunk)
            image_array = np.frombuffer(image_stream.read(), np.uint8)
            image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
            return image