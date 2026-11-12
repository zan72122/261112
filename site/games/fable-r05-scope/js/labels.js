// Short Japanese labels shown when a part is clicked (name, reading aid in English, what it does).
(function () {
  'use strict';
  const S = window.SCOPE;
  S.LABELS = {
    base: { ja: 'ベース（鏡基）', en: 'Base', desc: 'どっしり支える土台。中に光の通り道があり、ランプの光が前へ進みます。' },
    lamp: { ja: 'ランプハウス（光源）', en: 'Lamp housing', desc: '観察のための光をつくります。光の旅はここからスタート。' },
    collector: { ja: 'コレクターレンズ', en: 'Collector lens', desc: 'ランプから広がる光を集めて、まっすぐな光の束にそろえます。' },
    mirror: { ja: 'ミラー', en: 'Folding mirror', desc: '横に進んできた光を、真上へはね返します。' },
    field: { ja: '視野絞り', en: 'Field diaphragm', desc: '照らす範囲を決める絞り。開け閉めすると光の束の太さが変わります。' },
    aperture: { ja: '開口絞り', en: 'Aperture diaphragm', desc: '光の円すいの角度を決める絞り。明るさ・コントラスト・細かさのバランスをとります。' },
    condenser: { ja: 'コンデンサー（アッベ式）', en: 'Abbe condenser', desc: '光を円すい形に集めて、スライドの見たい場所に届けます。' },
    stage: { ja: 'ステージ', en: 'Mechanical stage', desc: 'スライドをのせる台。ピント合わせのときに上下に動きます。' },
    stageKnob: { ja: 'ステージハンドル', en: 'Stage X-Y drive', desc: 'スライドを前後・左右にすこしずつ動かして、見る場所を変えます。' },
    slide: { ja: 'スライドガラス（76×26 mm）', en: 'Test-pattern slide', desc: '目盛りグリッドと文字のテストパターンを印刷したガラス板です。' },
    nosepiece: { ja: 'レボルバー', en: 'Revolving nosepiece', desc: '回して対物レンズを切り替えます。クリックすると次の倍率へ回ります。' },
    objective: { ja: '対物レンズ', en: 'Objective', desc: '像を拡大する主役のレンズ。倍率が高いほど、光を広い角度で受け取ります。' },
    arm: { ja: 'アーム（鏡柱）', en: 'Arm', desc: 'ヘッドとステージを支える背骨。運ぶときはここをしっかり握ります。' },
    coarse: { ja: '粗動ハンドル', en: 'Coarse focus', desc: 'ステージを大きく上下。まずこれでおおまかにピントを合わせます。ドラッグで回せます。' },
    fine: { ja: '微動ハンドル', en: 'Fine focus', desc: 'ほんの少しずつ動かして、ピントをきっちり仕上げます。ドラッグで回せます。' },
    head: { ja: '三眼鏡筒（ヘッド）', en: 'Trinocular head', desc: '上がってきた光を、左右の接眼レンズとカメラポートに分けます。' },
    tubelens: { ja: '結像レンズ', en: 'Tube lens', desc: '対物レンズから出た平行な光を集めて、像を結ばせます。' },
    prism: { ja: 'プリズム', en: 'Beam-splitting prism', desc: '光を接眼レンズ側とカメラ側の二つの道に分けます。' },
    eyepiece: { ja: '接眼レンズ 10×', en: 'Eyepiece 10× / FN 26.5', desc: '対物レンズがつくった像をさらに10倍に。視野数 26.5 が見える丸い範囲を決めます。' },
    camport: { ja: 'カメラポート', en: 'Camera port', desc: 'まっすぐ上へ進んだ光をカメラへ導く筒。0.63×のアダプター付きです。' },
    camera: { ja: 'カメラ', en: 'Camera', desc: 'センサーの上に像を結んで撮影します。写るのは四角い範囲です。' },
  };
})();
