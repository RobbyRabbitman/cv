#!/bin/sh

echo '⚙️ Cleaning workspace - removing all git ignored files, reinstalling npm packages and resetting the nx workspace'

git clean -dfX
pnpm i
nx reset
