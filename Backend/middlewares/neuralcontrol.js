const ControlPlaneSDK = require('neuralcontrol').default || require('neuralcontrol');

const controlPlane = new ControlPlaneSDK({
  serviceName: "annsetu-backend",
  apiKey: process.env.CONTROL_PLANE_API_KEY || process.env.NEURALCONTROL_API_KEY,
  tenantId: process.env.TENANT_ID,
  controlPlaneUrl: process.env.CONTROL_PLANE_URL,
  tracing: true,       // Enable distributed tracing (spans sent to AI Control Plane)
  featureFlags: true,  // Enable feature flag support
});

module.exports = controlPlane;
