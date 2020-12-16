import React, { useEffect, useState } from "react";
import { List, message, Spin } from "antd";
// import reqwest from "reqwest";

// import InfiniteScroll from "react-infinite-scroller";
import { Divider } from "antd";
import { Typography } from "antd";

import "./History.css";
const { Title } = Typography;
const History = ({ history, jumpTo }) => {
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const curLocation = (i) => {
    return `(${1 + (i % 20)}, ${1 + Math.floor(i / 20)})`;
  };
  return (
    <div className="demo-infinite-container">
      {/* <Divider orientation="left"></Divider> */}
      <Title level={5}>Step history</Title>
      {history && (
        <List
          dataSource={history}
          renderItem={(step, move) => (
            <List.Item key={move} onClick={() => jumpTo(move)}>
              <List.Item.Meta
                title={
                  move
                    ? "Go to move #" +
                      move +
                      " - location: " +
                      curLocation(step.location)
                    : "Go to game start"
                }
              />
              <div>X - O</div>
            </List.Item>
          )}
        >
          {loading && hasMore && (
            <div className="demo-loading-container">
              <Spin />
            </div>
          )}
        </List>
      )}
    </div>
  );
};

export default History;
