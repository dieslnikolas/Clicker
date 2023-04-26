import electron from 'electron';
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const ipcRenderer = electron.ipcRenderer || false;

function App() {
    const [message, setMessage] = React.useState('no ipc message');

    const onClickWithIpc = () => {
        // ipcRenderer.send('get-messages', 'some data from ipcRenderer');
    };

    const onClickWithIpcSync = () => {
        // const message = ipcRenderer.sendSync('add-message', 'Message text');
        // setMessage(message);
    };

    // If we use ipcRenderer in this scope, we must check the instance exists
    if (ipcRenderer) {
        // In this scope, the webpack process is the client
    }

    React.useEffect(() => {
        // like componentDidMount()

        // register `ping-pong` event
        // ipcRenderer.on('get-messages', (event, data) => {
        //     setMessage(data);
        // });

        return () => {
            // like componentWillUnmount()

            // unregister it
            // ipcRenderer.removeAllListeners('ping-pong');
        };
    }, []);

    return (
        <React.Fragment>
        <Head>
          <title>Clicker</title>
        </Head>
        <div className='grid grid-col-1 text-2xl w-full text-center'>
          <img className='ml-auto mr-auto' src='/images/logo.png' />
          <span>⚡ Electron ⚡</span>
          <span>+</span>
          <span>Next.js</span>
          <span>+</span>
          <span>tailwindcss</span>
          <span>=</span>
          <span>💕 </span>
        </div>
        <div className='mt-1 w-full flex-wrap flex justify-center'>
          <Link href='/next'>
            <a className='btn-blue'>Go to next page</a>
          </Link>
        </div>
      </React.Fragment>
    );
};

export default App;
