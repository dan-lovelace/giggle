#!/bin/sh

# install all package dependencies
yarn install

# initialize local database
yarn workspace @giggle/db knex migrate:latest

# create .env with template
echo "GOOGLE_API_KEY=" >> packages/app/.env