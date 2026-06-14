const ControlPlaneSDK = require('neuralcontrol').default || require('neuralcontrol');

const controlPlane = new ControlPlaneSDK({
  serviceName: process.env.NEURALCONTROL_SERVICE_NAME,
  apiKey:  process.env.NEURALCONTROL_API_KEY,
  tenantId: process.env.TENANT_ID,
  controlPlaneUrl: process.env.CONTROL_PLANE_URL,
  tracing: true,       // Enable distributed tracing (spans sent to AI Control Plane)
  featureFlags: true,  // Enable feature flag support
});

module.exports = controlPlane;
