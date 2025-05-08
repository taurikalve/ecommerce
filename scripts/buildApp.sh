#!/bin/bash
DIR=$(dirname "$(realpath "$0")")
MONOREPO_DIR=$(dirname "$DIR") 

options=$(getopt -o n:d: --long name:,app-dir: -- "$@") 
eval set -- "$options"

while true; do
  case "$1" in
    -n|--name) NAME="$2"; shift 2;;
    -d|--app-dir) APP_DIR="$2"; shift 2;;
    --) shift; break;;
    *) echo "Unknown option: $1"; break;;
  esac
done

if [[ -z "$NAME" || -z "$APP_DIR" ]]; then
  echo "Error: All options --name|-n and --app-dir|-d are required"
  exit 1
fi; 

cp $APP_DIR/.dockerignore $MONOREPO_DIR/.dockerignore

docker build -t $NAME -f $APP_DIR/Dockerfile $MONOREPO_DIR

rm $MONOREPO_DIR/.dockerignore