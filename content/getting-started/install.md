---
title: 설치
description: "DabitONe 다운로드·설치 절차·첫 실행 — 5분 이내"
last_updated: 2026-04-21
---

# 설치

> [!abstract] TL;DR
> - 다빛솔루션 공식 사이트에서 DabitONe 설치 파일 다운로드
> - **기존 DabitChe와 별도 설치**되어 공존 가능
> - 설치 후 첫 실행 시 좌측 **[통신]** 탭에서 바로 연결 시도

## 시스템 요구사항

| 항목 | 최소 | 권장 |
|------|-----|-----|
| OS | Windows 10 (64비트) | Windows 11 |
| 메모리 | 4 GB | 8 GB 이상 |
| 디스크 | 500 MB 여유공간 | 2 GB |
| 디스플레이 | 1366 × 768 | 1920 × 1080 |
| .NET | 자동 설치 | — |

> [!warning] Windows 7·8은 지원하지 않습니다. 해당 환경이라면 기존 DabitChe를 유지하시거나 OS 업그레이드가 필요합니다.

## 다운로드

1. **[다빛솔루션 공식 사이트](https://www.dabitsol.com)** 또는 구매처에서 안내받은 URL에서 **DabitONe 설치 파일** 다운로드
2. 다운로드 파일명: `DabitONe-Setup-x.x.x.exe`
3. 파일 크기: 약 150 MB (변동 가능)

## 설치 절차

1. 다운로드한 `.exe`를 **우클릭 → 관리자 권한으로 실행**
2. Windows 보안 경고가 뜨면 **[추가 정보] → [실행]** (코드 서명된 설치 파일)
3. 설치 마법사 안내에 따라 진행:
   - 설치 경로 (기본: `C:\Program Files\DabitONe\`)
   - 시작 메뉴 바로가기
   - 바탕화면 아이콘 (선택)
4. "설치 완료" 화면에서 **[DabitONe 실행]** 체크 상태로 종료
5. 처음 실행 시 Windows Defender 방화벽 허용 팝업이 뜨면 **[허용]**

### 기존 DabitChe와의 관계

- **별도 설치**되어 공존 가능 — 예전 버전 그대로 유지되며 DabitONe은 `C:\Program Files\DabitONe\`에 새로 설치됩니다.
- 양쪽 모두 **기존 프로젝트 파일**을 읽을 수 있으므로 익숙해질 때까지 병행 사용 가능.
- 완전히 이관 후 DabitChe는 제어판에서 삭제하셔도 됩니다.

## 첫 실행

1. 바탕화면 또는 시작 메뉴에서 **DabitONe** 아이콘 클릭
2. 실행되면 좌측 사이드바 맨 위의 **[통신]** 탭이 기본 선택된 상태로 뜹니다
3. 여기서부터는 → [/tour/quickstart/01-first-connection/](/tour/quickstart/01-first-connection/) 투어가 안내

## 제거

제어판 → 앱 → DabitONe → 제거. 사용자 설정·프로젝트 파일은 `C:\Users\<사용자>\Documents\DabitONe\`에 별도 보관되어 제거해도 안전.

완전 삭제를 원하면 위 폴더도 수동 삭제.

## 관련 페이지

- [[getting-started/overview|전체 화면 구조]] — 5 그룹 사이드바 개요
- [/tour/](/tour/) — 인터랙티브 체험 투어
- [[troubleshooting/01-connection|연결이 안 될 때]]
