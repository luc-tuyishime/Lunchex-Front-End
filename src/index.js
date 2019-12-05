import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { transitions, positions, types, Provider as AlertProvider } from 'react-alert'
import { Apollo } from './ApolloProvider';


const AlertTemplate = ({ options, message }) => (
    <div>
        {options.type === 'error' && ':('}
        {message}
    </div>
)

const options = {
    // you can also just use 'bottom center'
    position: positions.TOP_CENTER,
    type: types.SUCCESS,
    timeout: 5000,
    offset: '90px',
    // you can also just use 'scale'
    transition: transitions.SCALE
}

ReactDOM.render(
    <AlertProvider template={AlertTemplate} {...options}>
        <Apollo />
    </AlertProvider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
