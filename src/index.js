import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter as Router} from "react-router-dom"
ReactDOM.render(<Router>
<HashRouter>
<App />
</HashRouter>
</Router>, document.getElementById('root'));

serviceWorker.unregister();
