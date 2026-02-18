import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

/* ===========================
   AXIOS INSTANCE
=========================== */

const api = axios.create({
    baseURL: apiUrl,
    withCredentials: true // required if refresh token is in cookies
});

/* ===========================
   REQUEST INTERCEPTOR
=========================== */

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/* ===========================
   RESPONSE INTERCEPTOR
=========================== */

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            error.response?.data?.tokenExpired &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const { data } = await axios.post(
                    `${apiUrl}/api/user/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                // store new access token
                localStorage.setItem("accessToken", data.accessToken);

                // retry original request
                originalRequest.headers.Authorization =
                    `Bearer ${data.accessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

/* ===========================
   API HELPERS
=========================== */

export const postData = async (url, payload) => {
  try {
    const { data } = await api.post(url, payload);
    return data;
  } catch (error) {
    return {error:true, message : error?.response?.data.message||"something went wrong"}
  }
};

export const fetchDataFromApi = async (url) => {
    const { data } = await api.get(url);
    return data;
};

export const editData = async (url, payload, config = {}) => {
    const { data } = await api.put(url, payload,config);
    return data;
};

export const deleteData = async (url) => {
    const { data } = await api.delete(url);
    return data;
};

export const deleteMultipleData = async (url, payload) => {
    const { data } = await api.delete(url, {
        data: payload
    });
    return data;
};

/* ===========================
   FILE UPLOADS
=========================== */

export const uploadImage = async (url, formData) => {
    const { data } = await api.put(url, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return data;
};

export const uploadImages = async (url, formData) => {
    const { data } = await api.post(url, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return data;
};

export const deleteImages = async (url, payload) => {
    const { data } = await api.delete(url, {
        data: payload
    });
    return data;
};

export default api;
