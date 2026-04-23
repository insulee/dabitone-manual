/**
 * 랜딩 페이지 — 안 Playground (Interactive Playground, 2026-04-23).
 * /tour7/ 경로 전용. Hero + 3 미니 데모 (연결 테스트, dbNet 검색, HEX↔ASCII 변환) + End CTA.
 *
 * 디자인 테시스: 랜딩은 작은 DabitOne 체험. 각 기능의 feel을 클릭·입력으로 즉시 확인.
 * B2B 바이어가 '읽기·스크롤·클릭' 퍼널 대신 '클릭·시도'로 바로 시작.
 *
 * 참조: Arc /max, Figma file preview, Typefully editor demo, Linear demo sections.
 */
import { useEffect, useState } from "preact/hooks"

export function LandingPlayground() {
  useEffect(() => {
    document.body.classList.add("tour7-page")
    return () => {
      document.body.classList.remove("tour7-page")
    }
  }, [])

  return (
    <div class="tour7-shell">
      <HeroSection />
      <Demo01Connection />
      <Demo02DbNet />
      <Demo03HexAscii />
      <EndSection />
    </div>
  )
}

function HeroSection() {
  return (
    <section class="tour7-hero">
      <p class="tour7-hero__eyebrow">DABITONE PLAYGROUND</p>
      <h1 class="tour7-hero__title">읽지 말고 써보세요.</h1>
      <p class="tour7-hero__sub">
        아래 세 가지 미니 데모로 DabitOne의 핵심 기능을 직접 체험합니다. 실제 앱은 Windows
        데스크톱에서 동작합니다.
      </p>
      <div class="tour7-hero__cta">
        <a class="tour-btn tour-btn--primary" href="#demo01">
          시작하기 →
        </a>
        <a
          class="tour-btn tour-btn--secondary"
          href="https://www.dabitsol.com"
          target="_blank"
          rel="noreferrer"
        >
          DabitOne 다운로드
        </a>
      </div>
      <p class="tour7-hero__hint">↓ 아래로 스크롤 · 또는 섹션 클릭</p>
    </section>
  )
}

type ConnectState = "idle" | "testing" | "success" | "warning" | "error"
function Demo01Connection() {
  const [method, setMethod] = useState<"serial" | "tcp" | "udp">("serial")
  const [state, setState] = useState<ConnectState>("idle")
  const [rt, setRt] = useState(0)

  function test() {
    setState("testing")
    setTimeout(() => {
      const r = Math.random()
      if (r < 0.6) {
        setState("success")
        setRt(Math.floor(Math.random() * 8) + 2)
      } else if (r < 0.85) {
        setState("warning")
      } else {
        setState("error")
      }
    }, 800)
  }
  function reset() {
    setState("idle")
  }

  return (
    <section class="tour7-demo" id="demo01">
      <div class="tour7-demo__header">
        <p class="tour7-demo__eyebrow">DEMO 01</p>
        <h2 class="tour7-demo__title">컨트롤러 연결.</h2>
      </div>
      <div class="tour7-demo__panel">
        <div class="tour7-demo__controls">
          <fieldset class="tour7-fieldset">
            <legend>연결 방식</legend>
            <label class="tour7-radio">
              <input
                type="radio"
                name="method"
                checked={method === "serial"}
                onChange={() => setMethod("serial")}
              />
              <span>Serial</span>
            </label>
            <label class="tour7-radio">
              <input
                type="radio"
                name="method"
                checked={method === "tcp"}
                onChange={() => setMethod("tcp")}
              />
              <span>Client TCP/IP</span>
            </label>
            <label class="tour7-radio">
              <input
                type="radio"
                name="method"
                checked={method === "udp"}
                onChange={() => setMethod("udp")}
              />
              <span>UDP</span>
            </label>
          </fieldset>

          {method === "serial" ? (
            <div class="tour7-demo__fields">
              <label class="tour7-field">
                <span>포트</span>
                <select>
                  <option>COM1</option>
                  <option>COM2</option>
                  <option>COM3</option>
                  <option>COM4</option>
                  <option>COM5</option>
                  <option>COM6</option>
                </select>
              </label>
              <label class="tour7-field">
                <span>속도</span>
                <select>
                  <option>9600</option>
                  <option>19200</option>
                  <option selected>115200</option>
                </select>
              </label>
            </div>
          ) : (
            <div class="tour7-demo__fields">
              <label class="tour7-field">
                <span>IP</span>
                <input type="text" defaultValue="192.168.0.201" />
              </label>
              <label class="tour7-field">
                <span>Port</span>
                <input type="text" defaultValue={method === "tcp" ? "5000" : "5108"} />
              </label>
            </div>
          )}

          <div class="tour7-demo__actions">
            <button
              class="tour-btn tour-btn--primary"
              onClick={test}
              disabled={state === "testing"}
            >
              {state === "testing" ? "테스트 중..." : "[ 연결 테스트 ]"}
            </button>
            {state !== "idle" && state !== "testing" && (
              <button class="tour-btn tour-btn--secondary" onClick={reset}>
                재시도
              </button>
            )}
          </div>

          {state === "success" && (
            <div class="tour7-toast tour7-toast--ok" role="status" aria-live="polite">
              ● 연결 성공 · 응답 {rt}ms
            </div>
          )}
          {state === "warning" && (
            <div class="tour7-toast tour7-toast--warn" role="status" aria-live="polite">
              ◐ 응답 없음 · 케이블·속도 재확인
            </div>
          )}
          {state === "error" && (
            <div class="tour7-toast tour7-toast--err" role="status" aria-live="polite">
              ● 연결 실패 · 포트 점유
            </div>
          )}
        </div>
        <aside class="tour7-demo__note">
          <p>Serial·TCP·UDP 라디오로 방식 선택 → 파라미터 입력 → 연결 테스트.</p>
          <p>
            실제 앱에서는 토스트 색으로 즉시 상태 구분 · 실패 시 상세 로그가 하단 패널에
            기록됩니다.
          </p>
        </aside>
      </div>
    </section>
  )
}

type DbNetState = "idle" | "scanning" | "found"
function Demo02DbNet() {
  const [state, setState] = useState<DbNetState>("idle")
  const [selected, setSelected] = useState(-1)

  const controllers = [
    { mac: "00:1A:2B:3C:4D:5E", ip: "192.168.0.201", name: "LED01" },
    { mac: "00:1A:2B:3C:4D:5F", ip: "192.168.0.202", name: "LED02" },
    { mac: "00:1A:2B:3C:4D:60", ip: "192.168.0.203", name: "LED03" },
  ]

  function scan() {
    setState("scanning")
    setSelected(-1)
    setTimeout(() => setState("found"), 1200)
  }
  function reset() {
    setState("idle")
    setSelected(-1)
  }

  return (
    <section class="tour7-demo" id="demo02">
      <div class="tour7-demo__header">
        <p class="tour7-demo__eyebrow">DEMO 02</p>
        <h2 class="tour7-demo__title">컨트롤러 자동 검색.</h2>
      </div>
      <div class="tour7-demo__panel">
        <div class="tour7-demo__controls">
          <div class="tour7-demo__actions">
            <button
              class="tour-btn tour-btn--primary"
              onClick={scan}
              disabled={state === "scanning"}
            >
              {state === "scanning" ? "검색 중..." : "[ UDP 검색 시작 ]"}
            </button>
            {state === "found" && (
              <button class="tour-btn tour-btn--secondary" onClick={reset}>
                초기화
              </button>
            )}
          </div>

          {state === "scanning" && (
            <div class="tour7-dbnet__pulse" aria-hidden="true">
              <div class="tour7-dbnet__pulse-dot" />
              <p class="tour7-dbnet__pulse-text">UDP 브로드캐스트 중...</p>
            </div>
          )}

          {state === "found" && (
            <ul class="tour7-dbnet__list">
              {controllers.map((c, i) => (
                <li
                  key={i}
                  class={`tour7-dbnet__item ${selected === i ? "is-selected" : ""}`}
                  onClick={() => setSelected(i)}
                >
                  <span class="tour7-dbnet__mac">{c.mac}</span>
                  <span class="tour7-dbnet__ip">{c.ip}</span>
                  <span class="tour7-dbnet__name">{c.name}</span>
                  {selected === i && (
                    <span class="tour7-dbnet__check">✓ 연결 설정 자동 반영</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        <aside class="tour7-demo__note">
          <p>버튼 한 번으로 같은 서브넷의 모든 컨트롤러를 찾습니다.</p>
          <p>결과 목록 중 하나를 클릭하면 IP·포트가 연결 설정으로 자동 복사됩니다.</p>
        </aside>
      </div>
    </section>
  )
}

function Demo03HexAscii() {
  const [msg, setMsg] = useState("MSG.02")
  const [page, setPage] = useState("PG.1")
  const [section, setSection] = useState("S.A")
  const [ascii, setAscii] = useState("")

  function convert() {
    const checksum = (msg.length + page.length + section.length)
      .toString(16)
      .toUpperCase()
      .padStart(2, "0")
    setAscii(
      `AT+MSG=${msg.slice(4)},PG=${page.slice(3)},S=${section.slice(2)},CHK=${checksum}`,
    )
  }
  function reset() {
    setAscii("")
  }

  return (
    <section class="tour7-demo" id="demo03">
      <div class="tour7-demo__header">
        <p class="tour7-demo__eyebrow">DEMO 03</p>
        <h2 class="tour7-demo__title">HEX ↔ ASCII 변환.</h2>
      </div>
      <div class="tour7-demo__panel tour7-demo__panel--hex">
        <div class="tour7-hex__col">
          <p class="tour7-hex__col-label">HEX 설정</p>
          <fieldset class="tour7-fieldset">
            <legend>메시지</legend>
            {["MSG.01", "MSG.02", "MSG.03"].map((v) => (
              <label class="tour7-radio" key={v}>
                <input
                  type="radio"
                  name="msg"
                  checked={msg === v}
                  onChange={() => setMsg(v)}
                />
                <span>{v}</span>
              </label>
            ))}
          </fieldset>
          <label class="tour7-field">
            <span>페이지</span>
            <select
              value={page}
              onChange={(e) => setPage((e.target as HTMLSelectElement).value)}
            >
              <option>PG.1</option>
              <option>PG.2</option>
            </select>
          </label>
          <label class="tour7-field">
            <span>섹션</span>
            <select
              value={section}
              onChange={(e) => setSection((e.target as HTMLSelectElement).value)}
            >
              <option>S.A</option>
              <option>S.B</option>
            </select>
          </label>
        </div>
        <div class="tour7-hex__center">
          <button class="tour-btn tour-btn--primary" onClick={convert}>
            ⇅ ASCII 변환
          </button>
          {ascii && (
            <button class="tour-btn tour-btn--secondary" onClick={reset}>
              초기화
            </button>
          )}
        </div>
        <div class="tour7-hex__col">
          <p class="tour7-hex__col-label">ASCII 출력</p>
          <pre class="tour7-hex__ascii" aria-live="polite">
            {ascii || "— 변환 결과가 여기에 —"}
          </pre>
        </div>
      </div>
      <aside class="tour7-demo__note tour7-demo__note--full">
        <p>
          HEX 설정 값이 ASCII 문자열로 변환됩니다. 현장 디버깅 시 패킷 구조를 즉시 확인할 수
          있습니다.
        </p>
      </aside>
    </section>
  )
}

function EndSection() {
  return (
    <section class="tour7-end">
      <h2 class="tour7-end__title">DabitOne을 지금 다운로드.</h2>
      <p class="tour7-end__sub">
        이 미니 데모는 실제 동작의 축약입니다. 설치하면 다섯 탭 모두 사용 가능.
      </p>
      <div class="tour7-end__cta">
        <a
          class="tour-btn tour-btn--primary"
          href="https://www.dabitsol.com"
          target="_blank"
          rel="noreferrer"
        >
          DabitOne 다운로드 →
        </a>
        <a
          class="tour-btn tour-btn--secondary"
          href="/tour/quickstart/01-first-connection/"
        >
          Quickstart 투어 →
        </a>
      </div>
      <p class="tour7-end__colophon">© 다빛솔루션 · 2026</p>
    </section>
  )
}
