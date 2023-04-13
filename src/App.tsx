import React, {MouseEvent, useEffect, useState} from 'react';
import './App.css';
import {
    ProjectDeleteRequest,
    ProjectEditRequest,
    ProjectOpenRequest,
    ProjectPostRequest,
    ProjectPostResponse,
    ProjectService
} from "./common/services/ProjectService";
import LoadingSpinner from './components/LoadingSpinner';
import TestButtons from './components/TestButtons';

function App() {

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


    return (
        <div className="App">
            <header className="App-header">
                {isLoading ? <LoadingSpinner/> : <TestButtons/>}
            </header>
        </div>
    );
}

export default App;