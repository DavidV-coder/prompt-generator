#!/bin/sh

# Replace PORT placeholder in nginx config
sed -i "s/\$PORT/${PORT:-80}/g" /etc/nginx/conf.d/default.conf

# Start nginx
nginx -g 'daemon off;'
