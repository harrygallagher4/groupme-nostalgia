import React, { Component } from 'react';

class Emoji extends Component {
  render() {
    let [ pack, offset ] = this.props.charmap;

    const className = `emoji pack-${pack}`;

    const style = {
      backgroundPosition: `0px ${ -20 * offset }px`
    }

    return (
      <span className={className} style={style} />
    );
  }
}

export default Emoji;
