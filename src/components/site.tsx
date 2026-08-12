import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ExternalLink, Menu } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { NAVIGATION_CONFIG } from "@/config/navigation";
import type { NavGroup } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CollapsibleNavGroup } from "@/components/collapsible-nav-group";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ClientThemeToggle } from "@/components/theme-toggle";

const ROBLOX_URL = "https://www.roblox.com/games/91704854174760/Finish-The-Word";
const DISCORD_URL = "https://www.roblox.com/communities/189805512/Table-Game-X";
const YOUTUBE_URL = "https://www.youtube.com/watch?v=bUtCQJ61TtA";
const GROUP_URL = "https://www.roblox.com/communities/189805512/Table-Game-X";
export function localizeHref(href: string, locale: string) {
  if (locale === "en") return href;
  return `/${locale}${href === "/" ? "" : href}`;
}

export async function SiteHeader({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "nav" });
  const header = (
    <div className="flex items-center justify-between gap-2 sm:gap-4">
      <Link href={localizeHref("/", locale)} className="flex min-w-0 items-center gap-2 sm:gap-3">
        <Image
          src="/android-chrome-192x192.png"
          alt="Finish The Word"
          width={36}
          height={36}
          className="h-8 w-8 shrink-0 rounded-xl border border-border sm:h-9 sm:w-9"
          priority
        />
        <span className="truncate text-sm font-bold tracking-wide text-foreground">Finish The Word</span>
      </Link>
      <nav className="hidden items-center gap-1 md:flex">
        {NAVIGATION_CONFIG.map((item) => (
          <Link key={item.key} href={localizeHref(item.path, locale)} className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
            {t(item.key)}
          </Link>
        ))}
      </nav>
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <LanguageSwitcher locale={locale} />
        <ThemeToggle label={t("toggleTheme")} />
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" aria-label={t("menu")} className="touch-target h-9 w-9">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent className="mobile-drawer border-border bg-background text-foreground">
            <SheetTitle className="pr-8 text-left text-sm font-semibold text-foreground">{t("menu")}</SheetTitle>
            <div className="mt-4 grid gap-1">
              {NAVIGATION_CONFIG.map((item) => (
                <Link
                  key={item.key}
                  href={localizeHref(item.path, locale)}
                  className="rounded-lg px-3 py-3.5 text-base font-semibold text-foreground hover:bg-muted"
                >
                  {t(item.key)}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
  return (
    <header className="site-header sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-3 py-2.5 sm:px-6 sm:py-3 lg:px-8">{header}</div>
    </header>
  );
}

function ThemeToggle({ label }: { label: string }) {
  return <ClientThemeToggle label={label} />;
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground sm:mb-7 sm:gap-2">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />}
          {item.href ? (
            <Link className="truncate hover:text-foreground" href={item.href}>{item.label}</Link>
          ) : (
            <span className="truncate text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export async function WikiSidebar({ locale, navGroups, currentPath }: { locale: string; navGroups: NavGroup[]; currentPath?: string }) {
  const t = await getTranslations({ locale, namespace: "shared" });
  const isActive = (href: string) => currentPath === href;
  return (
    <aside className="space-y-4 sm:space-y-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-1">
      <section className="rounded-2xl border border-border bg-card/60 p-4 shadow-sm sm:p-5">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground sm:mb-4">{t("wikiNavigation")}</h3>
        <div className="space-y-4">
          {navGroups.map((group) => (
            <CollapsibleNavGroup
              key={group.slug}
              title={group.title}
              icon={<span className="grid h-4 w-4 place-items-center rounded text-[10px] font-bold text-[hsl(var(--nav-theme))]">{group.title[0]}</span>}
              count={group.count}
              currentPath={currentPath}
            >
              <ul className="space-y-1">
                {group.links.map((link) => {
                  const isOverview = link.href === `/${group.slug}`;
                  return (
                  <li key={link.href}>
                    <Link
                      href={localizeHref(link.href, locale)}
                      title={link.fullTitle}
                      className={`flex items-start gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors ${isActive(link.href) ? "bg-[hsl(var(--nav-theme)/0.15)] font-semibold text-[hsl(var(--nav-theme))]" : "text-muted-foreground hover:bg-muted hover:text-foreground"} ${isOverview ? "font-medium" : ""}`}
                    >
                      <span className="line-clamp-2 min-w-0 flex-1 leading-snug">{link.label}</span>
                      {link.badge && <Badge variant="secondary" className="ml-auto h-5 shrink-0 border-border px-1.5 text-[10px]">{link.badge}</Badge>}
                    </Link>
                  </li>
                  );
                })}
              </ul>
            </CollapsibleNavGroup>
          ))}
        </div>
      </section>
      <section className="rounded-2xl border border-border bg-card/60 p-4 sm:p-5">
        <h3 className="mb-3 text-sm font-bold text-foreground">{t("activeCodes")}</h3>
        <div className="space-y-3 text-sm">
          <div className="rounded-xl bg-muted p-3">
            <code className="font-bold text-foreground">No codes yet</code>
            <p className="mt-1 text-muted-foreground">No verified active codes right now</p>
          </div>
          <div className="rounded-xl bg-muted p-3">
            <code className="font-bold text-foreground">No codes yet</code>
            <p className="mt-1 text-muted-foreground">Check the Roblox group or game Social Links for updates</p>
          </div>
          <Link href={localizeHref("/codes", locale)} className="inline-flex items-center gap-1 text-sm font-semibold text-[hsl(var(--nav-theme))]">
            {t("viewAllCodes")} <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </aside>
  );
}

export async function SiteFooter({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const site = await getTranslations({ locale, namespace: "site" });
  return (
    <footer className="mt-10 border-t border-border bg-card/30 pb-safe sm:mt-16">
      <div className="mx-auto max-w-7xl px-3 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-8 rounded-2xl border border-border bg-muted/40 p-4 sm:mb-10 sm:p-5">
          <div className="font-bold text-foreground">{site("name")}</div>
          <p className="mt-1 text-sm text-muted-foreground">{t("description")}</p>
          <Link href={ROBLOX_URL} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--nav-theme))]">
            {t("playGame")} <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
        <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground sm:mb-8">{site("legalNotice")}</p>
        <div className="grid gap-6 sm:gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="font-bold text-foreground">{t("aboutTitle")}</h3>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">{t("about")}</p>
          </div>
          <FooterList
            title={t("quickLinks")}
            links={[
              [t("playGame"), ROBLOX_URL],
              [t("officialDiscord"), DISCORD_URL],
              [t("officialYoutube"), YOUTUBE_URL],
              [t("communityGroup"), GROUP_URL],
            ]}
          />
          <FooterList
            title={t("guides")}
            links={[
              [t("beginnerGuide"), "/guide"],
              [t("petsGuide"), "/pets"],
              [t("rankedGuides"), "/ranked"],
              [t("winStreakGuides"), "/win-streaks"],
              [t("privacyPolicy"), "/privacy-policy"],
              [t("termsOfService"), "/terms-of-service"],
            ]}
          />
        </div>
        <p className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">{t("copyright")}</p>
      </div>
    </footer>
  );
}

function FooterList({ title, links }: { title: string; links: string[][] }) {
  return (
    <div>
      <h4 className="font-semibold text-foreground">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link className="hover:text-foreground" href={href}>{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TrailerEmbed({ videoId, title = "Finish The Word Official Trailer" }: { videoId: string; title?: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border shadow-lg">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="aspect-video w-full"
      />
    </div>
  );
}

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
