FROM postgres:15-alpine3.21

RUN apk --update --no-cache add --virtual build-dependencies postgresql-dev gcc clang15 llvm15 clang19 llvm19 musl-dev make curl \
    && cd /tmp \
    && curl -L -O https://github.com/pgbigm/pg_bigm/releases/download/v1.2-20200228/pg_bigm-1.2-20200228.tar.gz \
    && tar -xzf pg_bigm-1.2-20200228.tar.gz \
    && cd pg_bigm-1.2-20200228 \
    && make USE_PGXS=1 \
    && make USE_PGXS=1 install \
    && echo "shared_preload_libraries = 'pg_bigm'" >> /var/lib/postgresql/data/postgresql.conf \
    && rm -fr /tmp/pg_bigm-1.2-20200228 \
    && rm -fr /tmp/pg_bigm-1.2-20200228.tar.gz \
    && apk del --purge build-dependencies

COPY ./db/custom-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/custom-entrypoint.sh

ENTRYPOINT ["custom-entrypoint.sh"]

CMD ["postgres"]
