import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// 사이드바 폴더 hide — slugSegment 기반(Quartz default와 동일 패턴).
// Quartz fileTrie는 노드 단위로 호출하며 slugSegment는 노드의 직속 segment.
// /quickstart·/accessible (tour 영역)와 docs/ 안 보조 폴더는 매뉴얼 사이드바에 안 보이게.
const hiddenFilterFn = (node: any) => {
  const seg = String(node.slugSegment ?? "")
  if (seg === "quickstart" || seg === "accessible" || seg === "tags") return false
  if (seg === "blog" || seg === "getting-started" || seg === "troubleshooting" || seg === "templates") return false
  return true
}

// 폴더 prefix(01-, 02-) 알파벳 정렬 + 같은 폴더에서 overview 최상단.
// 폴더별 explicit 순서는 폴더 segmentHint 기반 (옛 layout과 동일).
const customSortFn = (a: any, b: any) => {
  if (a.isFolder && b.isFolder) {
    const aSeg = String(a.slugSegment ?? a.displayName)
    const bSeg = String(b.slugSegment ?? b.displayName)
    return aSeg.localeCompare(bSeg, undefined, { numeric: true, sensitivity: "base" })
  }
  if (a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1
  // 둘 다 파일
  const aSeg = String(a.slugSegment ?? "")
  const bSeg = String(b.slugSegment ?? "")
  if (aSeg === "overview" && bSeg !== "overview") return -1
  if (aSeg !== "overview" && bSeg === "overview") return 1
  return aSeg.localeCompare(bSeg, undefined, { numeric: true, sensitivity: "base" })
}

// 폴더 사이드바 이름 오버라이드 — slugSegment로 라벨 매칭.
const folderLabelMapFn = (node: any) => {
  if (!node.isFolder) return
  const seg = String(node.slugSegment ?? "")
  const labels: Record<string, string> = {
    "docs": "매뉴얼",
    "01-communication": "통신",
    "02-settings": "설정",
    "03-transfer": "전송",
    "04-editor": "편집",
    "05-advanced": "고급",
    "file-formats": "파일 형식",
  }
  const label = labels[seg]
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
