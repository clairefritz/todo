import React from 'react';
import Relay from 'react-relay';

export default class UserAvatar extends React.Component {
  render() {
    let avatar;
    if (this.props.user.avatar.length > 0) {
      avatar = <img src={this.props.user.avatar} title={this.props.user.name} className="avatar"/>;
    } else {
      // TODO: handle names with more than two words
      let initials = this.props.user.name.split(' ');
      let name = initials.map((s)=> s[0]);
      avatar = <div className="avatar">{name.join('')}</div>;
    }
    return (
      <div className="col-xs-2 user-avatar">{avatar}</div>
    )
  }
}