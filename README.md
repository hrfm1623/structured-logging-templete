<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# Structured Logging Template for Cloud Run

NestJSを使用してCloud Runにデプロイする構造化ログ出力のテンプレートプロジェクト。

## 機能

- 構造化ログ出力
- 複数のログレベル対応（ERROR, WARN, INFO, DEBUG, VERBOSE）
- Cloud Loggingとの統合
- 環境ごとのログレベル設定
- JSON形式/テキスト形式の切り替え
- エラーオブジェクトの自動シリアライズ
- メタデータの自動付与
- 開発環境とCloud Run環境の自動切り替え

## 必要要件

- Node.js 20.x
- pnpm
- Google Cloud SDK
- Docker

## ローカル開発環境のセットアップ

1. 依存関係のインストール

```bash
pnpm install
```

2. 環境変数の設定

```bash
cp .env.example .env
```

3. 開発サーバーの起動

```bash
pnpm run start:dev
```

## Google Cloudの設定手順

1. Google Cloud SDKのインストール

```bash
sudo snap install google-cloud-cli --classic
```

2. Google Cloudへのログイン

```bash
gcloud auth login
```

3. プロジェクトの作成

```bash
# プロジェクトの作成
gcloud projects create [PROJECT_ID] --name="[PROJECT_NAME]"

# プロジェクトの選択
gcloud config set project [PROJECT_ID]
```

4. 必要なAPIの有効化

```bash
gcloud services enable cloudbuild.googleapis.com run.googleapis.com artifactregistry.googleapis.com logging.googleapis.com
```

5. Artifact Registryの設定

```bash
# リポジトリの作成
gcloud artifacts repositories create structured-logging --repository-format=docker --location=asia-northeast1

# Dockerの認証設定
gcloud auth configure-docker asia-northeast1-docker.pkg.dev
```

6. サービスアカウントの権限設定

```bash
# Cloud Buildサービスアカウントの権限設定
gcloud projects add-iam-policy-binding [PROJECT_ID] \
  --member=serviceAccount:[PROJECT_NUMBER]@cloudbuild.gserviceaccount.com \
  --role=roles/artifactregistry.writer

gcloud projects add-iam-policy-binding [PROJECT_ID] \
  --member=serviceAccount:[PROJECT_NUMBER]@cloudbuild.gserviceaccount.com \
  --role=roles/run.admin

gcloud projects add-iam-policy-binding [PROJECT_ID] \
  --member=serviceAccount:[PROJECT_NUMBER]@cloudbuild.gserviceaccount.com \
  --role=roles/iam.serviceAccountUser

# Cloud Runサービスアカウントの権限設定
gcloud projects add-iam-policy-binding [PROJECT_ID] \
  --member=serviceAccount:service-[PROJECT_NUMBER]@serverless-robot-prod.iam.gserviceaccount.com \
  --role=roles/artifactregistry.reader
```

## デプロイ

1. ローカルでのDockerビルドとテスト

```bash
pnpm run deploy:local
```

2. Cloud Runへのデプロイ

```bash
pnpm run deploy:build
```

## 環境変数

| 変数名                    | 説明                               | デフォルト値 |
| ------------------------- | ---------------------------------- | ------------ |
| PORT                      | アプリケーションのポート番号       | 8080         |
| NODE_ENV                  | 実行環境                           | development  |
| LOG_LEVEL                 | ログレベル                         | info         |
| USE_JSON_LOGGER           | JSON形式でログを出力するか         | false        |
| GOOGLE_CLOUD_PROJECT_ID   | GCPプロジェクトID                  | -            |
| GOOGLE_CLOUD_CLIENT_EMAIL | サービスアカウントのメールアドレス | -            |
| GOOGLE_CLOUD_PRIVATE_KEY  | サービスアカウントの秘密鍵         | -            |

## ログ設定

### ログレベル

```typescript
export type LogLevel =
  | 'error' // エラーログ
  | 'warn' // 警告ログ
  | 'info' // 情報ログ
  | 'http' // HTTPリクエストログ
  | 'verbose' // 詳細ログ
  | 'debug' // デバッグログ
  | 'silly'; // 最も詳細なログ
```

### ログフォーマット

構造化ログは以下の形式で出力されます：

```json
{
  "timestamp": "2025-01-03T00:43:19.480Z",
  "level": "info",
  "message": "ログメッセージ",
  "metadata": {
    "context": "コンテキスト名",
    "additionalInfo": {
      "key": "value"
    }
  }
}
```

### 環境別の動作

- **Cloud Run環境**:

  - Cloud Loggingトランスポートのみを使用
  - 構造化JSONログを出力
  - 環境ラベルを自動付与

- **開発環境**:
  - コンソールトランスポートを使用
  - カラー付きの読みやすいフォーマットで出力
  - デバッグ情報を詳細に表示

### エラーハンドリング

エラーオブジェクトは自動的にシリアライズされ、以下の情報が含まれます：

- エラーメッセージ
- スタックトレース
- エラー名
- 追加のメタデータ

## ログ出力例

```typescript
// 基本的なログ出力
logger.log('Info message');
logger.error('Error message');
logger.warn('Warning message');
logger.debug('Debug message');
logger.verbose('Verbose message');

// 構造化ログ出力
logger.log('Info message', {
  context: 'AppController',
  additionalInfo: { key: 'value' },
});

// エラーログ出力
try {
  throw new Error('Something went wrong');
} catch (error) {
  logger.error('Error occurred', {
    error,
    context: 'ErrorHandler',
    additionalInfo: { operation: 'processData' },
  });
}
```

## ディレクトリ構造

```
.
├── src/
│   ├── common/
│   │   └── logger/
│   │       ├── logger.module.ts    # ロガーモジュール定義
│   │       ├── logger.factory.ts   # ロガー生成ファクトリー
│   │       └── logger.interface.ts # ロガー関連インターフェース
│   ├── app.module.ts              # アプリケーションのルートモジュール
│   └── main.ts                    # アプリケーションのエントリーポイント
├── Dockerfile                     # Dockerビルド設定
├── cloudbuild.yaml               # Cloud Build設定
└── .env.example                  # 環境変数テンプレート
```
