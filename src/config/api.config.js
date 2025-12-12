export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const API_URL = BASE_URL;
export const IMAGE_BASE_URL = "http://localhost:5000/uploads/foundPersons";
export const API_ENDPOINTS = {
    DASHBOARD: `${BASE_URL}/dashboard`,
    PERSONS: `${BASE_URL}/persons`,
    REGISTER: `${BASE_URL}/persons/register`,
    SEARCH: `${BASE_URL}/persons/search`
};
