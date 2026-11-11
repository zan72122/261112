#!/bin/sh
# 検証一式を順に流す(並列にすると計時が乱れるため直列)
cd "$(dirname "$0")"
node robust.cjs > shots/tmp/robust.log 2>&1
for s in "375 667" "820 1180" "1180 820" "390 844"; do node play.cjs $s > shots/tmp/play_$(echo $s | tr ' ' 'x').log 2>&1; done
for d in d2 d3 d4 d5 d7; do node disc.cjs $d > shots/tmp/disc_$d.log 2>&1; done
node perf.cjs 1180x820 > shots/tmp/perf_a.log 2>&1
node perf.cjs 820x1180 > shots/tmp/perf_b.log 2>&1
echo ALLDONE > shots/tmp/alldone
