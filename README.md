# github_visualization

깃헙을 시각화로 배울 수 있는 오픈소스 프로젝트

## 참고 프로젝트

- [learngitbranching](https://learngitbranching.js.org/?locale=ko)
- [Git Command Explorer](https://git.gaozih.com/)

## 오픈소스 목적

깃헙 프로세스를 시각화 하여 보다 쉽게 GitHub을 이해하고 활용할 수 있도록 돕는 프로젝트입니다. 기초 명령어만 지원하며 고급 명령어를 지원하지 않습니다.

## 오픈소스 목표

1. add, commit, push, pull, clone, init, status, log, branch, checkout, amend 명령어를 시각화 합니다.
2. Working Directory, Staging Area, Local Repository, Remote Repository의 개념을 시각화 합니다. 지금은 Working Directory, Staging Area 2개의 개념만 텍스트로 보여주고 있는데 시각화 하여 보여줄 예정입니다.
3. 명령어를 CLI로 입력하는 기능을 추가합니다. 지금은 버튼을 클릭하여 명령어를 실행하도록 되어 있습니다.
4. 실행했던 명령어는 누적하여 실행합니다.
5. 초기화 버튼을 누르면 초기화 되도록 합니다.
6. 오류가 나오면 실제 오류 메시지를 보여주고, 한국어로 쉽게 이해할 수 있도록 쉽게 번역해서 알려주며, 이 애러 메시지에 대한 해결 방법도 제시합니다.
7. 다운로드 버튼을 누르면 현재까지의 작업을 다운로드 받을 수 있도록 합니다. 애러메시지, 한국어 번역, 애러 메시지 해결까지 모두 다운로드 됩니다.
8. 튜토리얼을 제공합니다.

## 정기 회의 날짜

수요일 저녁 8시

## 프로젝트 기간

- 2024년 6월 26일 ~ 2024년 8월 15일
- 프로젝트 파악 기간: 2024년 6월 26일 ~ 2024년 7월 5일
- 디자인: 2024년 6월 26일 ~ 2024년 7월 5일
- 디자인 구현: 2024년 7월 11일 ~ 2024년 7월 23일
- 명령어 개발: 2024년 7월 17일 ~ 2024년 7월 23일
- 기능구현: 2024년 7월 23일 ~ 2024년 8월 15일
- 문서화 및 튜토리얼 개발: 2024년 6월 26일 ~ 2024년 8월 15일
- 프로젝트 리뷰기간: 2024년 8월 15일 ~ 2024년 8월 22일

## 팀 분할

### 디자인팀

- 팀원 : 진승현, 황수범, 이진희
- 과업:
  - `1.` UI 디자인
  - `2.` UI 디자인 구현(HTML, CSS)

### 명령어 개발팀

- 팀원: 김민서, 김현수, 이서림, 이성재, 정성훈, 홍성원, 황수범
- 과업:
  - `3.` Working Directory, Staging Area, Local Repository, Remote Repository의 개념을 시각화
  - `4.` clone 명령어 구현
  - `5.` push, pull 명령어 구현(지금은 push 되었습니다만 뜹니다. Remote Repository에 push되도록 구현)
  - `6.` branch, checkout 명령어 구현
  - `7.` (선택 구현)amend, merge 명령어 구현
  - `8.` D3 시각화 구현

### 기능구현 개발팀

- 팀원: 정성훈, 박재영, 홍성원
- 과업:
  - `9.` CLI 구현
  - `10.` 실행했던 명령어 누적 구현, 다운로드 구현

### 문서화 및 튜토리얼 개발팀

- 팀원: 장유주, 지명진, 이성재, 이민서, 강지혜, 윤혜림, 이다빈
- 과업:
  - 오류메시지, 한국어 번역, 해결 방안 제시 구현(JSON 형태로 구현)
  - 튜토리얼 구현(JSON 형태로 구현)
  - hover 했을 때 나오는 메시지 구현

## 폴더와 파일 구조 및 목적

```
github_visualization(root)
 ┣ css
 ┃ ┣ components.css         →
 ┃ ┣ reset.css              →
 ┃ ┗ style.css              →
 ┣ images
 ┃ ┣ git_logo.svg           →   Git 로고
 ┃ ┣ ico_download.svg       →   다운로드 아이콘
 ┃ ┣ ico_help.svg           →   도움말 아이콘
 ┃ ┗ ico_refresh.svg        →   새로고침 아이콘
 ┣ js
 ┃ ┣ cmd_en_explain.json    →   Git 명령어 설명을 영문으로 작성
 ┃ ┣ cmd_error.json         →   Git 에러메시지 해석과 해결 방안을 작성
 ┃ ┣ cmd_ko_explain.json    →   Git 명령어 설명을 한국어로 작성
 ┃ ┣ gitCommands.js         →
 ┃ ┣ main.js                →
 ┃ ┣ tutorial.json          →   Git 명령어를 연습할 수 있는 튜토리얼 작성
 ┃ ┗ visualizer.js          →
 ┣ CNAME
 ┣ index.html               →
 ┗ README.md                →
```

## 오픈소스 기여자

- 강지혜
- 김민서
- 김현수
- 박재영
- 이다빈
- 이민서
- 이서림
- 이성재
- 이진희
- 이호준
- 윤혜림
- 진승현
- 정성훈
- 장유주
- 홍성원
- 황수범

## 도메인

- https://lookgit.com/

## 회의록

- 7월 10일

```
1. UI에서 후자로 선택하는 것으로 얘기되었습니다.
2. main을 색을 칠하지 않는 것이 좋을 것 같은데 굳이 색을 꼭 입혀야 한다면 짙은 회색으로 입히는 것으로 하겠습니다.
3. merge 색을 보라색으로 입히는 것
4. 한땀한땀 개발하실 때 이미 그 한땀으로도 배포가 가능하게 해주셨으면 좋겠습니다. 중간에 기술적 난이도가 확 올라가서 여러분에게 큰 부담이 되길 원하지 않습니다.
5. git clone 명령어는 git clone URL로 정리하겠습니다.
6. git clone 명령어는 main + 2개 브랜치 정도가 복사되게 해오는 튜토리얼로 진행
7. 모든 팀에서 다국어를 고려한 코드를 짜주시고, 부담되면 한국어만 해두세요.
8. 도움말은 버튼으로 만들고 처음 접속에는 보이고 그 다음에는 안보이게(같은 PC 로컬스토리지 저장)
```

- 7월 17일

```
1. 디자인 팀 퍼블리싱 주말에 최대한 시간내서 하기로 이야기했습니다.
2. 명령어 개발팀은 클래스 네임이 다 나오기 전에 각자 맡은 파트에 대한 의사코드 작성 후 그에 대한 공부를 진행하고 클래스 네임 나오자마자 준비하는 것이 좋을 것 같습니다.
3. 디자인 팀에서 클래스 네이밍 규칙에 대한 방안으로 BEM 제시했습니다.
4. 에러 메세지를 좀 추려보는 것이 좋을 것 같습니다.
5. 명령어 사전 및 기록을 나누고 기록의 커맨드 description을 제거하고 명령어 사전에서만 보이도록 하는 것으로 하였습니다.
```

- 7월 24일

```
1. d3 좀 더 봐야할 것 같습니다
2. 명령어는 전 단계 기다리는 것이 아닌 동시에 진행하는게 맞을 것 같습니다.
3. 기능구현 개발팀 빠른 시일 내에 회의 후 진행하는 것으로 하겠습니다.
4. 문서화 및 튜토리얼 개발팀 json 4개 명령어 사전(+영어버전), 에러메세지, 튜토리얼이 되었습니다.
5. git stash도 추가하는 것이 좋을까라는 의견이 나왔습니다.
6. 튜토리얼을 사용할 때 모바일보다는 pc에 집중하는 것이 좋겠습니다.
7. 명령어 - 튜토리얼 json 합치기로 했습니다.
8. 모든 명령어 개발팀에서 제작하는 json파일명에 cmd_ ... 형태로 작성하기로 하였습니다.
```

- 7월 31일

```
1. 지난 회의에서 명령어 - 튜토리얼 json 합치기로 하였는데 튜토리얼에 설명을 상세하게 적으면서 다시 분리하기로 하였습니다.
2. 용어에 대한 설명은 지금 단계에선 크게 신경쓰지 않는 것으로 하였습니다.
3. Local, Remote 레포지토리에서 보여지는 로그들은 git log에 나오는 정보들을 집어넣는 것이 맞다는 의견이 나왔습니다.
4. 폴더 구조 + 파일 목적 README.md에 적기로 하였습니다.
```

## 컨벤션

- WIKI를 참고해주세요.
- Trunk flow를 따라갑니다. 그러나 팀에 따라서 GitHub flow 등 다양한 flow를 별도로 적용할 수 있습니다.
