"""Local-first web extraction for Seoscout.

The extraction order is Trafilatura -> Crawl4AI -> Jina Reader.  The first
two run on the machine executing Seoscout and do not consume API credits.
"""

import asyncio
import os
from typing import Optional

import aiohttp
from trafilatura import extract

from .utils import get_url_hash, load_cache, save_cache


def _enabled(name: str, default: bool) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _minimum_length() -> int:
    return int(os.getenv("WEB_MIN_CONTENT_LENGTH", "500"))


def _usable(content: Optional[str]) -> bool:
    return bool(content and len(content.strip()) >= _minimum_length())


async def _trafilatura(url: str, proxy: Optional[str]) -> str:
    timeout = aiohttp.ClientTimeout(total=int(os.getenv("WEB_REQUEST_TIMEOUT", "45")))
    headers = {
        "User-Agent": os.getenv(
            "WEB_USER_AGENT",
            "Mozilla/5.0 (compatible; Seoscout/0.1; +https://github.com/libin257/seoscout)",
        )
    }
    async with aiohttp.ClientSession(timeout=timeout, headers=headers) as session:
        async with session.get(url, proxy=proxy, allow_redirects=True) as response:
            response.raise_for_status()
            html = await response.text(errors="replace")

    return await asyncio.to_thread(
        extract,
        html,
        url=url,
        output_format="markdown",
        include_links=True,
        include_images=False,
        include_comments=False,
        favor_recall=True,
    ) or ""


async def _crawl4ai(url: str) -> str:
    try:
        from crawl4ai import AsyncWebCrawler
    except ImportError:
        return ""

    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(url=url)

    if not getattr(result, "success", True):
        return ""
    markdown = getattr(result, "markdown", "")
    return getattr(markdown, "raw_markdown", None) or str(markdown or "")


async def _jina(url: str, config, proxy: Optional[str]) -> str:
    headers = {}
    if config.JINA_API_KEY:
        headers["Authorization"] = f"Bearer {config.JINA_API_KEY}"

    timeout = aiohttp.ClientTimeout(total=int(os.getenv("JINA_REQUEST_TIMEOUT", "45")))
    async with aiohttp.ClientSession(timeout=timeout) as session:
        async with session.get(
            f"https://r.jina.ai/{url}", headers=headers, proxy=proxy
        ) as response:
            response.raise_for_status()
            return await response.text()


async def extract_web_item(web, item, semaphore, rate_limiter):
    """Drop-in implementation for ``Web._extract_single``."""
    async with semaphore:
        url_hash = get_url_hash(item.url)
        cached = load_cache(url_hash, "web", title=item.title)
        if cached and cached.get("content"):
            print(f"  [cache] {item.title[:50]}...")
            return item, cached["content"]

        proxy = web.config.get_proxy_url_for_stage("extract")
        attempts = max(1, web.config.WEB_EXTRACT_RETRIES)

        for attempt in range(attempts):
            content = ""
            provider = ""

            if _enabled("TRAFILATURA_ENABLED", True):
                try:
                    content = await _trafilatura(item.url, proxy)
                    provider = "trafilatura"
                except Exception as error:
                    print(f"  [trafilatura] {item.title[:40]}: {error}")

            if not _usable(content) and _enabled("CRAWL4AI_FALLBACK_ENABLED", True):
                try:
                    content = await _crawl4ai(item.url)
                    provider = "crawl4ai"
                except Exception as error:
                    print(f"  [crawl4ai] {item.title[:40]}: {error}")

            if not _usable(content) and _enabled("JINA_FALLBACK_ENABLED", True):
                try:
                    # The upstream limiter is Jina-specific. Local extraction
                    # must not be throttled by the anonymous Reader API quota.
                    await rate_limiter.acquire()
                    content = await _jina(item.url, web.config, proxy)
                    provider = "jina"
                except Exception as error:
                    print(f"  [jina] {item.title[:40]}: {error}")

            if _usable(content):
                cleaned = web.cleaner.clean(content)
                save_cache(
                    url_hash,
                    "web",
                    {
                        "title": item.title,
                        "url": item.url,
                        "domain": item.domain,
                        "content": cleaned,
                        "source_type": "web",
                        "extractor": provider,
                    },
                    title=item.title,
                )
                print(f"  [{provider}] {item.title[:50]}...")
                return item, cleaned

            if attempt < attempts - 1:
                await asyncio.sleep(2**attempt)

        return item, ""
