import React, { Component } from 'react';
import Linkify from 'react-linkify';
import _ from 'lodash';

import Emoji from './Emoji';

function renderText({ text, attachments }) {
  let emoji = _.find(attachments, { type: 'emoji' });
  let mentions = _.find(attachments, { type: 'mentions' });

  let nodes = _.toArray(text);

  if (emoji) {
    let charmap = _.cloneDeep(emoji.charmap);
    let replaceEmoji = mapEmoji(charmap, emoji.placeholder);

    nodes = nodes.map(replaceEmoji);
  }

  let shiftIndex = 0;
  const shift = (i) => i + shiftIndex;

  if (mentions) {
    for (let loc of mentions.loci) {
      let start = nodes.slice(0, shift(loc[0]));
      let middle = nodes.slice(shift(loc[0]), shift(loc[0] + loc[1]));
      let end = nodes.slice(shift(loc[0] + loc[1]));

      let sizeChange = middle.length - 1;

      middle = <b>{middle}</b>;

      nodes = [...start, middle, ...end];
      shiftIndex -= sizeChange;
    }
  }

  return nodes;
}

function mapEmoji(charmap, placeholder) {
  return function mapEmoji(character, index){
    if (character != placeholder)
      return character;
    let map = charmap.shift();
    return <Emoji key={index} charmap={map} />
  }
}

class MessageTextField extends Component {
  render() {
    const { message } = this.props;

    let textNodes = renderText(message);

    return (
      <div className="message-body">
        {textNodes}
      </div>
    );
  }
}

export default MessageTextField;
