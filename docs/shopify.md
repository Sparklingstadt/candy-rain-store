# Candy Rain Store の Shopify 連携

対象: Sparklingstadt/prd-ec-shop / https://candy-rain-store.vercel.app

## 動作

`COMMERCE_PROVIDER=shopify` で、既存の /products・/products/[handle]・/cart を Storefront API に切り替えます。既存のデザインを使用し、ゲストで商品閲覧・バリエーション選択・カート追加・数量変更・削除ができます。購入ボタンはその時点のカートを再取得して Shopify の checkoutUrl へ移動します。注文の作成・決済・最終的な在庫確認は Shopify Checkout が担当します。

商品一覧は24件ごとにページ送り、バリエーションはAPIのページをすべて取得します。価格・通貨・販売可否・カート小計はShopifyの応答を使用します。固定送料やローカルDBのデモ価格は使用しません。APIエラー、販売商品0件、売り切れ、在庫調整の警告を表示します。

カートIDは秘密部分を含むためHttpOnly/SameSite=Lax Cookieに保存し、本番ではSecureを有効にします。クライアントへカートIDやprivate tokenは渡しません。数量は1〜99、カート更新対象は現在のCookieのカート内に存在する行だけです。更新時の上流userErrorsを成功として扱いません。GETの失敗を空カートとみなして新規作成しません。

アカウント・注文履歴はShopifyのホスト型アカウント画面 `/account` に案内します。Customer Account APIでの独自マイページや既存PostgreSQLの注文履歴の移行は含みません。旧デモのServer ActionsはShopifyモードでDB変更しません。

## ローカル設定

`.env.local`:

```dotenv
COMMERCE_PROVIDER=shopify
SHOPIFY_STORE_DOMAIN=candy-rain-dev.myshopify.com
# Headless販売チャネルを使う場合のみ、発行されたprivate tokenを指定
SHOPIFY_STOREFRONT_PRIVATE_TOKEN=
```

```bash
npm ci
npx prisma generate
npm run dev
```

Shopifyモードの起動にPostgreSQLやDockerは不要です。既存デモのモジュールもビルドされるためPrisma Client生成は必要です。`COMMERCE_PROVIDER=demo`または未指定では従来のDBデモ動作です。`.env.example`は既存環境を勝手に切り替えないようdemoを既定値にしています。

Storefront APIは2026-07を指定。トークンなしでも基本の商品・カート操作を利用できますが、ストア側でOnline Storeを利用可能にし、商品をそのチャネルへ公開する必要があります。Headlessチャネルのprivate tokenを設定する場合は、同チャネルへの商品公開を確認してください。Admin APIトークンを設定しないでください。private tokenはサーバーのみで使用し、Vercelではプラットフォームが設定するx-vercel-forwarded-forからShopify-Storefront-Buyer-IPを渡します。他ホストへ移す際は、そのホストの信頼できる接続元IPの取得方法を追加してください。

## 実ストアの確認結果と公開準備（2026-09-30 JST）

現在の接続先は無料開発ストア Candy Rain Dev (`candy-rain-dev.myshopify.com`) です。Headlessチャネルのprivate tokenをサーバー側に設定し、既存サイトから商品取得・日本語ハンドルの商品詳細・カート・Shopify Checkoutを確認しました。利用者がテスト決済を確定し、注文 #1002 がHeadless経由のテスト注文・支払い済みとして登録されています。実際の請求はありません。

開発ストアには既存5商品・10バリエーションをテスト用に追加し、有効化しています。テスト商品の在庫は追跡していません。ストア作成時のサンプル商品も一覧に含まれます。本番URLにデプロイしても接続先はこの開発ストアであり、実販売用への切替は別途必要です。元の試用ストアの下書きはそのまま残しています。

Vercel Productionには上記3環境変数を設定します。private tokenは機密値として保存し、リポジトリやブラウザに含めません。

## 元の試用ストアへの下書き移行

移行元は取得したリポジトリの `prisma/seed.ts`（ベースcommit cd8575e75236f532cb115c69b97fbe0e1425d862）の5商品・10バリエーションです。本番PostgreSQLのスナップショット移行ではありません。画像は既存公開サイトの固定画像をShopify CDNへ取り込み、バリエーション画像も関連付けました。空の説明はそのままです。

| 商品 | Shopify商品ID | バリエーション数 | 価格（JPY） |
|---|---|---:|---:|
| ランダム缶バッジ | 15400465891580 | 1 | 500 |
| クリアファイル | 15400466219260 | 2 | 800 |
| アクリルスタンド | 15400466317564 | 3 | 1500 |
| タペストリー | 15400466546940 | 2 | 4500 |
| オリジナル TEE | 15400467038460 | 2 | 6500 |

全商品DRAFT。`candy-rain-import`、`source-product-{旧ID}`タグと `CANDY-RAIN-{旧Variant ID}` SKUで移行元を追跡できます。在庫追跡は有効、数量は0。seedの50個はデモ値であり、実在庫としてコピーしていません。既存商品の削除、Shopifyでの商品公開、購入、プラン変更は行っていません。

## 検証

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
npx playwright install chromium
npm run test:shopify
```

`test:shopify`は本番ビルドを起動し、テストプロセスに限ってStorefront APIを差し替えます。実ストアへ注文を送らず、ゲスト購入導線・Cookie属性・別ブラウザとの分離・リロード保持・数量変更・削除・Checkout遷移・空商品・API失敗・404・売り切れ・在庫不足・調整警告・期限切れカート・390px画面を検証します。実Shopify Checkout内の決済完了はこのテストの対象外です。

公式資料:
- https://shopify.dev/docs/api/storefront/latest
- https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/manage

依存関係監査で既存の脆弱性が検出されたため、互換範囲の更新をlockfileへ反映しました（Next.js 16.3.7 / Prisma 7.10.0）。Prismaが参照するmysql2は3.24.4へoverrideし、Prismaのメジャーダウングレードを避けています。npm auditは0件です。

検証結果: 単体18件、DB統合8件、従来デモE2E8件、Shopify E2E3件が通過。lint・TypeScript・本番ビルドも通過しました。DBテストは専用の一時PostgreSQLで実施し、終了後にコンテナを削除しています。実接続のエラー画面は390pxで横はみ出し・JavaScriptエラーなし、Shopify CDN画像のNext.js最適化配信はHTTP 200を確認しました。
