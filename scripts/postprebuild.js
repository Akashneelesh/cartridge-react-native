#!/usr/bin/env node
/**
 * Post-prebuild script to add Controller pod to iOS Podfile
 *
 * This script runs after `expo prebuild` to inject the Controller native module
 * pod declaration, which is required for Cartridge session management.
 *
 * Usage: npm run prebuild (which runs expo prebuild && node scripts/postprebuild.js)
 */

const fs = require('fs');
const path = require('path');

const PODFILE_PATH = path.join(__dirname, '..', 'ios', 'Podfile');
const CONTROLLER_POD = `
  # Manually add Controller native module for Cartridge sessions
  pod 'Controller', :path => '../modules/controller'`;

function addControllerPod() {
  // Check if Podfile exists
  if (!fs.existsSync(PODFILE_PATH)) {
    console.log('⚠️  ios/Podfile not found. Run expo prebuild first.');
    return false;
  }

  let podfileContent = fs.readFileSync(PODFILE_PATH, 'utf8');

  // Check if Controller pod is already added
  if (podfileContent.includes("pod 'Controller'")) {
    console.log('✅ Controller pod already present in Podfile');
    return true;
  }

  // Find the use_expo_modules! line and add Controller pod after it
  const useExpoModulesPattern = /use_expo_modules!/;

  if (!useExpoModulesPattern.test(podfileContent)) {
    console.log('⚠️  Could not find use_expo_modules! in Podfile');
    return false;
  }

  // Insert Controller pod after use_expo_modules!
  podfileContent = podfileContent.replace(
    /use_expo_modules!/,
    `use_expo_modules!${CONTROLLER_POD}`
  );

  fs.writeFileSync(PODFILE_PATH, podfileContent);
  console.log('✅ Added Controller pod to ios/Podfile');

  return true;
}

// Run the script
console.log('🔧 Post-prebuild: Configuring iOS Podfile...');
const success = addControllerPod();

if (success) {
  console.log('');
  console.log('📦 Next steps:');
  console.log('   cd ios && pod install');
  console.log('   npx expo run:ios');
}

process.exit(success ? 0 : 1);
