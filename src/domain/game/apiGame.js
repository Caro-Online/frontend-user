import { API } from '../../config'
import axios from 'axios'

const getAllRoom = () => {
    const token = localStorage.getItem('token');
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    return axios.get(`${API}/room`, config)
}

const getRoomInfoById = (id) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    return axios.get(`${API}/room/${id}`, config)
}

const joinRoom = (userId, roomId) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    return axios.put(`${API}/room/${roomId}/join`, { userId }, config)
}
const outRoom = (userId, roomId) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    return axios.put(`${API}/room/${roomId}/out`, { userId }, config)
}

const joinMatch = (userId, roomId) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    return axios.put(`${API}/room/${roomId}/join-match`, { userId }, config)
}

const joinRoomById = (roomId) => {

}

const api = {
    getAllRoom,
    getRoomInfoById,
    joinRoom,
    joinMatch,
    outRoom
}

export default api;