import axios from 'axios';

// Create an Axios instance with default settings
const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // Replace with your API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor (e.g., adding auth tokens)
apiClient.interceptors.request.use(config => {
    // You can add authentication tokens here
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

apiClient.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response) {
        console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
        console.error('No response from API:', error.request);
    } else {
        console.error('API Request Error:', error.message);
    }
    return Promise.reject(error);
});

export const getUser = (userId) => {
    return apiClient.get(`/user/${userId}`);
};

export const getUserData = () => {
    return apiClient.get(`/user`);
};

export const createUser = (userData) => {
    return apiClient.post('/user/register', userData);
};

export const createChat = (firstId, secoundId) => {
    return apiClient.post('/chat-member', { firstId, secoundId });
};
export const sendMessages = (content, sender_id, chat_id, message_type, status) => {
    return apiClient.post('/message', { content, sender_id, chat_id, message_type, status });
};

export const getUserChat = () => {
    return apiClient.get(`/chat-member/findUserChat`);
};
export const getUserNotifications = () => {
    return apiClient.get(`/notifications`);
};
export const updateNotification = (items) => {
    return apiClient.patch(`/notifications/update`,items);
};

export const getUserMessage = (chat_id) => {
    return apiClient.get(`/message/${chat_id}`);
};
export const updateUserMessage = (user_id, data) => {
    if (user_id)
        return apiClient.patch(`/message/${user_id}`, data);
};
export const uploadImages = (data) => {
        return apiClient.post(`/uploads`, data,{
            headers:'multipart/form-data'
        });
};
export const loginUser = (userData) => {
    return apiClient.post('/user/login', userData);
};

export const updateUser = (userId, userData) => {
    return apiClient.put(`/users/${userId}`, userData);
};

export const deleteUser = (userId) => {
    return apiClient.delete(`/users/${userId}`);
};

