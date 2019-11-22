import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS
} from './types';

//CHECK TOKEN & LOAD USER
export const loadUser = () => (dispatch, getState) => {
    // User Loading
    dispatch({ type: USER_LOADING });

    // Get token from state
    const token = getState().auth.token;

    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    if(token) {
        config.headers['Authorization'] = `Token ${token}`;
    }

    
    fetch('/api/auth/user', config)
    .then(res => {
        if(res.ok) {
            res.json().then(data => {
                dispatch({
                    type: USER_LOADED,
                    payload: data
                });
            })
        } else {
            console.log(res.status + " " + res.statusText);
            dispatch({
                type: AUTH_ERROR
            });
        }
    }).catch(err => {
        console.log(err);
        dispatch({
            type: AUTH_ERROR
        })
    });
}

// LOGIN USER
export const login = (email, password) => (dispatch) => {

    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    //Request Body
    const body = JSON.stringify({ email , password })
    
    fetch('/api/auth/login', {
        method: 'POST',
        headers: config.headers,
        body
    })
    .then(res => {
        if(res.ok) {
            res.json().then(data => {
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: data
                });
            })
        } else {
            console.log(res.status + " " + res.statusText)
            dispatch({
                type: LOGIN_FAIL
            })
        }
    })
    .catch(err => {
        console.log(err)
        dispatch({
            type: LOGIN_FAIL
        })
    })
}


// LOGOUT USER
export const logout = () => (dispatch, getState) => {

    // Get token from state
    const token = getState().auth.token;

    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    if(token) {
        config.headers['Authorization'] = `Token ${token}`;
    }

    fetch('/api/auth/logout/', {
        method: 'POST',
        headers: config.headers,
        body: null
    })
    .then(res => {
        console.log(res)
        if(res.ok) {
            dispatch({
                type: LOGOUT_SUCCESS,
            });
        } else {
            console.log("Failed Logout")
        }
    }).catch(err => {
        console.log(err);
    });
}