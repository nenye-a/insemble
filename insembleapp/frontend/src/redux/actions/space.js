import {
    MAP_LOADING,
    MAP_LOADED,
    LOCATION_ERROR,
    LOCATION_LOADED,
    MAP_ERROR,
    LOCATION_LOADING
} from '../actions/types'


// LOAD LOCATION
export const getLocation = (requestUrl) => (dispatch) => {

    // start loading location
    dispatch({type: LOCATION_LOADING})
    
    // get location information from requestURL containing either lat, lng, radius or address, radius
    fetch(requestUrl)
    .then(res => {
        console.log("hiya", res)
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

// LOAD HEAT MAP
export const loadMap = (hasLocation=false, income=0, categories=[]) => (dispatch, getState) => {

    // map is loading
    dispatch({type: MAP_LOADING})

    if(hasLocation || getState().space.hasLocation) {
        
        const address = getState().space.location.address;
        fetch('/api/lmatches/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                address: address
            })
        })
        .then(res => {
            if(res.ok) {
                res.json().then(data => {
                    dispatch({
                        type: MAP_LOADED,
                        payload: data
                    });
                })
            } else {
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
    } else {
        // TODO: implement case of loading map without address.
        
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        console.log(income)
        console.log()

        const body = JSON.stringify({
            income,
            categories
        });

        fetch('/api/category/', {
            method: 'POST',
            headers: config.headers,
            body
        })
        .then(res => {
            if(res.ok) {
                res.json().then(data => {
                    dispatch({
                        type: MAP_LOADED,
                        payload: data
                    });
                })
            } else {
                console.log(res.status + " " + res.statusText)
                dispatch({
                    type: MAP_ERROR
                });
            }
        })
        .catch(err => {
            console.log(err)
            dispatch({
                type: MAP_ERROR
            });
        })
    
    }
}
