// Simple test to check if imports work
try {
  const React = require('react');
  const next = require('next');
  const framerMotion = require('framer-motion');
  console.log('✅ All main dependencies available');
} catch (error) {
  console.log('❌ Import error:', error.message);
}
