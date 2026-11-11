#!/usr/bin/env bash
# Downloads the three libraries into vendor/ so the app is fully self-hosted and works offline.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p vendor
B=https://cdnjs.cloudflare.com/ajax/libs
curl -fsSL "$B/xlsx/0.18.5/xlsx.full.min.js"   -o vendor/xlsx.full.min.js
curl -fsSL "$B/exceljs/4.4.0/exceljs.min.js"   -o vendor/exceljs.min.js
curl -fsSL "$B/jszip/3.10.1/jszip.min.js"      -o vendor/jszip.min.js
ls -lh vendor
