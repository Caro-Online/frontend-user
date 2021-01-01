import React from "react";
import { ImUserPlus } from "react-icons/im";
import { Button, Spin, Divider, Row, Col, Space } from "antd";
import { useHistory } from "react-router-dom";
import Modal from "../../../shared/components/Modal/Modal";
const InvitationDialog = ({ value, data, onCancel, onJoin }) => {
  const history = useHistory();
  const onClickJoin = () => {
    const roomId = data?.roomId;
    if (value && roomId) {
      onJoin(roomId);
    }
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
                Huỷ
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
