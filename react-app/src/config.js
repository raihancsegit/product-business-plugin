const API_BASE_URL = window.psp_object?.api_base_url || '/wp-json/productscope/v1/';
const ROOT_URL = window.psp_object?.root_url || '';

export const PRODUCTS_API_URL = `${API_BASE_URL}products`;
export const FAVORITES_API_URL = `${API_BASE_URL}favorites`;
export const MYLIST_API_URL = `${API_BASE_URL}mylist`;
export const JWT_API_URL = `${ROOT_URL}/wp-json/jwt-auth/v1/token`;