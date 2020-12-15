//Library
import React from 'react';

// Components
import BoardGame from '../../../game/components/BoardGame/BoardGame';
import UserInfo from '../../../game/components/UserInfo/UserInfo';
import History from '../../../game/components/History/History';
import Chat from '../../../game/components/Chat/Chat';
import AllUser from '../../../game/components/AllUser/AllUser';

//Others
import './Test.css';

const Test = (props) => {

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-6 col-md-6">
          <BoardGame />
        </div>
        <div className="col-lg-4 col-md-4 d-flex flex-column justify-content-between">
          <UserInfo />
          <History />
          <Chat />
        </div>
        <div className="col-lg-2 col-md-2">
          <AllUser />
        </div>
      </div>
    </div>
  );
};

export default Test;
