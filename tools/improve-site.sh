#!/bin/bash
# Site improvement cron job
# Runs every 15 minutes via cron: */15 * * * *

cd ~/Desktop/keyboard-tracker || exit 1

# Pull latest changes
git checkout new-master
git pull origin new-master

# Check if npm modules exist
if [ ! -d "node_modules" ]; then
  npm ci
fi

# Run the improvement agent via OpenClaw
# This spawns a sub-agent to work on next task
openclaw run-task

# After 4 runs (1 hour), commit and push
if [ $(($(date +%M) / 15)) -eq 0 ]; then
  git add -A
  git commit -m "WIP: Site improvements $(date '+%Y-%m-%d %H:%M')"
  git push origin new-master
fi
