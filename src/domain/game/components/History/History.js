import React, { useEffect, useState } from "react";
import { List, message, Spin } from "antd";
import reqwest from "reqwest";

import InfiniteScroll from "react-infinite-scroller";

import "./History.css";
const fakeDataUrl =
  "https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo";

const History = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  useEffect(() => {
    fetchData((res) => {
      setData(res.results);
    });
  }, []);
  const fetchData = (callback) => {
    reqwest({
      url: fakeDataUrl,
      type: "json",
      method: "get",
      contentType: "application/json",
      success: (res) => {
        callback(res);
      },
    });
  };
  const handleInfiniteOnLoad = () => {
    setLoading(true);
    if (data.length > 14) {
      message.warning("Infinite List loaded all");
      setHasMore(false);
      setLoading(false);
      return;
    }
    fetchData((res) => {
      setData(data.concat(res.results));
      setLoading(false);
    });
  };
  return (
    <div className="demo-infinite-container">
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        loadMore={handleInfiniteOnLoad}
        hasMore={!loading && hasMore}
        useWindow={false}
      >
        <List
          dataSource={data}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                title={<a href="https://ant.design">{item.name.last}</a>}
                description={item.email}
              />
              <div>Win</div>
            </List.Item>
          )}
        >
          {loading && hasMore && (
            <div className="demo-loading-container">
              <Spin />
            </div>
          )}
        </List>
      </InfiniteScroll>
    </div>
  );
};

export default History;
