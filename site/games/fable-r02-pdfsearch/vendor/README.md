Vendored libraries for offline file:// use. Do not replace these with a CDN.

pdfjs/: pdfjs-dist 3.11.174 legacy classic scripts (`build/pdf.min.js`, `build/pdf.worker.min.js`), plus `cmaps/` and `standard_fonts/` for Japanese PDF text. Unmodified upstream files (Apache-2.0; font licenses are inside `standard_fonts/`).

pdfjs-embedded/: generated from `pdfjs/` by `node tools/build-embedded.mjs`. Same bytes, wrapped in `.js` files so the app can load them with `<script>` tags, because browsers block fetch/XHR/Worker on file:// URLs:
- `cmaps/*.bcmap.js`, `standard_fonts/*.js` — loaded one by one, only when a PDF needs them.
- `worker-source.js` — the PDF.js worker as a string, started as a real Worker from a Blob URL.
Do not edit by hand; re-run the script if `pdfjs/` is ever updated.
