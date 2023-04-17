import * as React from 'react';
import {useEffect, useState} from 'react';
import Core from './components/Core';
import { LoadingSpinner } from './components/shared/LoadingSpinner';

export default function App() {

    const [isLoading, setIsLoading] = useState(true);

    // Token
    let jwt: String

    useEffect(() => {

        const loadApiDetails = async () => {
            // GET API DETAILS
            const {ipcRenderer} = window.require('electron');
            const apidetails = JSON.parse(await ipcRenderer.invoke("getApiDetails"));
            console.info("API DETAILS", apidetails);

            await new Promise(resolve => setTimeout(resolve, 1000));

            setIsLoading(false);
        }

        loadApiDetails();

    }, []);


    return (isLoading ? <LoadingSpinner/> : <Core/>);
}