import React, { useState, useEffect } from 'react';
import { Card, PageHeader, Button, Descriptions } from 'antd';
import { Link } from 'react-router-dom'
import './Rooms.css';
import api from '../../apiGame'
import {
  PauseCircleFilled,
  PlayCircleFilled
} from '@ant-design/icons';


const Rooms = (props) => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api.getAllRoom().then(res => {
      if (res.data.success) {
        console.log(res.data.rooms)
        setRooms(res.data.rooms);
      }
    })
  }, []);

  const getStatus = (room) => {
    if (room.status === 'WAITING') {
      return <div className="room-status">
        <div>
          <PauseCircleFilled style={{ color: "orange" }} />
        </div>
        <div> Waiting</div>
      </div >
    } else if (room.status === 'PLAYING') {
      return <div className="room-status">
        <div>
          <PlayCircleFilled style={{ color: "green" }} />
        </div>
        <div> Playing</div>
      </div>
    }
    return <div></div>
  }

  return (
    <div className="container">
      <div className="site-page-header-ghost-wrapper">
        <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          title="Danh sách các phòng"
          subTitle="Nhấn vào tên phòng để tham gia"
          extra={[
            <Button key="2">Tìm phòng bằng ID</Button>,
            <Button key="1" type="primary">
              Chơi ngay
        </Button>,
          ]}
        >
          <Descriptions size="small" column={3}>
            <Descriptions.Item label="Tổng số phòng">123</Descriptions.Item>
            <Descriptions.Item label="Số phòng đang đợi">23</Descriptions.Item>
            <Descriptions.Item label="Số phòng đang chơi">100</Descriptions.Item>
          </Descriptions>
        </PageHeader>
      </div>
      <div className="row">
        {rooms.map(room => (
          <div className="col-lg-3 col-md-4 col-sm-6" key={room._id}>
            <Card className="card-room" bordered={true} style={{ width: "80%" }}>
              <div className="d-flex flex-column justify-content-around">
                <div className="room-name">
                  Bàn:
                <Link to={`/room/${room.roomId}`}>
                    <span>{room.name}</span>
                  </Link>
                </div>
                {getStatus(room)}
              </div>

            </Card>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Rooms;
