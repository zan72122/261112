# 検証記録 — せんたくびより！くるくるドラムとおひさま（261112-1）

識別子: `gf-261112-nx1`

このファイルの表は `verify/report.js` が結果JSON（`results-*.json`）から生成しています。数値はすべて下記環境での実測で、
**iPad 実機での測定ではありません**。

## 実行環境

- クラウド上のコンテナ（Linux 6.18, Intel Xeon 2.30GHz 4コア, GPUなし）
- Playwright 1.63 / Chrome for Testing 153（headless shell）、WebGL は ANGLE + SwiftShader（**ソフトウェア描画**）
- 入力: CDP `Input.dispatchTouchEvent` による実タッチ → ブラウザが生成する Pointer Events（`pointerType: touch`）。
  ゲーム内関数を呼んで操作を代用していません。`page.evaluate` は「物が画面のどこにあるか」「何が起きたか」を読むためだけに使っています
  （`window.__T` は読み取り専用の状態・座標取得フック）。
- ソフトウェア描画は 3〜9 fps 程度しか出ないため、検証時は URL に `?steps=20&dtmax=0.15` を付けています。
  これは「1フレームで進める物理ステップ数と経過時間の上限」を上げるだけで、1ステップの物理・判定は同じです
  （付けないと低fps環境ではゲームがスローモーションになり、検証に数時間かかります）。

## スクリプト

| スクリプト | 内容 |
|---|---|
| `play.js` | 最初の1タッチからはなまるカード、再洗濯まで一続きに遊ぶ。七つの発見と同一布の状態引継ぎを確認 |
| `robust.js` | 追加指・pointercancel・連打・回転・非表示/復帰・放置・保存の拒否/破損/復元・WebGL失敗・音拒否・低負荷・`file://`とサブフォルダ配信 |
| `shots.js` | 375×667 / 390×844 / 820×1180 / 1180×820 の各五場面を撮影し fps を記録。場面1〜3はそのサイズで実タッチで到達、場面4・5は `play.js` がその時点で書き出したセーブ（ゲーム自身の保存/復元機能）を読み込んで表示 |

- 検証対象: `index.html` 732417 bytes（0.70 MB）, sha256 `b0f95da7a28559b6…`

## 通しプレイ（実タッチ入力）: 640×440

- 実行: 2026-11-11T22:23:22.646Z 〜 2026-11-11T22:45:27.238Z／結果: **69 合格, 0 不合格**
- 終了時: ゲーム内時間 1237.113 秒, fps(移動平均) 7.509, 低負荷モード true, 解像度倍率 0.55, 音 running
- コンソールエラー 0 件／外部リクエスト 0 件／出た指のお手本: load, load1, close, knob2, open, takeout, hang, hang2, stand, takein, pin, carryfold, tocounter, fold, give
- 袖に触れてから持ち上がりが見えるまで: 1 フレーム（このヘッドレス環境で 341 ms、0.03 m 上昇）
- テストが指を置き直した回数: 9 回（最初に触れた点で別の物＝かご・ばさみ等が応じたため離して別の点を触った。内訳: towel→basket, sockA→basket, sockA→basket, sockA→basket, sockA→basket, sockA→basket, sockA→basket, towel→pin, towel→basket）

| # | 確認内容 | 結果 | 実測 |
|---|---|---|---|
| 1 | starts in the laundry view with no menu | ✅ | `{"view":"wash-load"}` |
| 2 | sleeve, open port and basket are on screen together | ✅ | `{"sleeve":[223.072,372.493],"port":[374.56,173.227]}` |
| 3 | idle ~4s shows one finger demonstration for the first step | ✅ | `{"key":"load"}` |
| 4 | knob only wiggles while the door is open | ✅ |  |
| 5 | balcony door only rattles before the laundry is washed | ✅ |  |
| 6 | touching the sleeve grabs it and lifts that point (frames until visibly lifted) | ✅ | `{"ms":341,"frames":1,"liftedBy":0.03}` |
| 7 | short pull drops the shirt over the lip into the drum | ✅ | `{"seconds":1.027}` |
| 8 | sock put in on its own is not wrapped | ✅ |  |
| 9 | sock laid onto the towel in the drum gets wrapped in its fold | ✅ | `{"sockA":true,"sockB":false}` |
| 10 | door handle tap closes and latches the door, view moves to the washer | ✅ | `{"view":"wash-run"}` |
| 11 | turning the plain knob (arc drag) starts the wash | ✅ | `{"knob":0.254}` |
| 12 | water fills, slow drum lifts the cloth and drops it into the water | ✅ | `{"omega":4.6,"towelCentreYRange":0.081}` |
| 13 | cloth gets soaked, suds build up | ✅ | `{"wet":1,"suds":1}` |
| 14 | dirt marks thin out while washing | ✅ | `{"before":0.07,"after":0}` |
| 15 | turning further gives a short rinse and the water drains | ✅ | `{"water":0,"suds":0}` |
| 16 | spin: the view closes in on the round window | ✅ | `{"view":"wash-spin"}` |
| 17 | fast spin presses the laundry onto the drum wall, drops run on the window | ✅ | `{"onWall":{"shirt":true,"towel":true,"sockA":true,"sockB":true},"windowDrops":4}` |
| 18 | D1 slowing down: clothes peel off the wall one after another | ✅ | `{"peelSeconds":{"sockA":{"s":9.802,"knob":0.825,"omega":10.539},"shirt":{"s":55.553,"knob":0.638,"omega":6.845},"towel":{"s":75.712,"knob":0.618,"omega":6.453},"sockB":{"s":99.434,"knob":0.59,"omega":5.883}},"omega":5.34}` |
| 19 | D1 speeding up again: they stick to the wall again (both states reachable around mid speed) | ✅ | `{"omega":11.034,"onWall":{"shirt":true,"towel":true,"sockA":true,"sockB":true}}` |
| 20 | spinning lowers the remaining water | ✅ | `{"towelWet":0.3}` |
| 21 | turning the knob back does not put water back | ✅ | `{"zone":"rinse","water":0,"towelWet":0.3}` |
| 22 | door does not pop open mid-spin | ✅ | `{"omega":11.393}` |
| 23 | it slows, the knob returns, then the door opens | ✅ |  |
| 24 | after the spin the pieces cling to the drum wall | ✅ | `{"shirt":1,"towel":1,"sockA":1,"sockB":1}` |
| 25 | D2 pulling the towel out makes the wrapped sock tumble out inside-out | ✅ | `{"koron":1,"sockA":"basket","inverted":true}` |
| 26 | D2 the separately loaded sock is still stuck in the drum, not inverted | ✅ |  |
| 27 | everything is back in the basket, damp | ✅ | `{"shirt":0.3,"towel":0.3,"sockA":0.3,"sockB":0.3}` |
| 28 | carrying the basket to the doorway takes the view (and the laundry) to the balcony | ✅ | `{"view":"bal"}` |
| 29 | towel hangs over the rod where it was dropped | ✅ | `{"id":0,"s":3,"zr":0.28974719765396006,"row":3,"holds":[]}` |
| 30 | pulling one side down feeds the towel over the rod until it hangs spread by its edge | ✅ | `{"from":3,"to":0}` |
| 31 | sliding it along the rod puts it across the eaves line | ✅ | `{"outside":0.05,"nOut":75,"under":0.05,"nUnder":69}` |
| 32 | a clothespin carried from the saucer pins the corner | ✅ | `{"id":0,"s":-1,"zr":0.5509971829941678,"row":0,"holds":[{"k":0,"pinned":true}]}` |
| 33 | D3 one corner pinned: free corner swings widely; both corners pinned: overall swing drops, cloth between ripples | ✅ | `{"onePin":{"freeCorner":0.23,"hem":0.261,"overall":0.263},"twoPins":{"corner":0,"hem":0.292,"middle":0.114,"overall":0.15}}` |
| 34 | shirt hangs on the front rod | ✅ | `{"id":1,"s":4,"zr":-0.06550646973653995,"row":4,"holds":[]}` |
| 35 | (towel still evenly damp/dry before the shower) | ✅ | `{"outside":0,"nOut":80,"under":0,"nUnder":64}` |
| 36 | D6 a light shower comes once: only the part outside the eaves gets wet (same towel, two halves) | ✅ | `{"before":{"outside":0,"nOut":80,"under":0,"nUnder":64},"during":{"outside":0.98,"nOut":85,"under":0.02,"nUnder":59},"sun":"dimmed only, no thunder"}` |
| 37 | D6 sliding the stand under the eaves by its grip: no new wet marks while it still rains | ✅ | `{"standZ":-1.25,"rainK":0.876,"newWet":[0,0,0,0]}` |
| 38 | the shower passes and does not come back | ✅ |  |
| 39 | a tap on the grip rolls the stand back out | ✅ | `{"standZ":-2.5,"hit":{"x":406.38775634765625,"y":88.7514419555664,"hit":"stand"}}` |
| 40 | socks hang on the front rod too | ✅ | `{"shirt":"rod","towel":"rod","sockA":"rod","sockB":"rod"}` |
| 41 | pulling a clothespin takes it off; it returns to the saucer; the towel rests on the rod | ✅ | `{"rod":{"id":0,"s":0,"zr":0.5509971829941678,"row":0,"holds":[]}}` |
| 42 | towel re-hung folded in half over the rod | ✅ | `{"front":0.182,"back":0.189,"covF":26,"covB":128,"s":8,"loc":"rod"}` |
| 43 | D5 folded towel: outer face dries, the inner face keeps a darker wet patch (seen by flipping it up) | ✅ | `{"atHang":{"front":0.182,"back":0.189,"covF":26,"covB":128,"s":8,"loc":"rod"},"later":{"front":0.113,"back":0.172,"covF":46,"covB":126,"s":8,"loc":"rod"}}` |
| 44 | D5 spread out and pinned again: the patch is uncovered and dries, the towel catches the wind | ✅ | `{"spread":{"front":0.016,"back":0.084,"covF":5,"covB":0,"s":0,"loc":"rod"},"later":{"front":0,"back":0,"covF":0,"covB":0,"s":-1,"loc":"rod"},"swing":0.189}` |
| 45 | D4 towel slid upwind of the shirt: the shirt sways less; slid aside: wind reaches it and it sways again | ✅ | `{"windShare":{"open":0.541,"behind":0.144,"aside":0.539},"shirt":{"open":{"lean":0.027,"speed":0.016},"behindTowel":{"lean":0.025,"speed":0.009},"towelAside":{"lean":0.026,"speed":0.015}},"towelZ":[-2.122,-2.887]}` |
| 46 | laundry dries within seconds-to-a-minute depending on exposure | ✅ | `{"shirt":0.07,"towel":0,"sockA":0.023,"sockB":0.047}` |
| 47 | taking in: pulling pops the pins back to the saucer, laundry returns to the basket | ✅ | `{"pins":["tray","tray","tray","tray","tray","tray"]}` |
| 48 | basket carried back through the door returns to the washer | ✅ |  |
| 49 | returning the knob to the wash position refills the water | ✅ | `{"water":1}` |
| 50 | weak spin leaves the same towel much wetter | ✅ | `{"strongSpin":0.3,"weakSpin":0.763}` |
| 51 | same towel, same two pins, wetter: it drips, hangs heavier and swings less than after the strong spin | ✅ | `{"first":{"wet":0,"swingSlow":0.18,"hem":0.292,"drips":0},"second":{"wet":0.177,"hem":0.07,"drips":19}}` |
| 52 | basket carried on to the counter | ✅ | `{"view":"fold"}` |
| 53 | pieces laid on the counter spread flat; a family member comes over | ✅ | `{"person":"wait"}` |
| 54 | folding follows the finger; pulling the folded edge back opens it again | ✅ | `{"folded":{"w":0.9,"d":0.24,"where":"top","folds":1,"x":-2.25,"z":-0.175},"opened":{"w":0.9,"d":0.48,"where":"top","folds":0,"x":-2.25,"z":-0.05}}` |
| 55 | pulling the handle opens the drawer | ✅ |  |
| 56 | the stored towel can be taken out and opened again | ✅ | `{"w":0.9,"d":0.48,"where":"top","folds":0,"x":-1.86,"z":0.015}` |
| 57 | D7 folding the towel from different edges gives a long thin package and a square one; they leave different gaps in the drawer and the socks go in differently | ✅ | `{"thin":[0.42,0.12],"square":[0.18,0.24],"thinInDrawer":[-2.337,0.442],"squareInDrawer":[-2.512,0.479],"sockWithThin":[-2.337,0.571],"sockWithSquare":[-2.2,0.442],"sockB":[-2.2,0.56,"drawer"]}` |
| 58 | shirt folds (sleeves, hem) and goes into the drawer | ✅ | `{"folded":{"w":0.32,"d":0.2,"where":"top","folds":3,"x":-1.55,"z":-0.15},"stored":{"w":0.32,"d":0.2,"where":"drawer","folds":3,"x":-2.213,"z":0.516}}` |
| 59 | empty basket slides onto the shelf; pins are in their saucer | ✅ |  |
| 60 | the last towel is handed to the waiting hands | ✅ | `{"person":"receive"}` |
| 61 | towel is pressed to the cheek, then a wordless hanamaru card comes back | ✅ |  |
| 62 | the towel can be taken back from the hands (same piece, folds kept) | ✅ | `{"folds":3,"was":3}` |
| 63 | stored pieces go back into the basket for another wash (no copies; the socks stay where they were put, one still inside-out) | ✅ | `{"towel":"basket","shirt":"basket","sockA":"drawer","inv":true}` |
| 64 | the basket carries the view back to the washer | ✅ |  |
| 65 | door tap now goes out to the balcony (visited): only the viewpoint moves, the basket stays | ✅ |  |
| 66 | and the door seen from the balcony leads back in | ✅ | `{"doorOnScreen":true}` |
| 67 | same towel goes into the drum again | ✅ |  |
| 68 | no console errors | ✅ | `[]` |
| 69 | no external requests | ✅ | `[]` |

## 堅牢性

- 実行: 2026-11-11T23:30:10.368Z 〜 2026-11-11T23:37:25.966Z／結果: **25 合格, 0 不合格**
- 非表示の作り方: synthetic visibilitychange (headless tab stayed visible)

| # | 確認内容 | 結果 | 実測 |
|---|---|---|---|
| 1 | first touch not yet made: audio not started | ✅ | `none` |
| 2 | first touch starts Web Audio | ✅ | `running` |
| 3 | a second finger is ignored: the sleeve stays held, the door handle did nothing | ✅ | `{"grab":17,"door":1}` |
| 4 | the first finger finishes its drag normally | ✅ |  |
| 5 | pointercancel mid-drag: the towel is let go and settles back in the basket | ✅ | `basket` |
| 6 | 60 rapid taps/flicks on handle, port, knob, cloth, empty space: no error, one owner per piece | ✅ | `{"door":0,"latched":true,"locs":{"shirt":"drum","towel":"basket","sockA":"basket","sockB":"basket"}}` |
| 7 | rotating to portrait while holding a piece: it is released, layout re-fits | ✅ | `{"view":"wash-load"}` |
| 8 | after rotation the port and the basket are both inside the portrait screen | ✅ | `{"port":[248,266],"basket":[121,429]}` |
| 9 | hidden: game time stops; visible again: it continues without adding the time away | ✅ | `{"how":"synthetic visibilitychange (headless tab stayed visible)","hiddenAdvance":0,"afterReturn":0.65}` |
| 10 | left alone for 16 s: nothing breaks, at most one new finger demo for the current step | ✅ | `{"demos":0}` |
| 11 | no console errors / external requests in this session | ✅ | `{"errors":[],"requests":[]}` |
| 12 | reload restores save_s4.json: station, where each piece is, folds, pins, inside-out sock | ✅ | `{"station":"bal","got":{"shirt":"rod","towel":"rod","sockA":"rod","sockB":"rod"},"pins":2}` |
| 13 | reload restores save_s5.json: station, where each piece is, folds, pins, inside-out sock | ✅ | `{"station":"fold","got":{"shirt":"flat","towel":"flat","sockA":"flat","sockB":"flat"},"pins":0}` |
| 14 | saving refused (setItem throws): play continues in memory, no error | ✅ | `{"saveOK":false,"errors":[]}` |
| 15 | storage blocked entirely (localStorage getter throws): starts and plays | ✅ | `{"errors":[]}` |
| 16 | corrupted save (broken JSON): rejected, starts from the beginning and is playable | ✅ | `{"errors":[]}` |
| 17 | corrupted save (wrong version): rejected, starts from the beginning and is playable | ✅ | `{"errors":[]}` |
| 18 | corrupted save (out-of-range values): rejected, starts from the beginning and is playable | ✅ | `{"errors":[]}` |
| 19 | WebGL unavailable (getContext returns null): embedded still picture is shown instead, no error | ✅ | `{"shown":"block","img":"url(\"data:image/jpeg;b","bytes":92414,"canvas":"none","hasT":false,"errors":[]}` |
| 20 | WebGL unavailable (browser started with --disable-3d-apis): embedded still picture is shown instead, no error | ✅ | `{"shown":"block","img":"url(\"data:image/jpeg;b","bytes":92414,"canvas":"none","hasT":false,"errors":[]}` |
| 21 | audio refused (AudioContext throws): silent, game still plays | ✅ | `{"audio":"failed","errors":[]}` |
| 22 | forced low-load mode (?low=1): same interaction works | ✅ | `{"fps":5}` |
| 23 | dynamic resolution reacts to slow frames (software GL at 1180x820, first 20 s): the render scale drops (or low-load mode engages) | ✅ | `{"fps":1.9,"resScale":0.88,"low":false}` |
| 24 | and the game is still playable in that state | ✅ | `{"shirt":"drum","fps":2.4,"low":false}` |
| 25 | served over http from /261112/games/261112-1/: starts and plays, only index.html is requested | ✅ | `{"requestsToServer":["/261112/games/261112-1/index.html?steps=20&dtmax=0.15"],"external":[]}` |

## 4サイズ×5場面のスクリーンショットと fps

画像は `verify/shots/<場面>_<幅>x<高さ>.jpg`（撮影したPNGを容量のためJPEG化）。fps はその場面を表示して約3.5秒後の移動平均（下記の実行環境での値で、iPad 実機の値ではありません）。

| サイズ | 場面 | 構図 | fps | 解像度倍率 | 低負荷 | エラー | 外部通信 |
|---|---|---|---|---|---|---|---|
| 375x667 | s1_load | wash-load | 5.9 | 1 | false | 0 | 0 |
| 375x667 | s2_wash | wash-run | 8.5 | 0.55 | true | 0 | 0 |
| 375x667 | s3_spin | wash-spin | 7.4 | 0.55 | true | 0 | 0 |
| 375x667 | s4_dry | bal | 5.7 | 0.88 | false | 0 | 0 |
| 375x667 | s5_fold | fold | 6.8 | 0.88 | false | 0 | 0 |
| 390x844 | s1_load | wash-load | 5.5 | 1 | false | 0 | 0 |
| 390x844 | s2_wash | wash-run | 7.6 | 0.55 | true | 0 | 0 |
| 390x844 | s3_spin | wash-spin | 6.5 | 0.55 | true | 0 | 0 |
| 390x844 | s4_dry | bal | 5.3 | 0.88 | false | 0 | 0 |
| 390x844 | s5_fold | fold | 6.3 | 0.88 | false | 0 | 0 |
| 820x1180 | s1_load | wash-load | 4.5 | 1 | false | 0 | 0 |
| 820x1180 | s2_wash | wash-run | 3.5 | 0.55 | true | 0 | 0 |
| 820x1180 | s3_spin | wash-spin | 2.6 | 0.55 | true | 0 | 0 |
| 820x1180 | s4_dry | bal | 4 | 1 | false | 0 | 0 |
| 820x1180 | s5_fold | fold | 4.3 | 1 | false | 0 | 0 |
| 1180x820 | s1_load | wash-load | 4.6 | 1 | false | 0 | 0 |
| 1180x820 | s2_wash | wash-run | 3.4 | 0.55 | true | 0 | 0 |
| 1180x820 | s3_spin | wash-spin | 3 | 0.55 | true | 0 | 0 |
| 1180x820 | s4_dry | bal | 4.5 | 1 | false | 0 | 0 |
| 1180x820 | s5_fold | fold | 4.1 | 1 | false | 0 | 0 |

- WebGL レンダラ: `ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver)`

## 七つの発見と確認方法の対応

| 発見 | 通しプレイ表の項目 | 見ている実測 |
|---|---|---|
| 1 脱水つまみで張りつく／はがれる | 「D1 …」2項目 | 各布の「内壁に張りついている」判定が、減速で布ごとに別時刻に外れ、再加速で戻る |
| 2 タオルに包んだ靴下が片足裏返って出る | 「D2 …」2項目＋投入時の2項目 | 包んだ靴下は裏返しフラグが立ってかごへ、別に入れた靴下はドラム内壁に残り裏返らない |
| 3 片角だけ留める／両角留める | 「D3 …」 | 自由な角・裾・中央など9点の位置のばらつき（標準偏差, m）。片角＞両角、両角でも中央は動く |
| 4 タオルを風上へ／横へ | 「D4 …」 | シャツ全質点の受風率、平均の傾き（m）と平均速度（m/s）。タオルが風上＜横 |
| 5 二つ折りの内側の濡れ跡／広げて留め直す | 「D5 …」2項目 | 面ごとの水分（外側=front, 内側=back）と「他の層に覆われた質点数」 |
| 6 通り雨と軒の境目 | 「D6 …」2項目 | 同じタオルの軒外/軒下の質点の水分、台を引き込んだ後の雨による加水量 |
| 7 違う辺から畳む／収納の隙間 | 「D7 …」＋開く・取り出す項目 | 包みの寸法（m）、引き出し内の位置、靴下の置き場所の違い |

同一布の状態引継ぎは、通しプレイ全体が同じ4枚（固定ID `shirt` `towel` `sockA` `sockB`）で進むこと、
脱水後の水分→干したときの水分・滴・揺れ（「same towel, same two pins, wetter」）、裏返った靴下が最後まで裏返ったままであること、
折り目を保ったまま手渡し→受け取り直しできること、収納後にかごへ戻して再びドラムへ入れられること、で確認しています。

## 目視確認

`verify/shots/` の 20 枚（4サイズ×5場面）と `verify/out/` の通しプレイ途中の画面を自分で開いて確認し、
構図（かご・投入口・つまみ・物干し・かごの中身が画面内にあるか）、文字や数字が出ていないこと、破綻した形状がないことを見ました。
確認の過程で直したもの: 縦画面で床ばかりになる構図、ベランダで風の向きが視線と重なり揺れが見えない構図、
かごが深く最後の1枚が壁に隠れる問題、人物の造形、袖がかごの見えない側に垂れていた初期配置、など。

## 確認していないこと・既知の残課題（正直な記載）

- **iPad / iPhone 実機では一度も動かしていません。** 30fps 目標に対する実機 fps、Safari の Pointer Events / Safe Area / 音の解禁の挙動、
  発熱時の低負荷モード移行は未確認です。上の fps はソフトウェア描画での値で、実機性能の根拠にはなりません。
- 「袖に触れて 100ms 以内に持ち上がる」は、処理上は `pointerdown` と同じフレームで目標位置を設定し次の描画フレームで持ち上がる実装で、
  ヘッドレスでは「1フレーム後」を確認しました。ms 値はこの環境のフレーム時間（100ms 超）に支配されるため、100ms 以内であることは実機で未確認です。
- 音は「初回タッチで AudioContext が running になる」「生成に失敗しても遊べる」ことだけを確認しました。**音そのものは聴いていません**（音量バランス・音色は未確認）。
- 非表示/復帰は、ヘッドレスで別タブを前面に出す方法（それが効かない場合は `visibilitychange` を合成）で確認しています。表に実際に使った方法を記録しています。
- 低負荷モードの自動移行: 堅牢性テストの20秒間では解像度倍率が下がるところまで（表の `resScale`）。自動で低負荷モードに入ることは、
  撮影時の場面2・3（表の「低負荷 true」）で確認しました。低負荷でも遊べることは `?low=1` で袖を引いて入れる操作まで確認し、
  低負荷のまま七つの発見を全部通す実行はしていません（粒子数・影解像度・布の細分化を減らすだけで、判定や物理は同じコードです）。
- 通しプレイは 640×440 の1サイズで実施しました。他の4サイズは「場面1〜3を実タッチで到達して撮影」「場面4・5はセーブ復元で表示」までで、
  そのサイズで最後まで通してはいません。
- 検証スクリプトは、最初の最終ビルド候補から数回作り直しています（テスト側の触る位置や待ち時間の誤りの修正）。
  その過程で見つけて直したゲーム側の不具合: 脱水後に包んだ靴下が床を抜け落ちる（張りつきフラグの残り）、縦画面で開いた扉の取っ手が画面外、
  かごが深くて最後の1枚が見えない、かごを触っただけで隣の場面へ移ってしまう、引き出しの取っ手と中の布の拾い分け、など。
  ここに載せた結果はすべて、最後のビルド（上の sha256）に対する1回の実行のものです。
- `thumb.png` は最終ビルドの 1180×820 場面1の実画面を縮小したもの。WebGL失敗時の代替静止画（`tools/fallback.jpg` を埋め込み）は、
  見た目が同じ一つ前のビルドの同じ場面の実画面です（最終ビルドに埋め込むため、最終ビルド自身の画面では作れません）。
- スクリーンショットの一部に、約4秒無操作で出る「指のお手本」が写っています（仕様どおりの表示）。
- 写実性は手続き生成のテクスチャとPBR材質・影・環境光での近似です。「現実と見間違う」水準には届いていません
  （布は少数質点のため細かい皺がなく、室内は間接光を焼いていないので陰影が浅い、人物は簡略な造形で顔は目を閉じた簡素な表現）。
- 布は自己衝突を厳密には解いていないので、かごやドラムの中で布同士が浅くめり込んで見えることがあります。
- 畳みの折り目は質点の粒度（4〜6cm）で丸まります。シャツは1層の布として扱っています（前後身頃の2層ではありません）。
- 洗濯機前とカウンターの間の移動は、かごを運ぶ方法だけです（視点だけの移動は洗濯室⇔ベランダの戸）。
- 所要時間 5〜12 分は人が遊んで計ったものではありません（通しプレイのゲーム内時間は上の表のとおりで、検証の待ち時間を含みます）。
