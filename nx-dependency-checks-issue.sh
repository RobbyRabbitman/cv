#!/bin/sh

pnpm run clean

pnpm nx run-many -t lint-eslint --rule '@nx/dependency-checks:error' # fails which is not correct

pnpm nx run-many -t build build-tsc build-angular

pnpm nx run-many -t lint-eslint --rule '@nx/dependency-checks:error' # fails which is not correct

pnpm nx reset # nx reset is apparently a 'fix'

pnpm nx run-many -t lint-eslint --rule '@nx/dependency-checks:error' # does not fail which is correct
