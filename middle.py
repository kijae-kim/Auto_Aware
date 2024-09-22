import os
import cv2
import base64
import asyncio
import jwt
import datetime
import pickle
import face_recognition
from pymongo import MongoClient
from password_utils import hash_password, verify_password
from dotenv import load_dotenv
from sleep.sleep import process_frame_sleep
from face.face import process_frame_total

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# 24.09.03 학습 파일 경로
encoding_file_path = "./face/encodings.pickle"
load_dotenv(os.path.join(BASE_DIR, ".env"))

password_secret = os.environ["SECRET_KEY"]

sleep_frame = None

# Mongodb 연결
mongodburl = f"mongodb+srv://{os.environ['MONGODB_KEY']}@cluster0.siectcp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(mongodburl)
database = client["project3"]
collection = database["users"]
collection_list = database["list"]

# 로그인을 위한 함수
def login_middle(data):
    try:
        user = collection.find_one({"userid": data["id"]})
        if user is None or not verify_password(data["pw"], user["userpw"]):
            return "false"
        # 로그인 성공 시 JWT 토큰 생성
        payload = {
            "userid": user["userid"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=10)  # 토큰 만료 시간 설정
        }
        token = jwt.encode(payload, password_secret, algorithm="HS256")
        return token
    except Exception as e:
        return str(e)

# 회원가입을 위한 함수
# 24.09.03 가입 날짜 추가 저장
def signup_middle(data):
    try:
        search = collection.find_one({"userid" : data["id"]})
        if search == None:
            number = data["num"].replace("-", "") # 24/08/29 전화번호를 '-'없이 데이터 베이스에 저장함
            hashed_password = hash_password(data["pw"])
            signup_date = datetime.utcnow()
            collection.insert_one({"userid": data["id"], "userpw": hashed_password, "usernumber": number, "signup_date":signup_date})
            return "true"
        return "false"
    except Exception as e:
        return str(e)
    
# 토큰 확인을 위한 함수
def tokenCheck(token):
    try:
        # JWT 토큰 검증
        payload = jwt.decode(token, password_secret, algorithms=["HS256"])
        return {"status": "valid", "userid": payload["userid"]}  # 유효한 경우 응답
    except jwt.ExpiredSignatureError:
        return {"status": "invalid", "message": "Token has expired."}  # 만료된 토큰 처리
    except jwt.InvalidTokenError:
        return {"status": "invalid", "message": "Invalid token."}  # 잘못된 토큰 처리
    
# 24.08.31 사용자 정보를 가져오는 함수
def get_user_info(userid):
    try:
        user = collection.find_one({"userid": userid}, {"_id": 0, "userpw": 0})
        if user:
            return user
        return None
    except Exception as e:
        return str(e)
    
# 24.09.02 웹캠 프론트 전송
async def webcam_reader_total(websocket, userid: str):
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # 프레임 처리
            processed_frame = process_frame_total(frame, userid)

            # 처리된 프레임을 JPEG 형식으로 인코딩
            _, buffer = cv2.imencode('.jpg', processed_frame)
            frame_data = base64.b64encode(buffer).decode('utf-8')
            
            # 웹소켓을 통해 프레임 전송
            await websocket.send_text(frame_data)
            await asyncio.sleep(0.1)  # 0.1초마다 프레임 전송
    finally:
        cap.release()
    
# 24.09.01 웹캠 프로튼 전송
async def webcam_reader_sleep(websocket):
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    global sleep_frame
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            sleep_frame = frame

            # 이미지 처리 (sleep.py의 process_frame 사용)
            processed_frame = process_frame_sleep(frame)

            # 프레임을 JPEG 형식으로 인코딩하고 base64로 인코딩
            _, buffer = cv2.imencode('.jpg', processed_frame)
            frame_data = base64.b64encode(buffer).decode('utf-8')
            
            # 웹소켓을 통해 프레임 전송
            await websocket.send_text(frame_data)
            await asyncio.sleep(0.1)  # 0.1초마다 프레임 전송
    finally:
        cap.release()

#  24.09.03 이모지 전달
async def imoji_reader(websocket):
    global sleep_frame

    try:
        while True:
            imoji = process_frame_sleep(sleep_frame, 'true')

            # 처리된 프레임을 JPEG 형식으로 인코딩
            _, buffer = cv2.imencode('.jpg', imoji)
            
            # 인코딩된 이미지를 Base64로 인코딩
            frame_data = base64.b64encode(buffer).decode('utf-8')
            
            # WebSocket을 통해 전송
            await websocket.send_text(frame_data)

            # 초당 10 프레임 전송 (0.1초 대기)
            await asyncio.sleep(0.1)
    except Exception as e:
        print("error: ", e)

# 24.09.03 unknown 학습
def model_learning(data):
    global main_encodings
    with open(encoding_file_path, 'rb') as file:
        main_encodings = pickle.load(file)

    images_list = data['images']
    human_name = data['name']
    capture_folder = './capture'

    knownEncodings = main_encodings['encodings']
    knownNames = main_encodings['names']

    for file_name in filter(lambda f: f.endswith('.jpg'), images_list):
        name = human_name
        image_path = os.path.join(capture_folder, file_name)
        image = cv2.imread(image_path)
        rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        boxes = face_recognition.face_locations(rgb, model='cnn')
        encodings = face_recognition.face_encodings(rgb, boxes)

        knownEncodings.extend(encodings)
        knownNames.extend([name] * len(encodings))
        print(f"인코딩됨 {image_path} 사용자 이름: {name}")

    data = {"encodings": knownEncodings, "names": knownNames}

    with open(encoding_file_path, "wb") as f:
        f.write(pickle.dumps(data))

    with open(encoding_file_path, 'rb') as file:
        main_encodings = pickle.load(file)

    main_encodings = data

    name_count = main_encodings['names'].count(human_name)

    return name_count == 4

# 24.09.04 몽고디비에서 list 가져오기
def find_list_to_DB(userid):
    try:
        # MongoDB에서 사용자 ID로 데이터를 조회합니다.
        data = collection_list.find({"userid": userid}, {"_id": 0})
        result = []
        
        for item in data:
            # 바이너리 이미지 데이터를 Base64로 변환합니다.
            if 'image' in item:
                # Base64로 변환
                base64_image = base64.b64encode(item['image']).decode('utf-8')
                item['image'] = base64_image  # 이미지 필드를 Base64 문자열로 변경
            
            result.append(item)  # 결과 리스트에 추가
            
        return result
    except Exception as e:
        return str(e)