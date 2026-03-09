export const checkIsInSeason = (season) => {
  if (!season) return false
  
  const currentMonth = new Date().getMonth() + 1
  
  // 处理全年供应的
  if (season.includes('全年') || season.includes('一年四季') || season.includes('一直有')) {
    return true
  }
  
  // 处理 "除了X月X月" 的情况
  if (season.includes('除了')) {
    const excludeMatch = season.match(/除了(.*?)月/g)
    if (excludeMatch) {
      const excludeMonths = excludeMatch.map(m => parseInt(m.replace(/[^0-9]/g, '')))
      return !excludeMonths.includes(currentMonth)
    }
  }
  
  // 处理 "1-7月份，9-12月份" 这种带逗号的
  if (season.includes('，') || season.includes(',')) {
    const ranges = season.split(/[，,]/)
    for (const range of ranges) {
      const match = range.match(/(\d+)[\-至到](\d+)/)
      if (match) {
        const start = parseInt(match[1])
        const end = parseInt(match[2])
        if (currentMonth >= start && currentMonth <= end) {
          return true
        }
      }
    }
  }
  
  // 处理 "2月份到5月底" 这种格式
  if (season.includes('到') || season.includes('-')) {
    const match = season.match(/(\d+)[月份]*(?:到|至|-)(\d+)[月份]*(?:底|份|$)?/)
    if (match) {
      const start = parseInt(match[1])
      const end = parseInt(match[2])
      if (currentMonth >= start && currentMonth <= end) {
        return true
      }
    }
  }
  
  // 处理 "夏季：7-8月份上市 冬季：12月份上市 春季：3月份上市"
  if (season.includes('夏季') || season.includes('冬季') || season.includes('春季')) {
    const monthMatches = season.match(/\d+/g)
    if (monthMatches) {
      const months = monthMatches.map(m => parseInt(m))
      if (months.includes(currentMonth)) {
        return true
      }
    }
  }
  
  // 处理单个月份
  if (season.includes(currentMonth + '月') || season.includes(currentMonth + '月份')) {
    return true
  }
  
  return false
}