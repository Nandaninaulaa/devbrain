from pathlib import Path
import tempfile
import unittest

from app.file_discovery import iter_ingestible_files


class IterIngestibleFilesTests(unittest.TestCase):
    def test_project_root_named_data_does_not_hide_its_files(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory) / "data" / "my-project"
            root.mkdir(parents=True)
            source_file = root / "main.py"
            source_file.write_text("print('hello')", encoding="utf-8")

            self.assertEqual(
                list(iter_ingestible_files(root, {".py"})),
                [source_file],
            )

    def test_ignored_directories_inside_project_are_skipped(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory) / "project"
            source_file = root / "src" / "main.py"
            ignored_file = root / "data" / "generated.py"
            virtualenv_file = root / ".venv" / "lib" / "package.py"
            source_file.parent.mkdir(parents=True)
            ignored_file.parent.mkdir(parents=True)
            virtualenv_file.parent.mkdir(parents=True)
            source_file.write_text("print('hello')", encoding="utf-8")
            ignored_file.write_text("generated = True", encoding="utf-8")
            virtualenv_file.write_text("package = True", encoding="utf-8")

            self.assertEqual(
                list(iter_ingestible_files(root, {".py"})),
                [source_file],
            )


if __name__ == "__main__":
    unittest.main()
