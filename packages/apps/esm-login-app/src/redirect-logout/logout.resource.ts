import { mutate } from 'swr';
import { clearCurrentUser, openmrsFetch, refetchCurrentUser, restBaseUrl } from '@openmrs/esm-framework';

export async function performLogout() {
  // Call Lafia logout API
  try {
    const token = JSON.parse(localStorage.getItem('token') || '');
    await fetch('https://dev-api.lafialink-dev.com/api/v1/user/logout', {
      method: 'POST',
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error during Lafia logout:', error);
  }

  await openmrsFetch(`${restBaseUrl}/session`, {
    method: 'DELETE',
  });

  // clear the SWR cache on logout, do not revalidate
  // taken from the SWR docs
  mutate(() => true, undefined, { revalidate: false });

  clearCurrentUser();
  await refetchCurrentUser();
}
