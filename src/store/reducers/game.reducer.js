import * as actionTypes from '../actions/actionTypes';
import {
    updateNextPlayer
} from '../actions/game.action'
const initialState = {
    players: [],
    history: [],
    xIsNext: true
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_PLAYERS':
            return {
                ...state,
                players: action.players
            }
        case 'SET_HISTORY':
            return {
                ...state,
                history: action.history
            }
        case 'SET_XISNEXT':
            return {
                ...state,
                xIsNext: action.xIsNext
            }
        default:
            return state;
    }
};

export default reducer;
