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
          light: "#000000",
          lightgray: "#1c1c1e",
          gray: "#6b6b6b",
          darkgray: "#a3a3a3",
          dark: "#f5f5f5",
          secondary: "#ff9500",
          tertiary: "#ffb547",
          highlight: "rgba(255, 149, 0, 0.08)",
          textHighlight: "rgba(255, 149, 0, 0.3)",
        },
        darkMode: {
          light: "#000000",
          lightgray: "#1c1c1e",
          gray: "#6b6b6b",
          darkgray: "#a3a3a3",
          dark: "#f5f5f5",
          secondary: "#ff9500",
          tertiary: "#ffb547",
          highlight: "rgba(255, 149, 0, 0.08)",
          textHighlight: "rgba(255, 149, 0, 0.3)",
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
