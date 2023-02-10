import {
  CaretRightOutlined,
  CopyOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
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

  const convert = (data) => {
    const convertedData = convertData(data);

    const rs = convertedData.map((data) => {
      const medianVOT = calculateMedianVOT(data);
      return {
        position: data[0].position,
        sound: data[0].sound,
        // convert to ms and round a 3
        positiveMedian: medianVOT.positiveMedian * 1000,
        negativeMedian: medianVOT.negativeMedian * 1000,
      };
    });

    console.log("====================================");
    console.log(rs);
    console.log("====================================");

    let result =
      "position\tcold_negative\tcold_positive\tcoffee_negative\tcoffee_positive\tto_negative\tto_positive\ttalk_negative\ttalk_positive\tpack_negative\tpack_positive\tpassport_negative\tpack-sentence_negative\tpack-sentence_positive\ttalk-sentence_negative\ttalk-sentence_positive\tcold-sentence_negative\tcold-sentence_positive";

    let count = 0;
    for (let i = 0; i < rs.length / 9; i++) {
      console.log("====================================");
      console.log(count);
      console.log("====================================");
      result += `\n${rs[count].position}\t${rs[count].negativeMedian}\t${rs[count].positiveMedian}`;
      count++;
      result += `\t${rs[count].negativeMedian}\t${rs[count].positiveMedian}`;
      count++;
      result += `\t${rs[count].negativeMedian}\t${rs[count].positiveMedian}`;
      count++;
      result += `\t${rs[count].negativeMedian}\t${rs[count].positiveMedian}`;
      count++;
      result += `\t${rs[count].negativeMedian}\t${rs[count].positiveMedian}`;
      count++;
      result += `\t${rs[count].negativeMedian}\t${rs[count].positiveMedian}`;
      count++;
      result += `\t${rs[count].negativeMedian}\t${rs[count].positiveMedian}`;
      count++;
      result += `\t${rs[count].negativeMedian}\t${rs[count].positiveMedian}`;
      count++;
      result += `\t${rs[count].negativeMedian}\t${rs[count].positiveMedian}`;
      count++;
    }

    return result;
  };

  const convertData = (dataString) => {
    let dataArray = dataString.split("\n");
    dataArray.shift(); // remove the header row

    let result = [];
    let cur = [];
    dataArray.forEach((row) => {
      let rowData = row.split("\t");
      const data = {
        position: rowData[0],
        sound: rowData[1],
        burst: parseFloat(rowData[2]),
        voicing: parseFloat(rowData[3]),
        VOT: parseFloat(rowData[4]),
      };

      // Chunk into array if the same position and sound
      if (cur.length === 0) {
        cur.push(data);
      } else {
        const lastData = cur[cur.length - 1];
        if (
          lastData.position === data.position &&
          lastData.sound === data.sound
        ) {
          cur.push(data);
        } else {
          result.push(cur);
          cur = [data];
        }
      }
    });

    return result;
  };

  const calculateMedianVOT = (data) => {
    let positiveVOT = [];
    let negativeVOT = [];

    data.forEach((row) => {
      if (row.VOT >= 0) {
        positiveVOT.push(row.VOT);
      } else {
        negativeVOT.push(row.VOT);
      }
    });

    positiveVOT.sort((a, b) => a - b);
    negativeVOT.sort((a, b) => a - b);

    let positiveMedian;
    if (positiveVOT.length % 2 === 0) {
      positiveMedian =
        (positiveVOT[positiveVOT.length / 2 - 1] +
          positiveVOT[positiveVOT.length / 2]) /
        2;
    } else {
      positiveMedian = positiveVOT[Math.floor(positiveVOT.length / 2)];
    }

    let negativeMedian;
    if (negativeVOT.length % 2 === 0) {
      negativeMedian =
        (negativeVOT[negativeVOT.length / 2 - 1] +
          negativeVOT[negativeVOT.length / 2]) /
        2;
    } else {
      negativeMedian = negativeVOT[Math.floor(negativeVOT.length / 2)];
    }

    return {
      position: data[0].position,
      sound: data[0].sound,
      positiveMedian: positiveMedian,
      negativeMedian: negativeMedian,
    };
  };

  const onRun = () => {
    try {
      const rs = convert(input);

      setOutput(rs);

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

  const downloadAsCsv = () => {
    const blob = new Blob([output], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="App">
      {contextHolder}
      <Card
        className="card"
        title="Calculation Tool"
        bodyStyle={{ height: "90%" }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <TextArea
            value={input}
            style={{ flexGrow: "1" }}
            placeholder="Input Data"
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
          <TextArea
            value={output}
            style={{ flexGrow: "0.5" }}
            placeholder="Output Data"
            onChange={(e) => {
              e.preventDefault();
            }}
          />
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
            <Button
              type="primary"
              shape="round"
              icon={<DownloadOutlined />}
              onClick={downloadAsCsv}
              disabled={!output}
            />
          </Space>
        </div>
      </Card>
    </div>
  );
}

export default App;
