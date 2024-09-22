import os
import cv2
import numpy as np
import face_recognition
import pickle
import time
from dotenv import load_dotenv
from pymongo import MongoClient


env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env')
load_dotenv(env_path)

# Mongodb 연결
mongodburl = f"mongodb+srv://{os.environ['MONGODB_KEY']}@cluster0.siectcp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(mongodburl)
database = client["project3"]
collection_list = database["list"]

face_cascade_name = './face/haarcascades/haarcascade_frontalface_alt.xml'
face_cascade = cv2.CascadeClassifier()

if not face_cascade.load(cv2.samples.findFile(face_cascade_name)):
    print('--(!) 얼굴 인식 캐스케이드 로딩 오류')
    exit(0)

encoding_file = './face/encodings.pickle'
with open(encoding_file, "rb") as f:
    data = pickle.load(f)

unknown_name = 'Unknown'
# 24.09.03 unknown 이미지 저장을 위한 변수
unknown_count = 0
max_unknown_alerts = 4

def process_frame_total(frame, userid):
    # 사람 인식
    global unknown_count

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    faces = face_cascade.detectMultiScale(gray)
    rois = [(y, x + w, y + h, x) for (x, y, w, h) in faces]
    encodings = face_recognition.face_encodings(rgb, rois)

    names = []
    match_percentages = []

    # 얼굴 인식 및 매칭
    for encoding in encodings:
        matches = face_recognition.compare_faces(data["encodings"], encoding)
        face_distances = face_recognition.face_distance(data["encodings"], encoding)
        best_match_index = np.argmin(face_distances)
        name = unknown_name
        match_percentage = 0

        if matches[best_match_index]:
            match_percentage = (1 - face_distances[best_match_index]) * 100
            # print(f"{data['names'][best_match_index]}와의 일치율: {match_percentage:.2f}%")
            if match_percentage >= 65:
                name = data["names"][best_match_index]

        names.append(name)
        match_percentages.append(match_percentage)

    for ((top, right, bottom, left), name, match_percentage) in zip(rois, names, match_percentages):
        y = top - 15 if top - 15 > 15 else top + 15
        color = (0, 255, 0) if name != unknown_name else (0, 0, 255)
        line = 2 if name != unknown_name else 1

        # 24.09.03 unknown 경고가 4번 초과인 경우 이미지 저장
        if name == unknown_name:
            if unknown_count < max_unknown_alerts:
                current_time = time.strftime("%Y%m%d_%H%M%S")
                os.makedirs('capture', exist_ok=True)
                image_path = os.path.join('./capture', f"{current_time}.jpg")
                cv2.imwrite(image_path, frame)
                print(f"캡쳐된 이미지가 {image_path}로 저장되었습니다.")
                
                # 이미지를 바이너리 데이터로 변환
                with open(image_path, "rb") as img_file:
                    img_data = img_file.read()

                collection_list.insert_one({
                    "userid": userid,
                    "image": img_data,
                    "person": "Unknown",
                    "date": current_time,
                    "shape" : "thief"
                })

                unknown_count += 1  # Unknown 카운트 증가
            else:
                print(f"미등록 사용자가 감지되었으나, 최대 경고 횟수 ({max_unknown_alerts})에 도달했습니다.")

        cv2.rectangle(frame, (left, top), (right, bottom), color, line)
        text = f"{name} ({match_percentage:.2f}%)"
        y = top - 15 if top - 15 > 15 else top + 15
        cv2.putText(frame, text, (left, y), cv2.FONT_HERSHEY_SIMPLEX, 0.75, color, line)

    # end_time = time.time()
    # process_time = end_time - start_time
    # print("=== 프레임 처리 시간: {:.3f} 초".format(process_time))

    return frame  # 처리된 프레임 반환