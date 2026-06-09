#!/bin/bash
# boot.sh — runs after every snapshot restore in /invoke.
# Boots services, reconciles drift via the `changed` helper, then runs
# long-lived (typically `bin/dev &` + `wait`).
# Edit this file, then commit and push to keep changes.
# See also: .calude/snapshot.sh (runs once when the snapshot is built).
set -euo pipefail

cd "$HOME/workspace"

changed yarn.lock package.json && yarn install

yarn build:watch &
wait