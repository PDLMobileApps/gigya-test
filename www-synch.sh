#! /bin/bash
#
# Script to copy the content of the main www folder to the www folder under each platforms
#

WD=$(pwd)
IOS=$WD/platforms/ios/www/
ANDROID=$WD/platforms/android/app/src/main/assets/www/

if [ -d "$IOS" ] || [ -d "$ANDROID" ]; then
	# sync www under iOS
	if [ -d "$IOS" ]; then
		#rsync -vrh "$WD/www/" "$IOS"
		rsync -rh "$WD/www/" "$IOS"
	fi

	# sync www under Android
	if [ -d "$ANDROID" ]; then
		#rsync -vrh "$WD/www/" "$ANDROID"
		rsync -rh "$WD/www/" "$ANDROID"
	fi
else
	echo "Could not find suitable (ios, android) platform to synch with."
	echo "Please run this script from the main Cordova project folder."
	exit 1
fi
