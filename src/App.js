import React, { Component } from 'react';
import _ from 'lodash';
import querystring from 'querystring';
import { Navbar, FormGroup, FormControl } from 'react-bootstrap';

import './App.css';
import Message from './Message.js';
import getMessages, { getGroups } from './download.js';

import { CLIENT_ID } from './constants';

class App extends Component {

  constructor(props) {
    super(props);

    this.onSelected = this.onSelected.bind(this);
  }

  state = {
    messages: [],
    groups: [],
    selectedGroup: null,
    token: null
  }

  componentDidMount() {

    if (this.state.token && !this.state.groups.length) {
      this.loadGroups();
    }

    if (window.location.search) {
      const token = querystring.parse(window.location.search.substring(1)).access_token;

      this.setState({ token }, this.loadGroups);
    }

  }

  loadGroups() {
    getGroups(this.state.token).then(groups => {
      this.setState({groups});
    });
  }

  loadMessages() {
    getMessages(this.state.token, this.state.selectedGroup.id)
      .then(messages => {
        this.setState({messages});
      })
  }

  getGroupId() {
    return this.state.selectedGroup && this.state.selectedGroup.id ||
      null;
  }

  getGroupName() {
    return this.state.selectedGroup && this.state.selectedGroup.name ||
      'Select group...';
  }

  onSelected(event) {
    const id = event.target.value;

    if (id == null)
      return;

    const selectedGroup = _.find(this.state.groups, { id });

    this.setState({ selectedGroup, messages: [] }, this.loadMessages);

  }

  render() {

    let contents = null;

    if (!this.state.token) {
      contents = (
        <h1>
          <a href={`https://oauth.groupme.com/oauth/authorize?client_id=${CLIENT_ID}`}>
            Authorize
          </a>
        </h1>
      );
    } else if (this.state.token && !this.state.selectedGroup) {
      contents = (
        <h1>Nothing is selected!</h1>
      );
    } else if (this.state.token && this.state.selectedGroup && !this.state.messages.length) {
      contents = (
        <h1>Loading...</h1>
      )
    }
    else {
      contents = this.state.messages.map((message, index) => {
        return (
          <Message key={index} message={message} />
        );
      })
    }

    return (
      <div id="app">
        <Navbar fixedTop>
          <Navbar.Form pullLeft>
            <FormGroup controlId="formControlSelect">
              <FormControl
                value={this.getGroupId()}
                onChange={this.onSelected}
                componentClass="select" >
                <option value={null}>Select a group...</option>
                {
                  this.state.groups.map((group, index) => {
                    return (
                      <option
                        value={group.id}
                        key={index}>
                        {group.name}
                      </option>
                    );
                  })
                }
              </FormControl>
            </FormGroup>
          </Navbar.Form>
        </Navbar>
        <div className="container">
          { contents }
        </div>
      </div>
    )
  }
}

export default App;
