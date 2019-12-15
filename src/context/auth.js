import React, { useReducer, createContext } from 'react';
import { Redirect } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const initialState = {
    user: null
}

// check if we have the token when starting the app

if (localStorage.getItem('jwtToken')) {
    const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));
    decodedToken.exp * 1000 < Date.now() ?
        initialState.user = null :
        initialState.user = decodedToken

}


const AuthContext = createContext({
    user: null,
    login: (userData) => { },
    logout: () => { }
})

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload // set user in state with this data
            }
        case 'LOGOUT':
            return {
                user: null // clear the data, set user to null
            }
        default:
            return state;
    }
}

const AuthProvider = (props) => {
    const [state, dispatch] = useReducer(authReducer, initialState); // useReducer takes a reducer return a state and a dispatch

    const login = (userData) => {
        localStorage.setItem("jwtToken", userData.token); // persist the user token in localstorage
        dispatch({ // we can use the dispatch and return any action
            type: 'LOGIN',
            payload: userData
        })
    }

    const logout = () => {
        localStorage.removeItem("jwtToken");
        dispatch({ type: 'LOGOUT' });
    }

    return (
        <AuthContext.Provider
            value={{ user: state.user, login, logout }}
            {...props}
        />
    )
}

export { AuthContext, AuthProvider }

