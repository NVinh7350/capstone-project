export const getAccessToken =() => localStorage.getItem('accessToken');
export const getRefreshToken = ()=> localStorage.getItem('refreshToken');

export const setAccessToken =(value) => localStorage.setItem('accessToken', value);
export const setRefreshToken = (value)=> localStorage.setItem('refreshToken', value);

export const getUser = () => localStorage.getItem('user');
export const setUser = (value) => localStorage.setItem('user', value);

export const clearStorage = () => {
    localStorage.clear();
} 