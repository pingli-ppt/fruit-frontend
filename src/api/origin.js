// src/api/origin.js
import request from './request'

// 1. 获取产地详情 (Mock数据)
export function getOriginDetail(name) {
  // 模拟网络延迟，让它感觉更真实
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          name: name || '上海奉贤黄桃示范基地',
          description: '国家级地理标志保护产品，得天独厚的弱碱性土壤，孕育出香甜软糯的优质黄桃。核心产区，品质保证。',
          location: '上海市奉贤区青村镇',
          climate: '亚热带季风气候，年日照充足',
          manager: '张伟 (高级农艺师)',
          area: '5000 亩'
        }
      })
    }, 300)
  })
}

// 2. 获取该产地的农事记录
export function getFarmingRecords(originId) {
  return Promise.resolve({
    data: [
      { date: '2023-08-20', title: '采摘上市', content: '甜度达到14度，开始人工采摘。', imgs: ['https://via.placeholder.com/150/ffecb3/000?text=Picking'] },
      { date: '2023-06-15', title: '果实套袋', content: '使用专用纸袋，物理防虫，减少农药使用。', imgs: [] },
      { date: '2023-03-10', title: '春季修剪', content: '剪除病弱枝，改善通风透光条件。', imgs: [] }
    ]
  })
}

// 3. 获取产地关联的产品列表
export function getOriginProducts(originId) {
  return Promise.resolve({
    data: [
      { id: 1, name: '奉贤锦绣黄桃 12个装', price: 88.00, origin: '上海奉贤', batchCode: 'PC001' },
      { id: 2, name: '现摘大黄桃 5斤', price: 58.00, origin: '上海奉贤', batchCode: 'PC003' },
      { id: 3, name: '黄桃罐头 (出口级)', price: 35.00, origin: '上海奉贤', batchCode: 'PC002' }
    ]
  })
}