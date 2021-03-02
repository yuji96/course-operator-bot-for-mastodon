# mastodon 用コース運営ボット

- 実行: `npm forever app.js`

## 全般設定

### bot-config.json

```
{
  "admin": "moai_test", //管理者ユーザ名　今のところ意味なし
  "description": "text", //ボットアカウントのbio欄上部に記載する説明
  ...
}
```

## tagbot-タグ検知＆担当者メンション機能(v1.0.0)

target_tag がボットのホームタイムラインに投稿されると検知し、担当者へ伝える。
担当者の交代を自動で行い、交代時に通知する。

### bot-config.json

```
  {
    ...
    "tagbot": [ //配列内の設定オブジェクトごとに独立したボット
      {
        "id": "tagbot1", //bot-status.jsonと一致
        "bio_title": "text", //bio欄に当番を表示する際のタイトル
        "target_tag": "tag_name", //検知するタグ名（ハッシュタグ無し）
        "transfar_groups": [ //当番グループ配列　グループごとに独立してローテーションする
          {
            "id": "group1", //bot-status.jsonと一致
            "group_name": "groupname", //通知等するときの名前
            "member": ["username", ...] //ローテーションする担当者アカウントのユーザーネーム　@付けてそのままメンションできるやつ
          },
          ...
        ],
        "frequency_month": 0, //ローテーション間隔
        "frequency_date": 7,
        "frequency_hour": 0,
        "frequency_minute": 0,
        "frequency_second": 0,
        "transfar_comment": "<name>さんからのレビュー依頼です。\n<content>\n<mentions>", //タグ検知時の通知テキスト　<content>にトゥートのURL、<mentions>に当番へのメンションが入る
        "take_turn_comment": "レビュアー交代です。今週の当番は\n<content>\nです。よろしくお願いします。\ncc: <mentions>", //ローテーション交代時の通知　<content>に各グループの名前と当番へのメンション、<mentions>に交代前の人へのメンション
        "visibility": "private", //タグ検知時の通知テキストの表示設定（"public"|"unlisted"|"private"|"direct"）
        "is_active": "true" //ボット有効フラグ
      },
      ...
    ],
    ...
  }
```

### bot-status.json

```
{
  ...
  "tagbot": {
    "tagbots": [
      {
        "id": "tagbot1", //手動設定
        "updated_at": "Tue, 02 Mar 2021 06:23:18 GMT", //自動
        "transfar_groups": [ //手動で追加
          {
            "id": "group1",
            "index": 0 //現在の当番 configのmember配列のインデックス
          },
          ...
        ],
        "previous_tag_timeline_end_id": "105818751834570181" //作成まで自動
      }
    ],
    "recent_bio": "tag pick upper test\n\n今週のレビュアー\n- 二次レビュアー: @moai_test\n- 一次レビュアー: @moai_test_nowhere_4\n\n" //作成まで自動
  },
  ...
}
```

## loudspeaker-対象者一括メンション、予約投稿機能(v1.0.0)

以下をトゥートして実行
`@<botアカウント名> \loudspeaker <対象リスト(subscriber managerより)> <本文>`
予約投稿
`@<botアカウント名> \loudspeaker --remind <mm-dd-hh-mm-ss> <対象リスト(subscriber managerより)> <本文>`

設定不要

## reminder-毎週投稿機能(v1.0.0)

### bot-config.json

```
{
  ...
  "reminders": [ //配列内要素ごとに独立
    {
      "id": "reminder1", //bot-statusと一致
      "name": "reminder_test_1",
      "target_subscriber_list_id": "subscriber_list_1", //subscriber managerで管理するリストのid リストのメンバーへメンションが飛ぶ
      "text": "定例会開始5分前です。諸々よろしく。\n<mentions>", //リマインド本文 <mentions>に対象者へのメンションが入る
      "day": 0, //曜日
      "hour": 3,
      "minute": 0,
      "visibility": "private", //トゥートの表示設定
      "is_active": "true" //有効
    },
    ...
  ],
  ...
}
```

### bot-status.json

```
{
  ...
  "reminder": {
    "reminders": [
      {
        "id": "reminder1", //手動設定
        "list_id": "3528", //作成不要
        "scheduled_at": "Sat, 06 Mar 2021 18:00:00 GMT" //作成不要
      }
    ]
  },
  ...
}
```

## subscriber manager-各機能の対象者をリストで管理(v1.0.0)

以下のコマンドをトゥートすることでリストに加入 リストは bot-config.json で設定
`@<botアカウント名> \subscribe <リスト名>`

### bot-config.json

```
{
  ...
  "subscriber_manager": {
    "subscriber_lists": [
      {
        "id": "subscriber_list_1", //ユニーク
        "name": "subscriber_list_name_1" //リスト名
      }
    ]
  },
  ...
}
```

bot-status.json 設定不要

## operation listener-メンションからコマンド実行命令を検知(v1.0.0)

設定不要
