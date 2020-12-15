import * as actionTypes from '../actions/actionTypes';
import updateObject from '../../shared/utils/updateObject';

const initialState = {
    roomId: '',
};

const joinRoom = (state, action) => ({
    ...state,
    roomId: action.roomId
})
const outRoom = (state) => ({
    ...state,
    roomId: ''
})


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.JOIN_ROOM:
            return joinRoom(state, action);
        case actionTypes.OUT_ROOM:
            return outRoom(state);
        default:
            return state;
    }
};

export default reducer;
