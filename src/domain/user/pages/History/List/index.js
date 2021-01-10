import React from "react";
import {
  Space,
  Button,
  List,
  Avatar,
  Spin,
  Typography,
  Collapse,
  Tag,
  Divider,
} from "antd";

import { CaretRightOutlined } from "@ant-design/icons";
import "./List.css";
import moment from "moment";
import { boardSize } from "src/domain/game/components/BoardGame/BoardGame";
const { Panel } = Collapse;
const { Text } = Typography;
const HistoryList = ({ matches, isLoading, onClickMatch }) => {
  const convertToXY = (index, iHistory) => {
    const x = Math.floor(iHistory / boardSize) + 1;
    const y = (iHistory % boardSize) + 1;
    return (
      <span style={{ display: "flex", justifyContent: "space-between" }}>
        Nước {index + 1}
        <strong>
          ({x},{y})
        </strong>
      </span>
    );
  };
  const onClickDetail = (e, match) => {
    console.log("onClickDetail", match);
    onClickMatch(match);
  };
  return (
    <div>
      <div className="space-align-block">
        <Text type="secondary" style={{ paddingBottom: 8 }}>
          Lịch sử các trận đấu
        </Text>
        {isLoading ? (
          <div className="demo-loading-container">
            <Spin />
          </div>
        ) : (
          <Collapse
            accordion
            bordered={false}
            defaultActiveKey={["0"]}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
            className="site-collapse-custom-collapse"
          >
            {matches?.map((match, index) => (
              <Panel
                header={
                  <div onClick={(e) => onClickDetail(e, match)}>
                    Trận đấu:{" "}
                    <strong>{moment().format("h:mm MMM Do YY ")}</strong>
                  </div>
                }
                key={index}
                className="site-collapse-custom-panel"
                onClick={(e) => onClickDetail(e, match)}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 8px 0",
                  }}
                >
                  <Tag color="volcano" style={{ borderRadius: 8 }}>
                    <strong>Thua</strong>
                  </Tag>
                  <Tag color="green" style={{ borderRadius: 8 }}>
                    <strong>Thắng</strong>
                  </Tag>
                  <span>{`${match?.history?.length} nước`}</span>
                </div>
                <List
                  dataSource={match?.history}
                  renderItem={(history, iHistory) => (
                    <List.Item
                      key={`history-${index}-${iHistory}`}
                      class="item-list"
                    >
                      <List.Item.Meta title={convertToXY(iHistory, history)} />
                    </List.Item>
                  )}
                ></List>
              </Panel>
            ))}
          </Collapse>
        )}
      </div>
    </div>
  );
};
export default HistoryList;
