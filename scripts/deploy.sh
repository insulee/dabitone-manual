#!/bin/bash
# DabitOne Manual — deploy script
# 사용법: bash deploy.sh (auto-deploy.ps1에서 호출됨)

set -e

MANUAL_DIR="D:/GitHub/dabitone-manual"
REPO_DIR="D:/GitHub/dabitone-manual"
BRANCH="main"

echo "=== DabitOne Manual 배포 시작 ==="

cd "$MANUAL_DIR"

echo "[1/2] 전체 빌드..."
npm run build

echo "[2/2] Git add/commit/push..."
cd "$REPO_DIR"

PATHS=(
    content
    tour
    quartz
    scripts
    .github/workflows
    package.json
    package-lock.json
    quartz.config.ts
    quartz.layout.ts
    README.md
)

if [ -n "$(git status --short -- "${PATHS[@]}")" ]; then
    git add -- "${PATHS[@]}"
    git commit -m "docs(manual): auto-update $(date +%Y-%m-%d_%H:%M:%S)"
    git push origin "$BRANCH"
    echo "=== 배포 완료! ==="
    echo "사이트: https://dabitone.dabitsol.com (GitHub Pages 빌드 후 수 분 내 반영)"
else
    echo "=== 변경 없음, 배포 스킵 ==="
fi
