import React from 'react';

import { FaUsers } from 'react-icons/fa';

// import onlineIcon from '../../icons/onlineIcon.png';
// import closeIcon from '../../icons/closeIcon.png';

import './InfoBar.css';

const InfoBar = ({ room }) => (
  <div className="infoBar">
    <div className="leftInnerContainer">
      {/* <img className="onlineIcon" src={onlineIcon} alt="online icon" /> */}
      <FaUsers style={{ fontSize: '24px' }} />
    </div>
    <div className="rightInnerContainer">
      {/* <a href="/"><img src={closeIcon} alt="close icon" /></a> */}
    </div>
  </div>
);

export default InfoBar;
