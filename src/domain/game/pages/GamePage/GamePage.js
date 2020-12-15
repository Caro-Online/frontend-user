//Library
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Components
import BoardGame from '../../components/BoardGame/BoardGame';
import UserInfo from '../../components/UserInfo/UserInfo';
import History from '../../components/History/History';
import Chat from '../../components/Chat/Chat';
import { initSocket } from '../../../../shared/utils/socket.io-client';
import AllUser from '../../components/AllUser/AllUser';

//Others
import { API } from '../../../../config';
import { Spin } from 'antd';
import './GamePage.css'

const GamePage = (props) => {
    const params = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [room, setRoom] = useState(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        let socket;
        socket = initSocket(localStorage.getItem('userId'));
        // history.push('/');

        const { roomId } = params;
        setIsLoading(true);
        fetch(`${API}/game/${roomId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((response) => {
                setIsLoading(false);
                console.log(response);
                if (response.success) {
                    setRoom(response.room);
                } else {
                    setNotFound(true);
                }
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });

        return () => {
            socket.disconnect();
        };
    }, [params]);

    let content = (
        <div className="main-content">
            <div className="game-page__board">
                <BoardGame />
            </div>
            <div className="game-page__info">
                <UserInfo />
                <History />
                {room ? <Chat room={room} /> : null}
            </div>
            <div className="game-page__all-user">
                <AllUser />
            </div>
        </div>
    );

    if (isLoading) {
        content = <Spin style={{ fontSize: '64px' }} />;
    }

    if (notFound) {
        content = <h1>Room not found</h1>;
    }

    return content;
};

export default GamePage;
