#!/bin/bash
set -e

# WebDriverAgent connection details
WDA_IP="192.168.18.180"
WDA_PORT=8100
WDA_URL="http://${WDA_IP}:${WDA_PORT}"

echo "Starting iOS testing environment"
echo "WebDriverAgent URL: ${WDA_URL}"

# Kill existing processes
pkill -f WebDriverAgent || true
pkill -f appium || true

# Create derived data directory
mkdir -p ./derived_data

# Set environment variables
export IOS_DEVICE_NAME="iPhone 16 Plus"
export IOS_PLATFORM_VERSION="18.4"
export IOS_APP_PATH="./apps/iOS.Simulator.SauceLabs.Mobile.Sample.app.2.7.1.app"

# Start WebDriverAgent
echo "Starting WebDriverAgent..."
osascript -e 'tell application "Terminal" to do script "cd '$(pwd)' && xcodebuild -project node_modules/appium-xcuitest-driver/node_modules/appium-webdriveragent/WebDriverAgent.xcodeproj -scheme WebDriverAgentRunner -destination \"platform=iOS Simulator,name=iPhone 16 Plus,OS=18.4\" test"'

# Wait for WDA to start
echo "Waiting for WebDriverAgent to start..."
MAX_RETRY=30
COUNT=0
while [ $COUNT -lt $MAX_RETRY ]; do
  if curl -s ${WDA_URL}/status > /dev/null; then
    echo "WebDriverAgent is running at ${WDA_URL}"
    break
  fi
  COUNT=$((COUNT+1))
  sleep 2
done

if [ $COUNT -eq $MAX_RETRY ]; then
  echo "Failed to start WebDriverAgent"
  exit 1
fi

# Start Appium server
echo "Starting Appium server..."
npx appium --relaxed-security &
APPIUM_PID=$!
sleep 5

echo "Environment ready! Capabilities for Appium Inspector:"
echo "{
  \"platformName\": \"iOS\",
  \"appium:automationName\": \"XCUITest\",
  \"appium:deviceName\": \"${IOS_DEVICE_NAME}\",
  \"appium:platformVersion\": \"${IOS_PLATFORM_VERSION}\",
  \"appium:app\": \"$(pwd)/apps/iOS.Simulator.SauceLabs.Mobile.Sample.app.2.7.1.app\",
  \"appium:webDriverAgentUrl\": \"${WDA_URL}\",
  \"appium:useNewWDA\": false
}"

echo "Press Ctrl+C to stop"
wait $APPIUM_PID 