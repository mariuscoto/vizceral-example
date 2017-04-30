'use strict';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import React from 'react'; // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom';
import WebFont from 'webfontloader';

import './app.css';
import Nodes from './components/nodes';
import TrafficFlow from './components/trafficFlow';
import SecurityAdvisor from './components/securityAdvisor';

function fontsActive () {
  if (location.pathname === '/nodes') {
    ReactDOM.render(<Nodes />, document.getElementById('main'));
  } else if (location.pathname === '/security') {
    ReactDOM.render(<SecurityAdvisor />, document.getElementById('main'));
  } else {
    ReactDOM.render(<TrafficFlow />, document.getElementById('main'));
  }
}

// Only load the app once we have the webfonts.
// This is necessary since we use the fonts for drawing on Canvas'...

// imports are loaded and elements have been registered

WebFont.load({
  custom: {
    families: ['Source Sans Pro:n3,n4,n6,n7'],
    urls: ['/fonts/source-sans-pro.css']
  },
  active: fontsActive
});
