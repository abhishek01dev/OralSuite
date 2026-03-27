import { ApiClient, ApiError } from '@repo/shared';
import { clientConfig } from '@/config';

export { ApiError };
export const api = new ApiClient(clientConfig.apiUrl);

if (typeof window !== 'undefined') {
  api.setTokenGetter(() => sessionStorage.getItem('accessToken'));
}
