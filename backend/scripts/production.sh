#!/bin/bash
NAME=ecommerce-backend
TEMP_NAME=$NAME-new
PROXY=traefik-proxy
STATIC_VOLUME="$NAME"-static
CERTS_VOLUME="$NAME"-certs
DB_NET=mongo-net # !!!
DIR=$(dirname $(realpath $0))
APP_DIR=$(dirname $DIR)

# Volumes
if [ ! "$(docker volume ls | grep "$STATIC_VOLUME")" ]; then
  docker volume create $STATIC_VOLUME
fi
if [ ! "$(docker volume ls | grep "$CERTS_VOLUME")" ]; then
  docker volume create $CERTS_VOLUME
fi

docker run -d \
--name $TEMP_NAME \
--env-file $APP_DIR/.env.production.local \
--net $PROXY \
--net $DB_NET \
--volume $STATIC_VOLUME:/ecommerce/backend/static \
--volume $CERTS_VOLUME:/ecommerce/backend/certs \
--restart unless-stopped \
--label "traefik.enable=true" \
--label "traefik.http.routers.$NAME.rule=Host(\`server.my-ecommerce-domain.com\`)" \
--label "traefik.http.services.$NAME.loadbalancer.server.port=3000" \
$NAME
# --env-file $APP_DIR/.env.production \

# Remove old
docker stop $NAME
docker rm $NAME

# Rename new
docker rename $TEMP_NAME $NAME