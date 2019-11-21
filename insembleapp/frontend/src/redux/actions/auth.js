import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR
} from './types';

//Check TOKEN & LOAD USER
export const loadUser = () => (dispatch, getState) => {
    // User Loading
    dispatch({ type: USER_LOADING });

    // token from state
    const token = getState().auth.token;



    // headers
    const config = {
        haeders: {
            'Content-Type': 'application/json'
        }
    }

    if(token) {
        config.headers['Authorization'] = `Token ${token}`;
    }

    fetch('/api/auth/user', config)
    .then(res => res.json())
    .then((data) => {
      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
    }).catch(err => {
        console.log(err)
        dispatch({
            type: AUTH_ERROR
        })
    })

}

// async getDataFetch() {
//     const response =
//       await fetch("https://dog.ceo/api/breeds/list/all",
//         { headers: {'Content-Type': 'application/json'}}
//       );
//     console.log(await response.json());
// };