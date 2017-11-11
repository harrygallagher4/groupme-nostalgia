import React, { Component } from 'react';
import { Image } from 'react-bootstrap';

function todo(attachment, index) {
  return null;
}

const attachmentTypes = {
  image(attachment, index) {
    return (
      <div key={index} className="attachment attachment-image">
        <Image src={attachment.url} className="attached-image" responsive />
      </div>
    );
  },

  linked_image(attachment, index) {
    return (
      <div key={index} className="attachment attachment-linked-image">
        <Image src={attachment.url} className="attached-image" responsive />
      </div>
    );
  },

  emoji(attachment, index) {
    return null;
  }
}

function attachmentMap(attachment, index) {
  return (attachmentTypes[attachment.type] || todo)(attachment, index);
}

class Attachments extends Component {
  render() {
    if (this.props.attachments.length < 1) {
      return null;
    } else {
      let elements = this.props.attachments.map(attachmentMap);
      //      elements = _.compact(elements);
      return (
        <div className="attachments">
          {elements}
        </div>
      );
    }
  }
}

export default Attachments;
