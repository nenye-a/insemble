import {
    MAP_LOADING,
    MAP_LOADED,
    LOCATION_ERROR,
    LOCATION_LOADED,
    MAP_ERROR,
    LOCATION_LOADING,
    LOCATION_CLEAR
} from '../actions/types'

// LOAD LOCATION
export const getLocation = (requestUrl) => (dispatch) => {

    // start loading location
    dispatch({type: LOCATION_LOADING})
    
    // get location information from requestURL containing either lat, lng, radius or address, radius
    fetch(requestUrl)
    .then(res => {
        if(res.ok) {
            res.json().then(data => {
                dispatch({
                    type: LOCATION_LOADED,
                    payload: data
                });
            })
        } else {
            console.log(res.status + " " + res.statusText);
            dispatch({
                type: LOCATION_ERROR,
                // TODO: create better error handling on backend
                payload: "Failed to obtain location, please try again."
            });
        }
    }).catch(err => {
        console.log(err)
        dispatch({
            type: LOCATION_ERROR,
            payload: "Failed to obtain location, please try again."
        });
    });
}


// CLEAR LOCATION
export const clearLocation = () => dispatch => {

    // clear the existing loncation - provide no payload
    dispatch({type: LOCATION_CLEAR, payload: null});
}

// LOAD HEAT MAP
export const loadMap = (hasLocation=false, income=0, categories=[]) => (dispatch, getState) => {

    // map is loading
    dispatch({type: MAP_LOADING})

    // config for post request
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    var body = null;
    var apiRequest = '';
    
    if(hasLocation || getState().space.hasLocation) {
        const address = getState().space.location.address;
        apiRequest = '/api/lmatches/';
        body = JSON.stringify({
            address
        })
    } else {
        apiRequest = '/api/category/'
        body = JSON.stringify({
            income,
            categories
        })
    }

    fetch(apiRequest, {
        method: 'POST',
        headers: config.headers,
        body
    })
    .then(res => {
        // if response status is ready, return the heatmap and update redux state
        if(res.status == 200) {
            res.json().then(data => {
                dispatch({
                    type: MAP_LOADED,
                    payload: data
                });
            })
        }  
        // if successful but not ready - ping API with returned until it's ready
        else if(res.status == 202) { 
            res.json().then(data => {
                pingMapApi(data.id, dispatch)
            })
        } 
        
        // otherwise - raise error
        else {
            console.log(res.status + " " + res.statusText);
            dispatch({
                type: MAP_ERROR,
            })
        }
    }).catch(err => {
        console.log(error);
        dispatch({
            type: MAP_ERROR,
        })
    })
}

const pingMapApi = (id, dispatch) => {
    
    console.log("Lot's of things")
    var val = null
    
    fetch('/api/lmatches/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id
        })
    })
    .then(res => {
        if(res.status == 200) {
            res.json().then(data => {
                dispatch({
                    type: MAP_LOADED,
                    payload: data
                })
            })
        }  else if(res.status == 202) {
            res.json().then(data => {
                setTimeout(() => {pingMapApi(data.id, dispatch)}, 3000)
            })
        }
    })
}