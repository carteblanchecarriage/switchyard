#!/bin/bash
# Deploy Cloudflare Worker Edge API
# Run this once to deploy

echo "Installing Wrangler CLI..."
npm install -g wrangler

echo "Logging into Cloudflare..."
npx wrangler login

echo "Deploying worker..."
npx wrangler deploy --name switchyard-api --config wrangler-api.toml

echo "Done! Your API is now live."
