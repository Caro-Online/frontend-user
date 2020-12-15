import React from 'react'
import BoardGame from '../components/BoardGame/BoardGame'
import Chat from '../components/Chat/Chat'
import History from '../components/History/History'
import UserInfo from '../components/UserInfo/UserInfo'

export default function GamePage() {
    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-8 col-md-8">
                    <BoardGame />
                </div>
                <div className="col-lg-4 col-md-4 d-flex flex-column justify-content-between">
                    <UserInfo />
                    <History />
                    <Chat />
                </div>
            </div>
        </div>
    )
}
