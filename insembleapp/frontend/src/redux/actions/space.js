import {
    MAP_LOADING,
    MAP_LOADED,
    LOCATION_ERROR,
    LOCATION_LOADED,
    MAP_ERROR
} from '../actions/types'


// LOAD LOCATION
export const getLocation = (requestUrl) => (dispatch) => {

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
                type: LOCATION_ERROR
            });
        }
    }).catch(err => {
        console.log(err)
        dispatch({
            type: LOCATION_ERROR
        });
    });
}

// LOAD HEAT MAP
export const loadMap = (hasLocation=false, income=0, categories=[]) => (dispatch, getState) => {

    // map is loading
    dispatch({type: MAP_LOADING})

    console.log("hasLocaiton", hasLocation)
    console.log("getState", getState().space.hasLocation)
    if(hasLocation || getState().space.hasLocation) {

        const locationLoaded = getState().space.locationLoaded;
        while(!locationLoaded) {
            locationLoaded = getState().space.locationLoaded;
            console.log(locationLoaded);
        }        
        
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
