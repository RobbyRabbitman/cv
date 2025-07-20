#!/bin/sh

echo "⚙️ Building tools ..."
for tsconfig in $(find tools -name 'tsconfig.lib.json'); do
  tool=$(dirname "$tsconfig")
  echo "⚙️ Building $tool ..."
  pnpm tsc --build $tsconfig
done
