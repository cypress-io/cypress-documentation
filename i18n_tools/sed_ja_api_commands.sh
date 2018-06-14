#!/bin/bash

sed -i -E "s/^\# Syntax$/# シンタックス/" source/ja/api/commands/*.md
sed -i -E "s/^\# Example\(s\)*$/# 例/" source/ja/api/commands/*.md
sed -i -E "s/^\# Notes$/# ノート/" source/ja/api/commands/*.md
sed -i -E "s/^\# Rules$/# ルール/" source/ja/api/commands/*.md
sed -i -E "s/^\# Command Log$/# コマンドログ/" source/ja/api/commands/*.md
sed -i -E "s/^\# See also$/# こちらも参考にしてください/" source/ja/api/commands/*.md

sed -i -E "s/^\## Usage$/## 使い方/" source/ja/api/commands/*.md
sed -i -E "s/^\## Arguments$/## 引数/" source/ja/api/commands/*.md
sed -i -E "s/^\## Yields {% helper\_icon yields %}$/## 実行結果 {% helper_icon yields %}/" source/ja/api/commands/*.md
sed -i -E "s/^\## Function\(s\)*$/## 関数/" source/ja/api/commands/*.md
sed -i -E "s/^\## Alias\(es\)*$/## エイリアス/" source/ja/api/commands/*.md
sed -i -E "s/^\## Mouse Event\(s\)*$/## マウスイベント/" source/ja/api/commands/*.md
sed -i -E "s/^\## Change Event\(s\)*$/## チェンジイベント/" source/ja/api/commands/*.md
sed -i -E "s/^\## Position$/## 位置で指定/" source/ja/api/commands/*.md
sed -i -E "s/^\## Coordinates$/## 座標で指定/" source/ja/api/commands/*.md
sed -i -E "s/^\## Options$/## オプション/" source/ja/api/commands/*.md
sed -i -E "s/^\## Actionability$/## 操作ができる状態/" source/ja/api/commands/*.md
sed -i -E "s/^\## Snapshots$/## スナップショット/" source/ja/api/commands/*.md
sed -i -E "s/^\## Event\(s\)*$/## イベント/" source/ja/api/commands/*.md
sed -i -E "s/^\## Differences$/## 相違点/" source/ja/api/commands/*.md
sed -i -E "s/^\## Scopes$/## スコープ/" source/ja/api/commands/*.md
sed -i -E "s/^\## No Args$/## 引数なしの場合/" source/ja/api/commands/*.md
sed -i -E "s/^\## Selector$/## セレクターを使う場合/" source/ja/api/commands/*.md
sed -i -E "s/^\## Requirements {% helper\_icon requirements %}$/## 条件 {% helper_icon requirements %}/" source/ja/api/commands/*.md
sed -i -E "s/^\## Assertions {% helper\_icon assertions %}$/## アサーション {% helper_icon assertions %}/" source/ja/api/commands/*.md
sed -i -E "s/^\## Timeouts {% helper\_icon timeout %}$/## タイムアウト {% helper_icon timeout %}/" source/ja/api/commands/*.md
sed -i -E "s/^\## Timeout\(s\)$/## タイムアウト/" source/ja/api/commands/*.md
sed -i -E "s/^\## Command\(s\)*$/## コマンド/" source/ja/api/commands/*.md

rm source/ja/api/commands/*.md-E

ack "^#+ [a-zA-Z]+" source/ja/api/commands/
