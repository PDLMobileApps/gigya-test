#!/bin/bash

rm -rf platforms plugins package.json package-lock.json
cordova platform add android --verbose
cordova build android --debug