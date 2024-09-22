import os
import uvicorn
import pickle
from typing import List
from pydantic import BaseModel
from fastapi import FastAPI, WebSocket, UploadFile, File, BackgroundTasks, Query
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from middle import signup_middle, login_middle, tokenCheck, get_user_info, webcam_reader_sleep, webcam_reader_total, imoji_reader, model_learning, find_list_to_DB

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React 앱의 URL
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 헤더 허용
)


class LoginData(BaseModel):
    userid: str
    password: str

class SignupData(BaseModel):
    userid: str
    password: str
    number: str

class TokenData(BaseModel):
    token: str

# 24.09.03 이미지 및 토큰 받기
class ImageData(BaseModel):
    image0: str
    image1: str
    image2: str
    image3: str
    token: str
    name: str

# 24.09.03 'server/capture' 디렉토리의 절대 경로
CAPTURE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# 24.09.03 파일 리로드를 위한 변수
main_encodings = {}

# 24.09.03 정적 파일 서빙을 위한 설정
app.mount("/images", StaticFiles(directory=CAPTURE_DIR), name="images")

@app.post("/login")
async def login(request: LoginData):
    data = { "id": request.userid, "pw": request.password}
    result = login_middle(data)
    return result

@app.post("/signup")
async def signup(request: SignupData):
    data = { "id" : request.userid, "pw" : request.password, "num" : request.number}
    result = signup_middle(data)
    return result 

@app.post("/validateToken")
async def validate_token(request: TokenData):
    token = request.token
    result = tokenCheck(token)
    return result

# 24.09.05 list 몽고디비에서 가져오는 어노테이션
@app.post("/find_list")
async def database_list(request: TokenData):
    token = request.token
    token_user = tokenCheck(token)
    result = find_list_to_DB(token_user["userid"])
    return result


# 24.09.03 이미지 학습 어노테이션
@app.post("/registerImage")
async def image_register(request: ImageData, background_tasks: BackgroundTasks):
    token = request.token
    token_user = tokenCheck(token)
    data = {"name": request.name, 
            "images": [request.image0, request.image1, request.image2, request.image3]}
    result = model_learning(data)

    # Background task to reload the model
    background_tasks.add_task(reload_model)
    return result

# 24.09.03 서버 파일 리로드
def reload_model():
    global main_encodings
    encoding_file_path = "./face/encodings.pickle"
    # 이 함수에서 pickle 파일을 다시 로드하고 필요에 따라 초기화합니다.
    with open(encoding_file_path, 'rb') as file:
        main_encodings = pickle.load(file)

# 24.08.31 유저 데이터 정보 확인 어노테이션
@app.get("/user-info/{userid}")
async def user_info(userid: str):
    result = get_user_info(userid)
    return result


# 카메라1 연결
@app.websocket("/Cam1")
async def Cam1_webSocket_endpoint(websocket: WebSocket, token: str = Query(...)):
    try:
        await websocket.accept()
        token_user = tokenCheck(token)
        print(token_user["userid"])
        await webcam_reader_total(websocket, token_user["userid"])
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await websocket.close()

# 카메라2 연결
@app.websocket("/Cam2")
async def Cam2_webSocket_endpoint(websocket: WebSocket):
    try:
        await websocket.accept()
        await webcam_reader_sleep(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await websocket.close()

# 이모지 연결
@app.websocket("/imoji")
async def Imoji_webSocket_endpoint(websocket: WebSocket):
    try:
        await websocket.accept()
        await imoji_reader(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await websocket.close()


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)