# Syload_homepage
동국대 창업 캡스톤 과제 수행을 위한 코드 입니다. 

디자인 원본 링크 : https://templated.co/fullmotion

여러 참고 자료 링크 : 
https://cheese10yun.github.io/passport-thirdpart-loginl/


## 기획 하게 된 동기
동국대 창업 캡스톤 과제 수행에 있어서 기본적인 상권 데이터가 없기 때문에 상권 발전에 대한
아이디어 도출이 어려우며, 매 학기가 지날 때 마다 누적되는 정보가 전혀 없이 학기 마다 계획이 초기화 되는 문제가 발생하고 있었습니다.
따라서 API를 통해 기존의 상권 데이터를 JSON 형식으로 요청에 대한 응답을 하고자 하였고, 어떠한 데이터가 있으며,
간단한 홈페이지를 통해 시각화 예시를 보여줌으로써, 데이터를 사용할 수 있는 방법에 대한 예를 보여주고자 하였습니다.

## API 개발
- Node.js를 통해 API를 개발 하였으며, 아직 상권에 대한 정보를 얻지 못했기 때문에 더미 정보로 구성이 되며, 데이터 베이스 구조도 미흡합니다.
- 추후 개선을 통해 API 성능과 URL과 쿼리스트링 구조를 개선하며, 추가적으로 Document도 제공할 예정입니다.

### API 예시 
- https://www.playinfo.co.kr/foods/api?id=1 
- https://www.playinfo.co.kr/foods/api?name=필동면옥 

을 통해 다음과 같은 더미 정보를 얻을 수 있습니다. 

![Json 예시](/JsonImage/jsonexample.jpg)

#### 19-6-20 까지는 더미 정보 입니다. 이후에 효용성 테스트 후 실제 상권 정보를 기입할 예정 입니다. 

## 예시 홈페이지는 https://www.playinfo.co.kr 입니다. 

