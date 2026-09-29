# 商品データ照合結果

基準：`prd-ec-shop/prisma/seed.ts`（Git commit `cd8575e75236f532cb115c69b97fbe0e1425d862`）。DB接続設定はないため、稼働DBは照合対象外。

5商品・10バリエーションすべてに画像とBlenderモデルを対応付けました。追加生成はクリアファイルA/B・オリジナルTEE A/Bの4種類です。

| 商品ID | 商品 | Variant ID | 内容 | 状態 |
|---|---|---|---|---|
| 0 | ランダム缶バッジ | 0 | ランダム1SKU・内容物5色 | 既存素材を対応付け |
| 1 | クリアファイル | 1, 2 | 2種類 | 追加生成済み |
| 2 | アクリルスタンド | 3, 4, 5 | 3種類 | 既存素材を対応付け |
| 3 | タペストリー | 6, 7 | 2種類 | 既存素材を対応付け |
| 4 | オリジナル TEE | 8, 9 | 2種類 | 追加生成済み |

## IDごとの画像

| Variant ID | 商品バリエーション名 | 対応色 | 画像URL |
|---|---|---|---|
| 0 | ランダム缶バッジ | 5色ランダム | `/products/candy/variant-0.webp` |
| 1 | クリアファイル A | ストロベリーピンク | `/products/candy/variant-1.webp` |
| 2 | クリアファイル B | ソーダブルー | `/products/candy/variant-2.webp` |
| 3 | アクリルスタンド A | ストロベリーピンク | `/products/candy/variant-3.webp` |
| 4 | アクリルスタンド B | ミントグリーン | `/products/candy/variant-4.webp` |
| 5 | アクリルスタンド C | ラベンダー | `/products/candy/variant-5.webp` |
| 6 | タペストリー A | ストロベリーピンク | `/products/candy/variant-6.webp` |
| 7 | タペストリー B | ソーダブルー | `/products/candy/variant-7.webp` |
| 8 | オリジナル TEE A | ストロベリーピンク | `/products/candy/variant-8.webp` |
| 9 | オリジナル TEE B | ソーダブルー | `/products/candy/variant-9.webp` |

SKU専用カラムはありません。`Variant.id`がこの対応表の識別キーです。A/B/Cの色指定はseedにないため、既存モチーフと合わせて上記の色を割り当てています。

照合時点の商品・Variantレコード、価格、在庫はそのままです。素材をリポジトリに配置し、seedの画像URLを更新済みです。DBへの適用は未実施です。ランダム缶バッジを5つの販売SKUには分割していません。

合計は **販売5商品・10バリエーション、見た目14種類** です。
