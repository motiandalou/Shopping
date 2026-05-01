// import { Card, Form, Input, Button, Avatar, Space } from "antd";
// import { UserOutlined } from "@ant-design/icons";
// import { useTheme } from "@/hooks/useTheme";

// export default function Profile() {
//   const { theme } = useTheme();

//   return (
//     <Card
//       title="个人中心"
//       bordered={false}
//     >
//       <Space
//         size={20}
//         direction="vertical"
//       >
//         <Avatar
//           size={80}
//           icon={<UserOutlined />}
//         />
//         <Form
//           labelCol={{ span: 4 }}
//           wrapperCol={{ span: 10 }}
//         >
//           <Form.Item label="用户名">
//             <Input
//               disabled
//               placeholder="用户名"
//             />
//           </Form.Item>
//           <Form.Item label="真实姓名">
//             <Input placeholder="请输入真实姓名" />
//           </Form.Item>
//           <Form.Item label="手机号">
//             <Input placeholder="请输入手机号" />
//           </Form.Item>
//           <Form.Item label="修改密码">
//             <Input.Password placeholder="请输入新密码" />
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary">保存修改</Button>
//           </Form.Item>
//         </Form>
//       </Space>
//     </Card>
//   );
// }

export default function Profile() {
  return (
    <div style={{ padding: 24 }}>
      <h2>个人中心</h2>
      <p>这里是个人中心页面，功能正在开发中...</p>
    </div>
  );
}
