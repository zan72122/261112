# 検証結果 (自動生成)

`node verify/report.mjs` が `verify/results/*.json` から生成。すべて **ヘッドレス Chromium (Playwright) + SwiftShader(CPU 描画)** での結果で、**実機 iPad での検証ではない**。
操作は CDP の `Input.dispatchTouchEvent` → ブラウザの Pointer Events 経路。ゲーム内部の状態は読み取りのみ (`window.__gf` の読み取り専用関数)。

## 通し遊び 820x1180 (full)

合格 66 / 不合格 0 ／ 実時間 1129 秒・ゲーム内 732 秒・鳴らした音 485 回

- ✔ 最初の一画面: 納品箱の牛乳・棚の空き・隣の牛乳が画面内 `{"milk1":[128,891],"slot0":[211,277],"milk2":[282,278]}`
- ✔ 当たり判定は 64 CSS px 以上 (最小でも直径68px) `{"apple":68,"milk":68}`
- ✔ 最初のタッチ前は音が始まっていない `"none"`
- ✔ 約4秒の放置でお手本の手が出る `{"hints":1,"idleSecWhenShown":4.02}`
- ✔ お手本の手は入力で即消える `{"hintAfterTouch":false}`
- ✔ お手本は放置のたびに一度だけ (くり返さない) `{"hints":2}`
- ✔ 牛乳を置く前は別工程の品は小さく応答するだけ (動かせない) `{"before":[294,529],"after":[294,529]}`
- ✔ 最初のタッチで Web Audio が始まる `{"state":"running","sounds":7}`
- ✔ 牛乳は指を動かした次の描画フレームで本体が動く (60fps なら約17ms、30fps でも約33ms = 100ms以内) `{"frames":1,"ms":17.7,"inputMs":9.6,"fps":3.8,"note":"frames=入力から反映までの描画フレーム数。ms はこのヘッドレス環境(低fps)での実測で、実機の値ではない"}`
- ✔ 牛乳が棚の空きへ「ことん」と収まる `{"loc":"shelf","slot":0,"sounds":12}`
- ✔ 発見1: 手前のりんごを取ると奥のりんごが前へ転がる `{"before":0.088,"after":0}`
- ✔ 発見1: 同じ列へ戻すと奥に入り、次に出る品が変わる `[["apple2","apple1"],[],[]]`
- ✔ 発見1: 列を変えると元の列は次の品が前へ出る `[["apple1"],["apple2"],[]]`
- ✔ いちごパックも納品箱から傾斜トレーへ並べられる `[["apple1"],["apple2"],["berry"]]`
- ✔ 棚の牛乳を別の空きへ並べ替えられる `{"loc":"shelf","slot":2,"ord":0,"sc":0,"paid":0,"bx":0,"by":0.2,"ba":0,"tidy":1}`
- ✔ 撮影 scene1 `{"ms":70737,"station":0,"pixelRatio":1,"errors":[]}`
- ✔ 好きな品をかごへ集められる `{"milk1":"basket","apple1":"basket","berry":"basket","bread":"basket"}`
- ✔ かごの品を棚へ戻せる (逆戻り)
- ✔ かごをレジ側へ運ぶと同じ品のままレジ場面へ `{"basket":"reg"}`
- ✔ 未読が残るうちの丸ボタンは会計にならない (未読品が寄るだけ) `{"presses":1,"pays":0}`
- ✔ スキャナーをかざすと最も近い一品ずつ読み、読取ごとに光と「ピッ」が一度 `{"reads":2,"strongFlashes":2,"scannedItems":2}`
- ✔ 撮影 scene2 `{"ms":66998,"station":1,"pixelRatio":1,"errors":[]}`
- ✔ 読んだ品は補助店員の手が右の受け台へ移す (全品) `{"reads":4,"locs":["tray","tray","tray","tray"]}`
- ✔ 再読取は短い確認光だけで登録は増えない `{"reads":4,"flash":{"id":"milk1","strong":false,"t":179.42910000000705},"weak":1}`
- ✔ 丸ボタン連打でも会計確定は一度だけ `{"presses":2,"pays":1}`
- ✔ 会計後は同じ受け台が袋の隣へ滑る (品もそのまま)
- ✔ 発見2: 左へ牛乳 → 左の底が深く垂れ、左の持ち手が張る `{"x":-0.041,"bottoms":[1.9,0.3,0.3,0.62,1.51,2.3],"strainL":0.0259,"strainR":0.014}`
- ✔ 袋から出して受け台へ戻せる
- ✔ 発見2: 同じ位置のりんごより牛乳のほうが持ち手が張る `{"milk":0.0259,"apple":0.0159}`
- ✔ 発見2: 中央・右へ移すとたわむ場所と張る持ち手も移る `{"center":{"x":0.01,"bottoms":[2.27,1.44,0.3,0.3,1.36,2.22],"strainL":0.0136,"strainR":0.0139},"right":{"x":0.067,"bottoms":[6.17,3.47,1.55,0.35,0.3,0.3],"strainL":0.0103,"strainR":0.0284}}`
- ✔ 発見3: 支えの牛乳を引き抜くとりんごが空いた底へ転がる `{"before":[-0.017,0.053],"after":[-0.004,1.159]}`
- ✔ 発見3: 別方向から差し戻すと収まり方が変わる `{"milkBefore":0.063,"milkAfter":-0.045,"appleBefore":-0.017,"appleAfter":0.061}`
- ✔ 発見4: 牛乳の陰(口の肩の下)の品は口を開く前はつかめない (小さく応えるだけ) `{"reach":false,"drag":"none","hidden":[0.088,0.042],"milk":[0.015,0.109,-0.028],"band":[-0.05,0.05]}`
- ✔ 発見4: 袋掛けが片側を支えたまま反対の持ち手を横へ引くと口が広がり、離しても開いたまま `{"mouthRest":[-0.131,0.13,0.384],"mouthLeftOpen":[-0.195,0.108,0.372],"mouthRightOpen":[-0.111,0.191,0.381]}`
- ✔ 発見4: 開く方向で届く場所が変わる (左を開くと左へ、右を開くと右へ) `{"rest":[-0.05,0.05],"leftOpen":[-0.336,0.05],"rightOpen":[-0.05,0.336],"hiddenReach":{"rest":false,"leftOpen":true,"rightOpen":true}}`
- ✔ 発見4: 口を開くと陰の品をつかんで取り出せる `{"drag":"body","loc":"tray"}`
- ✔ 発見5: 横向きのパンは両端が袋口に載る `{"bread":{"id":"bread","x":0.029,"y":0.414,"a":1.548,"in":false,"all":false,"held":false,"reach":true},"mouthY":0.376}`
- ✔ 発見5: 端をつかむと先が下を向き、入れると上だけ残る `{"hangingAngle":3.142,"final":{"id":"bread","x":-0.007,"y":0.216,"a":3.592,"in":true,"all":false,"held":false,"reach":true},"tries":1}`
- ✔ 発見5: 牛乳の位置を変えるとパンの斜め方向も変わる `{"angles":[3.592,3.158,3.071],"movedMilk":"tray"}`
- ✔ 会計済みの品が袋に入っている `{"inBag":["milk1","apple1","berry","bread"],"sim":[["milk1",-0.08,0.108,true],["apple1",-0.006,0.04,true],["berry",0.118,0.039,true],["bread",-0.03,0.269,true]]}`
- ✔ 撮影 scene3 `{"ms":67623,"station":2,"pixelRatio":1,"errors":[]}`
- ✔ 持ち手を上へ引くと両持ち手をまとめて持ち上げる `{"drag":"handle:lift"}`
- ✔ 発見6: 横へ運んで止めると底が遅れて揺れる `{"ampFast":0.028,"fast":[0.002,0.02,0.016,0.003,-0.006,-0.008,-0.007,-0.003,0,0.001,0,-0.001,-0.002,-0.002]}`
- ✔ 発見6: ゆっくり運ぶと揺れが小さい `{"ampFast":0.028,"ampSlow":0.004}`
- ✔ 発見6: 台へ置くと揺れが収まり、離すと袋掛けへ戻る `{"ampRest":0.0010000000000000009,"bagWhere":"rack"}`
- ✔ 持った袋を近づけると客が手を伸ばして受け取りの構えをとる `{"x":0.339,"y":0.62,"z":0.041,"bow":0.42,"lean":0,"support":false,"arm1":true}`
- ✔ 重い袋 (1.25kg超) では客がもう一方の手を底へ添える `{"mass":1.96,"support":true,"arm1":true}`
- ✔ 離すと客が受け取り、同じ袋・同じ品が客の手に `{"bodies":["milk1","apple1","berry","bread"],"support":true}`
- ✔ 渡した袋に触れると客が同じ袋を台へ戻す (品はそのまま・会計も増えない) `{"bodies":["milk1","apple1","berry","bread"],"pays":1}`
- ✔ 取り出した品を再読取・再度ボタンを押しても登録と会計は増えない `{"reads":4,"pays":1}`
- ✔ 手渡しとおじぎのあと店じまいへ (渡した袋の中身だけが売れ、ほかは残る・複製なし) `{"handed":["apple1","berry","bread","milk1"],"sold":["apple1","berry","bread","milk1"],"leftOnTray":[],"milk2":"shelf","apple2":"lane"}`
- ✔ 売れた棚で残品が奥に引っ込んでいる
- ✔ 残品に触れると前へ寄る
- ✔ 空かごを重ねられる
- ✔ シャッターは引いたぶん下がり、離すとその位置で止まる `{"shutter":0.5076757527907478}`
- ✔ 撮影 scene4-shutter `{"ms":17381,"station":3,"pixelRatio":1,"errors":[]}`
- ✔ 閉じ切るとカメラが日中の店先へ移る
- ✔ はなまるを受け取るまではシャッターは開かない
- ✔ 店長が白いカードにはなまるを押して渡す `{"x":238,"y":885,"visible":true}`
- ✔ 撮影 scene4-storefront `{"ms":25143,"station":4,"pixelRatio":1,"errors":[]}`
- ✔ 上へ引くと再開店: 新しい取引として補充される `{"milk1":"crate","apple1":"crate","berry":"crate","bread":"bin"}`
- ✔ 前回整えた棚の並びは残る `{"milk2":{"loc":"shelf","slot":2,"ord":0,"sc":0,"paid":0,"bx":0,"by":0.2,"ba":0,"tidy":1},"apple2":{"loc":"lane","slot":1,"ord":0,"sc":0,"paid":0,"bx":0,"by":0.2,"ba":0,"tidy":1}}`
- ✔ 再開店後も納品箱の牛乳から始められる `[127,892]`
- ✔ 2日目も同じ操作で遊べる
- ✔ コンソールエラー 0 `[]`
- ✔ 外部リクエスト 0 (自分自身の HTML のみ) `["file:///home/user/261112/games/261112-3/index.html?low=1&rs=0.25&fixed=1"]`

## 通し遊び 375x667 (core)

合格 37 / 不合格 0 ／ 実時間 356 秒・ゲーム内 237 秒・鳴らした音 211 回

- ✔ 最初の一画面: 納品箱の牛乳・棚の空き・隣の牛乳が画面内 `{"milk1":[44,487],"slot0":[84,171],"milk2":[121,172]}`
- ✔ 当たり判定は 64 CSS px 以上 (最小でも直径68px) `{"apple":68,"milk":68}`
- ✔ 最初のタッチ前は音が始まっていない `"none"`
- ✔ 牛乳は指を動かした次の描画フレームで本体が動く (60fps なら約17ms、30fps でも約33ms = 100ms以内) `{"frames":1,"ms":8,"inputMs":4.7,"fps":7.6,"note":"frames=入力から反映までの描画フレーム数。ms はこのヘッドレス環境(低fps)での実測で、実機の値ではない"}`
- ✔ 牛乳が棚の空きへ「ことん」と収まる `{"loc":"shelf","slot":0,"sounds":5}`
- ✔ 発見1: 手前のりんごを取ると奥のりんごが前へ転がる `{"before":0.088,"after":0}`
- ✔ 発見1: 同じ列へ戻すと奥に入り、次に出る品が変わる `[["apple2","apple1"],[],[]]`
- ✔ 撮影 scene1 `{"ms":32857,"station":0,"pixelRatio":1,"errors":[]}`
- ✔ 好きな品をかごへ集められる `{"milk1":"basket","apple1":"basket","berry":"basket","bread":"basket"}`
- ✔ かごをレジ側へ運ぶと同じ品のままレジ場面へ `{"basket":"reg"}`
- ✔ 未読が残るうちの丸ボタンは会計にならない (未読品が寄るだけ) `{"presses":1,"pays":0}`
- ✔ スキャナーをかざすと最も近い一品ずつ読み、読取ごとに光と「ピッ」が一度 `{"reads":2,"strongFlashes":2,"scannedItems":2}`
- ✔ 撮影 scene2 `{"ms":34388,"station":1,"pixelRatio":1,"errors":[]}`
- ✔ 読んだ品は補助店員の手が右の受け台へ移す (全品) `{"reads":4,"locs":["tray","tray","tray","tray"]}`
- ✔ 再読取は短い確認光だけで登録は増えない `{"reads":4,"flash":{"id":"milk1","strong":false,"t":85.44599999999821},"weak":1}`
- ✔ 丸ボタン連打でも会計確定は一度だけ `{"presses":3,"pays":1}`
- ✔ 会計後は同じ受け台が袋の隣へ滑る (品もそのまま)
- ✔ 会計済みの品が袋に入っている `{"inBag":["milk1","apple1","berry","bread"],"sim":[["milk1",-0.076,0.11,true],["apple1",-0.005,0.04,true],["berry",0.064,0.086,true],["bread",0.056,0.296,true]]}`
- ✔ 撮影 scene3 `{"ms":28200,"station":2,"pixelRatio":1,"errors":[]}`
- ✔ 持った袋を近づけると客が手を伸ばして受け取りの構えをとる `{"x":0.256,"y":0.641,"z":0.041,"bow":0.42,"lean":0.042,"support":false,"arm1":false}`
- ✔ 重い袋 (1.25kg超) では客がもう一方の手を底へ添える `{"mass":1.96,"support":true,"arm1":true}`
- ✔ 離すと客が受け取り、同じ袋・同じ品が客の手に `{"bodies":["milk1","apple1","berry","bread"],"support":true}`
- ✔ 手渡しとおじぎのあと店じまいへ (渡した袋の中身だけが売れ、ほかは残る・複製なし) `{"handed":["apple1","berry","bread","milk1"],"sold":["apple1","berry","bread","milk1"],"leftOnTray":[],"milk2":"shelf","apple2":"lane"}`
- ✔ 売れた棚で残品が奥に引っ込んでいる
- ✔ 残品に触れると前へ寄る
- ✔ 空かごを重ねられる
- ✔ シャッターは引いたぶん下がり、離すとその位置で止まる `{"shutter":0.5086413591493122}`
- ✔ 撮影 scene4-shutter `{"ms":27090,"station":3,"pixelRatio":1,"errors":[]}`
- ✔ 閉じ切るとカメラが日中の店先へ移る
- ✔ はなまるを受け取るまではシャッターは開かない
- ✔ 店長が白いカードにはなまるを押して渡す `{"x":109,"y":500,"visible":true}`
- ✔ 撮影 scene4-storefront `{"ms":30830,"station":4,"pixelRatio":1,"errors":[]}`
- ✔ 上へ引くと再開店: 新しい取引として補充される `{"milk1":"crate","apple1":"crate","berry":"crate","bread":"bin"}`
- ✔ 前回整えた棚の並びは残る `{"milk2":{"loc":"shelf","slot":1,"ord":0,"sc":0,"paid":0,"bx":0,"by":0.2,"ba":0,"tidy":1},"apple2":{"loc":"lane","slot":0,"ord":0,"sc":0,"paid":0,"bx":0,"by":0.2,"ba":0,"tidy":1}}`
- ✔ 再開店後も納品箱の牛乳から始められる `[43,488]`
- ✔ コンソールエラー 0 `[]`
- ✔ 外部リクエスト 0 (自分自身の HTML のみ) `["file:///home/user/261112/games/261112-3/index.html?low=1&rs=0.25&fixed=1"]`

## 通し遊び 390x844 (core)

合格 37 / 不合格 0 ／ 実時間 391 秒・ゲーム内 252 秒・鳴らした音 207 回

- ✔ 最初の一画面: 納品箱の牛乳・棚の空き・隣の牛乳が画面内 `{"milk1":[48,579],"slot0":[87,251],"milk2":[125,252]}`
- ✔ 当たり判定は 64 CSS px 以上 (最小でも直径68px) `{"apple":68,"milk":68}`
- ✔ 最初のタッチ前は音が始まっていない `"none"`
- ✔ 牛乳は指を動かした次の描画フレームで本体が動く (60fps なら約17ms、30fps でも約33ms = 100ms以内) `{"frames":1,"ms":94.3,"inputMs":2.7,"fps":5.2,"note":"frames=入力から反映までの描画フレーム数。ms はこのヘッドレス環境(低fps)での実測で、実機の値ではない"}`
- ✔ 牛乳が棚の空きへ「ことん」と収まる `{"loc":"shelf","slot":0,"sounds":5}`
- ✔ 発見1: 手前のりんごを取ると奥のりんごが前へ転がる `{"before":0.088,"after":0}`
- ✔ 発見1: 同じ列へ戻すと奥に入り、次に出る品が変わる `[["apple2","apple1"],[],[]]`
- ✔ 撮影 scene1 `{"ms":40101,"station":0,"pixelRatio":1,"errors":[]}`
- ✔ 好きな品をかごへ集められる `{"milk1":"basket","apple1":"basket","berry":"basket","bread":"basket"}`
- ✔ かごをレジ側へ運ぶと同じ品のままレジ場面へ `{"basket":"reg"}`
- ✔ 未読が残るうちの丸ボタンは会計にならない (未読品が寄るだけ) `{"presses":1,"pays":0}`
- ✔ スキャナーをかざすと最も近い一品ずつ読み、読取ごとに光と「ピッ」が一度 `{"reads":2,"strongFlashes":2,"scannedItems":2}`
- ✔ 撮影 scene2 `{"ms":36756,"station":1,"pixelRatio":1,"errors":[]}`
- ✔ 読んだ品は補助店員の手が右の受け台へ移す (全品) `{"reads":4,"locs":["tray","tray","tray","tray"]}`
- ✔ 再読取は短い確認光だけで登録は増えない `{"reads":4,"flash":{"id":"milk1","strong":false,"t":96.9445999999977},"weak":1}`
- ✔ 丸ボタン連打でも会計確定は一度だけ `{"presses":3,"pays":1}`
- ✔ 会計後は同じ受け台が袋の隣へ滑る (品もそのまま)
- ✔ 会計済みの品が袋に入っている `{"inBag":["milk1","apple1","berry","bread"],"sim":[["milk1",-0.047,0.11,true],["apple1",0.022,0.04,true],["berry",0.102,0.089,true],["bread",0.077,0.301,true]]}`
- ✔ 撮影 scene3 `{"ms":31934,"station":2,"pixelRatio":1,"errors":[]}`
- ✔ 持った袋を近づけると客が手を伸ばして受け取りの構えをとる `{"x":0.251,"y":0.68,"z":0.04,"bow":0.42,"lean":0.119,"support":false,"arm1":true}`
- ✔ 重い袋 (1.25kg超) では客がもう一方の手を底へ添える `{"mass":1.96,"support":true,"arm1":true}`
- ✔ 離すと客が受け取り、同じ袋・同じ品が客の手に `{"bodies":["milk1","apple1","berry","bread"],"support":true}`
- ✔ 手渡しとおじぎのあと店じまいへ (渡した袋の中身だけが売れ、ほかは残る・複製なし) `{"handed":["apple1","berry","bread","milk1"],"sold":["apple1","berry","bread","milk1"],"leftOnTray":[],"milk2":"shelf","apple2":"lane"}`
- ✔ 売れた棚で残品が奥に引っ込んでいる
- ✔ 残品に触れると前へ寄る
- ✔ 空かごを重ねられる
- ✔ シャッターは引いたぶん下がり、離すとその位置で止まる `{"shutter":0.5095700167645033}`
- ✔ 撮影 scene4-shutter `{"ms":26008,"station":3,"pixelRatio":1,"errors":[]}`
- ✔ 閉じ切るとカメラが日中の店先へ移る
- ✔ はなまるを受け取るまではシャッターは開かない
- ✔ 店長が白いカードにはなまるを押して渡す `{"x":113,"y":633,"visible":true}`
- ✔ 撮影 scene4-storefront `{"ms":32813,"station":4,"pixelRatio":1,"errors":[]}`
- ✔ 上へ引くと再開店: 新しい取引として補充される `{"milk1":"crate","apple1":"crate","berry":"crate","bread":"bin"}`
- ✔ 前回整えた棚の並びは残る `{"milk2":{"loc":"shelf","slot":1,"ord":0,"sc":0,"paid":0,"bx":0,"by":0.2,"ba":0,"tidy":1},"apple2":{"loc":"lane","slot":0,"ord":0,"sc":0,"paid":0,"bx":0,"by":0.2,"ba":0,"tidy":1}}`
- ✔ 再開店後も納品箱の牛乳から始められる `[48,580]`
- ✔ コンソールエラー 0 `[]`
- ✔ 外部リクエスト 0 (自分自身の HTML のみ) `["file:///home/user/261112/games/261112-3/index.html?low=1&rs=0.25&fixed=1"]`

## 通し遊び 1180x820 (core)

合格 37 / 不合格 0 ／ 実時間 702 秒・ゲーム内 313 秒・鳴らした音 207 回

- ✔ 最初の一画面: 納品箱の牛乳・棚の空き・隣の牛乳が画面内 `{"milk1":[394,619],"slot0":[452,192],"milk2":[501,193]}`
- ✔ 当たり判定は 64 CSS px 以上 (最小でも直径68px) `{"apple":68,"milk":68}`
- ✔ 最初のタッチ前は音が始まっていない `"none"`
- ✔ 牛乳は指を動かした次の描画フレームで本体が動く (60fps なら約17ms、30fps でも約33ms = 100ms以内) `{"frames":1,"ms":8,"inputMs":7.3,"fps":5.2,"note":"frames=入力から反映までの描画フレーム数。ms はこのヘッドレス環境(低fps)での実測で、実機の値ではない"}`
- ✔ 牛乳が棚の空きへ「ことん」と収まる `{"loc":"shelf","slot":0,"sounds":5}`
- ✔ 発見1: 手前のりんごを取ると奥のりんごが前へ転がる `{"before":0.088,"after":0}`
- ✔ 発見1: 同じ列へ戻すと奥に入り、次に出る品が変わる `[["apple2","apple1"],[],[]]`
- ✔ 撮影 scene1 `{"ms":75818,"station":0,"pixelRatio":1,"errors":[]}`
- ✔ 好きな品をかごへ集められる `{"milk1":"basket","apple1":"basket","berry":"basket","bread":"basket"}`
- ✔ かごをレジ側へ運ぶと同じ品のままレジ場面へ `{"basket":"reg"}`
- ✔ 未読が残るうちの丸ボタンは会計にならない (未読品が寄るだけ) `{"presses":1,"pays":0}`
- ✔ スキャナーをかざすと最も近い一品ずつ読み、読取ごとに光と「ピッ」が一度 `{"reads":2,"strongFlashes":2,"scannedItems":2}`
- ✔ 撮影 scene2 `{"ms":70476,"station":1,"pixelRatio":1,"errors":[]}`
- ✔ 読んだ品は補助店員の手が右の受け台へ移す (全品) `{"reads":4,"locs":["tray","tray","tray","tray"]}`
- ✔ 再読取は短い確認光だけで登録は増えない `{"reads":4,"flash":{"id":"milk1","strong":false,"t":124.9133999999958},"weak":1}`
- ✔ 丸ボタン連打でも会計確定は一度だけ `{"presses":2,"pays":1}`
- ✔ 会計後は同じ受け台が袋の隣へ滑る (品もそのまま)
- ✔ 会計済みの品が袋に入っている `{"inBag":["milk1","apple1","berry","bread"],"sim":[["milk1",-0.079,0.111,true],["apple1",-0.013,0.04,true],["berry",0.086,0.087,true],["bread",0.055,0.295,true]]}`
- ✔ 撮影 scene3 `{"ms":65168,"station":2,"pixelRatio":1,"errors":[]}`
- ✔ 持った袋を近づけると客が手を伸ばして受け取りの構えをとる `{"x":0.372,"y":0.649,"z":0.039,"bow":0.42,"lean":0.063,"support":false,"arm1":true}`
- ✔ 重い袋 (1.25kg超) では客がもう一方の手を底へ添える `{"mass":1.96,"support":true,"arm1":true}`
- ✔ 離すと客が受け取り、同じ袋・同じ品が客の手に `{"bodies":["milk1","apple1","berry","bread"],"support":true}`
- ✔ 手渡しとおじぎのあと店じまいへ (渡した袋の中身だけが売れ、ほかは残る・複製なし) `{"handed":["apple1","berry","bread","milk1"],"sold":["apple1","berry","bread","milk1"],"leftOnTray":[],"milk2":"shelf","apple2":"lane"}`
- ✔ 売れた棚で残品が奥に引っ込んでいる
- ✔ 残品に触れると前へ寄る
- ✔ 空かごを重ねられる
- ✔ シャッターは引いたぶん下がり、離すとその位置で止まる `{"shutter":0.5082802434445477}`
- ✔ 撮影 scene4-shutter `{"ms":51258,"station":3,"pixelRatio":1,"errors":[]}`
- ✔ 閉じ切るとカメラが日中の店先へ移る
- ✔ はなまるを受け取るまではシャッターは開かない
- ✔ 店長が白いカードにはなまるを押して渡す `{"x":342,"y":615,"visible":true}`
- ✔ 撮影 scene4-storefront `{"ms":69128,"station":4,"pixelRatio":1,"errors":[]}`
- ✔ 上へ引くと再開店: 新しい取引として補充される `{"milk1":"crate","apple1":"crate","berry":"crate","bread":"bin"}`
- ✔ 前回整えた棚の並びは残る `{"milk2":{"loc":"shelf","slot":1,"ord":0,"sc":0,"paid":0,"bx":0,"by":0.2,"ba":0,"tidy":1},"apple2":{"loc":"lane","slot":0,"ord":0,"sc":0,"paid":0,"bx":0,"by":0.2,"ba":0,"tidy":1}}`
- ✔ 再開店後も納品箱の牛乳から始められる `[394,620]`
- ✔ コンソールエラー 0 `[]`
- ✔ 外部リクエスト 0 (自分自身の HTML のみ) `["file:///home/user/261112/games/261112-3/index.html?low=1&rs=0.25&fixed=1"]`

## 一品での完了・逆戻り・放置・連打・回転・非表示復帰・マルチタッチ (390x844)

合格 20 / 不合格 0

- ✔ マルチタッチ: 2本目の指を無視し、1本目のドラッグが最後まで成立 `{"drag":"item","loc":"shelf"}`
- ✔ pointercancel: つかみが解除され、品は支持面に戻る `{"loc":"lane","mode":"lane"}`
- ✔ 画面回転(縦→横): つかみが解除され支持面へ、横画面でも主要物が画面内 `{"apple2":"lane","milk2":[380,92],"basket":[489,297]}`
- ✔ 横画面でも同じ操作が成立 (りんごをかごへ)
- ✔ 画面回転(横→縦): 状態はそのまま
- ✔ 逆戻り: 棚へ戻ってもかごと品はレジに残り、巻き戻らない
- ✔ 逆戻り: かごを棚側へ持ち帰れる (会計前)
- ✔ 非表示: つかみを解除し、描画と進行が止まる `{"frames":[614,614],"time":[29.4,29.4],"audio":"suspended"}`
- ✔ 復帰: 非表示だった時間 (2.5 秒超) は進行に加算されない (復帰後の進みは見えていた実時間以内) `{"advancedGameSec":0.48,"visibleWallSec":0.46,"hiddenSec":2.8}`
- ✔ 放置 20 秒: 状態は変わらず、お手本は一度だけ `{"hints":[1,0]}`
- ✔ 連打 40 回: 壊れず、未読のまま会計は成立しない `{"presses":8,"pays":0,"station":1}`
- ✔ 一品だけで会計まで進める (連打でも一度)
- ✔ 袋の手前で離しても近い支え(袋)へ収まる `[{"id":"apple1","x":-0.01,"y":0.044,"a":0.113,"in":true,"all":true,"held":false,"reach":true}]`
- ✔ 袋を持ち上げたまま非表示→復帰: 袋は袋掛けへ戻り中身も無事 `{"bagWhere":"rack"}`
- ✔ 一品での完了: りんご1個の袋を渡して店じまいへ
- ✔ シャッターを上下に往復しても壊れない `{"shutter":0}`
- ✔ 店先で画面回転してもカードは画面内 `{"x":245,"y":293,"visible":true}`
- ✔ 再開店: 売れた一品だけ納品箱へ補充、ほかは前日の場所のまま
- ✔ コンソールエラー 0 `[]`
- ✔ 外部リクエスト 0 `["file:///home/user/261112/games/261112-3/index.html?low=1&rs=0.3&fixed=1"]`

## 見えている棚・レジ・袋台に触れて行き来 (1180x820)

合格 9 / 不合格 0

- ✔ 棚の場面でレジ(スキャナー)が画面内に見えている `{"x":1098,"y":300}`
- ✔ 見えているレジに触れるとレジへ移動 (状態は変わらない・かごは棚に残る)
- ✔ レジの場面で棚(パンのかご)が画面内に見えている `{"x":109,"y":210}`
- ✔ 見えている棚に触れると棚へ戻る
- ✔ レジの場面で袋掛けが画面内に見えている `{"x":1131,"y":220}`
- ✔ 見えている袋台に触れると袋台へ (会計前でも行ける・かごと品はレジに残る)
- ✔ 袋台の場面でレジ(端末)が画面内に見えている `{"x":319,"y":502}`
- ✔ 見えているレジに触れるとレジへ戻る
- ✔ コンソールエラー 0 `[]`

## 保存拒否・保存破損・復元・WebGL 失敗・音拒否

合格 22 / 不合格 0

- ✔ 保存拒否(setItem が例外): メモリで継続して遊べる `{"loc":"shelf","saveOK":false,"errors":[]}`
- ✔ 保存拒否(localStorage 自体が使えない): 標準配置で始まり遊べる `{"loc":"shelf","saveOK":false,"errors":[]}`
- ✔ 保存破損(壊れたJSON): 拒否して標準配置で開始 `{"day":1,"milk1":"crate","rejected":true,"errors":[]}`
- ✔ 保存破損(空文字): 拒否して標準配置で開始 `{"day":1,"milk1":"crate","rejected":false,"errors":[]}`
- ✔ 保存破損(別バージョン): 拒否して標準配置で開始 `{"day":1,"milk1":"crate","rejected":true,"errors":[]}`
- ✔ 保存破損(値域外(day)): 拒否して標準配置で開始 `{"day":1,"milk1":"crate","rejected":true,"errors":[]}`
- ✔ 保存破損(値域外(shutter)): 拒否して標準配置で開始 `{"day":1,"milk1":"crate","rejected":true,"errors":[]}`
- ✔ 保存破損(不整合(同じ棚に牛乳2つ)): 拒否して標準配置で開始 `{"day":1,"milk1":"crate","rejected":true,"errors":[]}`
- ✔ 保存破損(不整合(未知の場所)): 拒否して標準配置で開始 `{"day":1,"milk1":"crate","rejected":true,"errors":[]}`
- ✔ 保存破損(不整合(未会計なのに袋の中)): 拒否して標準配置で開始 `{"day":1,"milk1":"crate","rejected":true,"errors":[]}`
- ✔ 保存破損(不整合(品が足りない)): 拒否して標準配置で開始 `{"day":1,"milk1":"crate","rejected":true,"errors":[]}`
- ✔ 保存破損(非有限値): 拒否して標準配置で開始 `{"day":1,"milk1":"crate","rejected":true,"errors":[]}`
- ✔ 保存破損(配列): 拒否して標準配置で開始 `{"day":1,"milk1":"crate","rejected":true,"errors":[]}`
- ✔ 検査に通る保存は復元される (日数・棚の並び) `{"day":3,"lanes":[["apple2"],["apple1","berry"],[]]}`
- ✔ 遊びの途中で読み込み直しても同じ状態から続く (品の所在・読取済み・かご・場面・客) `{"station":1,"cust":"atReg","tray":["apple1","bread"]}`
- ✔ 読み込み直しで品が複製・消失しない
- ✔ WebGL 生成失敗: 埋め込み静止画の代替画面を表示 (エラーなし) `{"failed":true,"fb":"block","canvas":"none","w":560,"h":806,"src":"data:image/jpeg;base64","errors":[],"requests":1}`
- ✔ WebGL 喪失→復旧: 描画と遊びが続く `{"frames":[29,32],"errors":[]}`
- ✔ WebGL 喪失→復旧不能 (約4秒): 代替画面へ切り替え `{"failed":true,"fb":"block"}`
- ✔ 音の拒否(AudioContext が作れない): 無音で遊べる `{"audio":false,"errors":[]}`
- ✔ 音の拒否(resume が拒否される): 遊びは続く `{"audioState":"running","errors":[]}`
- ✔ 通常時: 最初のタッチで音が始まり「ことん」が鳴る `{"before":"none","after":"running","sounds":5}`

## 両起動方式 (file:// / http サブフォルダ)・外部リクエスト・容量

合格 7 / 不合格 0

- ✔ index.html は 1 ファイル完結 (script src / link href / @import / 外部画像の参照なし) `{"bytes":702505,"sizeMB":0.67,"externalRefs":{"scriptSrc":false,"linkHref":false,"cssImport":false,"imgSrc":false,"cssUrl":false},"urlLikeStrings":["http://www.w3.org/1999/xhtml"]}`
- ✔ 容量 8MB 以内 `{"MB":0.67}`
- ✔ file://: 起動して遊べる / リクエストは自身のHTMLのみ / コンソールエラー0 `{"requests":["file:///home/user/261112/games/261112-3/index.html?low=1&rs=0.25&fixed=1"],"errors":[]}`
- ✔ file:// (既定の画質): 起動して遊べる / リクエストは自身のHTMLのみ / コンソールエラー0 `{"requests":["file:///home/user/261112/games/261112-3/index.html"],"errors":[]}`
- ✔ http サブフォルダ: 起動して遊べる / リクエストは自身のHTMLのみ / コンソールエラー0 `{"requests":["http://127.0.0.1:37523/261112/games/261112-3/?low=1&rs=0.25&fixed=1"],"errors":[]}`
- ✔ http サブフォルダ index.html (既定の画質): 起動して遊べる / リクエストは自身のHTMLのみ / コンソールエラー0 `{"requests":["http://127.0.0.1:37523/261112/games/261112-3/index.html"],"errors":[]}`
- ✔ サーバーが受けたリクエストはゲームの HTML だけ `["/261112/games/261112-3/?low=1&rs=0.25&fixed=1","/261112/games/261112-3/index.html"]`

## 実測値 (820x1180 の通し遊びから)

- 入力→牛乳が動くまでの描画フレーム数 / このヘッドレス環境での ms: `{"frames":1,"ms":17.7,"inputMs":9.6,"fps":3.8}`
- 牛乳を棚へ収めるまでのゲーム内秒数 (ドラッグ開始〜「ことん」): `5.74`
- 当たり判定の直径 (CSS px): `{"apple":68,"milk":68}`
- 空の袋: 底の高さ[cm]・持ち手のひずみ: `{"bottoms":[2.98,2.82,2.73,2.73,2.81,2.96],"strainL":0.0006,"strainR":0.0006}`
- 牛乳を左へ: `{"x":-0.041,"bottoms":[1.9,0.3,0.3,0.62,1.51,2.3],"strainL":0.0259,"strainR":0.014}`
- りんごを左へ: `{"x":-0.027,"bottoms":[2.22,1.44,0.3,1.04,1.72,2.43],"strainL":0.0159,"strainR":0.0114}`
- 牛乳を中央へ: `{"x":0.01,"bottoms":[2.27,1.44,0.3,0.3,1.36,2.22],"strainL":0.0136,"strainR":0.0139}`
- 牛乳を右へ: `{"x":0.067,"bottoms":[6.17,3.47,1.55,0.35,0.3,0.3],"strainL":0.0103,"strainR":0.0284}`
- 発見3 (支えの牛乳を抜く前後のりんご): `{"before":{"id":"apple1","x":-0.017,"y":0.041,"a":0.053,"in":true,"all":true,"held":false,"reach":true},"milk":{"id":"milk1","x":0.063,"y":0.11,"a":-0.06,"in":true,"all":true,"held":false,"reach":true},"after":{"id":"apple1","x":-0.004,"y":0.044,"a":1.159,"in":true,"all":true,"held":false,"reach":true}}`
- 発見4 (口の開きと届く範囲): `{"hidden":{"id":"apple1","x":0.088,"y":0.042,"a":1.313,"in":true,"all":true,"held":false,"reach":false},"milk":{"id":"milk1","x":0.015,"y":0.109,"a":-0.028,"in":true,"all":true,"held":false,"reach":true},"mouth0":[-0.131,0.13,0.384],"band0":[-0.05,0.05]}`
- 発見5 (パン): `{"onRim":{"bread":{"id":"bread","x":0.029,"y":0.414,"a":1.548,"in":false,"all":false,"held":false,"reach":true},"mouth":[-0.103,0.093,0.376]},"hangingThenIn":{"hanging":{"id":"bread","x":0.02,"y":0.768,"a":3.142,"in":false,"all":false,"held":true,"reach":true},"final":{"id":"bread","x":-0.007,"y":0.216,"a":3.592,"in":true,"all":false,"held":false,"reach":true}}}`
- 発見6 (運搬後の重心の横ずれ[m] 時系列 0.12 秒間隔): `{"fast":[0.002,0.02,0.016,0.003,-0.006,-0.008,-0.007,-0.003,0,0.001,0,-0.001,-0.002,-0.002],"slow":[-0.003,-0.001,0,0.001,0.001,0,0,0,0,0,0,0,0,0],"ampFast":0.028,"ampSlow":0.004,"settled":[-0.001,-0.001,-0.001,-0.001]}`
- 手渡し直前の客の手: `{"custHand":{"x":0.339,"y":0.62,"z":0.041,"bow":0.42,"lean":0,"support":false,"arm1":true},"com":[0.302,0.431,1.96],"pins":[0.286,0.86,0.312,0.86]}`
- 受け取り後: `{"x":0.556,"y":0.716,"z":-0.429,"bow":0.409,"lean":0,"support":true,"arm1":true}`

## 実測 fps

- 計測環境: ヘッドレス Chromium (Playwright) + ANGLE/SwiftShader の CPU 描画。GPU なし。実機 iPad の計測ではない。
- レンダラ: `ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver)`
- CPU: Intel(R) Xeon(R) Processor @ 2.10GHz × 4 論理コア / メモリ 16GB / devicePixelRatio 1
- 計測対象: 場面1 (朝の陳列) を起動後 4 秒おいてから計測、各 10 秒

| サイズ | 条件 | fps | 遊びの速さ(実時間比) | 描画解像度 | pixelRatio | 動的解像度の倍率 | 低負荷モード | draw calls | 三角形 |
|---|---|---|---|---|---|---|---|---|---|
| 375x667 | 既定 (動的解像度あり・自動で低負荷化) `(なし)` | 3.8 | 0.48 | 188x334 | 0.5 | 0.5 | ON | 98 | 47072 |
| 375x667 | 低負荷モード指定 `?low=1` | 12.5 | 1.01 | 188x334 | 0.5 | 0.5 | ON | 98 | 44176 |
| 375x667 | 検証用の低解像度 (操作テストで使用) `?low=1&rs=0.25&fixed=1` | 25.7 | 1 | 94x167 | 0.25 | 1 | ON | 98 | 44176 |
| 390x844 | 既定 (動的解像度あり・自動で低負荷化) `(なし)` | 3.6 | 0.46 | 195x422 | 0.5 | 0.5 | ON | 97 | 47060 |
| 390x844 | 低負荷モード指定 `?low=1` | 10.4 | 0.97 | 195x422 | 0.5 | 0.5 | ON | 97 | 44164 |
| 390x844 | 検証用の低解像度 (操作テストで使用) `?low=1&rs=0.25&fixed=1` | 24.2 | 1 | 98x211 | 0.25 | 1 | ON | 97 | 44164 |
| 820x1180 | 既定 (動的解像度あり・自動で低負荷化) `(なし)` | 0.6 | 0.08 | 410x590 | 0.5 | 0.5 | ON | 101 | 47168 |
| 820x1180 | 低負荷モード指定 `?low=1` | 1.1 | 0.22 | 410x590 | 0.5 | 0.5 | ON | 120 | 49748 |
| 820x1180 | 検証用の低解像度 (操作テストで使用) `?low=1&rs=0.25&fixed=1` | 12.8 | 1.01 | 205x295 | 0.25 | 1 | ON | 101 | 44272 |
| 1180x820 | 既定 (動的解像度あり・自動で低負荷化) `(なし)` | 0.8 | 0.12 | 590x410 | 0.5 | 0.5 | ON | 118 | 55448 |
| 1180x820 | 低負荷モード指定 `?low=1` | 3.4 | 0.6 | 590x410 | 0.5 | 0.5 | ON | 118 | 52552 |
| 1180x820 | 検証用の低解像度 (操作テストで使用) `?low=1&rs=0.25&fixed=1` | 14.2 | 1 | 295x205 | 0.25 | 1 | ON | 118 | 52552 |

※ ソフトウェア描画 (GPU なし) の値。iPad の GPU での fps は未計測。

## 合計

合格 235 / 不合格 0
