# 検証記録 — ぷかぷか！あひるちゃんのおふろ (gf-261112-nx2)

この記録は `tools/report.cjs` が `tools/results/*.json` から生成したものです。数値はすべて下記の環境での実測で、**iPad 実機の結果ではありません**。

## 測定環境
- ヘッドレス Chromium (Playwright 同梱版) / ANGLE + SwiftShader (ソフトウェア描画、GPU なし) / 4 vCPU の Linux コンテナ
- 操作はすべて CDP `Input.dispatchTouchEvent` による実際のタッチ → ブラウザが生成する Pointer Events (pointerdown / pointermove / pointerup) で行った。内部状態は `window.__duckbath.debug` から**読むだけ**
- 操作検証は描画を軽くした設定 (`q=low&rs=0.3&lite=1`: 低負荷モード・解像度 0.3 倍・産毛の層を省略) で実行。ゲームの状態更新と入力経路は通常と同じ。スクリーンショットの瞬間だけ高品質設定へ切り替えて撮影
- 実施日: 2026-11-11

## 1. 通し遊び (最初の浴室 → はなまる → 再遊び → 再読込)
`tools/play.cjs`。保存データの書き込みによる近道は使わず、最初の画面から最後まで指の操作だけで進めた。

| 画面 | 合格 / 全項目 | 所要(実時間) |
|---|---|---|
| 375x667 | 41 / 41 | 407 秒 |
| 390x844 | 41 / 41 | 390 秒 |
| 820x1180 | 41 / 41 | 599 秒 |
| 1180x820 | 41 / 41 | 629 秒 |

| 確認項目 | 375x667 | 390x844 | 820x1180 | 1180x820 |
|---|---|---|---|---|
| start_first_bath | ○ | ○ | ○ | ○ |
| start_targets_visible | ○ | ○ | ○ | ○ |
| hit_areas_64px | ○ | ○ | ○ | ○ |
| hint_appears_when_idle | ○ | ○ | ○ | ○ |
| hint_retreats_on_touch | ○ | ○ | ○ | ○ |
| audio_starts_on_first_touch | ○ | ○ | ○ | ○ |
| short_drag_moves_handle | ○ | ○ | ○ | ○ |
| faucet_continuous | ○ | ○ | ○ | ○ |
| d1_kid_floats_on_step_when_filled | ○ | ○ | ○ | ○ |
| scene2_follows_same_water | ○ | ○ | ○ | ○ |
| overflow_outlet_takes_excess | ○ | ○ | ○ | ○ |
| faucet_tap_closes | ○ | ○ | ○ | ○ |
| stroke_moves_camera_to_water | ○ | ○ | ○ | ○ |
| stroking_mixes_foam_and_unlocks_shower | ○ | ○ | ○ | ○ |
| scene3_after_mixing | ○ | ○ | ○ | ○ |
| d4_parent_displaces_water_onto_rim | ○ | ○ | ○ | ○ |
| shower_unlocked | ○ | ○ | ○ | ○ |
| shower_wets_feathers_and_parent_lowers_head | ○ | ○ | ○ | ○ |
| shower_returns_and_stops | ○ | ○ | ○ | ○ |
| stage4_after_shower | ○ | ○ | ○ | ○ |
| ring_unlocked | ○ | ○ | ○ | ○ |
| ring_partial_position_drains | ○ | ○ | ○ | ○ |
| d1_same_kid_stands_again_when_drained | ○ | ○ | ○ | ○ |
| ring_down_stops_drain | ○ | ○ | ○ | ○ |
| d6_swirl_then_drain_gathers_foam | ○ | ○ | ○ | ○ |
| d6_plug_back_stops_suction_foam_remains | ○ | ○ | ○ | ○ |
| d6_ducks_stay_and_waddle_when_water_leaves | ○ | ○ | ○ | ○ |
| towel_unlocked | ○ | ○ | ○ | ○ |
| carry_kid_to_towel | ○ | ○ | ○ | ○ |
| carry_parent_to_towel | ○ | ○ | ○ | ○ |
| d7_wipe_one_side_dries_only_that_side | ○ | ○ | ○ | ○ |
| carry_kid_to_bed | ○ | ○ | ○ | ○ |
| d7_wet_side_leaves_stain_on_bed | ○ | ○ | ○ | ○ |
| carry_parent_to_bed | ○ | ○ | ○ | ○ |
| both_sleep_and_hanamaru | ○ | ○ | ○ | ○ |
| replay_parent_back_to_tub | ○ | ○ | ○ | ○ |
| state_carries_across_scenes | ○ | ○ | ○ | ○ |
| replay_fill_again | ○ | ○ | ○ | ○ |
| reload_restores_memory | ○ | ○ | ○ | ○ |
| no_console_errors | ○ | ○ | ○ | ○ |
| no_external_requests | ○ | ○ | ○ | ○ |

### 820×1180 での実測値(抜粋)
```
PASS start_first_bath {"stage":1,"level":-0.0809,"audio":"none"}
PASS start_targets_visible {"handle":[563.5001,373.1761],"hitR":{"handle":48,"kid":45.0914,"parent":94.3322}}
PASS hit_areas_64px {"handle":96,"ring":92,"shower":100,"towel0":92,"towel1":92,"parent":189,"kid":90}
PASS hint_appears_when_idle {"hint":"handle","simT":4.0833}
PASS hint_retreats_on_touch {"handOn":false}
PASS audio_starts_on_first_touch {"audio":"running"}
PASS short_drag_moves_handle {"open":0.1216,"flow":0.0134}
PASS faucet_continuous {"open":0.5615}
PASS d1_kid_floats_on_step_when_filled {"level":-0.0708,"simT":12.2667,"kidY":-0.0802}
PASS scene2_follows_same_water {"scene":2,"level":-0.0653}
PASS overflow_outlet_takes_excess {"level":-0.0178,"overQ":1.392}
PASS faucet_tap_closes {"open":0}
PASS stroke_moves_camera_to_water {"scene":2}
PASS stroking_mixes_foam_and_unlocks_shower {"stage":3,"foam0":107,"foam":166,"made":122}
PASS scene3_after_mixing 
PASS d4_parent_displaces_water_onto_rim {"levelBefore":-0.02,"lifted":-0.0302,"maxAfterDrop":-0.0052,"spillPeak":1,"faucetOpen":0,"disc":{"floatOnStep":true,"spill":true}}
PASS shower_unlocked {"x":109.46959383872418,"y":423.8062060138364,"r":50,"locked":false}
PASS shower_wets_feathers_and_parent_lowers_head {"neck":0.95,"hitDuck":55,"parentWet":[1,1,1,1]}
PASS shower_returns_and_stops 
PASS stage4_after_shower 
PASS ring_unlocked {"x":724.7584925945495,"y":932.8680749441468,"r":46,"locked":false}
PASS ring_partial_position_drains {"ring":0.0708,"drainQ":4.9158}
PASS d1_same_kid_stands_again_when_drained {"level":-0.0867,"kid":[-0.3872,0.0719],"floatedBefore":true}
PASS ring_down_stops_drain {"ring":0,"level":[-0.1175,-0.1175]}
PASS d6_swirl_then_drain_gathers_foam {"circulation":0.086,"foamBefore":63,"sucked":105}
PASS d6_plug_back_stops_suction_foam_remains {"level":-0.338,"foamLeft":19,"suckedAfterStop":0}
PASS d6_ducks_stay_and_waddle_when_water_leaves {"level":-0.34,"walked":true,"ducks":[["parent",0.184,-0.0266],["kid",-0.3872,0.0719]]}
PASS towel_unlocked 
PASS carry_kid_to_towel {"kid":"deck","stage":5}
PASS carry_parent_to_towel {"parent":"deck","scene":5}
PASS d7_wipe_one_side_dries_only_that_side {"wetBefore":[0.11,0.025,1,1],"wetAfter":[0.11,0.025,0.9972,0],"wipedPart":3,"towel":{"left":0.1527,"right":1.9315,"max":0.1958}}
PASS carry_kid_to_bed {"mode":"bed","scene":5}
PASS d7_wet_side_leaves_stain_on_bed {"stainSum":69.2,"stainLocalZ":-0.0278,"wetSide":"left(-z)","kidWet":[0.11,0.025,0.1328,0]}
PASS carry_parent_to_bed 
PASS both_sleep_and_hanamaru {"asleep":[0.9358,0.9358],"card":true,"cycles":1}
PASS replay_parent_back_to_tub {"mode":"tub","card":false,"scene":3}
PASS state_carries_across_scenes {"towelWet":[0.0029,0.002],"stain":[460.2039,459.8824],"parentWet":[[0.8525,1,0.0199,0.019],[0.8525,1,0.0199,0.019]]}
PASS replay_fill_again {"level":[-0.34,-0.3141],"scene":4}
PASS reload_restores_memory {"before":{"stage":5,"level":-0.3087,"ducks":[["tub",0.0998,0.0028],["bed",0.652,-0.5716]],"towel":0.0008,"stain":459.4627},"after":{"stage":5,"level":-0.3087,"ducks":[["tub",0.0998,0.0028],["bed",0.652,-0.5716]],"towel":0.0008,"stain":459.8314}}
PASS no_console_errors []
PASS no_external_requests []
```

進行の記録 (wall=実時間秒, simT=ゲーム内秒):
```
{"label":"start","wall":0,"simT":0.1167,"stage":1,"scene":1,"level":-0.0809,"foam":42,"fps":0.6046}
{"label":"faucet_open","wall":118.4,"simT":11.3333,"stage":1,"scene":1,"level":-0.0762,"foam":44,"fps":0.2608}
{"label":"kid_floats","wall":119.4,"simT":12.2667,"stage":1,"scene":1,"level":-0.0708,"foam":49,"fps":6.977}
{"label":"full","wall":132.9,"simT":22.5833,"stage":2,"scene":2,"level":-0.0173,"foam":100,"fps":1.5014}
{"label":"stroked","wall":241.6,"simT":68.6167,"stage":3,"scene":2,"level":-0.0206,"foam":166,"fps":2.5632}
{"label":"parent_dropped","wall":259.6,"simT":83.9667,"stage":3,"scene":3,"level":-0.0104,"foam":163,"fps":3.651}
{"label":"washed","wall":310.4,"simT":98.6667,"stage":4,"scene":4,"level":-0.018,"foam":152,"fps":0.5194}
{"label":"kid_stands_again","wall":349.1,"simT":114.3667,"stage":4,"scene":4,"level":-0.0867,"foam":69,"fps":3.317}
{"label":"mid_drain","wall":424.9,"simT":177.8667,"stage":4,"scene":4,"level":-0.338,"foam":19,"fps":4.1439}
{"label":"drained","wall":435.4,"simT":187.0667,"stage":4,"scene":4,"level":-0.34,"foam":15,"fps":4.5554}
{"label":"on_towel","wall":478.6,"simT":208.3,"stage":5,"scene":5,"level":-0.34,"foam":11,"fps":4.3256}
{"label":"wiped","wall":520.6,"simT":233.75,"stage":5,"scene":5,"level":-0.34,"foam":10,"fps":7.4808}
{"label":"asleep","wall":545,"simT":258.2,"stage":5,"scene":5,"level":-0.34,"foam":8,"fps":3.7951}
{"label":"replay","wall":590.2,"simT":287.9667,"stage":5,"scene":4,"level":-0.3087,"foam":18,"fps":5.3581}
```

蛇口を開け終えてから子のおなかが浮くまで(ゲーム内時間) / 最初の画面から二羽が眠るまでに使ったゲーム内時間:

| 画面 | 開栓→子が浮く | 眠るまで |
|---|---|---|
| 375x667 | 1.4 秒 | 230 秒 |
| 390x844 | 2.1 秒 | 228 秒 |
| 820x1180 | 0.9 秒 | 258 秒 |
| 1180x820 | 3.1 秒 | 279 秒 |

(検証スクリプトの操作は待ち時間を含むので、眠るまでの時間は子どもの実プレイ時間の目安ではない)

## 2. 発見の比較実験 (条件をそろえた A/B)
`tools/disc.cjs`。あひると泡の初期配置だけは保存データの読込経路でそろえ(=再現性のため)、そこからの操作は実際のタッチ。発見 1・4・6・7 は上の通し遊びの中でも確認している。

**発見2 壁へのひとなでで泡の帯が折り返す**: 泡の重心の移動 (dx, dz) [m]、なでた 0.7 秒後から 0.7 秒おき
```
泡の右脇をなでる: [[-0.103,0.095],[-0.099,0.106],[-0.095,0.114],[-0.089,0.122],[-0.083,0.127],[-0.077,0.13],[-0.071,0.133],[-0.068,0.134]]
泡の左脇をなでる: [[0.086,0.072],[0.082,0.081],[0.078,0.088],[0.072,0.096],[0.067,0.099],[0.062,0.103],[0.058,0.105],[0.054,0.106]]
```
→ なでる位置で x 方向の戻り方が逆になり、どちらも壁(z=-0.3)から手前(+z)へ折り返す。

**発見3 親が流れを分け、後ろの子の揺れが小さい**
```
親が間にいる  : {"kidMoved":0.0034163149410179642,"maxWaveMm":2.084494600421749,"maxFlow":0.0032834049406788206,"up":6,"dn":6,"mid":0}
親をどけた    : {"kidMoved":0.0030721986438824855,"maxWaveMm":6.148724176455291,"maxFlow":0.021075847629526114,"up":6,"dn":19,"mid":1}
```

**発見4 満水近くで親を下ろすと縁へ水が乗る / 少ない水では乗らない**
```
d4_-0.024: {"start":-0.02655533906803899,"after":-0.01780870110893703,"max":-0.010934666402252734,"spillPeak":0.16673756599967687,"lifted":-0.03413926490264766}
d4_-0.075: {"start":-0.07405497819003337,"after":-0.04311502653990586,"max":-0.04316451257712692,"spillPeak":0,"lifted":-0.07405496713957227}
```

**発見5 泡帽子へ横からシャワー → 隣の子の背へ / 離れていれば水面へ**
```
子が隣    : {"hat":0,"kidBack":1,"foam0":0,"foam1":7,"neck":0.9499999999999993}
子が離れる: {"hat":0,"kidBack":0,"foam0":0,"foam1":16,"neck":0.9499999999999993}
```

**発見7 片側だけ拭いて寝床へ → 濡れた側の下にだけ水跡 / 置く向きで跡の位置が変わる**
```
d7_false: {"wetAfterWipe":[0,0,0.9606177589178662,0.0019572333202780676],"heading":-0.1152953989439772,"stain":{"x":0.5966259032601389,"z":-0.6475470885615057,"sum":70.00784313725491},"stainLocalZ":-0.02781019910657017,"stainWorldDz":-0.027614841099022125,"kid":[0.599917773812277,-0.6199322474624835]}
d7_true: {"wetAfterWipe":[0,0,0.9344755711252198,0.0019275540763113203],"heading":-3.1138010392565665,"stain":{"x":0.6009891669950461,"z":-0.5922202910380545,"sum":69.66274509803921},"stainLocalZ":-0.027782101661376023,"stainWorldDz":0.027776559426967107,"kid":[0.6015746163312373,-0.6199968504650216]}
```

## 3. 壊れにくさ
`tools/robust.cjs`: 18 / 18 合格
```
PASS multitouch_first_finger_only {"mid":{"drag":"handle","open":0.5122,"kid":"tub"},"openAfter":0.5122,"endDrag":null,"errors":[]}
PASS rapid_taps_no_break {"level":-0.0149,"open":0.42,"stage":2,"ducks":[["tub",-0.13,0.0455],["tub",-0.2977,0.1769]],"errors":[]}
PASS rotate_releases_grab_and_reframes {"heldBefore":"held","after":"tub","handle":[739.228,92.6422]}
PASS rotate_back_and_play_on {"openAfterLandscapeDrag":0.5955,"openAfterTap":0.0255,"errors":[]}
PASS hidden_stops_progress {"frames":[29,29],"simT":[0.75,0.75],"audio":"suspended"}
PASS resume_releases_grab_no_time_jump {"heldBefore":"held","kidAfter":"tub","simJump":0.6333,"levelJump":0.0017,"audio":"running"}
PASS resume_play_on {"open":0,"errors":[]}
PASS storage_denied_still_plays {"flow":0.2678,"errors":[]}
PASS storage_quota_still_plays {"flow":0.3245,"saveReturned":false,"errors":[]}
PASS storage_corrupt_starts_playable {"broken_json":{"stage":1,"flow":0.3045,"loaded":false,"level":-0.0806,"errors":0},"wrong_version":{"stage":1,"flow":0.3851,"loaded":false,"level":-0.0802,"errors":0},"out_of_range":{"stage":1,"flow":0.281,"loaded":false,"level":-0.0807,"errors":0},"wrong_types":{"stage":1,"flow":0.4078,"loaded":false,"level":-0.0797,"errors":0},"nan_values":{"stage":1,"flow":0.3981,"loaded":false,"level":-0.08,"errors":0},"huge":{"stage":1,"flow":0.4193,"loaded":false,"level":-0.0781,"errors":0},"bad_strings":{"stage":3,"flow":0.2678,"loaded":true,"level":-0.0488,"errors":0}}
PASS webgl_fail_shows_embedded_still {"fallback":true,"display":"block","src":"data:image/jpeg;base64","natural":[960,720],"rect":[820,1180],"canvas":"none","veil":"0","errors":[]}
PASS audio_refused_game_continues {"audio":"failed","open":0.5815,"errors":[]}
PASS audio_resume_rejected_game_continues {"audio":"suspended","open":0.5815,"errors":[]}
PASS audio_starts_only_after_first_touch {"before":"none","after":"running"}
PASS idle_50s_stable {"hintsShown":5,"level":[-0.0809,-0.081],"simT":48.05,"errors":[]}
PASS auto_lowers_resolution_then_low_mode {"before":{"low":false,"scale":1},"after":{"low":true,"scale":0.55},"log":[{"t":33.2,"scale":0.88},{"t":46.4,"scale":0.76},{"t":60.7,"scale":0.64},{"t":74.8,"scale":0.55},{"t":79.3,"low":true}]}
PASS low_mode_keeps_core_play {"level":-0.0652,"low":true,"errors":[]}
PASS pages_subfolder_boots_single_file {"url":"/261112/games/261112-2/index.html","otherRequests":[],"errors":[]}
```

## 4. 描画速度 (ヘッドレス・ソフトウェア描画での実測)
`tools/perf.cjs`。各場面を 7 秒暖機したあと 10 秒間のフレーム数を数えた。「high」= 通常品質(屈折つきの水・産毛の層 11 枚・影 2048)、「low」= 低負荷モード(水は半透明反射・産毛 6 枚・影 1024 を隔フレーム更新・泡の上限 230)。

| 画面 | 品質 | 場面 | fps | 描画命令数 | 三角形数 | JS 物理 ms/フレーム |
|---|---|---|---|---|---|---|
| 1180x820 | high | 1 | 0.1 | 152 | 641044 | 0.7 |
| 1180x820 | high | 2 | 0.3 | 156 | 643372 | 0.7 |
| 1180x820 | high | 3 | 0.1 | 187 | 647266 | 0.8 |
| 1180x820 | high | 4 | 0.2 | 187 | 647266 | 0.6 |
| 1180x820 | high | 5 | 0.8 | 116 | 595740 | 0.6 |
| 1180x820 | low | 1 | 0.6 | 72 | 201988 | 3.2 |
| 1180x820 | low | 2 | 0.5 | 74 | 203152 | 3.7 |
| 1180x820 | low | 3 | 0.9 | 90 | 205100 | 0.7 |
| 1180x820 | low | 4 | 0.7 | 90 | 205100 | 0.5 |
| 1180x820 | low | 5 | 1.7 | 54 | 179336 | 1.9 |
| 820x1180 | high | 1 | 0.1 | 176 | 644604 | 0.6 |
| 820x1180 | high | 2 | 0.3 | 205 | 647442 | 0.4 |
| 820x1180 | high | 3 | 0.3 | 205 | 647442 | 0.7 |
| 820x1180 | high | 4 | 0.2 | 205 | 647442 | 0.9 |
| 820x1180 | high | 5 | 0.7 | 140 | 617176 | 0.8 |
| 820x1180 | low | 1 | 0.6 | 84 | 203768 | 0.5 |
| 820x1180 | low | 2 | 1.2 | 99 | 205188 | 3.2 |
| 820x1180 | low | 3 | 1.3 | 99 | 205188 | 0.7 |
| 820x1180 | low | 4 | 1.1 | 99 | 205188 | 0.6 |
| 820x1180 | low | 5 | 1.9 | 66 | 190054 | 2.9 |

ソフトウェア描画のため fps は GPU 搭載機より桁違いに低い(0.1〜2fps)。iPad での 30fps は**未検証**。JS 側の物理(水・泡・布)は表のとおり 1 フレームあたりおおむね 1ms 前後(数ステップまとめて進めたフレームで 10ms 程度)で、負荷の大半は描画側。品質自動調整は、この遅い環境で解像度 1.0→0.55 倍→低負荷モードの順に切り替わることを確認(3 章 auto_lowers_resolution_then_low_mode)。

## 5. スクリーンショット
`tools/shots/` に 27 枚。通し遊びの各場面を 4 サイズで撮影:

- 1180x820_s1_tameru.jpg
- 1180x820_s2_awa.jpg
- 1180x820_s3_arau.jpg
- 1180x820_s4_haisui.jpg
- 1180x820_s5_fuku.jpg
- 1180x820_s5_neru.jpg
- 375x667_s1_hint.jpg
- 375x667_s1_tameru.jpg
- 375x667_s2_awa.jpg
- 375x667_s3_arau.jpg
- 375x667_s4_haisui.jpg
- 375x667_s5_fuku.jpg
- 375x667_s5_neru.jpg
- 390x844_s1_tameru.jpg
- 390x844_s2_awa.jpg
- 390x844_s3_arau.jpg
- 390x844_s4_haisui.jpg
- 390x844_s5_fuku.jpg
- 390x844_s5_neru.jpg
- 820x1180_s1_hint.jpg
- 820x1180_s1_tameru.jpg
- 820x1180_s2_awa.jpg
- 820x1180_s3_arau.jpg
- 820x1180_s4_haisui.jpg
- 820x1180_s5_fuku.jpg
- 820x1180_s5_neru.jpg
- fallback_webgl_fail.jpg

## 6. 検証で見つけて直したこと
- 低い描画速度だとタップが「長押し扱い」になり蛇口が閉まらなかった → 動かさずに離せばタップと判定
- 指の報告間隔が粗いと、シャワーの向き・あひるの向き・水を押す強さが変わってしまった → 少し遅れて追う点を基準にして間隔に依存しないようにした
- オーバーフローが速すぎて、親を下ろしても水位が上がって見えなかった → 流出量に上限を設け、縁へ乗ってから戻るようにした
- 排水の渦が遠くの子まで運び、段に置いた子が立ち直る前に流されていた / 放置で子が段を離れていた → 渦は排水口の近くだけ、段の上の子は自分から動かない
- タオルが体全体を一度に乾かしてしまい片側だけ拭けなかった → 指で押さえている端の近くだけがよく拭ける
- 親が波も流れもほとんど遮らなかった → 親の体のまわりで波が静まり、流れは体を回り込む(発見3の実測参照)
- 非常に遅い端末では品質の自動引き下げが働かなかった → 長いフレームも遅さとして数える
- 水かさの多い状態の子の産毛が、ガラス質の暗い色に見えていた → 濡れ色と水滴の描き方を修正

## 7. 確認していないこと
- iPad / iPhone 実機での表示・タッチ・音・fps (Safari の WebGL、Safe Area の実寸、音の解禁挙動を含む)
- 実際の 5 歳児による初見プレイ(説明なしで成立するかは、当たり判定の大きさ・お手本の指・解放順の確認にとどまる)
- 音の聞こえ方(合成音の生成と開始状態は確認、音質は未聴取)
- 高品質設定のままの通し操作(操作検証は軽量描画で実施。高品質は撮影と fps 測定のみ)
- 「最初のタッチから 100ms 以内の反応」の実時間計測(処理上はタッチと同じフレームで取っ手が動き音が鳴るが、この環境は 1 フレームが 100ms を超えるため実時間では確かめられない)
- 親が波・流れを遮る効果(発見3)は数値で確認したが、子どもの目に「分かれて見える」かは未確認。素早く払うなで方での実測であり、ゆっくりなでると流れは弱い
