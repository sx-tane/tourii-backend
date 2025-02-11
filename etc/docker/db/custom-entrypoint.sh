#!/bin/sh
# データディレクトリの権限を調整
chown -R postgres:postgres /data

# PostgreSQL の標準エントリーポイントスクリプトを実行
exec docker-entrypoint.sh "$@"
