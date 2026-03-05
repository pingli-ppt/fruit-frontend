-- 食品安全科普数据库初始化脚本
DROP DATABASE IF EXISTS food_safety;
CREATE DATABASE food_safety CHARACTER SET utf8mb4;
USE food_safety;

CREATE TABLE science_article (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200),
  cover VARCHAR(255),
  content LONGTEXT,
  category VARCHAR(50),
  publish_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  sort INT DEFAULT 0,
  is_top TINYINT DEFAULT 0,
  summary VARCHAR(500)
);

-- =====================================================
-- 以下是 溯源 & 质检模块 表结构 + 测试数据
-- 直接复制到你的 init.sql 末尾即可
-- =====================================================

-- 1. 批次溯源表
CREATE TABLE IF NOT EXISTS trace_batch (
  id INT PRIMARY KEY AUTO_INCREMENT,
  batch_code VARCHAR(50) NOT NULL UNIQUE COMMENT '批次号',
  trace_code VARCHAR(64) UNIQUE NULL COMMENT '溯源码',
  qr_code VARCHAR(255) NULL COMMENT '二维码地址',
  product_name VARCHAR(100) NOT NULL COMMENT '商品名称',
  origin VARCHAR(100) NOT NULL COMMENT '产地',
  coop_name VARCHAR(100) NULL COMMENT '合作社/企业名称',
  status VARCHAR(20) DEFAULT '检测合格' COMMENT '质检状态',
  created_at DATETIME DEFAULT NOW()
);

-- 2. 溯源时间线（种植/检测/物流/责任）
CREATE TABLE IF NOT EXISTS trace_timeline (
  id INT PRIMARY KEY AUTO_INCREMENT,
  batch_code VARCHAR(50) NOT NULL,
  title VARCHAR(50) NOT NULL COMMENT '节点名称',
  operate_time VARCHAR(20) NOT NULL COMMENT '操作时间',
  content VARCHAR(255) NOT NULL COMMENT '内容',
  type ENUM('生产','检测','物流','主体') DEFAULT '生产'
);

-- 3. 质检标签表
CREATE TABLE IF NOT EXISTS quality_tag (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tag_name VARCHAR(50) NOT NULL COMMENT '认证标签：有机/绿色/无公害等'
);

-- ==========================================
-- 测试数据（保证前端能直接查询到）
-- ==========================================
INSERT INTO trace_batch (batch_code, product_name, origin, coop_name, status)
VALUES ('PC202509001','红富士苹果','上海奉贤区','奉贤绿色果业合作社','检测合格');

INSERT INTO trace_timeline (batch_code, title, operate_time, content)
VALUES
('PC202509001','采摘记录','2025-09-01','合作社完成采摘'),
('PC202509001','农残检测','2025-09-02','检测合格（第三方机构）'),
('PC202509001','冷链发运','2025-09-03','进入冷链物流系统'),
('PC202509001','责任主体','2025-09-03','奉贤绿色果业合作社');

INSERT INTO quality_tag (tag_name)
VALUES ('有机认证'),('绿色食品'),('无公害'),('检测合格');

ALTER TABLE science_article ADD COLUMN url VARCHAR(500) NULL COMMENT '微信公众号文章链接';

INSERT INTO science_article (title,cover,content,category,sort,is_top,summary,url) VALUES 
(
'超市里的“溯源码”，90%的人扫完就关了，其实应该看这3行',
'images/article/1.jpg',
'花了贵三倍的价钱买的“有机菜”，包装上的二维码扫出来却只有一个通用的绿勾？今天教你一招，花10秒钟，看懂农产品真正的“数字身份证”。',
'溯源科普',
1,1,
'10秒教会你看懂农产品溯源码，不花冤枉钱',
'https://mp.weixin.qq.com/s/8L2KVKDVKQfQbS_IDaw9nQ'
),
(
'上海人餐桌上的一半绿叶菜，原来都来自这个区',
'images/article/2.jpg',
'上海人的饭桌上，可以没有大鱼大肉，但绝对不能没有一盘“绿叶菜”。',
'产地直供',
2,0,
'上海本地蔬菜核心供应基地揭秘',
'https://mp.weixin.qq.com/s/pTqFkAVOBWXq-Nvg8KJZQQ'
),
(
'沃土育金—匠心种植流程',
'images/article/3.jpg',
'有一种甜蜜，是成长的陪伴。有一种幸福，暖心又暖胃。',
'种植技术',
3,0,
'绿色种植全流程，匠心培育优质农产品',
'https://mp.weixin.qq.com/s/DYQz0FzXYtm1v_Xd7HXcLg'
),
(
'种了30年地的奉贤阿姨说：现在的年轻人，没吃过真的番茄味',
'images/article/4.jpg',
'“现在的年轻人啊，可能都没尝过真正有番茄味的番茄了。”',
'产地直供',
4,1,
'奉贤老农户讲述真正的原味番茄',
'https://mp.weixin.qq.com/s/FYsCBk_MWN-zG3rCpaNsxw'
),
(
'不跑郊区，在上海怎么买到“早上还在地里”的奉贤青菜？',
'images/article/5.jpg',
'超市里的菜总是差口气？菜市场的菜又不知根知底？作为懂吃的老饕，难道为了口新鲜青菜，非得周末驱车两小时去趟奉贤吗？今天，教你一招“截胡”带着露水的时令鲜蔬。',
'买菜攻略',
5,0,
'教你在上海买到当天现摘的奉贤青菜',
'https://mp.weixin.qq.com/s/B3fg0MkpUBI5lYAK59d9nw'
);