import React from "react";
import { Button } from "antd";
import classNames from "classnames";
import "./index.less";

/**
 * 自定义按钮组件
 * @param {React.ReactNode} children 按钮文字
 * @param {'primary'|'default'|'dashed'|'link'|'text'} type 按钮类型
 * @param {React.ReactNode} icon 按钮图标
 * @param {boolean} loading 是否加载中
 * @param {string} className 自定义类名
 * @param {() => void} onClick 点击事件
 * @param {object} restProps 其他所有 antd Button 支持的属性（如 disabled、size）
 */
const ShoppingButton = ({
  children,
  type = "primary",
  icon,
  loading = false,
  className,
  onClick, // 明确声明 onClick
  ...restProps
}) => {
  const btnClass = classNames("custom-btn", className);

  return (
    <Button
      className={btnClass}
      type={type === "primary" ? "primary" : type} // 透传 type
      icon={icon}
      loading={loading}
      onClick={onClick}
      {...restProps} // 全部透传
    >
      {children}
    </Button>
  );
};

export default ShoppingButton;
