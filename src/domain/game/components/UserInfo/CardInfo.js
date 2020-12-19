import React from 'react'
import { Col, Card, Avatar } from 'antd'
import x from '../../../../shared/assets/images/x.png';
import o from '../../../../shared/assets/images/o.png';

const { Meta } = Card;
export default function CardInfo(props) {
    return (
        <Card
            style={{ width: "100%", height: "150px", padding: "3px" }}
        >
            <Meta
                avatar={<Avatar src={props.x ? x : o} />}
                title={props.name}
                description={props.name ? 'Đang đợi ...' : 'Còn trống'}
            />
            <img path="../../shared/assets/images/x.png" />
        </Card>
    )
}
