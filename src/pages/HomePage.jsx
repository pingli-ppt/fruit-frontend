import React, { useState, useEffect } from 'react';
import FilterPanel from '../components/FilterPanel';
import ProductCard from '../components/ProductCard';
import CooperativeInfo from '../components/CooperativeInfo';
import dataService from '../services/dataService';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    // 初始化数据
    const timer = setInterval(() => {
      if (dataService.categories.length > 0) {
        const allCategories = dataService.categories;
        setCategories(allCategories);
        setFilteredCategories(allCategories);
        setStats(dataService.getStats());
        setLoading(false);
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // 应用筛选
    if (categories.length > 0) {
      let result = dataService.filterCategories(filters);
      result = dataService.sortCategories(result, filters.sortBy);
      setFilteredCategories(result);
    }
  }, [filters, categories]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>正在加载数据...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      <header className="page-header">
        <h1>农产品品类数据库</h1>
        <p className="subtitle">汇集优质合作社，提供可靠的农产品信息</p>
        
        {stats && (
          <div className="stats-bar">
            <div className="stat-item">
              <div className="stat-number">{stats.totalCategories}</div>
              <div className="stat-label">总品类数</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.withFinancialData}</div>
              <div className="stat-label">有销售数据</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.demoCooperatives}</div>
              <div className="stat-label">示范合作社</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.totalCooperatives}</div>
              <div className="stat-label">合作社总数</div>
            </div>
          </div>
        )}
      </header>

      <div className="page-content">
        <aside className="sidebar">
          <FilterPanel onFilterChange={handleFilterChange} />
          <CooperativeInfo />
        </aside>
        
        <main className="product-grid">
          <div className="results-info">
            <span>找到 {filteredCategories.length} 个品类</span>
            <div className="sort-options">
              {/* 这里可以放额外的排序选项 */}
            </div>
          </div>
          
          {filteredCategories.length === 0 ? (
            <div className="no-results">
              <h3>没有找到匹配的品类</h3>
              <p>尝试调整筛选条件</p>
            </div>
          ) : (
            <div className="cards-container">
              {filteredCategories.map(category => (
                <ProductCard key={category.id} category={category} />
              ))}
            </div>
          )}
          
          {/* 分页组件可以在这里添加 */}
        </main>
      </div>
    </div>
  );
};

export default HomePage;