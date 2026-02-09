class DataService {
  constructor() {
    this.categories = [];
    this.cooperatives = [];
    this.metadata = {
      totalCategories: 20,
      totalCooperatives: 6,
      withFinancialData: 6,
      demoCooperatives: 5,
      generatedAt: "2026-02-09T05:35:50.080Z"
    };
    this.isInitialized = false;
    this.init();
  }

  async init() {
    try {
      console.log('开始加载数据...');
      
      // 尝试不同的路径
      const paths = [
        '/data/json/categories-simple.json',  // 主要路径
        '/public/data/json/categories-simple.json', // 备用路径
        'data/json/categories-simple.json' // 无斜杠版本（某些服务器配置可能需要）
      ];
      
      let data = null;
      let successPath = null;

      for (const path of paths) {
        try {
          console.log(`尝试路径: ${path}`);
          const response = await fetch(path);
          if (response.ok) {
            data = await response.json();
            successPath = path;
            console.log(`成功从 ${path} 加载数据`);
            break;
          }
        } catch (err) {
          console.log(`路径 ${path} 失败:`, err.message);
        }
      }
      
      if (data) {
        this.categories = data.categories || [];
        this.metadata = data.metadata || this.metadata;
        this.cooperatives = this.extractCooperatives();
        console.log('数据加载成功:', {
          成功路径: successPath,
          品类数量: this.categories.length,
          合作社数量: this.cooperatives.length
        });

        // 调试：检查是否有图片URL
        const categoriesWithImages = this.categories.filter(cat => cat.imageUrl);
        console.log(`有图片的品类: ${categoriesWithImages.length}个`);
        if (categoriesWithImages.length > 0) {
          console.log('图片详情:');
          categoriesWithImages.forEach(cat => {
            console.log(`  - ${cat.name}: ${cat.imageUrl} (合作社: ${cat.cooperative?.name})`);
          });
        } else {
          console.log('警告：没有任何品类有图片URL！');
          console.log('检查JSON文件中的imageUrl字段是否正确添加');
        }
      } else {
        console.warn('无法加载JSON文件，使用默认数据结构');
        // 提供一个简单的默认数据结构
        this.categories = [
          {
            id: "default_1",
            name: "示例品类",
            season: "全年",
            description: "这是示例数据",
            cooperative: {
              name: "示例合作社",
              level: "市级",
              quality: "绿色食品"
            },
            stats: {
              plantingArea: 100,
              annualOutput: 200,
              annualSales: 180,
              annualRevenue: 36,
              pricePerTon: 2000
            }
          }
        ];
        this.cooperatives = this.extractCooperatives();
      }
    } catch (error) {
      console.error('数据初始化失败:', error);
      // 即使失败也要确保有基本数据
      this.categories = [];
      this.cooperatives = [];
    } finally {
      this.isInitialized = true;
    }
  }

  // 提取合作社列表
  extractCooperatives() {
    const coopMap = new Map();
    
    this.categories.forEach(category => {
      const coopName = category.cooperative.name;
      if (!coopMap.has(coopName)) {
        coopMap.set(coopName, {
          name: coopName,
          level: category.cooperative.level,
          quality: category.cooperative.quality,
          categories: [],
          hasFinancialData: false
        });
      }
      
      const coop = coopMap.get(coopName);
      coop.categories.push(category.name);
      
      if (category.stats && category.stats.annualSales > 0) {
        coop.hasFinancialData = true;
      }
    });
    
    return Array.from(coopMap.values());
  }

  // 筛选品类
  filterCategories(filters = {}) {
    if (!this.categories.length) return [];
    
    return this.categories.filter(category => {
      // 按品类名称筛选
      if (filters.categoryName && !category.name.includes(filters.categoryName)) {
        return false;
      }
      
      // 按合作社筛选
      if (filters.cooperativeName && !category.cooperative.name.includes(filters.cooperativeName)) {
        return false;
      }
      
      // 按示范级别筛选
      if (filters.demoLevel && category.cooperative.level !== filters.demoLevel) {
        return false;
      }
      
      // 按质量认证筛选
      if (filters.qualityCert && category.cooperative.quality !== filters.qualityCert) {
        return false;
      }
      
      // 按上市期筛选
      if (filters.season) {
        // 添加调试信息
        console.log(`筛选季节: "${category.season}" vs "${filters.season}"`);
        const isMatch = this.checkSeasonMatch(category.season, filters.season);
        console.log(`匹配结果: ${isMatch ? '通过' : '不通过'}`);
  
        if (!isMatch) {
          return false;
        }
      }
      
      // 按是否有财务数据筛选
      if (filters.hasFinancialData && category.stats.annualSales === 0) {
        return false;
      }
      
      return true;
    });
  }

  // 检查季节匹配
  checkSeasonMatch(seasonStr, targetSeason) {
    if (!seasonStr || !targetSeason) return false;
  
    const seasonLower = seasonStr.toLowerCase();
    const targetLower = targetSeason.toLowerCase();
  
    console.log(`季节匹配检查: "${seasonStr}" vs "${targetSeason}"`);
  
    // 1. 处理常见的季节描述
    if (targetLower === '全年' || targetLower === '一年四季') {
      return seasonLower.includes('全年') || 
             seasonLower.includes('一年四季') ||
             seasonLower.includes('一直有') ||
             seasonLower.includes('全年有');
    }
  
    // 2. 处理 "除了X月X月其他月份一直有"
    if (seasonLower.includes('除了') && seasonLower.includes('其他月份一直有')) {
      // 提取排除的月份
      const excludeMonths = this.extractExcludeMonths(seasonLower);
      console.log('排除的月份:', excludeMonths);
    
      // 提取查询的月份
      const queryMonth = this.extractMonthNumber(targetLower);
      console.log('查询的月份:', queryMonth);
    
      if (queryMonth) {
        // 如果查询月份不在排除列表中，则匹配成功
        return !excludeMonths.includes(queryMonth);
      }
    }
  
    // 3. 处理月份范围，如 "1-7月份"、"4月下旬"、"2月份到5月底"
    const seasonMonths = this.extractAllMonths(seasonLower);
    const queryMonths = this.extractAllMonths(targetLower);
  
    console.log('季节包含的月份:', seasonMonths);
    console.log('查询包含的月份:', queryMonths);
  
    // 如果查询的月份中任意一个在季节的月份中，就匹配成功
    if (queryMonths.length > 0 && seasonMonths.length > 0) {
      return queryMonths.some(month => seasonMonths.includes(month));
    }
  
    // 4. 简单的包含匹配
    return seasonLower.includes(targetLower);
  }

  // 提取排除的月份（从"除了7月8月"中提取[7,8]）
  extractExcludeMonths(seasonStr) {
    const excludeMonths = [];
  
    // 匹配"除了"后面的月份
    const excludeMatch = seasonStr.match(/除了([\d月\s\-到至、，,]+?)其他月份/);
    if (excludeMatch) {
      const excludePart = excludeMatch[1];
      // 提取所有月份数字
      const monthMatches = excludePart.match(/\d+/g);
      if (monthMatches) {
        monthMatches.forEach(match => {
          const month = parseInt(match);
          if (month >= 1 && month <= 12) {
            excludeMonths.push(month);
          }
        });
      }
    }
  
    return excludeMonths;
  }

  // 从字符串中提取月份数字
  extractMonthNumber(str) {
    const monthMatches = str.match(/\d+/g);
    if (monthMatches) {
      const month = parseInt(monthMatches[0]);
      if (month >= 1 && month <= 12) {
        return month;
      }
    }
    return null;
  }

  // 提取字符串中的所有月份（支持多种格式）
  extractAllMonths(str) {
    const months = [];
  
    if (!str) return months;
  
    // 1. 处理 "全年"、"一年四季"、"一直有"
    if (str.includes('全年') || str.includes('一年四季') || str.includes('一直有')) {
      return [1,2,3,4,5,6,7,8,9,10,11,12];
    }
  
    // 2. 处理月份范围 "1-7月份"、"1到7月"
    const rangeMatch = str.match(/(\d+)[\-\到至]+(\d+)/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1]);
      const end = parseInt(rangeMatch[2]);
    
      for (let month = start; month <= end; month++) {
        if (month >= 1 && month <= 12) {
          months.push(month);
        }
      }
      return months;
    }
  
    // 3. 处理多个不连续月份 "1月、3月、5月" 或 "1月份，3月份，5月份"
    const monthMatches = str.match(/\d+/g);
    if (monthMatches) {
      monthMatches.forEach(match => {
        const month = parseInt(match);
        if (month >= 1 && month <= 12 && !months.includes(month)) {
          months.push(month);
        }
      });
    }
  
    // 4. 处理 "4月下旬"、"4月" 等单个月份
    if (months.length === 0) {
      const singleMonth = this.extractMonthNumber(str);
      if (singleMonth) {
        months.push(singleMonth);
      }
    }
  
    return months;
  }

  // 排序品类
  sortCategories(categories, sortBy = 'default') {
    const sorted = [...categories];
    
    switch (sortBy) {
      case 'sales':
        return sorted.sort((a, b) => (b.stats?.annualSales || 0) - (a.stats?.annualSales || 0));
      case 'revenue':
        return sorted.sort((a, b) => (b.stats?.annualRevenue || 0) - (a.stats?.annualRevenue || 0));
      case 'price':
        return sorted.sort((a, b) => (b.stats?.pricePerTon || 0) - (a.stats?.pricePerTon || 0));
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
      default:
        return sorted;
    }
  }

  // 获取品类详情
  getCategoryDetail(categoryId) {
    console.log('查找品类详情，ID:', categoryId);
    console.log('总品类数:', this.categories.length);
  
    // 精确匹配
    const found = this.categories.find(cat => cat.id === categoryId);
  
    if (found) {
      console.log('找到品类:', found.name);
      console.log('图片URL:', found.imageUrl || '无');
      console.log('描述:', found.description?.substring(0, 50) + '...' || '无');
      console.log('合作社:', found.cooperative?.name);
      return found;
    }
  
    console.log('精确匹配失败，尝试其他匹配方式...');
  
    // 尝试其他匹配方式
    // 1. 去掉可能的URL编码
    const decodedId = decodeURIComponent(categoryId);
    if (decodedId !== categoryId) {
      const foundDecoded = this.categories.find(cat => cat.id === decodedId);
      if (foundDecoded) {
        console.log('通过解码找到品类:', foundDecoded.name);
        return foundDecoded;
      }
    }
  
    // 2. 模糊匹配
    const foundFuzzy = this.categories.find(cat => 
      cat.id.includes(categoryId) || 
      cat.name.includes(categoryId)
    );
  
    if (foundFuzzy) {
      console.log('通过模糊匹配找到品类:', foundFuzzy.name);
      return foundFuzzy;
    }
  
    console.log('所有匹配方式都失败，返回null');
    return null;
  }

  // 获取统计数据 - 永远不会返回 null
  getStats() {
    // 如果 categories 为空，使用 metadata 中的数据
    if (this.categories.length === 0) {
      return {
        totalCategories: this.metadata.totalCategories || 20,
        withFinancialData: this.metadata.withFinancialData || 6,
        demoCooperatives: this.metadata.demoCooperatives || 5,
        totalCooperatives: this.metadata.totalCooperatives || 6
      };
    }
    
    const total = this.categories.length;
    const withFinancial = this.categories.filter(cat => 
      cat.stats && cat.stats.annualSales > 0
    ).length;
    const demoCoops = this.cooperatives.filter(coop => 
      coop.level && !coop.level.includes('否')
    ).length;
    
    return {
      totalCategories: total,
      withFinancialData: withFinancial,
      demoCooperatives: demoCoops,
      totalCooperatives: this.cooperatives.length
    };
  }
}

export default new DataService();