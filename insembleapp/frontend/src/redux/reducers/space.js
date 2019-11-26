import {
    MAP_LOADING,
    MAP_LOADED,
    MAP_ERROR,
    LOCATION_ERROR,
    LOCATION_LOADED,
} from '../actions/types'

const initialState = {
    // // map state
    // mapLoaded: false,
    // heatMap: null,
    // mapIsLoading: false,

    // // location state
    // locationLoaded: false,
    // hasLocation: false,
    // location: null,

    mapLoaded: sessionStorage.getItem("mapLoaded"),
    heatMap: JSON.parse(sessionStorage.getItem("heatMap")),
    mapIsLoading: false,

    // location state
    locationLoaded: sessionStorage.getItem("locationLoaded"),
    hasLocation: sessionStorage.getItem("hasLocation"),
    location: JSON.parse(sessionStorage.getItem("location")),
}

export default function(state = initialState, action) {
    switch (action.type) {
        case MAP_LOADING:
            sessionStorage.removeItem("heatMap")
            return {
                ...state,
                mapIsLoading: true
            }
        case MAP_LOADED:
            sessionStorage.setItem("mapLoaded", true)
            sessionStorage.setItem("heatMap", JSON.stringify(action.payload))
            return {
                ...state,
                mapLoaded: true,
                heatMap: action.payload,
                mapIsLoading: false
            }
        case MAP_ERROR:
            sessionStorage.removeItem("mapLoaded")
            sessionStorage.removeItem("heatMap")
            return {
                ...state,
                mapLoaded: false,
                mapIsLoading: false,
            }
        case LOCATION_LOADED:
            sessionStorage.setItem("location", JSON.stringify(action.payload))
            sessionStorage.setItem("locationLoaded", true)
            sessionStorage.setItem("hasLocation", true)
            return {
                ...state,
                location: action.payload,
                locationLoaded: true,
                hasLocation: true,
            }
        case LOCATION_ERROR:
            sessionStorage.removeItem("location")
            sessionStorage.removeItem("locationLoaded")
            sessionStorage.removeItem("hasLocation")
            return {
                ...state,
                locationLoaded: false,
                location: null,
                hasLocation: false
            }
        default:
            return state;
    }
}