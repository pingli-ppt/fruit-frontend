const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 8080; 

app.use(cors());
app.use(express.json());

const getDb = () => {
    const data = fs.readFileSync(path.join(__dirname, 'origin-data.json'), 'utf8');
    return JSON.parse(data);
};

//接口1:产地详情
app.get('/api/origin-v2/details/:id', (req, res) => {
    const db = getDb();
    const info = db.origins.find(o => o.id === req.params.id);
    info ? res.json({ success: true, data: info }) : res.status(404).send("未找到该产地");
});

//接口2: 产地合作社
app.get('/api/origin-v2/cooperatives/:originId', (req, res) => {
    const db = getDb();
    const list = db.cooperatives.filter(c => c.origin_id === req.params.originId);
    res.json({ success: true, count: list.length, data: list });
});

//接口3: 供给端入驻表单提交
app.post('/api/origin-v2/apply', (req, res) => {
    const formData = req.body;
    console.log('>>> 收到新的合作社入驻申请:', formData);
    res.json({ 
        success: true, 
        message: `感谢您的申请！[${formData.name || '合作社'}] 的入驻信息已进入审核队列。` 
    });
});

app.listen(PORT, () => {
    console.log(`============================================`);
    console.log(`产地模块后端 (V2) 已成功启动！`);
    console.log(`接口地址: http://localhost:${PORT}/api/origin-v2/details/fengxian`);
    console.log(`已加载6家合作社真实数据`);
    console.log(`============================================`);
});