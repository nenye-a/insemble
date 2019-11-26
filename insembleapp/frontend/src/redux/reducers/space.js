import {
    MAP_LOADING,
    MAP_LOADED,
    MAP_ERROR,
    LOCATION_ERROR,
    LOCATION_LOADED,
} from '../actions/types'

const initialState = {
    // map state
    mapLoaded: false,
    heatMap: null,
    mapIsLoading: false,

    // location state
    locationLoaded: false,
    hasLocation: false,
    location: null,
}

export default function(state = initialState, action) {
    switch (action.type) {
        case MAP_LOADING:
            return {
                ...state,
                mapIsLoading: true
            }
        case MAP_LOADED:
            return {
                ...state,
                mapLoaded: true,
                heatMap: action.payload,
                mapIsLoading: false
            }
        case MAP_ERROR:
            return {
                ...state,
                mapLoaded: false,
                mapIsLoading: false,
            }
        case LOCATION_ERROR:
            return {
                ...state,
                locationLoaded: false,
                location: null,
                hasLocation: false
            }
        case LOCATION_LOADED:
            return {
                ...state,
                location: action.payload,
                locationLoaded: true,
                hasLocation: true,
            }
        default:
            return state;
    }
}