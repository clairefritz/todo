import React from 'react';

export default class TodoCount extends React.Component {
  render() {
    const text = this.props.count > 1 ? 'items' : 'item';
    return (
      <div className="row">
        <p className="col-xs-12">{this.props.count} {text}</p>
      </div>
    )
  }
}