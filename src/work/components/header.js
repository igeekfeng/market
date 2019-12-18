import React, {Component} from 'react';
import UserCenter from "./userCenter";
export default class Header extends Component {
  render() {
    return (
      <div className='xxf-global header'>
        <div className='w1200'>
          <span>开十二电子班牌</span>
        </div>
        <UserCenter pro={this.props.pro}/>
      </div>
    );
  }
}


