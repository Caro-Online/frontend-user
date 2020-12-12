import React from 'react'
import AllUser from '../components/AllUser/AllUser'
import BoardGame from '../components/BoardGame/BoardGame'
import Chat from '../components/Chat/Chat'
import History from '../components/History/History'
import UserInfo from '../components/UserInfo/UserInfo'

export default function GamePage() {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-7 col-md-7">
                    <BoardGame />
                </div>
                <div className="col-lg-3 col-md-3 d-flex flex-column justify-content-between">
                    <UserInfo />
                    <History />
                    <Chat />
                </div>
                <div className="col-lg-2 col-md-2">
                    <AllUser />
                </div>
            </div>
        </div>
    )
}
