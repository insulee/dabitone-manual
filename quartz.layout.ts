import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// 사이드바에서 숨길 최상위 폴더 (URL은 유지, Explorer만 숨김)
// FileTrieNode에 depth 필드가 없어서 slug 첫 segment로 체크.
const hiddenFilterFn = (node: any) => {
  const hidden = new Set([
    "blog",
    "getting-started",
    "troubleshooting",
    "templates",
    "tour",
    "tags",
  ])
  const slug = String(node.slug ?? "")
  const first = slug.split("/")[0]
  if (hidden.has(first)) return false
  return true
}

// 폴더 숫자 prefix(01-, 02-) 기반 정렬 — slug 기준 (displayName은 한글이라 가나다 순됨)
const customSortFn = (a: any, b: any) => {
  if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
    const aSlug = String(a.slug ?? a.displayName)
    const bSlug = String(b.slug ?? b.displayName)
    return aSlug.localeCompare(bSlug, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  }
  return a.isFolder ? -1 : 1
}

// 최상위 폴더 사이드바 이름 오버라이드 — index.md title은 "X 개요"로 두고 폴더명은 짧게.
// 클로저 금지(브라우저 측 new Function 평가) — 인라인 라벨.
const folderLabelMapFn = (node: any) => {
  if (!node.isFolder) return
  const slug = String(node.slug ?? "")
  const parts = slug.split("/")
  if (parts.length !== 2 || parts[parts.length - 1] !== "index") return
  const labels: Record<string, string> = {
    "01-communication": "통신",
    "02-settings": "설정",
    "03-transfer": "전송",
    "04-editor": "편집",
    "05-advanced": "고급",
    "file-formats": "파일 형식",
  }
  const label = labels[parts[0]]
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
      folderClickBehavior: "link",
      folderDefaultState: "collapsed",
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
      folderClickBehavior: "link",
      folderDefaultState: "collapsed",
      sortFn: customSortFn,
      filterFn: hiddenFilterFn,
      mapFn: folderLabelMapFn,
    }),
    quickLinks,
  ],
  right: [],
}
