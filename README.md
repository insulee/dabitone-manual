# DabitOne 매뉴얼 사이트

**URL**: https://dabitone.dabitsol.com
**구성**: `/` 원페이지 소개, `/quickstart/*` 투어, `/docs/*` 매뉴얼
**호스팅**: GitHub Pages (`.github/workflows/deploy.yml`)

## 로컬 빌드

```powershell
cd D:\GitHub\dabitone-manual
npm ci
npm run build
npm run verify:serve
# http://localhost:8888
```

`tour/src`나 `tour/data`만 빠르게 확인할 때는 `npm run build:tour`를 실행합니다. 이 명령은 `quartz/static/tour`와 기존 `public/static/tour`를 같이 갱신합니다.

## 자동 배포

```powershell
pwsh -ExecutionPolicy Bypass -File scripts/auto-deploy.ps1
```

watcher는 `content`, `tour`, `quartz`, 주요 설정 파일 변경을 감지해 `scripts/deploy.sh`를 실행합니다. `deploy.sh`는 CI와 같은 `npm run build`를 수행한 뒤 관련 소스를 커밋하고 `main`에 push합니다.

## 주요 스크립트

| 명령                                 | 역할                                                             |
| ------------------------------------ | ---------------------------------------------------------------- |
| `npm run build:tour`                 | Preact quickstart 번들 생성 및 local `public/static/tour` 미러링 |
| `npm run build`                      | 폰트 복사, tour 번들, Quartz 정적 사이트 빌드                    |
| `npm run verify:serve`               | `public`을 `localhost:8888`로 서빙                               |
| `node scripts/verify-quickstart.mjs` | quickstart 화면/핫스팟 확인용 스크린샷 생성                      |
| `node scripts/capture-pages.mjs`     | 라이브 사이트 주요 경로 캡처                                     |

## 배포 경로

GitHub Actions는 push 후 `npm ci → npm run build:tour → npx quartz build → public 업로드` 순서로 배포합니다. `public/`은 빌드 산출물이며 커밋 대상이 아닙니다.
