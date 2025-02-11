# DockerでローカルPostgresqlのDBを起動する

## Container

- postgres:15-alpine

## 前提条件

- Dockerのインストール

## 初回起動時

1. docker-compose.yml がある階層まで移動
2. 1.で移動した階層で以下のコマンドを実行し、コンテナを作成・起動する

   `docker-compose up -d`

3. 1.で移動した階層で以下のコマンドを実行し、コンテナが起動している確認する（STATUS が Up になっていれば起動成功）

   `docker ps`

## よく使うコマンド

- 起動しているコンテナを確認
  `docker ps`
- 起動中・停止中のコンテナを確認
  `docker ps -a`
- 起動(コンテナ起動)
  `docker-compose start`
- 停止(コンテナ停止)
  `docker-compose stop`
- 停止(コンテナ停止と削除)
  `docker-compose down`
