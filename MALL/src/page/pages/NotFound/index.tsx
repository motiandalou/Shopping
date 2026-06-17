import React from "react";
import { Link } from "react-router-dom";
import "./index.less";
import { Breadcrumb } from "antd";
import { useTranslation } from "react-i18next";

const Contact: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="NotFound-page">
      <Breadcrumb className="breadcrumb">
        <Breadcrumb.Item>
          <Link to="/">{t("nav.home")}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>404 Error</Breadcrumb.Item>
      </Breadcrumb>

      <div className="contact-page">
        <p className="title">404 Not Found</p>
        <p className="content">
          Your visited page not found. You may go home page.
        </p>
      </div>
    </div>
  );
};

export default Contact;
