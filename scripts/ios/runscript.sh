#!/bin/bash

# This script loops through embedded frameworks to remove unused architectures
# It gets added to the iOS project as a build phase by the ios/before-build-ios-config.js script

APP_PATH="${TARGET_BUILD_DIR}/${WRAPPER_NAME}"

echo "Looping through the embedded frameworks to remove unused architectures"

# Only consider MFP and Gigya frameworks
# To include all frameworks: find "$APP_PATH" -name '*.framework' -type d | while read -r FRAMEWORK
find "$APP_PATH" \( -name 'GigyaSDK.framework' \) -type d | while read -r FRAMEWORK; do
    FRAMEWORK_EXECUTABLE_NAME=$(defaults read "$FRAMEWORK/Info.plist" CFBundleExecutable)
    FRAMEWORK_EXECUTABLE_PATH="$FRAMEWORK/$FRAMEWORK_EXECUTABLE_NAME"
    echo "Executable is $FRAMEWORK_EXECUTABLE_PATH"

    EXTRACTED_ARCHS=()

    for ARCH in $ARCHS; do
        echo "Extracting $ARCH from $FRAMEWORK_EXECUTABLE_NAME"
        lipo -extract "$ARCH" "$FRAMEWORK_EXECUTABLE_PATH" -o "$FRAMEWORK_EXECUTABLE_PATH-$ARCH"
        EXTRACTED_ARCHS+=("$FRAMEWORK_EXECUTABLE_PATH-$ARCH")
    done

    echo "Merging extracted architectures: ${ARCHS}"
    lipo -o "$FRAMEWORK_EXECUTABLE_PATH-merged" -create "${EXTRACTED_ARCHS[@]}"
    rm "${EXTRACTED_ARCHS[@]}"

    echo "Replacing original executable with thinned version"
    rm "$FRAMEWORK_EXECUTABLE_PATH"
    mv "$FRAMEWORK_EXECUTABLE_PATH-merged" "$FRAMEWORK_EXECUTABLE_PATH"
done
