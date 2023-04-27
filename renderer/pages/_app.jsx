// Node Modules
import { React } from 'react';

// Styles
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import '../styles/global.css';


// App shell
function Clicker({ Component, pageProps }) {
    return (
        <>
            <Component {...pageProps} />
        </>
    )
}

export default Clicker