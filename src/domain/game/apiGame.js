import { API } from '../../config'
import axios from 'axios'

const getAllRoom = () => {
    const token = localStorage.getItem('token');
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    return axios.get(`${API}/room`, config)
}

const api = {
    getAllRoom
}

export default api;