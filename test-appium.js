const { remote } = require('webdriverio');
const path = require('path');

/**
 * Checks if a value is effectively undefined
 */
function isEffectivelyUndefined(value) {
  return value === undefined || value === "undefined";
}

/**
 * Recursively removes undefined values from objects
 */
function removeUndefined(obj) {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => !isEffectivelyUndefined(v))
      .map(([k, v]) => [
        k,
        v && typeof v === 'object' && !Array.isArray(v)
          ? removeUndefined(v)
          : v
      ])
  );
}

/**
 * Verifies capabilities don't contain undefined values
 */
function verifyCapabilities(caps) {
  const stringified = JSON.stringify(caps);
  return !stringified.includes('undefined') && !stringified.includes('"undefined"');
}

(async () => {
  const appPath = path.resolve('./apps/iOS.Simulator.SauceLabs.Mobile.Sample.app.2.7.1.app');
  
  const caps = removeUndefined({
    platformName: 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:deviceName': 'iPhone 16 Plus',
    'appium:platformVersion': '18.4',
    'appium:app': appPath,
    'appium:webDriverAgentUrl': 'http://192.168.18.180:8100',
    'appium:useNewWDA': false,
    'appium:noReset': false
  });

  if (!verifyCapabilities(caps)) {
    console.error('⚠️ Error: Capabilities contain undefined values');
    process.exit(1);
  }
  
  try {
    // Check if WDA is running
    const { execSync } = require('child_process');
    try {
      execSync(`curl ${caps['appium:webDriverAgentUrl']}/status`);
      console.log('WDA is running ✅');
    } catch (err) {
      console.error(`WDA is not running at ${caps['appium:webDriverAgentUrl']}`);
      process.exit(1);
    }
    
    const driver = await remote({
      protocol: 'http',
      hostname: '127.0.0.1',
      port: 4723,
      path: '/',
      capabilities: caps
    });
    
    const source = await driver.getPageSource();
    
    if (source.includes('test-Username') && source.includes('test-Password')) {
      console.log('App launched successfully ✅');
    } else {
      console.log('App launched but login page not found');
    }
    
    await driver.deleteSession();
    
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})(); 