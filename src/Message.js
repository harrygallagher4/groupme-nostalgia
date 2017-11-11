import React, { Component } from 'react';
import { Media, Image } from 'react-bootstrap';
import moment from 'moment';

import Attachments from './Attachments';
import MessageTextField from './MessageTextField';

function messageBody(message) {
  return (
    <Media.Body>
      <div className="nickname text-muted">
        { message.name }
      </div>
      <MessageTextField message={message} />
      <div className="timestamp text-muted">
        { moment.unix(message.created_at).format('MMM Do Y') }
      </div>
      <Attachments attachments={ message.attachments } />
    </Media.Body>
  );
}

class SystemMessage extends Component {
  render() {
    return (
      <Media className="message system-message">
        { messageBody(this.props.message) }
      </Media>
    );
  }
}

class UserMessage extends Component {
  render() {
    return (
      <Media className="message">
        <Media.Left className="avatar">
          <Image src={this.props.message.avatar_url} className="avatar"/>
        </Media.Left>
        { messageBody(this.props.message) }
      </Media>
    );
  }
}

class Message extends Component {
  render() {
    if (this.props.message.system) {
      return <SystemMessage {...this.props} />;
    } else {
      return <UserMessage {...this.props} />;
    }
  }
}

export default Message;
