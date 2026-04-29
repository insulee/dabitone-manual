---
title: 파일 형식 개요
---

# 파일 형식 개요

DabitOne가 다루는 파일 포맷별 설명입니다. 사용자 관점에서 "어느 화면에서 만들어지는지, 어디에 저장되는지, 무엇을 담는지"에 초점을 둡니다.

## 포맷

- [DAT](/docs/file-formats/dat) — 텍스트 렌더링 결과 또는 이미지 비트맵. 전광판에 직접 표시되는 기본 단위
- [ANI](/docs/file-formats/ani) — 여러 DAT 프레임을 타이밍과 묶은 애니메이션
- [GIF](/docs/file-formats/gif) — 표준 GIF 포맷. DabitOne 내장 편집기로 제작·편집 가능
- [PLA](/docs/file-formats/pla) — 표시 스케줄(플레이리스트). DAT/ANI 항목과 효과 설정을 담음
- [BGP](/docs/file-formats/bgp) — 배경 스케줄. PLA와 유사하나 배경 전용
- [FNT](/docs/file-formats/fnt) — 컨트롤러 내장 폰트 파일(16×16 고정 픽셀)

## 저장 위치

기본 저장 위치는 사용자 문서 폴더 아래 `DabitOne\Data\`입니다. 프로젝트별로 하위 폴더를 만들어 관리하면 편합니다.
