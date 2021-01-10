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

import { getUserIdFromStorage } from "src/shared/utils/utils";
import xImg from "src/shared/assets/images/x.png";
import oImg from "src/shared/assets/images/o.png";
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
        <span>
          <img
            alt="x"
            src={index % 2 ? oImg : xImg}
            style={{ marginRight: 8 }}
            width="20px"
            height="80%"
          />
          Nước {index + 1}
        </span>
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
  const showCurrentStep = (match, iHistory) => {
    const history = match?.history;
    const currentMatch = Object.assign({}, match, {
      history: history.slice(0, iHistory + 1),
    });
    onClickMatch(currentMatch);
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
                    padding: "0 8px 8px",
                  }}
                >
                  {match?.winner ? (
                    match?.winner === getUserIdFromStorage() ? (
                      <Tag color="green" style={{ borderRadius: 8 }}>
                        <strong>Thắng</strong>
                      </Tag>
                    ) : (
                      <Tag color="volcano" style={{ borderRadius: 8 }}>
                        <strong>Thua</strong>
                      </Tag>
                    )
                  ) : (
                    <Tag style={{ borderRadius: 8 }}>
                      <strong>Hoà</strong>
                    </Tag>
                  )}
                  <span>{`${match?.history?.length} nước`}</span>
                </div>
                <List
                  dataSource={match?.history}
                  renderItem={(history, iHistory) => (
                    <List.Item
                      key={`history-${index}-${iHistory}`}
                      class="item-list"
                      onClick={(e) => showCurrentStep(match, iHistory)}
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
