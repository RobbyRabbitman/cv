#!/bin/sh

echo "⚙️ Setting up node via nvm - using the node version specified in $(pwd)/package.json"

node_version=$(jq -r '.engines.node // empty' package.json)

if [ -z "$node_version" ]; then
    echo '❌ No node version specified in package.json'
    exit 1
fi

if [ -f "$NVM_DIR/nvm.sh" ]; then
    . "$NVM_DIR/nvm.sh"
else
    echo '❌ Unable to find nvm.sh in $NVM_DIR'
    exit 1
fi

nvm use $node_version || nvm install $node_version
