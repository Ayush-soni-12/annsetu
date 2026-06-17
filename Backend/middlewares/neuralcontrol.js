const ControlPlaneSDK = require('neuralcontrol').default || require('neuralcontrol');

let controlPlane;

if (!process.env.NEURALCONTROL_API_KEY) {
  console.log("[ControlPlane] ⚠️ API key not found. Running in offline/mock mode.");
  
  controlPlane = {
    initialize: async () => {},
    middleware: () => (req, res, next) => {
      req.controlPlane = {
        shouldSkip: false,
        isRateLimitedCustomer: false,
        isLoadShedding: false,
        isQueueDeferral: false,
        shouldCache: false,
        coalesce: async (key, fn) => await fn(),
      };
      next();
    },
    withDbTimeout: async (key, fn, priority) => {
      return await fn();
    },
    adaptiveFetch: async (key, url, options) => {
      // Use global fetch if needed, though adaptiveFetch is not typically used without it defined globally
      return await global.fetch(url, options);
    }
  };
} else {
  controlPlane = new ControlPlaneSDK({
    serviceName: process.env.NEURALCONTROL_SERVICE_NAME,
    apiKey:  process.env.NEURALCONTROL_API_KEY,
    tenantId: process.env.TENANT_ID,
    controlPlaneUrl: process.env.CONTROL_PLANE_URL,
    tracing: true,       // Enable distributed tracing (spans sent to AI Control Plane)
    featureFlags: true,  // Enable feature flag support
  });
}

module.exports = controlPlane;
