# **우리동네 푸드트럭(FoodInDaHood)**

## Introduction

**우리동네 푸드트럭**은 서울지역 푸드트럭 API를 기반으로 자신의 위치 주변에 있는 푸드트럭은 물론 서울 내에 등록된 푸드트럭들의 위치와 운영상황을 확인할 수 있는 푸드트럭 플랫폼입니다.

<img src="https://t1.daumcdn.net/thumb/R1280x0/?fname=http://t1.daumcdn.net/brunch/service/user/1aNR/image/Xk2YVqAV3qVo2xuGJzkftBff6mk.png" width="30%" height="30%"></img>
<img src="https://t1.daumcdn.net/thumb/R1280x0/?fname=http://t1.daumcdn.net/brunch/service/user/1aNR/image/n6m0Uue8FCDVyojFPRO2UQXdotw.png" width="30%" height="30%"></img>
<img src="https://t1.daumcdn.net/thumb/R1280x0/?fname=http://t1.daumcdn.net/brunch/service/user/1aNR/image/9lMQhAYERu0zLuhsZIlRzFYGITI.png" width="30%" height="30%"></img>

## Features

- 거리 내 푸드트럭 필터링(500M, 1KM, 2KM, 4KM)
- 거리, 즐겨찾기, 댓글 순으로 정렬기능
- Facebook Social 로그인
- 댓글달기
- 지역, 카테고리, 푸드트럭명 통합검색
- 푸드트럭 정보제공 (위치, 메뉴, 세부정보 등)
- 푸드트럭 즐겨찾기 추가/해제
- 푸드트럭 찾아가기
- 영업상태 실시간 반영

## Requirements

- mLab MongoDB Database, AWS S3 Storage
- Google Geolocation API, Google Map API
- FaceBoock Social Login
- [서울시 푸드트럭 공공 데이터 사용](https://www.data.go.kr/dataset/3072599/fileData.do)

## Prerequisites

- Node, NPM 환경기반
- Chrome Browser(권장)

## Installation

### Client
```
git clone https://github.com/yeon0206/FoodInDaHood-FrontEnd
npm install
npm start
```

### Server
```
git clone https://github.com/redant23/FoodInDaHood-BackEnd
npm install
npm run server
```

## Client-Side

- Create React App 환경
- Google Geolocation API, Google Map API 위치기반 서비스
- React, Redux 를 이용한 컴포넌트 기반 코드 설계 및 스테이트 관리
- Facebook Social Login API

## Server-Side

- Node.js, Express.js 서버 구축
- MongoDB-mLab NoSQL 데이터베이스
- AWS S3를 이용한 이미지 데이터 관리
- Facebook Social Login API(Passport, JWT인증)

## Test
- Unit Test (Jest, Enzyme) 기본 함수테스트 및 컴포넌트 테스트

## Work-Flow Management
- Circle CI
- Github
- Netlify
- AWS CodePipeline

## Project Control
- [Mindmeister를 활용한 아이디어 공유 및 초기 기획 구성](https://www.mindmeister.com/1126545775?t=OUh1i8cm6y)
- [Trello 스케쥴 관리 및 Task 정리](https://trello.com/b/1E0mVL4Z/%EC%9A%B0%EB%A6%AC%EB%8F%99%EB%84%A4-%ED%91%B8%EB%93%9C%ED%8A%B8%EB%9F%AD-food-in-da-hood)
- Git, GitHub를 활용한 버전관리 및 협업
- Netlify(Client), Elastic Beanstalk(Server) 사용한 배포 관리
- Circle CI & AWS Pipeline 을 이용한 테스트, 배포 업무자동화 구현

## Inspiration and Philosophy

일반 매장의 경우 시장이 크기 때문에 여러 큰 기업에서 제공하는 서비스가 많지만 푸드트럭의 경우 상대적으로 시장이 적어
서비스가 없었다. 고객의 입장에서는 이동하는 푸드트럭의 영업정보를 알 수 있는 수단이 없고 먹고 싶을 때 찾아가서 먹을 수 있게 
도움을 주는 서비스가 있다면 좋겠다는 생각이 들었다. 트럭운영자의 입장에서도 일반 매장에 비해 홍보수단이 적고 고객과의 소통을 원하는
니즈가 있겠다고 판단했다.(현재 젊은 트럭운영자들 몇 곳만 인스타그램으로 각자 홍보중)
다행히도 서울시에서 제공하는 푸드트럭 공공api가 있어 기본 db 뼈대를 갖추고 서비스 제작을 진행했다.
두 명이서 프론트엔드, 백엔드로 나뉘어 진행했으며, 총괄관리는 한 명이 맡았다.

총괄관리 : [권기연](https://github.com/yeon0206)

프론트엔드 : [권기연](https://github.com/yeon0206)

백엔드 : [김동준](https://github.com/redant23)

디자인 : [김동준](https://github.com/redant23)

Special thanks to [Ken Huh](https://github.com/Ken123777)
