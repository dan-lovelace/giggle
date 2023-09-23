#!/bin/sh

# install all package dependencies
yarn install

# initialize local database
yarn workspace @giggle/db knex migrate:latest
