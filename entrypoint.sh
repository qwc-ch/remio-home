#!/bin/sh
set -e

# 挂载的自定义图标目录（可选）：/opt/icons -> /usr/share/nginx/html/icons
if [ -d /opt/icons ] && [ -n "$(ls -A /opt/icons 2>/dev/null)" ]; then
  echo "Copying custom icons to /usr/share/nginx/html/icons"
  mkdir -p /usr/share/nginx/html/icons
  cp -rf /opt/icons/. /usr/share/nginx/html/icons/
fi

exec "$@"