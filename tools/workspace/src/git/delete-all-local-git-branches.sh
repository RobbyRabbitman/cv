#!/bin/sh

echo '⚙️ Deleting all local branches except main'

if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
    echo '❌ You have uncommitted changes. Please commit or stash them before deleting branches.'
    exit 1
fi

git checkout -q --track origin/main || git switch main && git for-each-ref --format '%(refname:short)' refs/heads | grep -v 'main' | xargs git branch -D
