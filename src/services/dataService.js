class DataService {
  constructor() {
    this.baseURL = 'http://localhost:3000/api';
    this.categories = [];
    this.cooperatives = [];
    this.metadata = {
      totalCategories: 20,
      totalCooperatives: 6,
      withFinancialData: 6,
      demoCooperatives: 5
    };
    this.isInitialized = false;
    // 立即开始初始化
    this.init();
  }

  async init() {
    try {
      console.log('开始初始化数据...');
      
      // 并行加载所有数据
      const [categories, cooperatives, stats] = await Promise.all([
        this.fetchCategories(),
        this.fetchCooperatives(),
        this.fetchStats()
      ]);
      
      this.categories = categories;
      this.cooperatives = cooperatives;
      if (stats) {
        this.metadata = stats;
      }
      
      console.log('数据初始化完成:', {
        品类数: this.categories.length,
        合作社数: this.cooperatives.length
      });
      
    } catch (error) {
      console.error('数据初始化失败:', error);
    } finally {
      this.isInitialized = true;
    }
  }

  // 获取品类列表（内部使用）
  async fetchCategories(filters = {}, page = 1, limit = 12, sortBy = 'default') {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        sortBy
      });
      
      if (filters.categoryName) params.append('categoryName', filters.categoryName);
      if (filters.cooperativeName) params.append('cooperativeName', filters.cooperativeName);
      if (filters.demoLevel) params.append('demoLevel', filters.demoLevel);
      if (filters.qualityCert) params.append('qualityCert', filters.qualityCert);
      if (filters.season) params.append('season', filters.season);
      if (filters.hasFinancialData) params.append('hasFinancialData', 'true');
      
      const url = `${this.baseURL}/categories?${params}`;
      console.log('请求URL:', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.code === 0) {
        return result.data.categories;
      }
      return [];
    } catch (error) {
      console.error('获取品类列表失败:', error);
      return [];
    }
  }

  // 对外接口：获取品类列表
  async getCategories(filters = {}, page = 1, limit = 12, sortBy = 'default') {
    try {
      const params = new URLSearchParams({ page, limit, sortBy });
    
      if (filters.categoryName) params.append('categoryName', filters.categoryName);
      if (filters.cooperativeName) params.append('cooperativeName', filters.cooperativeName);
      if (filters.demoLevel) params.append('demoLevel', filters.demoLevel);
      if (filters.qualityCert) params.append('qualityCert', filters.qualityCert);
      if (filters.hasFinancialData) params.append('hasFinancialData', 'true');
    
      const url = `${this.baseURL}/categories?${params}`;
      const response = await fetch(url);
    
      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`);
      }
    
      const result = await response.json();
    
      if (result.code === 0 && result.data && Array.isArray(result.data.categories)) {
        return result.data.categories;
      }
      return [];
    } catch (error) {
      console.error('获取品类列表失败:', error);
      return []; // 确保返回数组
    }
  }

  // 获取品类详情
  async getCategoryDetail(id) {
    try {
      const url = `${this.baseURL}/categories/${id}`;
      console.log('请求详情URL:', url);
      
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.code === 0) {
        return result.data;
      }
      return null;
    } catch (error) {
      console.error('获取品类详情失败:', error);
      return null;
    }
  }

  // 获取统计数据（内部使用）
  async fetchStats() {
    try {
      const url = `${this.baseURL}/categories/stats`;
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.code === 0) {
        return result.data;
      }
      return null;
    } catch (error) {
      console.error('获取统计数据失败:', error);
      return null;
    }
  }

  // 对外接口：获取统计数据
  async getStats() {
    // 等待初始化完成
    if (!this.isInitialized) {
      await new Promise(resolve => {
        const check = () => {
          if (this.isInitialized) resolve();
          else setTimeout(check, 100);
        };
        check();
      });
    }
    return this.metadata;
  }

  // 获取合作社列表（内部使用）
  async fetchCooperatives() {
    try {
      const url = `${this.baseURL}/cooperatives`;
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.code === 0) {
        return result.data;
      }
      return [];
    } catch (error) {
      console.error('获取合作社列表失败:', error);
      return [];
    }
  }

  // 对外接口：获取合作社列表
  async getCooperatives() {
    // 等待初始化完成
    if (!this.isInitialized) {
      await new Promise(resolve => {
        const check = () => {
          if (this.isInitialized) resolve();
          else setTimeout(check, 100);
        };
        check();
      });
    }
    return this.cooperatives;
  }

  // 为了兼容旧代码
  async filterCategories(filters = {}) {
    return this.getCategories(filters);
  }

  sortCategories(categories, sortBy = 'default') {
    return categories;
  }

  extractCooperatives() {
    return this.cooperatives;
  }

  checkSeasonMatch(seasonStr, targetSeason) {
    return true;
  }
}

export default new DataService();