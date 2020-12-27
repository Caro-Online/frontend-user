import React from 'react'
import { Col, Card, Avatar } from 'antd'
import x from '../../../../shared/assets/images/x.png';
import o from '../../../../shared/assets/images/o.png';
import { StarFilled } from '@ant-design/icons'
import { connect } from 'react-redux'
const { Meta } = Card;
function CardInfo(props) {

    const isPlayingStatus = () => {
        if (props.nextPlayer === props.x) {
            // console.log(props.nextPlayer)
            return <StarFilled style={{ color: "yellow" }} />
        }
        return <div></div>
    }
    return (
        <Card
            style={{
                width: "100%", height: "150px", padding: "3px",
            }}
        >
            <Meta
                avatar={<Avatar src={props.x ? x : o} />}
                title={props.user ? props.user.name : ''}
                description={props.user ? 'Đang đợi ...' : 'Còn trống'}
            />
            <img path="../../shared/assets/images/x.png" />
            {isPlayingStatus()}
        </Card>
    )
}
const mapStateToProps = (state) => ({
    nextPlayer: state.game.nextPlayer
})
export default connect(mapStateToProps)(CardInfo)
