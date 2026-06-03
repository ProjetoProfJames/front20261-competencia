import {apiRequest} from './api';

export async function login (email, password){
    const response = await apiRequest('/auth/login', 'POST',{
        email,
        password,
    })

    localStorage.setItem('token', response.data.accessToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    return response.data;
};
    export function logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
   
}
    export function getUser(){
        return JSON.parse(localStorage.getItem('user'));
    }