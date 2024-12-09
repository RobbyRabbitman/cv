#!/bin/sh

for tool in "tools"/*; do
    if [ -d "$tool" ]; then
        tsconfig="$tool/tsconfig.lib.json"

        if [ -f "$tsconfig" ]; then
            echo "⚙️ Building $tool ..."
            pnpm tsc --build $tsconfig
        fi
    fi
done
