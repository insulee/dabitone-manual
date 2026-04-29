import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// 사이드바에서 숨길 폴더 (URL은 유지, Explorer만 숨김)
// 새 라우트: 매뉴얼은 /docs/, tour 영역은 /quickstart·/accessible.
// 사이드바는 매뉴얼 페이지에서만 노출되므로 tour 영역과 docs/ 안의 보조 폴더를 hide.
const hiddenFilterFn = (node: any) => {
  const slug = String(node.slug ?? "")
  // root 레벨 hide: tour 영역 + 태그 인덱스
  const rootHidden = new Set(["quickstart", "accessible", "tags"])
  const first = slug.split("/")[0]
  if (rootHidden.has(first)) return false
  // docs/ 하위 hide: blog·getting-started·troubleshooting·templates는 별도 페이지에서만 노출
  const firstTwo = slug.split("/").slice(0, 2).join("/")
  const docsHidden = new Set([
    "docs/blog",
    "docs/getting-started",
    "docs/troubleshooting",
    "docs/templates",
  ])
  if (docsHidden.has(firstTwo)) return false
  return true
}

// 폴더 숫자 prefix(01-, 02-) 기반 정렬 — slug 기준.
// 파일은 같은 폴더 안에서 `overview`가 항상 최상단, 이후는 폴더별 explicit
// 순서(orderMap) → explicit 없는 나머지는 slug 알파벳순 fallback.
// 클로저 금지(브라우저 new Function 평가) — 맵 인라인.
const customSortFn = (a: any, b: any) => {
  if (!a.isFolder && !b.isFolder) {
    const aIsOv = String(a.slug ?? "").endsWith("/overview")
    const bIsOv = String(b.slug ?? "").endsWith("/overview")
    if (aIsOv && !bIsOv) return -1
    if (!aIsOv && bIsOv) return 1

    const orderMap: Record<string, string[]> = {
      "01-communication": ["serial", "dbnet", "tcp", "udp", "ble", "mqtt"],
      "02-settings": ["screen-size", "display-signal", "font"],
      "03-transfer": ["message"],
      "04-editor": ["text", "image", "gif", "schedule-grid", "split-mode"],
      "05-advanced": ["time", "board-settings", "firmware", "theme"],
    }
    const aParts = String(a.slug ?? "").split("/")
    const bParts = String(b.slug ?? "").split("/")
    // 직속 부모 폴더로 비교 (docs/01-communication/serial → "01-communication")
    const aFolder = aParts.length >= 2 ? aParts[aParts.length - 2] : aParts[0]
    const bFolder = bParts.length >= 2 ? bParts[bParts.length - 2] : bParts[0]
    const aName = aParts[aParts.length - 1]
    const bName = bParts[bParts.length - 1]
    if (aFolder === bFolder && orderMap[aFolder]) {
      const order = orderMap[aFolder]
      const aIdx = order.indexOf(aName)
      const bIdx = order.indexOf(bName)
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx
      if (aIdx !== -1) return -1
      if (bIdx !== -1) return 1
    }
    const aSlug = String(a.slug ?? a.displayName)
    const bSlug = String(b.slug ?? b.displayName)
    return aSlug.localeCompare(bSlug, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  }
  if (a.isFolder && b.isFolder) {
    const aSlug = String(a.slug ?? a.displayName)
    const bSlug = String(b.slug ?? b.displayName)
    return aSlug.localeCompare(bSlug, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  }
  return a.isFolder ? -1 : 1
}

// 폴더 사이드바 이름 오버라이드 — index.md 없이 fileSegmentHint로
// fallback되면 '01-communication' 같은 slug가 노출되므로 짧은 한글 라벨로 덮는다.
// 새 구조: docs/<카테고리>/index 형태 (3 segments).
const folderLabelMapFn = (node: any) => {
  if (!node.isFolder) return
  const slug = String(node.slug ?? "")
  const parts = slug.split("/")
  const last = parts[parts.length - 1]
  if (last !== "index") return
  const labels: Record<string, string> = {
    "docs": "매뉴얼",
    "01-communication": "통신",
    "02-settings": "설정",
    "03-transfer": "전송",
    "04-editor": "편집",
    "05-advanced": "고급",
    "file-formats": "파일 형식",
  }
  // 직속 폴더 이름으로 라벨 매칭
  const folderName = parts[parts.length - 2] ?? parts[0]
  const label = labels[folderName]
  if (label) node.displayName = label
}

// 사이드바 하단 바로가기
const quickLinks = Component.QuickLinks({
  title: "바로가기",
  links: [
    { icon: "home", label: "다빛솔루션 홈페이지", href: "https://dabitsol.com" },
    { icon: "store", label: "네이버 스마트스토어", href: "https://smartstore.naver.com/dabitsol" },
    { icon: "chat", label: "카카오톡 채널", href: "http://pf.kakao.com/_iPfen" },
    { icon: "mail", label: "dabit@dabitsol.com", href: "mailto:dabit@dabitsol.com" },
    { icon: "phone", label: "031-202-2435~6", href: "tel:031-202-2435" },
  ],
})

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      "다빛솔루션": "https://dabitsol.com",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      folderClickBehavior: "collapse",
      folderDefaultState: "open",
      sortFn: customSortFn,
      filterFn: hiddenFilterFn,
      mapFn: folderLabelMapFn,
    }),
    quickLinks,
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      folderClickBehavior: "collapse",
      folderDefaultState: "open",
      sortFn: customSortFn,
      filterFn: hiddenFilterFn,
      mapFn: folderLabelMapFn,
    }),
    quickLinks,
  ],
  right: [],
}
