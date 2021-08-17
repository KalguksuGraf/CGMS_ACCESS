# CGMS_ACCESS
-- fst made by KalguksuGraf(김태일)

// 2021.08.17
 policy CORS 우회 처리 완료
 Controller server = http://192.168.0.51:8081/ (서버 운영시간 평일 09:00 ~ 18:00)
 /*TODO*/
 1. 웹(chrome) 페이지에서 가로모드 미지원 수정필요
 2. 관리자(admin) 모듈 접근허용 필요
 3. 웹 기능시 d3 작동이상 수정 필요 (초기 로드시 데스크톱 환경에서 제대로 로드 되지 않음)
 
 /*김태일*/
 - 아래의 서버설정이후 http://127.0.0.1:8080 로 로드하시면 해당 디렉토리내 접근이 가능합니다
   현재 appGlu 예하의 html/js 파일만 접근이 가능한 상태입니다 추후 관리자 페이지도 수정해놓겠습니다
   /*접속방법*/
   [app_main/appGlu/page/us/login.html] 의 경로로 접속
   아이디 입력란에 'kyu' 입력후 "로그인"
   --메인대시보드 그래프 완료 (2020.05.13 데이터로 고정처리)
   --"리포트" 페이지 그래프 완료
   
   -- 참고 해야하는 소스 (d3 Graphics 기준)-- 
   /*메인 차트 [zoom 지원]*/
   /* dashboard.html [/app_main/appGlu/page/us/dashboard.html] -- 메인페이지 
   /* dashboard.js   [/app_main/appGlu/page/js/dashboard.js]   -- 291 라인부터 "selectCgmMainChart" CGM d3 Graphics draw
   /* cgmMainChart.js [/app_main/appGlu/js/chart/custom/cgmMainChart.js] --  d3 chart 메인소스



/*common heating https*/ 

--First download or update this project

* npm need
* npx load
- type this to 'cmd'
- go to code directory (EX) # cd C:\Users\as654\OneDrive\바탕 화면\cgms_main_grapy)

# npm install http-server -g

# npx http-server (is default PORT 8080)

-- access this = {http://127.0.0.1:8080}

but you need use other PORT dependence

type this 

# npm install http-server -g

# npx http-server -p {your want PORT}

-- access this = {http://127.0.0.1:{your want PORT}}
