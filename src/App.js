import { CaretRightOutlined, CopyOutlined } from "@ant-design/icons";
import { Button, Card, Input, message, Space } from "antd";
import { useState } from "react";
import "./App.css";

const { TextArea } = Input;

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    messageApi.open({
      type: "success",
      content: "Copied to clipboard !",
    });
  };

  const onRun = () => {
    try {
      messageApi.open({
        type: "success",
        content: "Completed !",
      });
    } catch (error) {
      messageApi.open({
        type: "fail",
        content: `${error}`,
      });
    }
  };

  return (
    <div className="App">
      {contextHolder}
      <Card className="card" title="Calculation Tool" bordered={false}>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <TextArea rows={4} placeholder="Input Data" onChange={setInput} />
          <TextArea rows={4} placeholder="Output Data" disabled />
          <Space>
            <Button
              type="primary"
              onClick={onRun}
              icon={<CaretRightOutlined />}
              disabled={!input}
            >
              Run
            </Button>
            <Button
              type="primary"
              shape="round"
              icon={<CopyOutlined />}
              onClick={copyToClipboard}
              disabled={!output}
            />
          </Space>
        </Space>
      </Card>
    </div>
  );
}

export default App;
