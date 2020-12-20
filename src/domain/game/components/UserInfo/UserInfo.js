import React, { useEffect, useState } from 'react'
import { Card, Avatar, Button } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import api from '../../apiGame'
import './UserInfo.css'
import CardInfo from './CardInfo';
const { Meta } = Card;

export default function UserInfo(props) {
    const [user1, setUser1] = useState(null);
    const [user2, setUser2] = useState(null);
    const [audience, setAudience] = useState([]);
    const [playing, setPlaying] = useState(false)
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (props.user) {
            //player1
            setUser1(props.user.u1.userRef.name);
            if (userId === props.user.u1.userRef._id) {
                setPlaying(true);
            }

            //player2
            if (props.user.u2) {
                setUser2(props.user.u2.userRef.name);
                if (userId === props.user.u2.userRef._id) {
                    setPlaying(true);
                }
            }

        }
    }, [props.user])
    useEffect(() => {
        if (props.audience) {
            setAudience(props.audience)
            console.log(props.audience)
        }
    }, [props.audience])

    const joinMatchHanler = () => {
        const userId = localStorage.getItem('userId');
        api.joinMatch(userId, props.roomId).then(res => {
            setUser2(res.data.name)
            setPlaying(true);
        })
        console.log("click")
    }

    return (
        <div className="user-info" >
            <Card className="card-group" >
                <CardInfo name={user1} x={true} />
                <CardInfo name={user2} x={false} />
                <Card className="join-game" style={{ width: "100%", height: "10%" }}>
                    <Button style={{ display: playing ? 'none' : '' }} type="primary" onClick={joinMatchHanler}>Vào chơi</Button>
                </Card>
                <Card style={{ width: "100%", height: "30%" }}>
                    <div>Đang xem</div>
                    <ul>
                        {audience ? audience.map((au, i) => (
                            <li key={i}>{au.name}</li>
                        )) :
                            <li>Không có khán giả</li>
                        }
                    </ul>
                </Card>
            </Card>
        </div>
    )
}
