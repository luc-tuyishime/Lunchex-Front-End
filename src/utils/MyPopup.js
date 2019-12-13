import { Popup } from 'semantic-ui-react';
import React from 'react';

const MyPopup = ({ content, header, children }) => {
    return <Popup inverted content={content} header={header} trigger={children} />
}

export default MyPopup;

