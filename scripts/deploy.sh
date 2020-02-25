#!/bin/sh
cd web2
./node_modules/.bin/gatsby build
cd ..
netlify deploy
