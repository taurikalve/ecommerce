#!/bin/bash
NAME=ecommerce-backend
DIR=$(dirname "$(realpath "$0")")
APP_DIR=$(dirname "$DIR")
MONOREPO_DIR=$(dirname "$APP_DIR")

bash $MONOREPO_DIR/scripts/buildApp.sh --name $NAME --app-dir $APP_DIR