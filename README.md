# Candy Rain Store / prd-ec-shop

ECストアの基本的な購入フローを実装したデモWebアプリです。

バックエンド開発の学習を目的として、商品一覧・商品詳細・カート・購入・注文履歴をフルスタックで設計・実装しています。正常系の機能実装と責務分離を優先しており、入力バリデーションや厳密な認証、有限在庫の管理は将来の拡張対象です。

## Shopify連携

商品・カート・購入手続きをShopifyへ接続するモードを追加しています。設定、下書き移行した商品、実ストア側の残作業は [Shopify連携ガイド](docs/shopify.md) を参照してください。

## デモ

https://candy-rain-store.vercel.app

デモアカウントの入力内容はサインイン画面に記載しています。

## 実装済みの機能

- Credentialsを利用したデモ用サインイン・サインアウト
- 商品一覧・商品詳細・商品バリエーション表示
- カートへの追加・数量変更・削除
- Prismaトランザクションを利用した注文処理
- 注文履歴・注文詳細の表示
- Vercelへのデプロイ

## 技術スタック

- Next.js 16 / React 19
- TypeScript
- Prisma ORM 7
- PostgreSQL
- Tailwind CSS 4
- shadcn/ui / Base UI / Lucide
- Auth.js 5 beta

## アーキテクチャ

次のレイヤー分離を目標に、段階的にリファクタリングしています。

- UI（Server Component / Client Component）
- Server Action（入力受付・UI更新）
- Service層（ビジネスロジック）
- Repository層（DBアクセス）

注文作成とカート削除は同じトランザクション内で処理し、購入時の商品名と価格を注文データに保存しています。

## 開発上の前提

本プロジェクトは学習用デモのため、常に正常な操作が行われるケースを中心に実装しています。

- 入力バリデーションは未実装
- 認証はデモ用に簡略化
- 在庫は無限として扱い、注文時の在庫確認・減算は行わない
- ローカル開発ではDocker ComposeのPostgreSQLを利用

これらは実運用を想定する場合の追加課題です。

## ローカル開発

Node.js、npm、Docker Desktopを使用します。ローカル開発時のPostgreSQLはDocker Composeで起動するため、Dockerの起動が必須です。

```bash
cp .env.example .env
npm install
npm run db:setup
npm run dev
```

以前の設定を使っていた場合は、既存の`.env`にある`DATABASE_URL`も`.env.example`と同じDocker用の接続先（ポート`5432`）へ更新してください。5432番を別のPostgreSQLが使用中の場合は、`.env`の`POSTGRES_PORT`と`DATABASE_URL`のポートを両方とも`5433`などの空きポートに変更できます。既存のPostgreSQLを停止する必要はありません。

`npm run dev`はPostgreSQLコンテナが起動済みであることを確認してからNext.jsを起動します。DBだけを操作する場合は次のコマンドを使用します。

起動前に`npm run env:check`が`.env`のDocker DB接続先と`AUTH_SECRET`を検証します。エラーになった場合は`.env.example`を基準に設定を更新してください。

```bash
npm run db:start  # PostgreSQLを起動してhealthcheckを待つ
npm run db:logs   # PostgreSQLのログを表示
npm run db:stop   # コンテナを停止（データはvolumeに保持）
```

`AUTH_SECRET`は次のコマンドなどで生成した値へ置き換えてください。

```bash
openssl rand -base64 32
```

通常のアプリビルドはDB更新を行いません。ローカルDBへmigrationとseedをまとめて適用する場合は`npm run db:setup`を使用します。デプロイ先のDBへmigrationを適用する場合は、対象の`DATABASE_URL`を確認したうえで`npm run db:migrate`を明示的に実行します。

本番DBのmigrationはGitHub Actionsの「Migrate production database」を手動実行します。GitHubの`production` Environmentに`DATABASE_URL` secretを登録し、必要に応じてEnvironmentの承認ルールを設定してください。

## 品質チェック

```bash
npm test
npm run test:integration
npm run test:e2e
npm run lint
npx tsc --noEmit
npm run build
```

Node.js Test Runnerとtsxによる単体・DB統合テストに加え、Playwrightによるサインインから購入完了までのE2Eテストを実装しています。統合・E2Eテストの前にDocker PostgreSQLへmigrationとseedを適用してください。main・devへのpushとPull RequestではGitHub ActionsがPostgreSQLを起動し、品質チェック、統合テスト、E2Eテストを自動実行します。

## 今後の改善候補

- Service層とRepository層の責務整理
- 単体・統合テストの対象拡大
- 入力バリデーションと認証・認可の強化
- 有限在庫を扱う場合の在庫管理


## キャンディーモチーフの商品素材

商品5件・Variant 10件のWebP画像は `public/products/candy/` に配置しています。
ランダム缶バッジはVariant 0のまま、5色の集合画像を使用します。

- 編集可能なBlenderモデル・個別PNG/WebP・元テクスチャ：`assets/candy-collection/`
- 素材一覧：`assets/candy-collection/index.html`（ブラウザーで直接開けます）
- 商品ID・Variant IDと画像URLの対応：`assets/candy-collection/shop-assets/image-mapping.json`
- 商品データとの照合記録：`assets/candy-collection/catalog-audit.md`

`prisma/seed.ts` は配置済みの画像URLを使用します。既存レコードについても、IDと商品名（VariantはproductIdも）が一致する場合に画像URLだけを更新します。この画像更新では価格・在庫・商品名を変更しません。
画像の配置だけでは既存DBのURLは変わりません。DBへ反映する場合は、接続先を確認して通常のseed手順を実行してください。seedには従来どおりデモユーザーのパスワード更新も含まれます。

商品一覧・詳細画面は `lib/product-images.ts` を通じて同じ対応表の画像を参照するため、DBに旧プレースホルダーURLが残っていても新しい画像を表示します。対応表にない商品・VariantはDBの画像URLを引き続き使用します。

Blenderモデル（`.blend`と番号付きバックアップ）は`.gitignore`で除外し、ローカルにのみ保持します。Git cloneで取得できるのはレンダリング画像・テクスチャ・生成スクリプト・対応表です。素材一覧のBlenderリンクはローカルにモデルがある場合に利用できます。
