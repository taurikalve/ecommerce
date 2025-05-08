#!/bin/bash
NAME=ecommerce-backend
TEMP_NAME=$NAME-new
PROXY=traefik-proxy
VOLUME="$NAME"-static
DB_NET=mongo-net # !!!
DIR=$(dirname $(realpath $0))
APP_DIR=$(dirname $DIR)

# Volume
if [ ! "$(docker volume ls | grep $VOLUME)" ]; then
  docker volume create $VOLUME
fi

docker run -d \
--name $TEMP_NAME \
--env-file $APP_DIR/.env.production.local \
--net $PROXY \
--net $DB_NET \
--volume $VOLUME:/ecommerce/backend/static \
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