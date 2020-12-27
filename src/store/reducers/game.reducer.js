import * as actionTypes from '../actions/actionTypes';
import {
    updateNextPlayer
} from '../actions/game.action'
const initialState = {
    nextPlayer: true,
    players: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.NEXT_PLAYER:
            console.log(action)
            return {
                ...state,
                nextPlayer: action.nextPlayer
            }
        case 'SET_PLAYERS':
            return {
                ...state,
                players: action.players
            }
        default:
            return state;
    }
};

export default reducer;
