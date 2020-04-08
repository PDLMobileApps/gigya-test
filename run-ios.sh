#!/bin/bash

rm -rf platforms plugins package.json package-lock.json
cordova platform add ios --verbose
cordova build ios --debug

echo
echo "********** TO BUILD ***********"
echo
echo "- Open the project in Xcode"
echo "- Select the target and go to 'Signing & Capabilities'"
echo "- In the Debug tab, configure the Team"
echo "- In the Release tab, delesect 'Automatically manage signing', then select it again enabling automatic signing. Finally, select a Team."
echo "- Build and deploy from Xcode"
echo