#!/bin/bash
NAME=ecommerce-backend
VOLUME="$NAME"-static
DB_NET=mongo-net # !!!
DIR=$(dirname "$(realpath $0)")
APP_DIR=$(dirname "$DIR")

# Existing container
if [ "$(docker ps -a | grep "$NAME")" ]; then 
  docker rm -f "$NAME"
fi

# Volume
if [ ! "$(docker volume ls | grep "$VOLUME")" ]; then
  docker volume create "$VOLUME"
fi

docker run -d \
--name $NAME \
--env-file $APP_DIR/.env.test \
--net $DB_NET \
--volume $VOLUME:/ecommerce/backend/static \
-p 127.0.0.1:4000:4000 \
$NAME
