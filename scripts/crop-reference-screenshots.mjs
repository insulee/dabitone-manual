/**
 * crop-reference-screenshots.mjs — sharp로 reference 스크린샷 크롭.
 *
 * 사용법: node scripts/crop-reference-screenshots.mjs
 *
 * 원본: content/assets/screens/manual-poc/main-*.png (1422×1386)
 * 산출: content/assets/screens/reference/<name>.png (각 reference 페이지용)
 *
 * 좌표는 이미지 분석 기반 추정. 결과 확인 후 조정 가능.
 */

import sharp from "sharp"
import { mkdir } from "fs/promises"
import { join } from "path"

const SRC = "content/assets/screens/manual-poc"
const OUT = "content/assets/screens/reference"

const CROPS = [
  // Communication (main-comm.png)
  { out: "comm-serial.png", src: "main-comm.png", x: 130, y: 130, w: 340, h: 260 },
  { out: "comm-tcp-client.png", src: "main-comm.png", x: 130, y: 410, w: 340, h: 200 },
  { out: "comm-tcp-server.png", src: "main-comm.png", x: 130, y: 635, w: 340, h: 135 },
  { out: "comm-udp.png", src: "main-comm.png", x: 130, y: 790, w: 340, h: 145 },
  { out: "comm-ble-mqtt.png", src: "main-comm.png", x: 130, y: 960, w: 340, h: 50 },
  { out: "comm-dbnet.png", src: "main-comm.png", x: 475, y: 130, w: 460, h: 900 },

  // Settings (main-setup.png)
  { out: "settings-screen-size.png", src: "main-setup.png", x: 130, y: 120, w: 620, h: 180 },
  { out: "settings-display-signal.png", src: "main-setup.png", x: 130, y: 300, w: 620, h: 760 },
  { out: "settings-font.png", src: "main-setup.png", x: 790, y: 100, w: 600, h: 900 },

  // Transfer (main-simulator.png)
  { out: "transfer-message.png", src: "main-simulator.png", x: 130, y: 130, w: 870, h: 900 },
  { out: "transfer-page.png", src: "main-simulator.png", x: 1030, y: 130, w: 360, h: 160 },
  { out: "transfer-brightness.png", src: "main-simulator.png", x: 1030, y: 290, w: 360, h: 180 },
  { out: "transfer-power.png", src: "main-simulator.png", x: 1030, y: 420, w: 360, h: 140 },
  { out: "transfer-background.png", src: "main-simulator.png", x: 1030, y: 540, w: 360, h: 130 },

  // Advanced (main-advanced.png)
  { out: "advanced-time.png", src: "main-advanced.png", x: 130, y: 130, w: 390, h: 140 },
  { out: "advanced-board.png", src: "main-advanced.png", x: 130, y: 290, w: 390, h: 480 },
  { out: "advanced-firmware.png", src: "main-advanced.png", x: 560, y: 130, w: 730, h: 570 },
  { out: "advanced-buttons.png", src: "main-advanced.png", x: 1300, y: 130, w: 110, h: 620 },
]

async function main() {
  await mkdir(OUT, { recursive: true })
  for (const c of CROPS) {
    const srcPath = join(SRC, c.src)
    const outPath = join(OUT, c.out)
    try {
      await sharp(srcPath)
        .extract({ left: c.x, top: c.y, width: c.w, height: c.h })
        .toFile(outPath)
      console.log(`✓ ${c.out} (from ${c.src}, ${c.w}×${c.h} @ ${c.x},${c.y})`)
    } catch (e) {
      console.error(`✗ ${c.out}: ${e instanceof Error ? e.message : e}`)
    }
  }
  console.log(`\nTotal: ${CROPS.length} crops → ${OUT}/`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
