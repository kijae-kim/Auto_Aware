# 👨🏻‍💻 Auto_Aware
### 운전 중 발생하는 피로, 주의력 저하로 인한 사고와 도난에 대처 하기 위한 운전자 보조 서비스
* 인원 : 6명
* 기간 : 2024.08.05 ~ 2024.09.03

  
![1](https://github.com/user-attachments/assets/23910004-cab4-4c2a-aec9-a620b1c91599)


<br>

# 💡프로젝트 기획
운전자의 상태를 실시간으로 모니터링함으로써 교통사고를 예방하고 안전한 주행 환경을 조성하는 데 있습니다. Auto Aware 서비스는 졸음운전 방지와 전방 주시 경고 같은 기능을 통해 운전자가 집중력을 유지하도록 돕습니다. 얼굴 인식 기술을 활용하여 운전자의 상태를 지속적으로 감지하고, 위험한 상황 발생 시 즉각적인 경고를 제공하여 사고를 미연에 방지하는 것을 목표로 합니다.
<img width="1234" alt="스크린샷 2024-09-10 오후 5 54 08" src="https://github.com/user-attachments/assets/7fbdece5-d8a0-42ca-bec2-f6290d296fa3">

<br>

# **✅ Process&Roll**
### Process
- 기획, 데이터 전처리-구성, 모델학습, 프론트구현, 서버구현, PPT제작, 발표
![Auto_Aware_UML](https://github.com/user-attachments/assets/ff28d097-38e3-41de-b5b0-16d808844ddc)


### 🔑 My Role
- React.js를 이용 웹 소켓 방식과 파이썬 모델을 적용
- 테이블 형식으로 유저의 데이터를 저장, 배정
- 도난 또는 졸음 또는 전방주시태만 감지시 등록자에게 문자 메시지로 안내, 경보
- 컴포넌트 식으로 구성하여 기능을 구현.
  
<br>

# 💾 DataSet & Model
### DataSet


### Model
![keyfeatures1-(code)](https://github.com/user-attachments/assets/d3d02ed4-7540-4b47-aa5d-c53afafe10d8)
![keyfeatures2-(code)](https://github.com/user-attachments/assets/3c758651-284b-4434-a323-3f6c5f6e831f)


# **📖 Service Explain**
![Process](https://github.com/user-attachments/assets/7bc196d3-a76e-47db-999b-d111354b232f)
![Process (2)](https://github.com/user-attachments/assets/5d08dd60-a0ae-4dd2-9771-78a1f9a413ab)
![keyfeatures](https://github.com/user-attachments/assets/405e67cf-eed8-4bdd-80c4-a1e003d761f2)
![10](https://github.com/user-attachments/assets/bf5bedda-6008-4b0a-955a-f5e479e81e28)

<br>

# **📍 Vision**
![사업성](https://github.com/user-attachments/assets/a75c51b3-a4c9-4230-88f0-9acb0a24652e)
<img width="1230" alt="스크린샷 2024-09-10 오후 5 55 36" src="https://github.com/user-attachments/assets/25c96564-5741-47df-9189-f0cda6d60df7">
<br>

# **😎 Thoughts**
이번 프로젝트에서 가장 큰 도전 중 하나는 서버에서 웹캠을 열어 프레임 단위로 영상을 처리하는 과정이었습니다. 웹캠에서 프레임을 받아오고, 얼굴 인식 및 졸음 감지와 같은 연산을 처리하는데 시간이 많이 걸리면서 웹캠이 다운되는 현상이 자주 발생했습니다. 이를 해결하기 위해 처리 과정을 최대한 간소화하고, 연산을 비동기 방식으로 처리하여 성능을 최적화했습니다. 그 결과, 정상적으로 웹캠이 작동하게 되었고 실시간 분석이 가능해졌습니다.

또한, Python으로 개발한 기능을 React.js와 연결하는 과정에서 예상치 못한 오류가 많이 발생했습니다. 기능을 서버에서 처리할 수 있도록 기존의 코드를 함수화하고, 이를 백엔드에서 관리하도록 구조를 재설계하면서 오류를 해결할 수 있었습니다. 이러한 과정을 통해 백엔드와 프론트엔드 간의 연동의 중요성을 깊이 깨닫게 되었습니다.

세 번째로, 사용자의 이미지를 등록하고 학습하는 과정에서 발생한 번거로움도 큰 도전이었습니다. 처음에는 로컬에 이미지를 저장 후 가져오는 방식으로 처리했지만, 유저 정보를 데이터베이스에서 확인해야 하는 불편함이 있었습니다. 이를 해결하기 위해, unknown 이미지를 바이너리 데이터로 변환하여 데이터베이스에 저장하고 userid와 연동시키는 방식을 도입해 프로세스를 크게 단순화할 수 있었습니다.

이번 프로젝트를 통해 비동기 처리, 컴포넌트 기반 개발, 그리고 백엔드-프론트엔드의 통합에 대한 이해를 깊이 있게 다질 수 있었으며, 문제 해결 능력 또한 크게 향상되었습니다.

<br>

# **🛠️ Skill&Tool**
<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black"/> <img alt="Css" src ="https://img.shields.io/badge/CSS3-1572B6.svg?&style=for-the-badge&logo=CSS3&logoColor=white"/> <img alt="JavaScript" src ="https://img.shields.io/badge/JavaScriipt-F7DF1E.svg?&style=for-the-badge&logo=JavaScript&logoColor=black"/> <img alt="Python" src ="https://img.shields.io/badge/Python-3776AB.svg?&style=for-the-badge&logo=Python&logoColor=white"/> <img alt="FastAPI" src ="https://img.shields.io/badge/fastapi-009688.svg?&style=for-the-badge&logo=Python&logoColor=white"/>
<br>
<img alt="pytorch" src ="https://img.shields.io/badge/pytorch-EE4C2C.svg?&style=for-the-badge&logo=PyTorch&logoColor=white"/>
<img alt="MongoDB" src ="https://img.shields.io/badge/MongoDB-47A248.svg?&style=for-the-badge&logo=Python&logoColor=white"/>




