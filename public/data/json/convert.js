import { readFileSync, writeFileSync } from 'fs';

console.log('开始转换 categories.json 数据格式...\n');

// 1. 读取原始数据文件
const rawData = JSON.parse(readFileSync('categories.json', 'utf8'));

// 2. 统计有财务数据的品类数量
const categoriesWithFinancialData = rawData.allCategories.filter(cat => 
  cat.annualSales > 0 && cat.annualSales !== 0
).length;

console.log(`原始数据统计：`);
console.log(`   合作社数量: ${rawData.metadata.totalCooperatives}`);
console.log(`   品类总数: ${rawData.metadata.totalCategories}`);
console.log(`   有财务数据的品类: ${categoriesWithFinancialData}`);

// 3. 转换品类数据格式
const convertedCategories = rawData.allCategories.map(cat => {
  // 计算是否为示范合作社（级别不是"否"）
  const isDemoCooperative = cat.cooperativeLevel && 
                           cat.cooperativeLevel !== "否" && 
                           cat.cooperativeLevel !== "无" && 
                           cat.cooperativeLevel !== "";
  
  return {
    id: cat.id,
    name: cat.name,
    season: cat.season,
    description: cat.description,
    cooperative: {
      id: cat.id.split('_cat_')[0], // 从品类ID提取合作社ID
      name: cat.cooperativeName,
      level: cat.cooperativeLevel,
      quality: cat.qualityCertification || "",
      isDemo: isDemoCooperative
    },
    stats: {
      plantingArea: cat.plantingArea || 0,
      annualOutput: cat.annualOutput || 0,
      annualSales: cat.annualSales || 0,
      annualRevenue: cat.annualRevenue || 0,
      pricePerTon: cat.pricePerTon || 0,
      hasFinancialData: cat.annualSales > 0 && cat.annualSales !== 0
    }
  };
});

// 4. 转换合作社数据格式
const cooperativesMap = new Map();

rawData.allCategories.forEach(cat => {
  const coopName = cat.cooperativeName;
  const coopLevel = cat.cooperativeLevel;
  
  if (!cooperativesMap.has(coopName)) {
    cooperativesMap.set(coopName, {
      id: cat.id.split('_cat_')[0],
      name: coopName,
      level: coopLevel,
      quality: cat.qualityCertification || "",
      categories: [],
      hasFinancialData: false,
      contact: "",
      phone: "",
      plantingArea: 0
    });
  }
  
  const coop = cooperativesMap.get(coopName);
  coop.categories.push({
    id: cat.id,
    name: cat.name,
    season: cat.season
  });
  
  // 如果有财务数据，标记合作社有财务数据
  if (cat.annualSales > 0) {
    coop.hasFinancialData = true;
  }
  
  // 从原始合作社数据获取联系方式
  const originalCoop = rawData.cooperatives.find(c => c.name === coopName);
  if (originalCoop) {
    coop.contact = originalCoop.contact || "";
    coop.phone = originalCoop.phone || "";
    coop.plantingArea = originalCoop.plantingArea || 0;
  }
});

const convertedCooperatives = Array.from(cooperativesMap.values());

// 5. 计算统计数据
const totalCooperatives = convertedCooperatives.length;
const demoCooperatives = convertedCooperatives.filter(coop => 
  coop.level && coop.level !== "否" && coop.level !== "无"
).length;
const categoriesWithFinance = convertedCategories.filter(cat => 
  cat.stats.annualSales > 0
).length;

// 6. 生成最终的数据格式
const convertedData = {
  metadata: {
    totalCooperatives: totalCooperatives,
    totalCategories: convertedCategories.length,
    withFinancialData: categoriesWithFinance,
    demoCooperatives: demoCooperatives,
    generatedAt: new Date().toISOString(),
    originalFile: "categories.json"
  },
  categories: convertedCategories,
  cooperatives: convertedCooperatives
};

// 7. 保存到新文件
writeFileSync('categories-simple.json', JSON.stringify(convertedData, null, 2));

console.log('\n转换完成！生成文件: categories-simple.json\n');
console.log('转换后数据统计：');
console.log(`   合作社数量: ${totalCooperatives}`);
console.log(`   示范合作社: ${demoCooperatives}`);
console.log(`   品类总数: ${convertedCategories.length}`);
console.log(`   有财务数据的品类: ${categoriesWithFinance}`);
console.log(`   转换时间: ${new Date().toLocaleString()}`);

// 8. 检查是否有问题
console.log('\n数据检查：');
const emptyDescriptions = convertedCategories.filter(cat => 
  !cat.description || cat.description.trim() === ''
).length;
console.log(`   无描述的品类: ${emptyDescriptions} 个`);

const zeroPriceItems = convertedCategories.filter(cat => 
  cat.stats.pricePerTon === 0
).length;
console.log(`   价格为0的品类: ${zeroPriceItems} 个`);

console.log('\n文件位置:');
console.log('   原始文件: categories.json');
console.log('   转换后文件: categories-simple.json');
console.log('\n转换成功！现在可以把这个文件放到前端项目中了。');