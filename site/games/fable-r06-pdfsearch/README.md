# PDF横断検索 — offline PDF cross-search

Search across a whole library of PDFs — hundreds to about a thousand papers, guidelines, manuals, slide handouts and
old scans, Japanese and English — and see the answer **on the pages themselves**: every hit is a page image with the
matching words highlighted and the best lines enlarged in place. No server, no account, no network: one HTML file you double-click.

完全オフラインの PDF 横断検索です。`index.html` をダブルクリックするだけで動きます（開発サーバー不要・ネット接続不要・`file://` で動作）。
一度フォルダを追加すれば索引がブラウザ内に保存され、次回からは開いた瞬間に検索できます。

## Run / 起動

1. Double-click **`index.html`** (Google Chrome or Edge recommended). Nothing to install, build or serve.
2. Add your library once: **＋ → フォルダを追加…** (or drop the folder on the window). See "Your library" below.
3. Type a word or a whole question into the search pill.

Only three fixed controls exist: the search pill (top), **＋** and **⤢** (bottom right). Everything else is a key, the ＋ menu,
a right-click menu or a message that leaves by itself. Press **`?`** any time for the keys and the search syntax.

## What you see / 画面

- **Before searching**: the first page of every PDF.
- **After searching**: the matching pages, best first. On each page image
  - matching words are highlighted where they sit on the page,
  - the lines that explain the match best carry an orange bar and are **enlarged in place** (a magnified strip of the real page, never extracted text),
  - below: a relevance bar, the file name, the page number, and `OCR 92%` when the page was read by OCR.
- How a hit was found is marked quietly: plain yellow = as typed; thin underline = spelling variant (サーバ / サーバー, ひらがな / カタカナ);
  blue = found through the dictionary; dotted outline = text read by OCR (fainter when the engine was unsure).
- **Click a page** (or Enter): the document opens at that page beside a narrow rail of the other hits.
- **`n` / `Shift+N`**: next / previous hit — through the document, then on to the next document. A small "3 / 17" appears beside the hit and fades.
- When a search finds nothing (or almost nothing) and part of the library could not be searched, the app says so:
  「検索済み 14,820 / 15,000 ページ ・ OCR待ち 180 ページ ・ 読めない 3 ファイル — 内訳を見る」. "Not found" and "not searchable" never look the same.

## Your library / フォルダの追加と再スキャン

| What you do | What happens |
|---|---|
| **＋ → フォルダを追加…** and choose the folder (Chrome asks once: 「このサイトにファイルの閲覧を許可しますか」→ 許可). Or drop the folder on the window. | Every PDF in it (sub-folders included) is indexed in the background. The pill shows 「索引中 412/1,000」; you can search and type meanwhile. 1,000 PDFs / 15,000 pages took about a minute on the test machine. |
| Close the tab while it is indexing | Nothing is lost. Next time a message offers 「続きから再開」; one click and only the rest is indexed. |
| Open the app again later | The index is already there: searchable in well under a second, **without reading any PDF**. Results show stored page thumbnails with the hits painted on them. |
| First click on 「アクセスを許可」 after a restart (Chrome shows its permission prompt; if it offers "Allow on every visit", choosing it should stop the question — not verified here) | The PDFs themselves become readable again: sharp pages, enlarged lines, copy as image. Until then search, highlights and thumbnails work from the index. |
| **＋ → 再スキャン: フォルダ名** | Only new and changed files are read (size + modified time, then SHA-256 of the content). Renamed or moved files are followed by their content hash without re-reading. Removed files leave the index. A file replaced by a new edition under the same name becomes a new version (see "Notes"). |
| **＋ → PDFを追加…** or drop single PDFs | Loose PDFs are copied into the browser's storage (folders are not copied: they are read in place). |
| **＋ → 追加したPDF・フォルダを外す** | Removes your folders and PDFs from the index. Notes and bookmarks are kept. |

Notes on browsers: tested in Google Chrome only. Folder handles (re-scan without choosing the folder again) need Chrome or Edge. Without them
(the `<input webkitdirectory>` path, which is what Safari / Firefox would use — not tested there) the index still persists, and to re-scan or to see sharp pages
after a restart you choose the folder again; unchanged files are not read twice.
The app opens your PDFs **read-only** and never writes to them.

## Scanned PDFs / スキャン PDF（OCR）

Pages without a text layer are recognised automatically, offline, with the bundled Tesseract engine (Japanese horizontal and vertical, English).
The pill shows 「OCR 12/340」 while it works (about 2–4 s per page, in the background, paused while you type). OCR results go into the same index:
hits are highlighted on the page image like any other, with a dotted outline and the confidence in the caption.

- **`L`** (or ＋ → 検索できた範囲) opens the ledger: every PDF as a page tile with its state — 検索可 / OCR待ち / OCR要確認 / パスワード / 破損 / 旧版 — and a 再試行 button.
- **`R`** on an opened page reads that page again at higher resolution; **`Shift+R`** turns it 90° first (for pages scanned sideways).
- PDFs that already carry an OCR text layer made elsewhere are used as they are.
- The first OCR in a session loads the engine (15 MB from `vendor/`, a few seconds). Nothing is downloaded.

## Searching / 検索の書き方

Type keywords (`庫内幅 28 cm`, `torque stem bolts`) or a full question (`冷蔵庫と電子レンジの型番は何か。`). It is lexical search: it finds the wording and shows you the lines to read; it does not paraphrase or write an answer.

| You type | It means |
|---|---|
| `フィルター 交換` | pages that cover these words, best coverage first |
| `"stem bolts"` | the page must contain this phrase, in this order |
| `-washer` | leave out pages that contain this word (`-"two words"` works too) |
| `file:manual` | only files whose name contains `manual` (`-file:draft` to exclude) |
| `in:travel/2024` | only files whose folder path contains this |

Things you do not have to care about — these all match each other:
full-width / half-width (`ＦＲ－２２８Ｋ` = `FR-228K`), upper / lower case, ひらがな / カタカナ, small kana (`ウィンドウ` = `ウインドウ`),
long vowels (`サーバ` = `サーバー`, `インタフェース` = `インターフェース`), hyphens, dashes and spaces (`KX-9000` = `KX9000` = `KX 9000`),
ligatures (`ﬁlter` = `filter`), and words hyphenated across a line break (`appli-⏎ances` = `appliances`). Exact matches rank above variants.

**Dictionary (`synonyms.json`)** — abbreviations and synonyms, e.g. `ac` = `air conditioner`, `fridge` = `refrigerator` = `冷蔵庫`.
It is plain JSON: `{"groups": [["ac", "air conditioner", "エアコン"], …]}`. Edit the file in this folder, then **drop it on the app window**
(or ＋ → 読み込む・復元 / 辞書を読み込む…). The app remembers it from then on. Dictionary matches rank below exact ones and are marked blue.
(A `file://` page cannot read a neighbouring JSON file by itself, hence the drop. The shipped examples are built in.)

## Keys / キー操作

| Key | Action |
|---|---|
| `/` or `Ctrl/⌘+F` | focus the search pill |
| `↑` `↓` `←` `→` | choose a result page; `Enter` opens it |
| `n` / `Shift+N` | next / previous hit (page → document → next document) |
| `D` | search only the opened document; `D` again goes back to the whole library |
| `H` | search history (↑↓, Enter re-runs) |
| `Alt+←` / `Alt+→` (`⌘[` / `⌘]`) | back / forward between the places you looked at, exact scroll position |
| `+` `-` `0`, `Ctrl/⌘`+wheel, double-click | zoom the opened page |
| `B` / `K` / `M` | bookmark the page / highlight the hit (or the selected region) / add a note |
| `Shift`+drag | select a region → copy as image, copy its text, highlight, note |
| `Ctrl/⌘+Shift+C` | copy the hit's line with a source line |
| `I` | check / correct the citation fields of the document |
| `O` | open the original PDF in a new tab at this page |
| `R` / `Shift+R` | OCR this page again / rotated |
| `L` | ledger: what was actually searchable |
| `?` | this list, in the app |
| `Esc` | close the overlay → the opened page → clear the search |
| `F` | fullscreen |

The app comes back where you left it: last query, opened document, page, zoom and scroll position. The address bar also keeps the search
(`index.html#q=…`) and the opened page (`index.html#doc=…&p=17`), so both can be bookmarked.

## Notes, bookmarks, copying / しおり・メモ・コピー

- `B`, `K`, `M` (or right-click on the page) attach bookmarks, highlights and short notes to a page. They are stored by the **content** of the PDF
  (SHA-256), so they survive renaming and moving files. ＋ → しおり・メモのページを表示 lists the marked pages as page images.
- If a file is replaced by a different edition under the same name, its notes are **not** moved silently: they stay with the old content and are shown on the
  nearest page of the new version with a dashed 「原本が変更されました」 mark.
- **Copy with source** (`Ctrl/⌘+Shift+C`): the line of the current hit plus a source line built only from what the PDF itself states
  (XMP / Info metadata, a DOI printed on the first pages) or what you entered with `I`. The printed page number is added only when the PDF defines page labels
  or you set an offset: `… — paper.pdf, PDF p.4 (p.72)`. Nothing is guessed; missing fields stay empty. Text that came from OCR starts with `[OCR未確認]`.
- **Copy a figure or table**: `Shift`+drag a rectangle → 画像をコピー. The region is re-rendered from the PDF at 300 dpi without highlights
  (a scan is not enlarged beyond its own resolution; the message says the dpi). Right-click → ページ全体を画像でコピー for the whole page.
  If the browser refuses clipboard access, the same PNG / text is saved as a file and a message says so.
- **Export** (＋ menu): Markdown, JSON (file, page, note, and a link `index.html#doc=…&p=…` that reopens the page), and an HTML reading list that shows the
  bookmarked page thumbnails offline. **Backup**: ＋ → バックアップを保存 writes one JSON with everything you made (notes, corrected citations,
  dictionary, history). ＋ → 読み込む・復元 brings it back, matching PDFs by content; anything without a matching PDF is reported and kept.
  The app reminds you (at most weekly) when notes changed after the last backup.
- `O` opens the original PDF in a new browser tab at the current page (a web page cannot start Preview.app or another program directly).

## What is stored where / 保存場所

Everything lives in this browser's IndexedDB for `file://` pages, in two databases:
the **index** (text, word positions, page thumbnails, OCR results — about 13 KB per page, 200 MB for 1,000 PDFs / 15,000 pages; it can always be rebuilt from the PDFs) and
your **user data** (folder list, notes, citations, dictionary, history — small, and never dropped by the app). If storage runs short the app gives up
thumbnails first. Clearing the browser's site data removes both, which is what the backup file is for.

### Changing the bundled sample PDFs (optional)

The five PDFs in `pdfs/` are built in. After adding or removing files there, or after updating anything in `vendor/` or `synonyms.json` defaults, run
`node tools/build-embedded.mjs` once (Node.js is needed only for this, never for using the app).

## Offline by construction

- No CDN, remote font, remote module or first-run download. Libraries are in `vendor/`: PDF.js 3.11.174 and the Tesseract OCR core with
  Japanese / English data (names, versions, licenses, sources and SHA-256 in `vendor/README.md`).
- No `fetch`/XHR anywhere: PDFs, CMaps, fonts, the PDF.js and OCR engines are loaded through `<script>` tags, which is what makes `file://` work.
  Indexing and OCR run in real background threads (Blob workers assembled from those scripts).
- The acceptance run starts Chrome with name resolution disabled and records zero non-local requests.

## Tests / 受け入れテスト

- `ACCEPTANCE.md` — T1–T5 (unchanged) and T6–T28 for everything above; `test-results.md` — pass/fail, observed vs expected, timings; screenshots in `test-evidence/`.
- `node tools/acceptance.mjs` — repeats the whole run (headless Chrome over `file://`, DNS disabled; Node 22+ and a local Chrome; several minutes because of the
  1,000-PDF scale test). Parts can be run alone: `node tools/acceptance.mjs --only T12,T13`.
- `node tools/unit-tests.mjs` — the matching rules, engine only. `node tools/benchmark.mjs` — the scale measurements.
- `acceptance.html` — double-click to re-check T1–T5 by eye.

## Files

```
index.html  app.css          the app
js/search.js                 search engine (normalisation, matching, ranking, query syntax, dictionary)
js/store.js                  IndexedDB: index database + user-data database, schema version and migration
js/core.js                   PDF.js setup, library, folders, background index workers, coverage ledger
js/indexer.js                code of the background workers (indexing, OCR)
js/ocr.js                    OCR queue
js/ui.js                     the screen
js/notes.js                  bookmarks, highlights, notes, copy-out, export / backup
js/extras.js                 help, ledger, history, session restore, scope, dictionary loading
synonyms.json                the dictionary you can edit
pdfs/                        bundled sample PDFs (+ embedded/ and manifest.js, generated)
vendor/                      PDF.js and Tesseract as shipped, plus script-wrapped copies (generated)
tools/                       optional Node scripts: build-embedded, generators, benchmark, acceptance, unit tests
ACCEPTANCE.md  test-results.md  test-evidence/  REPORT.md
```
