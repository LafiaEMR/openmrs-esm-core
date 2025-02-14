import Cookies from 'js-cookie';

export const setupFetchInterceptor = () => {
  const { fetch: originalFetch } = window;
  window.fetch = async (...args) => {
    let [resource, config] = args;

    // Initialize config if it doesn't exist
    config = config || {};

    // Initialize headers if they don't exist
    config.headers = config.headers || {};

    // Add X-TenantID header
    const user = JSON.parse(Cookies.get('user') || '');
    const backupTenantId = user?.tenantId;
    const tenantId = backupTenantId || localStorage.getItem('tenantId');

    config.headers = {
      ...config.headers,
      'X-TenantID': tenantId,
    };

    const response = await originalFetch(resource, config);
    return response;
  };
};
