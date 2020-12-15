import { Spin } from 'antd';
import React, { useState, useEffect } from 'react';

import './Rooms.css';
import { API } from '../../../../config';

const Rooms = (props) => {
  const [rooms, setRooms] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   fetch(`${API}/game`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   });
  // }, []);

  return (
    <>
      <h1>Rooms</h1>
      {isLoading ? <Spin style={{ fontSize: '64px' }} /> : <ul></ul>}
    </>
  );
};

export default Rooms;
