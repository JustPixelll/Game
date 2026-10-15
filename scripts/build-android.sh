#!/usr/bin/env bash
# Reproducible unsigned APK with Android SDK tools; no Gradle or Maven downloads.
set -euo pipefail
cd "$(dirname "$0")/.."
SDK="${ANDROID_SDK_ROOT:-${ANDROID_HOME:-}}"
if [[ -z "$SDK" || ! -f "$SDK/platforms/android-35/android.jar" ]]; then
  echo 'Install Android SDK platform 35 and build-tools 35.0.0; set ANDROID_HOME.' >&2
  exit 1
fi
BT="$SDK/build-tools/35.0.0"
for tool in aapt2 d8 zipalign; do test -x "$BT/$tool" || { echo "Missing $BT/$tool" >&2; exit 1; }; done
rm -rf build/android
mkdir -p build/android/{gen,classes,dex} dist/android
B="$PWD/build/android"
"$BT/aapt2" compile --dir android/res -o "$B/resources.zip"
"$BT/aapt2" link -o "$B/base.apk" -I "$SDK/platforms/android-35/android.jar" \
 --manifest android/AndroidManifest.xml "$B/resources.zip" -A web --java "$B/gen"
find android/src "$B/gen" -name '*.java' -print > "$B/sources.txt"
javac -encoding UTF-8 -source 8 -target 8 -classpath "$SDK/platforms/android-35/android.jar" \
 -d "$B/classes" @"$B/sources.txt"
find "$B/classes" -name '*.class' -print > "$B/classes.txt"
"$BT/d8" --lib "$SDK/platforms/android-35/android.jar" --min-api 26 --output "$B/dex" @"$B/classes.txt"
cp "$B/base.apk" "$B/with-dex.apk"
(cd "$B/dex" && zip -q "$B/with-dex.apk" classes*.dex)
"$BT/zipalign" -P 16 -f 4 "$B/with-dex.apk" dist/android/Bramblehaven-v2.0.0-unsigned.apk
cp "$BT/lib/apksigner.jar" dist/android/apksigner.jar
"$BT/aapt2" dump badging dist/android/Bramblehaven-v2.0.0-unsigned.apk > dist/android/APK-INFO.txt
printf '\nAPK built. Sign with a private, stable key before installing.\n'
