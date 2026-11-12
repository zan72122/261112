# PDF横断検索 — offline PDF cross-search

Search across many PDFs at once and see the answer **on the pages themselves**: every hit is shown as a page preview with the matching words highlighted and the best lines enlarged in place. No server, no account, no network — one HTML file you double-click.

完全オフラインのPDF横断検索です。`index.html` をダブルクリックするだけで動きます（開発サーバー不要・ネット接続不要・`file://` で動作）。

## Run / 起動

1. Double-click **`index.html`**. It opens in your browser from a `file://` address. That is all — there is nothing to install, build or serve.
2. Type a word or a whole question into the search pill at the top.

Checked with Google Chrome (see `test-results.md`). It uses only standard browser features, so current Edge, Firefox and Safari should behave the same, but they were not run here.

`index.html` をダブルクリック → 上部の検索欄に語句や質問文を入力するだけです。

## What you see / 画面

- **Before searching**: the first page of every PDF in the library.
- **After searching**: the pages that match, best first. On each page preview
  - matching words are highlighted in yellow where they sit on the page,
  - the lines that explain the match best carry an orange bar and are **enlarged in place** (a magnified strip of the real page, not extracted text),
  - below the preview: a small relevance bar, the file name and the page number.
- **Click a page** (or press Enter): the document opens at that page at reading size, beside a narrow rail of the other hits. Scroll to read the rest of the document.
- There are only three fixed controls: the search pill (top), **＋** add PDFs and **⤢** fullscreen (bottom right). No header, footer or settings.

| Key | Action |
|---|---|
| `/` or `Ctrl/⌘+F` | focus the search pill |
| `↑` `↓` | previous / next hit page |
| `Enter` | open the selected hit page |
| `←` `→` | previous / next hit (wall), previous / next page of the document (opened page) |
| `+` `-` `0`, `Ctrl/⌘`+wheel, double-click | zoom the opened page |
| `Esc` | close the opened page → clear the search |
| `F` | fullscreen |

The address bar keeps the search (`index.html#q=…`), so a search can be bookmarked.

## Searching / 検索のしかた

Type keywords (`庫内幅 28 cm`, `torque stem bolts`) or a full question (`冷蔵庫と電子レンジの型番は何か。`). The engine keeps the parts of your text that actually occur in the PDFs and ignores the rest, so questions work without any AI service:

- Japanese: any run of 2+ kana/kanji shared with a page counts (no dictionary needed). A number stays with its counter (`15日` does not match `15分`).
- English and codes: whole words (3+ letters also match as a prefix), whole numbers; `FR-228K`, `FR228K` and `fr 228k` are the same; full-width/half-width and upper/lower case are the same.
- Ranking: pages that cover more of the query, with rarer words, closer together, rank higher. A question that needs several files simply shows those pages side by side.

It is lexical search: it finds the wording, it does not paraphrase (`ランドリー` will not find `洗濯`) and it does not write an answer sentence for you — it shows you the lines to read.

## Your own PDFs / 自分のPDFを追加

- **＋ → PDFを追加… / フォルダを追加…**, or drop PDF files or a folder anywhere on the window.
- Added PDFs are copied into this browser's local storage (IndexedDB) and are still there next time. **＋ → 追加したPDFを外す** removes them again. Nothing is uploaded anywhere. If the browser refuses storage (private window, quota), the PDFs stay usable until the tab is closed.
- PDFs need a text layer. Scanned images without text are listed but cannot be searched (there is no OCR). Password-protected files are skipped.

### Changing the bundled set (optional)

The five PDFs in `pdfs/` (warranty, appliance manuals, household notes, recipe) are built in. Browsers cannot read neighbouring files from a `file://` page, so each one also exists as a script-wrapped copy in `pdfs/embedded/`. After adding or removing files in `pdfs/`, regenerate the copies:

```
node tools/build-embedded.mjs
```

This needs Node.js only for that one-off step; using the app never does.

## Offline by construction

- No CDN, remote font, remote module or first-run download. The only library, PDF.js 3.11.174, is in `vendor/`.
- No `fetch`/XHR is used at all: PDFs, CMaps, fonts and the PDF.js worker are loaded through `<script>` tags, which is what makes `file://` work. The worker runs as a real background thread (Blob URL), with an automatic main-thread fallback.
- The acceptance run starts Chrome with name resolution disabled and records zero non-local requests.

## Tests / 受け入れテスト

- `test-results.md` — T1–T5 from `ACCEPTANCE.md`: pass/fail, what the tool showed, the expected answer. Screenshots in `test-evidence/`.
- `acceptance.html` — double-click it to re-check by eye: each question is a link that opens the app with that search.
- `node tools/acceptance.mjs` — repeats the recorded run (drives the real UI over `file://` in headless Chrome; needs Node 22+ and a local Chrome, no packages, no network).

## Files

```
index.html  app.css          the app
js/search.js                 search engine (matching, ranking, evidence lines)
js/core.js                   PDF.js setup, library, text extraction, IndexedDB
js/ui.js                     the screen
pdfs/                        bundled PDFs (+ embedded/ and manifest.js, generated)
vendor/pdfjs/                PDF.js as shipped
vendor/pdfjs-embedded/       the same resources wrapped for <script> loading (generated)
tools/                       optional Node scripts: build-embedded, acceptance, browser driver
acceptance.html  test-results.md  test-evidence/
```
