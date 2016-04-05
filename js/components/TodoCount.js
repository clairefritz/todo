import React from 'react';

export default class TodoCount extends React.Component {
  render() {
    const text = this.props.count > 1 ? 'items' : 'item';
    return (
      <p>{this.props.count} {text}</p>
    )
  }
}