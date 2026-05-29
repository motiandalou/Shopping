import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import "./index.less";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="page-404">
      <Result
        status="404"
        title="404"
        extra={
          <Button
            type="primary"
            onClick={() => navigate("/")}
          >
            返回首页
          </Button>
        }
      />
    </div>
  );
};

export default NotFound;
