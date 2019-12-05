import {
    MAP_LOADING,
    MAP_LOADED,
    MAP_ERROR,
    LOCATION_ERROR,
    LOCATION_LOADED,
    LOCATION_LOADING,
    LOCATION_CLEAR,
} from '../actions/types'

const initialState = {

    mapLoaded: sessionStorage.getItem("mapLoaded"),
    heatMap: JSON.parse(sessionStorage.getItem("heatMap")),
    mapIsLoading: false,

    // location state
    locationLoaded: sessionStorage.getItem("locationLoaded"),
    hasLocation: sessionStorage.getItem("hasLocation"),
    location: JSON.parse(sessionStorage.getItem("location")),
    locationIsLoading: false,
    locationErr: null
}

export default function(state = initialState, action) {
    switch (action.type) {
        case MAP_LOADING:
            sessionStorage.removeItem("heatMap")
            sessionStorage.removeItem("mapLoaded")
            return {
                ...state,
                mapIsLoading: true,
                heatMap: null,
                mapLoaded: null
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
        case LOCATION_LOADING:
            sessionStorage.removeItem("locationLoaded")
            return {
                ...state,
                locationIsLoading: true,
                locationLoaded: false,
                locationErr: null
            }
        case LOCATION_LOADED:
            sessionStorage.setItem("location", JSON.stringify(action.payload))
            sessionStorage.setItem("locationLoaded", true)
            sessionStorage.setItem("hasLocation", true)
            return {
                ...state,
                location: action.payload,
                locationIsLoading: false,
                locationLoaded: true,
                hasLocation: true,
                locationErr: null
            }
        case LOCATION_ERROR:
        case LOCATION_CLEAR:
            sessionStorage.removeItem("location")
            sessionStorage.removeItem("locationLoaded")
            sessionStorage.removeItem("hasLocation")
            return {
                ...state,
                locationLoaded: false,
                locationIsLoading: false,
                location: null,
                hasLocation: false,
                locationErr: action.payload
            }
        default:
            return state;
    }
}