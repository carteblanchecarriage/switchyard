#!/bin/bash
# Keebshelf A/B Test Runner - Runs every 30 minutes
# Tests different user personas against content pages

cd /home/klondike/Desktop/keyboard-tracker

# Run A/B test with all personas
node tools/ab-test-runner.js --persona=all > logs/ab-test-$(date +%Y%m%d-%H%M).log 2>&1

# Log completion
echo "[$(date)] A/B test completed" >> logs/cron.log