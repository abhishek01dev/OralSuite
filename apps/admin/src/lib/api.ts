import { ApiClient, ApiError } from '@repo/shared';
import { adminConfig } from '@/config';

export { ApiError };
export const api = new ApiClient(adminConfig.apiUrl);
