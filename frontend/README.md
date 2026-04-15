src/
├── layouts/ # 布局
│ └── MainLayout.jsx
├── pages/
│ ├── Login/ # 登录
│ │ └── index.jsx
│ ├── Register/ # 注册
│ │ └── index.jsx
│ ├── Dashboard/
│ ├── Goods/
│ ├── Order/
│ ├── User/
│ └── Category/
├── router/
│ ├── index.js # 路由 + 守卫
│ └── AuthRoute.jsx # 登录校验
├── utils/
│ └── token.js # token 存储工具
├── App.jsx
└── main.jsx

一、前端管理后台（Admin）模块拆解

1. Dashboard（数据统计面板）
   ✅ 核心功能
   数据概览：展示商城核心运营数据
   可视化图表：用 ECharts 做趋势图、饼图
   快捷入口：跳转到各管理模块
   📊 展示内容
   表格
   模块 展示内容
   核心数据卡片 总用户数、总商品数、总订单数、总销售额
   销售趋势图 近 7/30 天订单金额 / 订单量折线图
   商品分类占比 各分类商品数量 / 销售额饼图
   订单状态统计 待付款 / 待发货 / 已完成订单数柱状图
   热门商品排行 销量 Top10 商品列表
   🎨 原型参考图
2. 商品管理
   ✅ 核心功能
   商品 CRUD（增删改查）
   商品上下架
   分类关联
   库存管理
   📊 展示内容
   表格
   模块 展示内容
   商品列表页 商品 ID、名称、封面图、价格、库存、分类、状态（上架 / 下架）、操作按钮（编辑 / 删除 / 上下架）
   新增 / 编辑页 商品名称、描述、价格、库存、分类选择、封面图上传、详情图上传、上下架状态
   筛选栏 按分类、价格区间、状态、关键词搜索
   🎨 原型参考图
3. 订单管理
   ✅ 核心功能
   订单列表查看
   订单状态修改（待付款→待发货→已完成）
   订单详情查看
   物流信息填写
   📊 展示内容
   表格
   模块 展示内容
   订单列表页 订单号、用户信息、下单时间、总金额、订单状态、操作按钮（查看详情 / 发货）
   订单详情页 订单基本信息、商品明细（名称 / 数量 / 单价）、收货地址、支付信息、物流信息
   筛选栏 按订单状态、时间区间、用户、订单号搜索
   🎨 原型参考图
4. 客户管理
   ✅ 核心功能
   用户列表查看
   用户信息编辑
   用户禁用 / 启用
   权限分配
   📊 展示内容
   表格
   模块 展示内容
   用户列表页 用户 ID、用户名、手机号、注册时间、状态（正常 / 禁用）、操作按钮（编辑 / 禁用 / 重置密码）
   编辑页 用户基本信息、权限角色、状态修改
   筛选栏 按用户名、手机号、状态搜索
   🎨 原型参考图
5. 分类管理
   ✅ 核心功能
   分类 CRUD
   分类排序
   层级管理（一级 / 二级分类）
   📊 展示内容
   表格
   模块 展示内容
   分类列表页 分类 ID、名称、层级、排序、图标、操作按钮（编辑 / 删除 / 新增子分类）
   新增 / 编辑页 分类名称、父分类选择、排序值、图标上传
   🎨 原型参考图
   二、前端用户端（User 简易商城）模块拆解
6. 首页商品列表
   ✅ 核心功能
   商品展示
   分类筛选
   搜索
   分页
   📊 展示内容
   表格
   模块 展示内容
   首页布局 轮播图、分类导航、商品推荐区、热门商品列表
   商品卡片 商品封面图、名称、价格、销量、「加入购物车」按钮
   筛选栏 分类选择、价格排序（升 / 降）、销量排序、搜索框
   🎨 原型参考图
7. 商品详情页
   ✅ 核心功能
   商品信息展示
   加入购物车
   立即购买
   商品评价
   📊 展示内容
   表格
   模块 展示内容
   商品主图区 轮播图、商品名称、价格、库存、销量、分类
   商品详情区 商品描述、参数、详情图
   操作区 数量选择、「加入购物车」「立即购买」按钮
   评价区 用户评价列表、评分展示
   🎨 原型参考图
8. 购物车
   ✅ 核心功能
   购物车商品列表
   商品数量修改
   商品删除
   全选 / 单选
   结算
   📊 展示内容
   表格
   模块 展示内容
   购物车列表 商品封面、名称、单价、数量选择器、小计、删除按钮
   操作栏 全选、批量删除、「去结算」按钮
   合计栏 已选商品总数、总金额
   🎨 原型参考图
9. 下单 & 模拟支付
   ✅ 核心功能
   订单确认
   收货地址管理
   模拟支付
   订单生成
   📊 展示内容
   表格
   模块 展示内容
   订单确认页 商品明细、收货地址选择 / 新增、优惠券、总金额、「提交订单」按钮
   支付页 订单信息、支付方式选择（模拟微信 / 支付宝）、「立即支付」按钮
   支付成功页 订单号、支付状态、「查看订单」「继续购物」按钮
   🎨 原型参考图
10. 个人中心
    ✅ 核心功能
    个人信息管理
    订单管理
    收货地址管理
    账户安全
    📊 展示内容
    表格
    模块 展示内容
    个人信息页 头像、用户名、手机号、编辑按钮
    我的订单页 订单列表（按状态分类：全部 / 待付款 / 待发货 / 已完成）、订单操作（付款 / 确认收货 / 评价）
    收货地址页 地址列表、新增 / 编辑 / 删除地址、设为默认
    账户安全页 修改密码、绑定手机号
    🎨 原型参考图
    三、后端 SpringBoot 服务对应关系
    表格
    前端模块 对应后端服务 核心接口
    登录 / 权限 用户服务（JWT） 登录、注册、token 校验、权限拦截
    商品管理 / 商城商品 商品服务 商品 CRUD、上下架、列表查询、详情查询
    购物车 购物车服务 购物车增删改查、批量操作
    订单 / 支付 订单服务 + 支付模拟服务 订单创建、状态修改、支付模拟、订单查询
    库存 库存服务 库存扣减、库存回滚、库存查询
    后台管理 后台权限管理 管理员权限校验、用户 / 商品 / 订单管理接口
    🎯 给你的落地建议
    先做页面骨架：把所有页面的布局、路由先搭好，再填功能
    先联调核心流程：用户登录→商品浏览→加入购物车→下单支付，跑通主流程
    再补管理后台：商品 / 订单 / 用户管理，基于后端接口做 CRUD
    最后优化细节：图表、样式、交互、权限控制
    要不要我帮你把每个页面的 API 接口清单也整理出来？你前端写完页面就能直接对接后端，不用再自己想接口了。
    行
    🛒 前后端全模块 API 接口清单（SpringBoot + React 商城项目）
    我按前端页面 → 后端服务 → 接口详情的结构整理，你前端写完页面就能直接对接，完全不用自己设计接口，直接照着写就行。

    一、用户服务（登录 JWT）
    核心作用：用户登录、注册、身份校验、权限管理
    表格
    接口 方法 路径 功能 请求参数 返回值
    用户注册 POST /api/user/register 新用户注册 username, password, phone code, msg, data: {userId, username}
    用户登录 POST /api/user/login 登录获取 JWT Token username, password code, msg, data: {token, userId, username, role}
    刷新 Token POST /api/user/refresh 刷新过期 Token refreshToken code, msg, data: {token, refreshToken}
    获取当前用户信息 GET /api/user/info 获取登录用户详情 无（Header 带 Token） code, msg, data: {userId, username, phone, role, avatar}
    修改用户信息 PUT /api/user/info 修改个人信息 username, phone, avatar code, msg
    修改密码 PUT /api/user/password 修改登录密码 oldPassword, newPassword code, msg
    管理员获取用户列表 GET /api/admin/user/list 后台用户管理列表 page, size, keyword, status code, msg, data: {total, list: [{userId, username, phone, status, createTime}]}
    管理员修改用户状态 PUT /api/admin/user/status/{userId} 禁用 / 启用用户 status (0 = 禁用，1 = 正常) code, msg

    二、商品服务
    核心作用：商品 CRUD、上下架、分类关联、列表查询
    表格
    接口 方法 路径 功能 请求参数 返回值
    管理员新增商品 POST /api/admin/goods 新增商品 name, price, stock, categoryId, description, cover, images, status code, msg, data: {goodsId}
    管理员修改商品 PUT /api/admin/goods/{goodsId} 编辑商品信息 同新增参数 code, msg
    管理员上下架商品 PUT /api/admin/goods/status/{goodsId} 修改商品上下架状态 status (0 = 下架，1 = 上架) code, msg
    管理员删除商品 DELETE /api/admin/goods/{goodsId} 删除商品 无 code, msg
    管理员商品列表 GET /api/admin/goods/list 后台商品管理列表 page, size, keyword, categoryId, status code, msg, data: {total, list: [{goodsId, name, price, stock, categoryName, status, cover}]}
    用户端商品列表 GET /api/goods/list 商城首页商品列表 page, size, categoryId, sort (price/sales), keyword code, msg, data: {total, list: [{goodsId, name, price, sales, cover}]}
    商品详情 GET /api/goods/{goodsId} 商品详情页信息 无 code, msg, data: {goodsId, name, price, stock, sales, description, images, categoryName}
    分类列表 GET /api/category/list 全部分类列表（前台 + 后台共用） 无 code, msg, data: [{categoryId, name, parentId, sort, icon}]
    管理员新增分类 POST /api/admin/category 新增商品分类 name, parentId, sort, icon code, msg, data: {categoryId}
    管理员修改分类 PUT /api/admin/category/{categoryId} 编辑分类 同新增参数 code, msg
    管理员删除分类 DELETE /api/admin/category/{categoryId} 删除分类 无 code, msg
    三、购物车服务
    核心作用：购物车增删改查、批量操作
    表格
    接口 方法 路径 功能 请求参数 返回值
    添加购物车 POST /api/cart 商品加入购物车 goodsId, quantity code, msg, data: {cartId}
    获取购物车列表 GET /api/cart/list 购物车页面商品列表 无（Header 带 Token） code, msg, data: [{cartId, goodsId, name, price, quantity, stock, cover, checked}]
    修改购物车数量 PUT /api/cart/{cartId} 修改商品数量 quantity code, msg
    修改购物车选中状态 PUT /api/cart/checked/{cartId} 单选 / 取消选中 checked (0 = 未选，1 = 选中) code, msg
    全选 / 取消全选 PUT /api/cart/checked/all 批量修改选中状态 checked code, msg
    删除购物车商品 DELETE /api/cart/{cartId} 删除单个商品 无 code, msg
    批量删除购物车 DELETE /api/cart/batch 批量删除选中商品 cartIds (数组) code, msg
    清空购物车 DELETE /api/cart/clear 清空当前用户购物车 无 code, msg
    四、订单服务
    核心作用：订单创建、状态管理、订单查询
    表格
    接口 方法 路径 功能 请求参数 返回值
    创建订单 POST /api/order 提交订单生成 addressId, cartIds (选中的购物车 ID 数组) code, msg, data: {orderId, totalAmount}
    用户订单列表 GET /api/order/list 个人中心我的订单 page, size, status (0 = 待付款，1 = 待发货，2 = 已完成) code, msg, data: {total, list: [{orderId, orderNo, totalAmount, status, createTime, goodsCover}]}
    订单详情 GET /api/order/{orderId} 订单详情页 无 code, msg, data: {orderId, orderNo, totalAmount, status, createTime, address, payTime, deliveryTime, finishTime, items: [{goodsId, name, price, quantity}]}
    管理员订单列表 GET /api/admin/order/list 后台订单管理列表 page, size, status, orderNo, userId code, msg, data: {total, list: [{orderId, orderNo, username, totalAmount, status, createTime}]}
    管理员发货 PUT /api/admin/order/delivery/{orderId} 订单状态改为待收货 deliveryNo (物流单号) code, msg
    用户确认收货 PUT /api/order/finish/{orderId} 订单状态改为已完成 无 code, msg
    取消订单 PUT /api/order/cancel/{orderId} 取消待付款订单 无 code, msg
    五、支付模拟服务
    核心作用：模拟支付流程、订单支付状态更新
    表格
    接口 方法 路径 功能 请求参数 返回值
    模拟支付 POST /api/pay/pay/{orderId} 模拟微信 / 支付宝支付 payType (1 = 微信，2 = 支付宝) code, msg, data: {payStatus: 1=成功}
    查询支付状态 GET /api/pay/status/{orderId} 轮询查询支付结果 无 code, msg, data: {status}
    支付回调（模拟） POST /api/pay/notify 模拟支付平台回调 orderId, payStatus code, msg
    六、库存服务
    核心作用：库存扣减、回滚、库存查询
    表格
    接口 方法 路径 功能 请求参数 返回值
    扣减库存 POST /api/stock/deduct 下单时扣减商品库存 goodsId, quantity code, msg
    回滚库存 POST /api/stock/rollback 取消订单时回滚库存 goodsId, quantity code, msg
    查询商品库存 GET /api/stock/{goodsId} 查询商品剩余库存 无 code, msg, data: {stock}
    管理员修改库存 PUT /api/admin/stock/{goodsId} 后台修改商品库存 stock code, msg
    七、后台权限管理
    核心作用：管理员权限校验、后台接口拦截
    表格
    接口 方法 路径 功能 请求参数 返回值
    管理员登录 POST /api/admin/login 管理员登录 username, password code, msg, data: {token, adminId, username}
    权限校验（拦截器） 所有 /api/admin/\*\* 接口 校验管理员身份 Header 带 Token 无（拦截器自动处理）
    管理员菜单列表 GET /api/admin/menu/list 后台侧边栏菜单 无 code, msg, data: [{id, name, path, icon, children}]
    八、收货地址服务（补充，订单依赖）
    核心作用：收货地址增删改查
    表格
    接口 方法 路径 功能 请求参数 返回值
    新增地址 POST /api/address 新增收货地址 receiver, phone, province, city, district, detail, isDefault code, msg, data: {addressId}
    地址列表 GET /api/address/list 获取用户所有地址 无 code, msg, data: [{addressId, receiver, phone, fullAddress, isDefault}]
    修改地址 PUT /api/address/{addressId} 编辑地址 同新增参数 code, msg
    删除地址 DELETE /api/address/{addressId} 删除地址 无 code, msg
    设置默认地址 PUT /api/address/default/{addressId} 设为默认地址 无
