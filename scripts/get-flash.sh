#!/bin/bash

set -e

out="$1"
arch="$2"
version="$3"

if [ $arch = "x86-64" ]; then
    arch="x86_64"
fi

version="32.0.0.465"
url="http://web.archive.org/web/https://fpdownload.adobe.com/pub/flashplayer/pdc/32.0.0.465/flash_player_ppapi_linux.$arch.tar.gz"

echo "Fetching flash player $version $arch"

echo $url

mkdir -p cache

cachename="cache/flashplayer-v$version-$arch.tar.gz"
curl -sS -o "$cachename" -z "$cachename" -L --remote-time --connect-timeout 30 --fail "$url" || exit $?

tar -xzf "$cachename" -C "$out"
