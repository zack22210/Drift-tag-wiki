"""Install the repository's local-first extraction override into Seoscout."""

from pathlib import Path
import re
import shutil
import sys


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("usage: apply-seoscout-local-extractor.py SEOSCOUT_SRC OVERRIDE_FILE")

    source_root = Path(sys.argv[1]).resolve()
    override = Path(sys.argv[2]).resolve()
    core = source_root / "seoscout" / "core"
    web_file = core / "web.py"
    target = core / "local_web_extractor.py"

    if not web_file.is_file() or not override.is_file():
        raise SystemExit("Seoscout source or local extractor override is missing")

    shutil.copyfile(override, target)
    text = web_file.read_text(encoding="utf-8")

    import_line = "from .local_web_extractor import extract_web_item\n"
    if import_line not in text:
        anchor = "from .cleaner import ContentCleaner\n"
        if anchor not in text:
            raise SystemExit("Unsupported Seoscout web.py: import anchor not found")
        text = text.replace(anchor, anchor + import_line, 1)

    pattern = re.compile(
        r"(?m)^(    async def _extract_single\(self, item: WebItem, semaphore, rate_limiter\) -> Tuple\[WebItem, str\]:).*?"
        r"(?=^    (?:async )?def |\Z)",
        re.DOTALL,
    )
    replacement = (
        "    async def _extract_single(self, item: WebItem, semaphore, rate_limiter) -> Tuple[WebItem, str]:\n"
        "        # Installed by scripts/apply-seoscout-local-extractor.py\n"
        "        return await extract_web_item(self, item, semaphore, rate_limiter)\n\n"
    )
    text, count = pattern.subn(replacement, text, count=1)
    if count != 1:
        raise SystemExit("Unsupported Seoscout web.py: extraction method not found")

    web_file.write_text(text, encoding="utf-8")
    print(f"==> Applied local-first web extractor to {web_file}")


if __name__ == "__main__":
    main()
