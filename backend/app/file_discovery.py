from pathlib import Path

IGNORE_DIRS = {
    "node_modules", ".git", "__pycache__", ".venv", "venv",
    "dist", "build", ".next", "data", ".chroma",
}


def iter_ingestible_files(root: Path, extensions: set[str]):
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        relative_parts = path.relative_to(root).parts
        if any(part in IGNORE_DIRS for part in relative_parts[:-1]):
            continue
        if path.suffix not in extensions:
            continue
        yield path
