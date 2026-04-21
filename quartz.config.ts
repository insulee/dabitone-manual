import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration — DabitONe 매뉴얼
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "DabitONe 매뉴얼",
    pageTitleSuffix: " - 다빛솔루션",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "ko-KR",
    baseUrl: "dabitone.dabitsol.com",
    ignorePatterns: [
      "private",
      "templates",
      ".obsidian",
      ".claude",
      ".trash",
      "Template",
      "docs/decisions",
      "assets/raw",
    ],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "local",
      cdnCaching: true,
      typography: {
        header: "Pretendard Variable",
        body: "Pretendard Variable",
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: {
          light: "#fafaf9",
          lightgray: "#e7e5e4",
          gray: "#a8a29e",
          darkgray: "#44403c",
          dark: "#1c1917",
          secondary: "#2563eb",
          tertiary: "#1d4ed8",
          highlight: "rgba(37, 99, 235, 0.04)",
          textHighlight: "#fef9c3",
        },
        darkMode: {
          light: "#1c1917",
          lightgray: "#292524",
          gray: "#78716c",
          darkgray: "#d6d3d1",
          dark: "#fafaf9",
          secondary: "#60a5fa",
          tertiary: "#93c5fd",
          highlight: "rgba(96, 165, 250, 0.06)",
          textHighlight: "#854d0e",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage({ showDates: false }),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      Plugin.TourEmitter(),
      // CustomOgImages disabled — Pretendard 폰트 Satori 호환성 이슈
      // Plugin.CustomOgImages(),
    ],
  },
}

export default config
