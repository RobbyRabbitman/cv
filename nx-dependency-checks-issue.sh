#!/bin/sh

pnpm run clean

# see https://github.com/nrwl/nx/issues/29438
pnpm run sync-dependencies

# works because every project - therefore project dependencies aswell - have the same build target name
pnpm nx run @robby-rabbitman/cv-libs-i18n-util:lint-eslint

# does not work build target names are different for the project dependencies
pnpm nx run @robby-rabbitman/cv-libs-i18n-util:eslint-issue
