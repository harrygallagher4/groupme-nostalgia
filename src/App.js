import React, { Component } from 'react';
import querystring from 'querystring';

import logo from './logo.svg';
import './App.css';
import Message from './Message.js';
import getMessages from './download.js';

import { CLIENT_ID } from './constants';
import MESSAGES from './gm_messages.json';

class App extends Component {

  state = {
    messages: [],
    token: null
  }

  componentDidMount() {

    if (window.location.search) {
      const token = querystring.parse(window.location.search.substring(1)).access_token;

      this.setState({
        token
      });

      getMessages(token).then(messages => {
        this.setState({messages});
      });
    }

  }

  render() {
    if (!this.state.token) {
      return (
        <h1>
          <a href={`https://oauth.groupme.com/oauth/authorize?client_id=${CLIENT_ID}`}>
            Authorize
          </a>
        </h1>
      );
    } else if (this.state.messages.length == 0) {
      return (
        <h1>Loading...</h1>
      );
    } else {
      return (
        <div id="app" className="container">
          {
            this.state.messages.map((message, index) => {
              return (
                <Message key={index} message={message} />
              );
            })
          }
        </div>
      );
    }
  }
}

export default App;
