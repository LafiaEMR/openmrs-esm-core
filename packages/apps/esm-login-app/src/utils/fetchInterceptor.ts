export const setupFetchInterceptor = () => {
  const { fetch: originalFetch } = window;
  window.fetch = async (...args) => {
    let [resource, config] = args;

    // Initialize config if it doesn't exist
    config = config || {};

    // Initialize headers if they don't exist
    config.headers = config.headers || {};

    // Add X-Tenant-ID header
    const tenantId = localStorage.getItem('tenantId') || 'default';
    config.headers = {
      ...config.headers,
      'X-TenantID': tenantId,
    };

    const response = await originalFetch(resource, config);
    return response;
  };
};
