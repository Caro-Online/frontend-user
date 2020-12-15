//Library
import React, { useCallback } from 'react';
import { Form, Input, Button } from 'antd';
import { MessageFilled, UserOutlined } from '@ant-design/icons';

//Components
//Others
import './Chat.css';

export default function Chat() {
  const [form] = Form.useForm();

  const onFinish = useCallback((values) => {
    const { message } = values;
  }, []);

  return (
    <div className="chat-container">
      <div className="chat-container__header">
        <MessageFilled className="chat-container__messageicon" />
        Trò chuyện
      </div>
      <div className="chat-container__body">
        <div className="chat-container__chatbox">
          <ul className="chat-container__nav-tabs">
            <li className="active">
              <UserOutlined style={{ color: 'blue', fontSize: '16px' }} />
            </li>
          </ul>
          <div className="chat-container__tab-content"></div>
        </div>
        <div className="chat-container__send-message">
          <Form
            form={form}
            className="message-form"
            name="control-hooks"
            onFinish={onFinish}
          >
            <Form.Item
              name="message"
              rules={[
                { required: true, message: 'Please input your message!' },
              ]}
            >
              <Input
                // prefix={<MailOutlined className="site-form-item-icon" />}
                type="text"
                placeholder="Aa"
              />
            </Form.Item>

            <Form.Item className="send-message-button">
              <Button type="primary" htmlType="submit">
                Send
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
