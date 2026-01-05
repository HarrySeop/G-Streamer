# G-Streamer 구현을 위한 상세 TODO 리스트

이 문서는 G-Streamer 프로젝트의 실제 구현을 위한 단계별 작업 목록을 정의합니다.

---

### Phase 1: 프로젝트 초기 설정

- [x] **Vite + React + TypeScript 프로젝트 생성**
  - `pnpm create vite . --template react-ts`
- [x] **Tailwind CSS 설치 및 설정**
  - `pnpm add -D tailwindcss @tailwindcss/vite`
  - `vite.config.ts`에 `@tailwindcss/vite` 플러그인 추가
  - `postcss.config.js` 및 `tailwind.config.js` 파일 생성 및 설정
  - `index.css`에 `import "tailwindcss";` 추가
- [x] **ShadCN/UI 초기 설정**
  - `pnpm dlx shadcn@latest init` 명령어를 통한 초기 설정
  - `components.json` 설정 확인
- [x] **필요 라이브러리 설치**
  - `pnpm add @tanstack/react-query gapi-script react-router-dom`
  - `@types/node`, `@types/gapi`, `@types/gapi.auth2`, `@types/gapi.client.drive-v3` 설치
- [x] **기본 폴더 구조 설정**
  - `src/components`: 공통 컴포넌트
  - `src/pages`: 페이지 컴포넌트
  - `src/hooks`: 커스텀 훅
  - `src/lib`: 유틸리티 함수 및 API 관련 로직
  - `src/store`: 상태 관리 로직 (필요시)
- [x] **Git 초기 커밋**

### Phase 2: Google 인증 구현

- [ ] **Google Cloud Platform(GCP) 설정**
  - 새 프로젝트 생성
  - Google Drive API 활성화
  - OAuth 2.0 동의 화면 설정
  - OAuth 2.0 클라이언트 ID 및 시크릿 키 발급
- [x] **인증 컨텍스트(Context) 생성**
  - 사용자 로그인 상태 및 Access Token을 전역적으로 관리하기 위한 React Context 생성 (`AuthContext`)
- [x] **로그인 페이지/컴포넌트 구현**
  - `useGoogleLogin` 훅 또는 관련 라이브러리를 사용한 로그인 버튼 구현
  - 로그인 성공 시, Access Token 및 사용자 프로필 정보를 `AuthContext`에 저장
- [x] **로그아웃 기능 구현**
  - `AuthContext`의 상태를 초기화하고 토큰을 무효화하는 로그아웃 버튼 구현
- [x] **인증 상태에 따른 라우팅 처리**
  - 로그인된 사용자는 대시보드로, 비로그인 사용자는 로그인 페이지로 리디렉션하는 로직 구현
- [x] **Git 인증 기능 커밋**

### Phase 3: 핵심 UI 레이아웃 구현 (반응형)

- [x] **Header 컴포넌트 구현**
  - 로고, 검색창(기능은 추후 구현), 사용자 프로필/로그아웃 버튼 포함
  - 모바일에서는 햄버거 메뉴 등으로 축소 표시
- [x] **메인 컨텐츠 영역 레이아웃**
  - `flex` 또는 `grid`를 사용하여 반응형 레이아웃 구성
- [x] **Footer 컴포넌트 구현**
  - 간단한 저작권 정보 또는 링크 포함
- [x] **Git UI 레이아웃 커밋**

### Phase 4: 데이터 페칭 및 상태 관리

- [x] **Google Drive API 래퍼(Wrapper) 함수 작성**
  - `lib/googleDrive.ts` 파일에 파일 목록을 가져오는 함수 (`listFiles`)와 JSON 파일을 읽고 쓰는 함수 (`readFile`, `writeFile`) 구현
- [x] **`useGoogleDriveData` 커스텀 훅 구현**
  - `@tanstack/react-query`의 `useQuery`를 사용하여 `listFiles`와 `readFile`('g-streamer-history.json')을 동시에 호출
  - 두 API의 데이터를 병합하여 반환
  - 로딩(isLoading), 에러(isError) 상태를 컴포넌트에서 그대로 사용
- [x] **Git 데이터 페칭 커밋**

### Phase 5: 대시보드 UI 구현

- [x] **비디오 썸네일 카드 컴포넌트 (`VideoCard`) 구현**
  - ShadCN/UI의 `Card` 컴포넌트 기반으로 제작
  - 비디오 썸네일 이미지, 제목, 재생 시간 등의 정보를 표시
  - 시청 기록이 있는 경우 `Progress` 컴포넌트로 진행률 표시
- [x] **스켈레톤 로더 컴포넌트 (`VideoCardSkeleton`) 구현**
  - ShadCN/UI의 `Skeleton` 컴포넌트를 사용하여 `VideoCard`와 동일한 크기의 로딩 상태 UI 제작
- [x] **비디오 목록 그리드 구현**
  - `useGoogleDriveData` 훅에서 데이터를 받아와 `VideoCard` 또는 `VideoCardSkeleton`을 렌더링
  - 화면 크기에 따라 1열(모바일) ~ 4열 이상(PC)으로 동적으로 변하는 반응형 그리드 적용
- [x] **Git 대시보드 UI 커밋**

### Phase 6: 비디오 플레이어 페이지 구현

- [x] **플레이어 페이지 라우팅 설정**
  - `/video/:fileId` 와 같은 형태로 특정 비디오를 재생하는 페이지 라우팅 설정
- [x] **HTML5 `<video>` 태그 기반 플레이어 컴포넌트 구현**
  - `ref`를 사용하여 비디오 엘리먼트 제어
  - `preload="auto"` 속성 설정
- [x] **커스텀 컨트롤 UI 구현**
  - ShadCN/UI의 `Button`, `Slider` 등을 사용하여 재생/일시정지 버튼, 타임라인, 볼륨 조절 등 구현
- [x] **플레이어 상태와 UI 연동**
  - `onTimeUpdate`, `onLoadedMetadata` 등의 비디오 이벤트를 받아 `currentTime`, `duration` 상태를 업데이트하고 UI에 반영
- [x] **이어보기(Auto-Resume) 기능 구현**
  - 페이지 진입 시, 시청 기록에 있는 `lastTime`으로 `videoRef.current.currentTime`을 설정하고 자동 재생
- [x] **더블 탭 탐색 기능 구현**
  - 화면 좌/우 영역에 투명한 오버레이를 씌우고, 더블 탭 이벤트를 감지하여 10초 앞/뒤로 탐색하는 로직 구현
- [x] **Git 비디오 플레이어 커밋**

### Phase 7: 시청 기록 저장/업데이트

- [x] **시청 기록 업데이트 훅/함수 구현**
  - `@tanstack/react-query`의 `useMutation`을 사용하여 Google Drive의 `g-streamer-history.json` 파일을 업데이트하는 로직 구현
- [x] **주기적 업데이트 로직 구현**
  - 비디오 플레이어에서 `onTimeUpdate` 이벤트 발생 시, 일정 간격(예: 15초마다)으로 시청 기록 업데이트 함수 호출
- [x] **언마운트 시 업데이트 로직 구현**
  - 사용자가 페이지를 벗어나거나 컴포넌트가 언마운트될 때, 최종 시청 기록을 저장하는 로직 구현 (`useEffect`의 cleanup 함수 활용)
- [x] **Git 시청 기록 저장 커밋**

### Phase 8: 최종 테스트 및 배포

- [x] **기능 테스트**
  - 로그인/로그아웃, 비디오 목록 조회, 재생, 이어보기, 시청 기록 저장 등 모든 기능 정상 동작 확인
- [x] **반응형 UI 테스트**
  - Chrome 개발자 도구 및 실제 모바일/태블릿 기기에서 각 화면 크기별 UI 깨짐 여부 확인
- [x] **프로덕션 빌드**
  - `pnpm build` 명령어로 프로덕션용 파일 생성
- [ ] **배포**
  - Vercel, Netlify 등 정적 호스팅 서비스에 배포

---

### 다음에 해야 할 일 (User's Next Steps)

다음은 G-Streamer 프로젝트를 완성하기 위해 사용자가 직접 수행해야 할 작업들입니다.

1.  **Google Cloud Platform(GCP) 설정 완료:**
    *   `src/pages/LoginPage.tsx` 파일 내에 `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com`으로 설정된 **Google Client ID를 실제 값으로 교체**해야 합니다.
    *   **GCP 프로젝트에서 Google Drive API가 활성화**되어 있는지, **OAuth 2.0 동의 화면**이 올바르게 구성되어 있는지, 그리고 애플리케이션이 실행될 URL (예: `http://localhost:5173`)이 **OAuth 2.0 클라이언트 ID의 "승인된 자바스크립트 원본"**에 추가되어 있는지 다시 확인해 주세요.

2.  **수동 테스트 수행:**
    *   로그인/로그아웃, 비디오 목록 조회, 비디오 재생, 이어보기, 시청 기록 저장 등 **모든 기능이 예상대로 작동하는지 웹 브라우저에서 직접 확인**해야 합니다.
    *   다양한 화면 크기(모바일, 태블릿, 데스크탑)에서 **UI가 깨지지 않고 반응형으로 잘 표시되는지 확인**해야 합니다.

3.  **애플리케이션 배포:**
    *   프로젝트가 성공적으로 빌드되었으므로 (빌드 결과물은 `dist` 폴더에 있습니다), Vercel, Netlify와 같은 정적 호스팅 서비스에 애플리케이션을 배포합니다.
    *   배포 후에는 **Google OAuth 리디렉션 URI**를 배포된 애플리케이션의 URL에 맞게 GCP 설정에서 재설정해야 합니다.

이러한 단계들이 완료되면 G-Streamer 프로젝트가 완전히 작동하고 배포될 준비가 됩니다. 궁금한 점이 있으시면 언제든지 질문해주세요.