import React from "react";
import { ImUserPlus } from "react-icons/im";
import { Button, Spin, Divider, Row, Col, Space, Statistic } from "antd";
import Modal from "../../../shared/components/Modal/Modal";
import "./invitation.css";
const { Countdown } = Statistic;
const InvitationDialog = ({ value, data, onCancel, onJoin }) => {
  const onClickJoin = () => {
    const roomId = data?.roomId;
    if (value && roomId) {
      onJoin(roomId);
    }
  };
  const deadline = Date.now() + 10 * 1000;
  const onFinish = () => {
    onCancel();
  };
  return (
    <div>
      <Modal show={value}>
        <Row justify="center">
          <Space align="center">
            <Col style={{ margin: "8px 0" }} span={24}>
              <Spin tip={data?.message}></Spin>
            </Col>
          </Space>
          <Col span={24}>
            <Divider style={{ margin: "8px 0" }}></Divider>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Button type="dashed" danger onClick={onCancel}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  (
                  <Countdown
                    valueStyle={{
                      fontSize: 8,
                      fontWeight: 600,
                      color: "gray",
                    }}
                    value={deadline}
                    onFinish={onFinish}
                    format="ss"
                  />
                  ) Huỷ
                </div>
              </Button>
              <Button
                type="primary"
                style={{ width: 200, fontWeight: "bold" }}
                success
                onClick={onClickJoin}
              >
                Tham gia
              </Button>
            </div>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};
export default InvitationDialog;
