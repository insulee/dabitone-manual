/**
 * embed-reference-images.mjs — reference md의 H1 제목 다음에 크롭 이미지 embed.
 *
 * 이미 embed 있으면 skip (idempotent).
 */

import { readFile, writeFile } from "fs/promises"

const MAPPING = [
  { file: "content/ui-reference/01-communication/serial.md", image: "/assets/screens/reference/comm-serial.png", alt: "Serial 통신 설정 UI" },
  { file: "content/ui-reference/01-communication/tcp.md", image: "/assets/screens/reference/comm-tcp-client.png", alt: "TCP/IP 통신 설정 UI" },
  { file: "content/ui-reference/01-communication/udp.md", image: "/assets/screens/reference/comm-udp.png", alt: "UDP 통신 설정 UI" },
  { file: "content/ui-reference/01-communication/ble.md", image: "/assets/screens/reference/comm-ble-mqtt.png", alt: "BLE/MQTT 영역" },
  { file: "content/ui-reference/01-communication/mqtt.md", image: "/assets/screens/reference/comm-ble-mqtt.png", alt: "BLE/MQTT 영역" },
  { file: "content/ui-reference/01-communication/dbnet.md", image: "/assets/screens/reference/comm-dbnet.png", alt: "dbNet 설정 UI" },
  { file: "content/ui-reference/02-settings/screen-size.md", image: "/assets/screens/reference/settings-screen-size.png", alt: "전광판 화면 구성 UI" },
  { file: "content/ui-reference/02-settings/display-signal.md", image: "/assets/screens/reference/settings-display-signal.png", alt: "표출신호 설정 UI" },
  { file: "content/ui-reference/02-settings/font.md", image: "/assets/screens/reference/settings-font.png", alt: "폰트 전송 UI" },
  { file: "content/ui-reference/03-transfer/message.md", image: "/assets/screens/reference/transfer-message.png", alt: "메시지 전송 UI" },
  { file: "content/ui-reference/03-transfer/page.md", image: "/assets/screens/reference/transfer-page.png", alt: "페이지 메시지 UI" },
  { file: "content/ui-reference/03-transfer/brightness.md", image: "/assets/screens/reference/transfer-brightness.png", alt: "밝기 UI" },
  { file: "content/ui-reference/03-transfer/power.md", image: "/assets/screens/reference/transfer-power.png", alt: "전광판 켜기/끄기 UI" },
  { file: "content/ui-reference/03-transfer/background.md", image: "/assets/screens/reference/transfer-background.png", alt: "배경이미지 UI" },
  { file: "content/ui-reference/05-advanced/time.md", image: "/assets/screens/reference/advanced-time.png", alt: "시간 설정 UI" },
  { file: "content/ui-reference/05-advanced/board-settings.md", image: "/assets/screens/reference/advanced-board.png", alt: "보드 기능 설정 UI" },
  { file: "content/ui-reference/05-advanced/firmware.md", image: "/assets/screens/reference/advanced-firmware.png", alt: "펌웨어 업데이트 UI" },
]

async function embed(m) {
  let txt
  try {
    txt = await readFile(m.file, "utf-8")
  } catch (e) {
    console.warn(`! ${m.file}: 파일 없음 (skip)`)
    return "skip"
  }
  // 이미 이미지 embed돼있으면 skip (idempotent)
  const imgTag = `](${m.image})`
  if (txt.includes(imgTag)) {
    console.log(`○ ${m.file}: 이미 embed됨`)
    return "already"
  }
  // H1 라인 찾기 (front matter 후)
  const lines = txt.split("\n")
  let h1Idx = -1
  let fmEnd = -1
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === "---") {
      if (fmEnd === -1 && i === 0) {
        // front matter 시작
        continue
      }
      if (fmEnd === -1) {
        fmEnd = i
      }
    }
    if (fmEnd !== -1 && i > fmEnd && lines[i].startsWith("# ")) {
      h1Idx = i
      break
    }
  }
  if (h1Idx === -1) {
    console.warn(`! ${m.file}: H1 찾기 실패 (skip)`)
    return "skip"
  }
  // H1 다음 빈 줄(있음) 뒤에 이미지 삽입
  // pattern: [H1] \n [empty] \n [next content]
  //                     ^ 여기 삽입
  let insertAfter = h1Idx + 1
  if (lines[insertAfter]?.trim() === "") {
    insertAfter += 1
  }
  lines.splice(
    insertAfter,
    0,
    `![${m.alt}](${m.image})`,
    "",
  )
  const out = lines.join("\n")
  await writeFile(m.file, out, "utf-8")
  console.log(`✓ ${m.file}`)
  return "ok"
}

async function main() {
  let ok = 0,
    already = 0,
    skipped = 0
  for (const m of MAPPING) {
    const r = await embed(m)
    if (r === "ok") ok++
    else if (r === "already") already++
    else skipped++
  }
  console.log(`\n결과: ${ok} 추가, ${already} 기존, ${skipped} skip / 총 ${MAPPING.length}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
