Vendored libraries for offline file:// use. Do not replace these with a CDN.

pdfjs/: pdfjs-dist 3.11.174 legacy classic scripts (`build/pdf.min.js`, `build/pdf.worker.min.js`), plus `cmaps/` and `standard_fonts/` for Japanese PDF text. Unmodified upstream files (Apache-2.0; font licenses are inside `standard_fonts/`).

pdfjs-embedded/: generated from `pdfjs/` by `node tools/build-embedded.mjs`. Same bytes, wrapped in `.js` files so the app can load them with `<script>` tags, because browsers block fetch/XHR/Worker on file:// URLs:
- `cmaps/*.bcmap.js`, `standard_fonts/*.js` — loaded one by one, only when a PDF needs them.
- `worker-source.js` — the PDF.js worker as a string, started as a real Worker from a Blob URL.
Do not edit by hand; re-run the script if `pdfjs/` is ever updated.

tesseract/: the offline OCR engine and its language data (added in R2, used only for scanned pages).
Obtained once from the public npm registry during development, for bundling only; nothing is fetched at run time.

| File | Package | Version | License | Source | sha256 |
|---|---|---|---|---|---|
| `tesseract/tesseract-core-simd-lstm.wasm.js` (Tesseract compiled to WebAssembly, LSTM engine, SIMD; the .wasm is embedded in the .js) | `tesseract.js-core` | 6.1.2 | Apache-2.0 (`tesseract/LICENSE-tesseract.js-core`) | https://registry.npmjs.org/tesseract.js-core/-/tesseract.js-core-6.1.2.tgz (tarball sha256 `1b5863e7d912de9fc639222a38ede7876b2344565f8ad8d9527b242b0d793e24`) · https://github.com/naptha/tesseract.js-core | `9d7c43fb206dc9f48475228b46bf35f888fa9e6259da2e67d5a75c77049f2dc7` |
| `tesseract/lang/eng.traineddata.gz` (`4.0.0_best_int`) | `@tesseract.js-data/eng` | 1.0.0 | MIT (package); the data is the official Tesseract tessdata, Apache-2.0 | https://registry.npmjs.org/@tesseract.js-data/eng/-/eng-1.0.0.tgz (tarball sha256 `c9bddf2e2f0a214ac7918f3f4a3caf45e09ce8674fe26662ae7787ac8927f7bb`) · https://github.com/naptha/tessdata | `45b4cb346724ac1774f1c36f42f182b887bcdb28ebe63e6fff90ac41f3fcff91` |
| `tesseract/lang/jpn.traineddata.gz` (`4.0.0_best_int`) | `@tesseract.js-data/jpn` | 1.0.0 | same | https://registry.npmjs.org/@tesseract.js-data/jpn/-/jpn-1.0.0.tgz (tarball sha256 `0a04436991da81e01c4c3a9549643365fff643495b8988755c565913517b7cc7`) | `2b63ebfbf1484de4a08ce53b29ef98a1c17658a93cbd38acb665d7d316d0be88` |
| `tesseract/lang/jpn_vert.traineddata.gz` (`4.0.0_best_int`) | `@tesseract.js-data/jpn_vert` | 1.0.0 | same | https://registry.npmjs.org/@tesseract.js-data/jpn_vert/-/jpn_vert-1.0.0.tgz (tarball sha256 `80e0ec4d492617dc27633df5cf7b020790f4419634a67e9371e3463b12840bc7`) | `3a4f4df8df8f50f3389fe0da10502effced38faef763d8e540142bdc9b770308` |

Only the engine core is used; the `tesseract.js` wrapper package is not (its worker fetches over HTTP, which a file:// page cannot do).
The app talks to the core directly from its own Blob worker (`js/indexer.js`, `PS_OCR_WORKER`).
The non-SIMD build is not bundled: WebAssembly SIMD is available in Chrome 91+, Edge 91+, Firefox 89+, Safari 16.4+.

tesseract-embedded/: generated from `tesseract/` by `node tools/build-embedded.mjs` — the same bytes wrapped as base64 in `.js`
files (`core.js`, `eng.js`, `jpn.js`, `jpn_vert.js`, about 15 MB together), loaded with `<script>` tags the first time a scanned page needs OCR.

pdfjs-embedded/display-source.js: `pdfjs/build/pdf.min.js` as a string (generated). The background index worker is a Blob worker
and cannot `importScripts()` a file:// URL, so it is assembled from this string and `worker-source.js`.
