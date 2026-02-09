import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

// 配置
const EXCEL_DIR = path.join(process.cwd(), 'data/excel');
const OUTPUT_DIR = path.join(process.cwd(), 'public/data/json');

// 确保目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 安全文件名函数
function safeFilename(name) {
  if (!name || typeof name !== 'string') return '未命名合作社';
  
  return name
    .replace(/[<>:"/\\|?*[\]]/g, '_')
    .replace(/\.\./g, '_')
    .replace(/\s+/g, '_')
    .substring(0, 100);
}

// 生成唯一ID
function generateId(prefix = 'coop') {
  const timestamp = Date.now();
  const pid = process.pid || 0;
  const random = Math.random().toString(36).substr(2, 9);
  return `${prefix}_${timestamp}_${pid}_${random}`;
}

// 验证Excel文件
function validateExcelFile(filePath) {
  try {
    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      throw new Error('文件为空');
    }
    if (stats.size > 100 * 1024 * 1024) { // 100MB限制
      throw new Error('文件过大（超过100MB）');
    }
    return true;
  } catch (error) {
    throw new Error(`文件验证失败: ${error.message}`);
  }
}

// 辅助函数
function cleanString(value) {
  if (value === null || value === undefined || value === '') return '';
  
  if (typeof value === 'string') {
    return value.trim()
      .replace(/[\r\n\t]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  if (typeof value === 'number') {
    // 检查是否是Excel日期（Excel日期从1899-12-30开始）
    if (value > 0 && value < 100000) {
      try {
        // Excel日期转换（Windows版本，1900日期系统）
        const excelEpoch = new Date(1899, 11, 30); // 1899-12-30
        const msPerDay = 24 * 60 * 60 * 1000;
        const date = new Date(excelEpoch.getTime() + (value - 1) * msPerDay);
        
        // 检查是否是有效日期
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        }
      } catch (e) {
        // 转换失败，返回原始字符串
      }
    }
    return value.toString();
  }
  
  return String(value);
}

function cleanNumber(value) {
  if (value === null || value === undefined) return 0;
  
  if (typeof value === 'number') {
    return isFinite(value) ? value : 0;
  }
  
  if (typeof value === 'string') {
    const str = value.trim();
    if (str === '') return 0;
    
    // 处理中文数字单位
    const units = { 
      '万': 10000, 
      '亿': 100000000, 
      '千': 1000,
      '百万': 1000000,
      '千万': 10000000
    };
    
    // 提取数字和单位
    let numStr = str;
    let unitMultiplier = 1;
    
    // 检查是否包含中文单位
    for (const [unit, multiplier] of Object.entries(units)) {
      if (str.includes(unit)) {
        numStr = str.replace(unit, '');
        unitMultiplier = multiplier;
        break;
      }
    }
    
    // 移除非数字字符（保留小数点、负号）
    const cleanNumStr = numStr.replace(/[^\d.-]/g, '');
    
    if (cleanNumStr === '' || cleanNumStr === '-') return 0;
    
    const num = parseFloat(cleanNumStr);
    
    if (!isFinite(num)) return 0;
    
    return num * unitMultiplier;
  }
  
  return 0;
}

// 品类名称匹配函数
function matchCategory(productName, categoryName) {
  if (!productName || !categoryName) return false;
  
  // 标准化名称（去空格、转小写、移除序号和特殊字符）
  const normalize = (str) => {
    if (!str || typeof str !== 'string') return '';
    return str.toLowerCase()
      .replace(/^\d+\.\s*/, '') // 移除开头的序号
      .replace(/\s+/g, '')      // 移除所有空格
      .replace(/[^\w\u4e00-\u9fa5]/g, ''); // 只保留中文字符、字母、数字
  };
  
  const normProduct = normalize(productName);
  const normCategory = normalize(categoryName);
  
  if (!normProduct || !normCategory) return false;
  
  // 完全匹配
  if (normProduct === normCategory) return true;
  
  // 包含匹配，但要求最小长度
  if (normProduct.length >= 2 && normCategory.length >= 2) {
    // 检查是否是合理的包含关系（避免部分匹配导致错误）
    const minLength = Math.min(normProduct.length, normCategory.length);
    if (minLength >= 3) {
      // 对于较长的名称，要求匹配部分超过一定比例
      if (normProduct.includes(normCategory) || normCategory.includes(normProduct)) {
        const matchRatio = normProduct.includes(normCategory) 
          ? normCategory.length / normProduct.length
          : normProduct.length / normCategory.length;
        return matchRatio > 0.5; // 要求匹配部分超过50%
      }
    }
  }
  
  return false;
}

// 解析合作社基本信息
function parseBasicInfoFromTable(tableData) {
  const info = {};
  
  // 从表格数据中提取基本信息
  const fieldMapping = {
    '企业名称': 'name',
    '负责人姓名': 'contact', 
    '联系电话': 'phone',
    '成立时间': 'establishedDate',
    '注册资本（万元）': 'registeredCapital',
    '员工数量（户）': 'employees',
    '总种植面积（亩）': 'plantingArea',
    '是否示范社': 'isDemonstration',
    '荣获资质/曾获荣誉': 'honors',
    '合作社名称': 'name',
    '负责人': 'contact',
    '电话': 'phone'
  };
  
  console.log('开始解析基本信息表格...');
  
  // 查找"填写项目"行或其他可能的表头
  let startRow = -1;
  for (let i = 0; i < tableData.length; i++) {
    const row = tableData[i];
    if (!row || row.length === 0) continue;
    
    const firstCell = cleanString(row[0]);
    if (firstCell === '填写项目' || firstCell === '项目' || firstCell.includes('合作社')) {
      startRow = i;
      console.log(`找到表头行: ${i}, 内容: "${firstCell}"`);
      break;
    }
  }
  
  if (startRow === -1) {
    // 尝试其他表头模式
    for (let i = 0; i < tableData.length; i++) {
      const row = tableData[i];
      if (!row || row.length < 2) continue;
      
      const key = cleanString(row[0]);
      if (key in fieldMapping) {
        startRow = i;
        console.log(`通过字段映射找到表头行: ${i}, 字段: "${key}"`);
        break;
      }
    }
  }
  
  if (startRow === -1) {
    console.log('警告: 未找到基本信息表头');
    return info;
  }
  
  console.log(`从第${startRow}行开始提取基本信息`);
  
  // 从下一行开始提取数据
  for (let i = startRow; i < Math.min(tableData.length, startRow + 20); i++) {
    const row = tableData[i];
    if (!row || row.length < 2) continue;
    
    const key = cleanString(row[0]);
    const value = row[1];
    
    if (!key || key === '') {
      // 如果遇到空行，检查是否需要继续
      if (i > startRow + 5 && Object.keys(info).length > 3) {
        console.log(`遇到空行，已提取${Object.keys(info).length}个字段，停止提取`);
        break;
      }
      continue;
    }
    
    // 调试：显示当前处理的行
    console.log(`处理行${i}: "${key}" = "${cleanString(value)}"`);
    
    let matched = false;
    
    // 首先：处理特殊情况 - "是否示范社"
    if (key.includes('示范社') || key === '是否示范社') {
      const demoValue = cleanString(value);
      info.isDemonstration = demoValue;
      console.log(`提取示范社信息: "${key}" = "${demoValue}"`);
      matched = true;
    } 
    // 其次：检查是否匹配其他字段
    else {
      for (const [chineseKey, englishKey] of Object.entries(fieldMapping)) {
        // 排除已经特殊处理的字段
        if (chineseKey === '是否示范社') continue;
        
        // 检查是否匹配
        if (key === chineseKey || key.includes(chineseKey) || chineseKey.includes(key)) {
          if (englishKey === 'registeredCapital' || englishKey === 'employees' || englishKey === 'plantingArea') {
            const numValue = cleanNumber(value);
            info[englishKey] = numValue;
            console.log(`提取数值字段 ${englishKey}: "${key}" = ${numValue}`);
          } else {
            const strValue = cleanString(value);
            info[englishKey] = strValue;
            console.log(`提取文本字段 ${englishKey}: "${key}" = "${strValue}"`);
          }
          matched = true;
          break;
        }
      }
    }
    
    // 如果匹配到核心字段，可以考虑继续
    const coreFields = ['name', 'contact', 'phone', 'isDemonstration'];
    const hasCoreFields = coreFields.filter(field => info[field]).length;
    
    // 检查是否到达下一个部分（比如"核心优势品类"）
    if (key.includes('核心优势品类') || key.includes('核心品类') || 
        key.includes('物流方面') || key.includes('质量合规')) {
      console.log(`遇到下一部分标题 "${key}"，停止基本信息提取`);
      break;
    }
    
    // 如果已经收集到足够的信息，可以提前退出
    if (hasCoreFields >= 3 && i > startRow + 8) {
      console.log(`已提取${Object.keys(info).length}个字段，提前结束`);
      break;
    }
  }
  
  console.log('基本信息提取完成:', info);
  return info;
}

// 解析品类数据
function parseCategoriesFromTable(tableData) {
  const categories = [];
  
  // 查找"核心优势品类"或"核心品类"标题
  let startRow = -1;
  for (let i = 0; i < tableData.length; i++) {
    const row = tableData[i];
    if (row && row[0]) {
      const cellValue = cleanString(row[0]);
      if (cellValue.includes('核心优势品类') || cellValue.includes('核心品类') || 
          cellValue.includes('主要品类') || cellValue.includes('经营品类')) {
        startRow = i;
        break;
      }
    }
  }
  
  if (startRow === -1) return categories;
  
  // 查找表头行（包含"核心品类名称"的行）
  let headerRow = -1;
  for (let i = startRow; i < Math.min(tableData.length, startRow + 10); i++) {
    const row = tableData[i];
    if (row && row.length >= 2) {
      const secondCell = cleanString(row[1]);
      if (secondCell === '核心品类名称' || secondCell === '品类名称' || 
          secondCell.includes('名称') && (secondCell.includes('品类') || secondCell.includes('产品'))) {
        headerRow = i;
        break;
      }
    }
  }
  
  if (headerRow === -1) {
    // 如果没有找到标准表头，尝试其他方式
    for (let i = startRow; i < Math.min(tableData.length, startRow + 10); i++) {
      const row = tableData[i];
      if (row && row[0] && cleanString(row[0]).match(/^\d+\./)) {
        headerRow = i - 1;
        if (headerRow < startRow) headerRow = startRow;
        break;
      }
    }
  }
  
  if (headerRow === -1) {
    // 如果仍然找不到，使用startRow作为headerRow
    headerRow = startRow;
  }
  
  console.log(`发现品类表头行: ${headerRow}`);
  
  // 从表头下一行开始解析品类数据
  for (let i = headerRow + 1; i < tableData.length; i++) {
    const row = tableData[i];
    if (!row || row.length < 2) continue;
    
    // 检查是否到其他部分
    const firstCell = cleanString(row[0]);
    if (firstCell.includes('物流方面') || firstCell.includes('物流配送范围') ||
        firstCell.includes('质量合规') || firstCell.includes('财务数据') ||
        firstCell.includes('合作社') || firstCell.includes('合计') ||
        firstCell === '') {
      break;
    }
    
    // 解析品类数据
    let categoryName = '';
    let season = '';
    let description = '';
    
    // 处理序号列（第一列）
    if (firstCell && firstCell.match(/^\d+\./)) {
      // 标准格式：品类名称在第二列
      categoryName = cleanString(row[1] || '');
      season = cleanString(row[2] || '');
      description = cleanString(row[3] || '');
    } else if (firstCell && firstCell.trim() !== '') {
      // 可能是没有序号，直接是品类名称
      categoryName = firstCell;
      season = cleanString(row[1] || '');
      description = cleanString(row[2] || '');
    } else {
      // 如果第一列为空，尝试从第二列开始
      if (row[1]) {
        categoryName = cleanString(row[1]);
        season = cleanString(row[2] || '');
        description = cleanString(row[3] || '');
      }
    }
    
    // 清理品类名称
    if (categoryName) {
      categoryName = categoryName
        .replace(/^\d+\.\s*/, '')
        .replace(/^[、，,]\s*/, '')
        .trim();
    }
    
    if (categoryName && categoryName !== '' && categoryName.length >= 2) {
      categories.push({
        name: categoryName,
        season: season,
        description: description
      });
      console.log(`  提取品类: ${categoryName}`);
    }
    
    // 限制最大解析行数
    if (i > headerRow + 50) {
      console.log(`  警告: 超过最大解析行数，停止解析`);
      break;
    }
  }
  
  return categories;
}

// 解析财务数据中的品类信息
function parseFinancialData(tableData, categories) {
  if (!categories || categories.length === 0) return categories;
  
  // 查找"品类名称及单价"行或其他可能的表头
  let startRow = -1;
  for (let i = 0; i < tableData.length; i++) {
    const row = tableData[i];
    if (row && row[0]) {
      const cellValue = cleanString(row[0]);
      if (cellValue === '品类名称及单价' || cellValue.includes('财务数据') || 
          cellValue.includes('销售额') || cellValue.includes('销量')) {
        startRow = i + 1;
        break;
      }
    }
  }
  
  if (startRow === -1) return categories;
  
  // 查找财务数据的表头行
  let headerRow = -1;
  for (let i = startRow; i < Math.min(tableData.length, startRow + 5); i++) {
    const row = tableData[i];
    if (row && row.length >= 5) {
      const firstCell = cleanString(row[0]);
      if (firstCell.includes('品类') || firstCell.includes('产品') || 
          firstCell.includes('名称') || firstCell.match(/^\d+\./)) {
        headerRow = i;
        break;
      }
    }
  }
  
  if (headerRow === -1) headerRow = startRow;
  
  // 解析财务数据
  for (let i = headerRow; i < tableData.length; i++) {
    const row = tableData[i];
    if (!row || row.length < 5) break;
    
    const productName = cleanString(row[0]);
    if (!productName || productName === '' || 
        productName.includes('合计') || productName.includes('总计') ||
        productName.includes('小计') ||
        // 排除Excel日期格式
        productName.match(/^\d{4}-\d{2}-\d{2}$/) ||
        productName === '1899-12-30' || productName === '1899-12-31' ||
        productName === '1900-01-01' || productName === '1900-01-02' ||
        productName === '1899-12-29' || productName === '1900-01-03') {
      break;
    }
    
    // 清理产品名称（可能包含序号）
    const cleanProductName = productName.replace(/^\d+\.\s*/, '').trim();
    
    // 查找匹配的品类
    let matched = false;
    for (const category of categories) {
      if (matchCategory(cleanProductName, category.name)) {
        // 补充财务数据
        category.plantingArea = cleanNumber(row[1]);
        category.annualOutput = cleanNumber(row[2]);
        category.annualSales = cleanNumber(row[3]);
        category.annualRevenue = cleanNumber(row[4]);
        
        // 计算单价（元/吨）
        if (category.annualSales > 0 && category.annualRevenue > 0) {
          category.pricePerTon = (category.annualRevenue * 10000) / category.annualSales;
        }
        
        console.log(`  补充财务数据: ${category.name} - 销量: ${category.annualSales}吨, 销售额: ${category.annualRevenue}万元`);
        matched = true;
        break;
      }
    }
    
    if (!matched) {
      // 如果没有匹配，尝试创建一个新的品类
      if (cleanProductName && cleanProductName.length >= 2) {
        const newCategory = {
          name: cleanProductName,
          season: '',
          description: '',
          plantingArea: cleanNumber(row[1]),
          annualOutput: cleanNumber(row[2]),
          annualSales: cleanNumber(row[3]),
          annualRevenue: cleanNumber(row[4])
        };
        
        if (newCategory.annualSales > 0 && newCategory.annualRevenue > 0) {
          newCategory.pricePerTon = (newCategory.annualRevenue * 10000) / newCategory.annualSales;
        }
        
        categories.push(newCategory);
        console.log(`  从财务数据创建新品类: ${cleanProductName}`);
      }
    }
  }
  
  return categories;
}

// 解析质量合规信息
function parseQualityInfo(tableData) {
  const quality = {};
  
  // 查找质量合规表头
  let startRow = -1;
  for (let i = 0; i < tableData.length; i++) {
    const row = tableData[i];
    if (row && row[0]) {
      const cellValue = cleanString(row[0]);
      if (cellValue === '合作社（公司）名称' || cellValue.includes('质量合规') || 
          cellValue.includes('质量体系')) {
        startRow = i;
        break;
      }
    }
  }
  
  if (startRow === -1) return quality;
  
  // 提取质量信息
  for (let i = startRow + 1; i < Math.min(tableData.length, startRow + 10); i++) {
    const dataRow = tableData[i];
    if (dataRow && dataRow.length >= 6) {
      quality.qualitySystem = cleanString(dataRow[1]);
      quality.pesticideRecords = cleanString(dataRow[2]);
      quality.greenControl = cleanString(dataRow[3]);
      quality.detectionMethod = cleanString(dataRow[4]);
      quality.detectionCount = cleanString(dataRow[5]);
      quality.evidenceMaterials = cleanString(dataRow[6] || '');
      break;
    }
  }
  
  return quality;
}

// 解析物流信息
function parseLogisticsInfo(tableData) {
  const logistics = {};
  
  // 查找"物流方面"行
  let startRow = -1;
  for (let i = 0; i < tableData.length; i++) {
    const row = tableData[i];
    if (row && row[0]) {
      const cellValue = cleanString(row[0]);
      if (cellValue === '物流方面' || cellValue.includes('物流配送') || 
          cellValue.includes('运输方式')) {
        startRow = i;
        break;
      }
    }
  }
  
  if (startRow === -1) return logistics;
  
  // 查找"物流配送范围"行
  for (let i = startRow; i < Math.min(tableData.length, startRow + 10); i++) {
    const row = tableData[i];
    if (row && row[0]) {
      const cellValue = cleanString(row[0]);
      if (cellValue === '物流配送范围' || cellValue.includes('配送范围')) {
        // 下一行是数据
        const dataRow = tableData[i + 1];
        if (dataRow && dataRow.length >= 4) {
          logistics.range = cleanString(dataRow[0]);
          logistics.method = cleanString(dataRow[1]);
          logistics.duration = cleanString(dataRow[2]);
          logistics.mode = cleanString(dataRow[3]);
        }
        break;
      }
    }
  }
  
  return logistics;
}

// 处理单个Excel文件
function processExcelFile(filePath, fileName) {
  console.log(`\n处理文件: ${fileName}`);
  
  try {
    // 验证文件
    validateExcelFile(filePath);
    
    const workbook = XLSX.readFile(filePath);
    const result = {
      sourceFile: fileName,
      basicInfo: {},
      categories: [],
      quality: {},
      logistics: {},
      sheetNames: workbook.SheetNames,
      processedAt: new Date().toISOString()
    };
    
    // 处理每个sheet
    workbook.SheetNames.forEach(sheetName => {
      console.log(`  处理sheet: ${sheetName}`);
      
      const worksheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
      
      // 根据sheet名称决定解析逻辑
      if (sheetName.includes('基础经营信息') || sheetName.includes('基本信息') || 
          sheetName.includes('合作社信息')) {
        result.basicInfo = parseBasicInfoFromTable(sheetData);
        result.categories = parseCategoriesFromTable(sheetData);
        result.logistics = parseLogisticsInfo(sheetData);
      } else if (sheetName.includes('质量合规') || sheetName.includes('质量')) {
        result.quality = parseQualityInfo(sheetData);
      } else if (sheetName.includes('财务数据') || sheetName.includes('财务')) {
        result.categories = parseFinancialData(sheetData, result.categories);
      } else if (workbook.SheetNames.length === 1) {
        // 如果只有一个sheet，尝试从这一个sheet中提取所有信息
        if (Object.keys(result.basicInfo).length === 0) {
          result.basicInfo = parseBasicInfoFromTable(sheetData);
        }
        if (result.categories.length === 0) {
          result.categories = parseCategoriesFromTable(sheetData);
        }
        if (Object.keys(result.logistics).length === 0) {
          result.logistics = parseLogisticsInfo(sheetData);
        }
        if (Object.keys(result.quality).length === 0) {
          result.quality = parseQualityInfo(sheetData);
        }
        // 尝试解析财务数据
        result.categories = parseFinancialData(sheetData, result.categories);
      }
    });
    
    // 生成ID
    const coopId = generateId('coop');
    result.id = coopId;
    
    // 为每个品类生成ID
    result.categories.forEach((category, index) => {
      category.id = `${coopId}_cat_${index}`;
      category.cooperativeId = coopId;
      category.cooperativeName = result.basicInfo.name || fileName.replace(/\.(xlsx|xls)$/, '');
      category.cooperativeLevel = result.basicInfo.isDemonstration || '';
      category.qualityCertification = result.quality.qualitySystem || '';
      
      // 确保必要字段存在
      if (!category.season) category.season = '';
      if (!category.description) category.description = '';
      if (!category.plantingArea) category.plantingArea = 0;
      if (!category.annualOutput) category.annualOutput = 0;
      if (!category.annualSales) category.annualSales = 0;
      if (!category.annualRevenue) category.annualRevenue = 0;
      if (!category.pricePerTon) category.pricePerTon = 0;
    });
    
    console.log(`提取完成: ${result.basicInfo.name || '未命名合作社'}`);
    console.log(`品类数量: ${result.categories.length}`);
    
    return result;
    
  } catch (error) {
    console.error(`处理文件 ${fileName} 失败: ${error.message}`);
    
    // 记录错误日志
    const errorLog = {
      file: fileName,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    };
    
    const errorLogPath = path.join(OUTPUT_DIR, 'error-log.json');
    try {
      let existingLogs = [];
      if (fs.existsSync(errorLogPath)) {
        const content = fs.readFileSync(errorLogPath, 'utf8');
        if (content.trim()) {
          existingLogs = JSON.parse(`[${content.replace(/\n+$/, '').replace(/\n/g, ',')}]`);
        }
      }
      existingLogs.push(errorLog);
      fs.writeFileSync(errorLogPath, existingLogs.map(log => JSON.stringify(log)).join('\n') + '\n');
    } catch (logError) {
      console.error('无法写入错误日志:', logError.message);
    }
    
    return null;
  }
}

// 特殊处理：数据汇总.xlsx（包含多个合作社）
function processSummaryFile(workbook, fileName) {
  const allCooperatives = [];
  
  workbook.SheetNames.forEach(sheetName => {
    console.log(`  处理合作社: ${sheetName}`);
    
    const worksheet = workbook.Sheets[sheetName];
    const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
    
    const cooperative = {
      sourceFile: fileName,
      sheetName: sheetName,
      basicInfo: {},
      categories: [],
      quality: {},
      logistics: {},
      processedAt: new Date().toISOString()
    };
    
    // 解析基本信息
    cooperative.basicInfo = parseBasicInfoFromTable(sheetData);
    
    // 如果sheet名称是合作社名称，但基本信息中没有名称，使用sheet名称
    if (!cooperative.basicInfo.name || cooperative.basicInfo.name === '') {
      cooperative.basicInfo.name = sheetName;
    }
    
    // 解析品类数据
    cooperative.categories = parseCategoriesFromTable(sheetData);
    
    // 解析质量信息
    cooperative.quality = parseQualityInfo(sheetData);
    
    // 解析物流信息
    cooperative.logistics = parseLogisticsInfo(sheetData);
    
    // 尝试解析财务数据
    cooperative.categories = parseFinancialData(sheetData, cooperative.categories);
    
    // 生成ID
    const coopId = generateId('coop');
    cooperative.id = coopId;
    
    // 为每个品类生成ID
    cooperative.categories.forEach((category, index) => {
      category.id = `${coopId}_cat_${index}`;
      category.cooperativeId = coopId;
      category.cooperativeName = cooperative.basicInfo.name;
      category.cooperativeLevel = cooperative.basicInfo.isDemonstration || '';
      category.qualityCertification = cooperative.quality.qualitySystem || '';
      
      // 确保必要字段存在
      if (!category.season) category.season = '';
      if (!category.description) category.description = '';
      if (!category.plantingArea) category.plantingArea = 0;
      if (!category.annualOutput) category.annualOutput = 0;
      if (!category.annualSales) category.annualSales = 0;
      if (!category.annualRevenue) category.annualRevenue = 0;
      if (!category.pricePerTon) category.pricePerTon = 0;
    });
    
    console.log(`提取品类: ${cooperative.categories.length}个`);
    
    allCooperatives.push(cooperative);
  });
  
  return allCooperatives;
}

// 主函数
async function main() {
  console.log('开始从Excel提取品类数据');
  console.log('='.repeat(60));
  
  // 检查目录
  if (!fs.existsSync(EXCEL_DIR)) {
    console.error(`错误: Excel目录不存在: ${EXCEL_DIR}`);
    console.log('请创建目录并放入Excel文件:');
    console.log(`mkdir -p ${EXCEL_DIR}`);
    return;
  }
  
  // 获取Excel文件
  const files = fs.readdirSync(EXCEL_DIR)
    .filter(file => file.toLowerCase().endsWith('.xlsx') || file.toLowerCase().endsWith('.xls'))
    .filter(file => !file.startsWith('~$'))  // 排除临时文件
    .filter(file => !file.startsWith('._'))  // 排除Mac临时文件
    .sort();
  
  if (files.length === 0) {
    console.error(`错误: 目录 ${EXCEL_DIR} 中没有Excel文件`);
    console.log('支持的格式: .xlsx, .xls');
    return;
  }
  
  console.log(`找到 ${files.length} 个Excel文件:`);
  files.forEach((file, index) => {
    console.log(`  ${index + 1}. ${file}`);
  });
  
  console.log('\n' + '='.repeat(60));
  
  // 处理所有文件
  const allCooperatives = [];
  const allCategories = [];
  
  for (const file of files) {
    const filePath = path.join(EXCEL_DIR, file);
    
    try {
      if (file === '数据汇总.xlsx' || file === '数据汇总.xls') {
        // 特殊处理汇总文件
        console.log(`\n处理汇总文件: ${file}`);
        const workbook = XLSX.readFile(filePath);
        const cooperatives = processSummaryFile(workbook, file);
        
        if (cooperatives && cooperatives.length > 0) {
          allCooperatives.push(...cooperatives);
          
          cooperatives.forEach(coop => {
            if (coop.categories && coop.categories.length > 0) {
              allCategories.push(...coop.categories.map(cat => ({
                ...cat,
                sourceFile: file,
                sourceSheet: coop.sheetName
              })));
            }
          });
        }
      } else {
        // 处理单个合作社文件
        const result = processExcelFile(filePath, file);
        
        if (result) {
          allCooperatives.push(result);
          if (result.categories) {
            allCategories.push(...result.categories);
          }
        }
      }
    } catch (error) {
      console.error(`处理文件 ${file} 时发生错误:`, error.message);
      continue;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('数据处理统计');
  console.log('='.repeat(60));
  console.log(`总计处理合作社: ${allCooperatives.length}`);
  console.log(`总计提取品类: ${allCategories.length}`);
  
  if (allCooperatives.length === 0) {
    console.error('错误: 没有成功处理任何合作社数据');
    return;
  }
  
  // 输出每个合作社的JSON文件
  console.log('\n保存数据文件:');
  console.log('='.repeat(60));
  
  allCooperatives.forEach(coop => {
    try {
      const safeName = safeFilename(coop.basicInfo.name || '未命名合作社');
      const fileName = `${safeName}.json`;
      const outputPath = path.join(OUTPUT_DIR, fileName);
      
      fs.writeFileSync(
        outputPath,
        JSON.stringify(coop, null, 2),
        'utf8'
      );
      
      console.log(`${fileName} (${coop.categories.length}个品类)`);
    } catch (error) {
      console.error(`保存合作社 ${coop.basicInfo.name || '未命名'} 数据失败:`, error.message);
    }
  });
  
  // 创建品类汇总文件
  try {
    const categoriesSummary = {
      metadata: {
        totalCooperatives: allCooperatives.length,
        totalCategories: allCategories.length,
        generatedAt: new Date().toISOString(),
        sourceFiles: files,
        processingDate: new Date().toLocaleDateString('zh-CN')
      },
      cooperatives: allCooperatives.map(coop => ({
        id: coop.id,
        name: coop.basicInfo.name || '未命名',
        level: coop.basicInfo.isDemonstration || '',
        contact: coop.basicInfo.contact || '',
        phone: coop.basicInfo.phone || '',
        plantingArea: coop.basicInfo.plantingArea || 0,
        categoryCount: coop.categories.length,
        categories: coop.categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          season: cat.season,
          hasFinancialData: !!(cat.annualSales && cat.annualRevenue)
        }))
      })),
      // 扁平化的所有品类数据
      allCategories: allCategories.map(cat => ({
        id: cat.id,
        name: cat.name,
        season: cat.season,
        description: cat.description || '',
        cooperativeName: cat.cooperativeName || '',
        cooperativeLevel: cat.cooperativeLevel || '',
        qualityCertification: cat.qualityCertification || '',
        plantingArea: cat.plantingArea || 0,
        annualOutput: cat.annualOutput || 0,
        annualSales: cat.annualSales || 0,
        annualRevenue: cat.annualRevenue || 0,
        pricePerTon: cat.pricePerTon || 0
      }))
    };
    
    // 保存汇总文件
    const summaryPath = path.join(OUTPUT_DIR, 'categories.json');
    fs.writeFileSync(
      summaryPath,
      JSON.stringify(categoriesSummary, null, 2),
      'utf8'
    );
    
    console.log(`\ncategories.json (汇总文件)`);
  } catch (error) {
    console.error('创建汇总文件失败:', error.message);
  }
  
  // 创建简化的前端数据文件
  try {
    const simplifiedData = {
      metadata: {
        total: allCategories.length,
        lastUpdated: new Date().toISOString(),
        version: '1.0'
      },
      categories: allCategories.map(cat => ({
        id: cat.id,
        name: cat.name,
        season: cat.season,
        description: cat.description ? 
          (cat.description.length > 100 ? cat.description.substring(0, 100) + '...' : cat.description) 
          : '',
        cooperative: {
          name: cat.cooperativeName,
          level: cat.cooperativeLevel,
          quality: cat.qualityCertification
        },
        stats: {
          plantingArea: cat.plantingArea,
          annualOutput: cat.annualOutput,
          annualSales: cat.annualSales,
          annualRevenue: cat.annualRevenue,
          pricePerTon: Math.round(cat.pricePerTon || 0)
        },
        // 用于前端筛选的标签
        tags: [
          cat.cooperativeLevel ? `示范社:${cat.cooperativeLevel}` : null,
          cat.qualityCertification ? `认证:${cat.qualityCertification}` : null,
          cat.season ? `上市期:${cat.season}` : null,
          cat.annualSales > 0 ? '有销售数据' : null
        ].filter(tag => tag !== null)
      }))
    };
    
    const simplePath = path.join(OUTPUT_DIR, 'categories-simple.json');
    fs.writeFileSync(
      simplePath,
      JSON.stringify(simplifiedData, null, 2),
      'utf8'
    );
    
    console.log(`categories-simple.json (简化版)`);
  } catch (error) {
    console.error('创建简化文件失败:', error.message);
  }
  
  // 显示数据统计
  console.log('\n品类统计信息:');
  console.log('='.repeat(60));
  
  // 统计各合作社的品类数量
  console.log('\n各合作社品类数量:');
  allCooperatives.forEach(coop => {
    const name = coop.basicInfo.name || '未命名合作社';
    const shortName = name.length > 30 ? name.substring(0, 27) + '...' : name;
    console.log(`  ${shortName.padEnd(30)}: ${coop.categories.length.toString().padStart(3)}个品类`);
  });
  
  // 统计最常见的品类
  const categoryCounts = {};
  allCategories.forEach(cat => {
    const name = cat.name.trim();
    if (name) {
      categoryCounts[name] = (categoryCounts[name] || 0) + 1;
    }
  });
  
  const sortedCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);
  
  console.log('\n最常见品类 (前15):');
  sortedCategories.forEach(([name, count]) => {
    const shortName = name.length > 25 ? name.substring(0, 22) + '...' : name;
    console.log(`  ${shortName.padEnd(25)}: ${count.toString().padStart(3)}次`);
  });
  
  // 统计有财务数据的品类
  const withFinancialData = allCategories.filter(cat => cat.annualSales > 0).length;
  console.log(`\n有财务数据的品类: ${withFinancialData}/${allCategories.length} (${Math.round(withFinancialData/allCategories.length*100)}%)`);
  
  // 统计示范社数量
  const demonstrationCoops = allCooperatives.filter(coop => {
    const demoValue = coop.basicInfo.isDemonstration || '';
    const demoStr = demoValue.toString().toLowerCase().trim();
  
    // 多种可能的"是"表示方式
    return demoStr !== '否' && 
           demoStr !== '' && 
           !demoStr.includes('否') &&
           demoStr !== '0' &&
           demoStr !== 'false';
  }).length;
  console.log(`示范社数量: ${demonstrationCoops}/${allCooperatives.length}`);
  
  console.log('数据转换完成！');
  console.log(`输出目录: ${OUTPUT_DIR}`);
  console.log('文件已保存，可以开始前端开发了。');
}

// 执行
main().catch(error => {
  console.error('程序执行失败:', error);
  console.error('错误堆栈:', error.stack);
  process.exit(1);
});