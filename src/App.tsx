import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  provinceData, 
  getProvinceData, 
  monthOptions,
  PRICE_RATIOS,
  PRICE_COLORS,
  type PriceType,
  type TimeSlot
} from '@/data/electricityPriceData';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  Area,
  ComposedChart
} from 'recharts';
import { 
  Zap, 
  MapPin, 
  Info, 
  Clock,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Sparkles,
  Battery,
  Sun,
  Moon
} from 'lucide-react';

// 高级配色方案
const PREMIUM_COLORS: Record<PriceType, { main: string; gradient: string; glow: string }> = {
  '尖峰': { 
    main: '#ff4757', 
    gradient: 'linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)',
    glow: '0 0 20px rgba(255, 71, 87, 0.5)'
  },
  '高峰': { 
    main: '#ff6348', 
    gradient: 'linear-gradient(135deg, #ff6348 0%, #ff7f50 100%)',
    glow: '0 0 20px rgba(255, 99, 72, 0.4)'
  },
  '平段': { 
    main: '#2ed573', 
    gradient: 'linear-gradient(135deg, #2ed573 0%, #7bed9f 100%)',
    glow: '0 0 20px rgba(46, 213, 115, 0.3)'
  },
  '低谷': { 
    main: '#1e90ff', 
    gradient: 'linear-gradient(135deg, #1e90ff 0%, #70a1ff 100%)',
    glow: '0 0 20px rgba(30, 144, 255, 0.4)'
  },
  '深谷': { 
    main: '#5352ed', 
    gradient: 'linear-gradient(135deg, #5352ed 0%, #7b68ee 100%)',
    glow: '0 0 20px rgba(83, 82, 237, 0.5)'
  },
};

// 电价类型说明
const PRICE_TYPE_INFO: Record<PriceType, { label: string; desc: string; icon: React.ReactNode }> = {
  '尖峰': { 
    label: '尖峰电价', 
    desc: '最高电价时段',
    icon: <TrendingUp className="w-4 h-4" />
  },
  '高峰': { 
    label: '高峰电价', 
    desc: '用电高峰时段',
    icon: <Zap className="w-4 h-4" />
  },
  '平段': { 
    label: '平段电价', 
    desc: '正常电价时段',
    icon: <Clock className="w-4 h-4" />
  },
  '低谷': { 
    label: '低谷电价', 
    desc: '用电低谷时段',
    icon: <TrendingDown className="w-4 h-4" />
  },
  '深谷': { 
    label: '深谷电价', 
    desc: '最低电价时段',
    icon: <Battery className="w-4 h-4" />
  },
};

// 准备柱状图数据
const prepareChartData = (timeSlots: TimeSlot[]) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  return hours.map(hour => {
    const slot = timeSlots.find(s => {
      const start = parseInt(s.startTime.split(':')[0]);
      const end = parseInt(s.endTime.split(':')[0]);
      if (end < start) {
        return hour >= start || hour < end;
      }
      return hour >= start && hour < end;
    });
    
    return {
      hour: `${hour.toString().padStart(2, '0')}:00`,
      hourNum: hour,
      value: slot ? PRICE_RATIOS[slot.type] : 0,
      type: slot?.type || null,
    };
  });
};

// 自定义Tooltip
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{payload: {hour: string; type: PriceType | null}}> }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    if (data.type && data.type in PRICE_TYPE_INFO) {
      const info = PRICE_TYPE_INFO[data.type];
      const premiumColor = PREMIUM_COLORS[data.type];
      return (
        <div className="backdrop-blur-md bg-slate-900/90 p-4 rounded-xl shadow-2xl border border-slate-700/50 animate-in fade-in zoom-in duration-200">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <p className="font-bold text-white text-lg">{data.hour}</p>
          </div>
          <div 
            className="flex items-center gap-3 p-2 rounded-lg mb-2"
            style={{ background: premiumColor.gradient }}
          >
            {info.icon}
            <span className="font-bold text-white">
              {info.label}
            </span>
            <span className="text-white/80 text-sm">
              {PRICE_RATIOS[data.type]}倍
            </span>
          </div>
          <p className="text-xs text-slate-400">{info.desc}</p>
        </div>
      );
    }
  }
  return null;
};

function App() {
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const provinceList = useMemo(() => provinceData.map(p => p.name), []);
  
  const provinceInfo = useMemo(() => {
    return getProvinceData(selectedProvince);
  }, [selectedProvince]);

  const monthData = useMemo(() => {
    if (!provinceInfo) return null;
    return provinceInfo.months.find(m => m.month === selectedMonth);
  }, [provinceInfo, selectedMonth]);

  const chartData = useMemo(() => {
    if (!monthData) return [];
    return prepareChartData(monthData.timeSlots);
  }, [monthData]);

  // 统计各时段数量
  const timeSlotStats = useMemo(() => {
    if (!monthData) return {} as Record<PriceType, number>;
    const stats: Partial<Record<PriceType, number>> = {};
    monthData.timeSlots.forEach(slot => {
      const start = parseInt(slot.startTime.split(':')[0]);
      const end = parseInt(slot.endTime.split(':')[0]);
      let hours = end > start ? end - start : 24 - start + end;
      stats[slot.type] = (stats[slot.type] || 0) + hours;
    });
    return stats as Record<PriceType, number>;
  }, [monthData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative backdrop-blur-xl bg-slate-900/50 border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="relative p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/25 group hover:shadow-blue-500/40 transition-all duration-500">
              <Zap className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                全国分时电价查询系统
              </h1>
              <p className="text-sm text-slate-400 flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                数据时间：2026年2月 | 执行范围：电网代理购电工商业用户
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 选择器区域 */}
        <Card className="mb-8 backdrop-blur-xl bg-slate-800/40 border-slate-700/50 shadow-2xl shadow-black/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              选择查询条件
            </CardTitle>
            <CardDescription className="text-slate-400">
              请选择省份和月份查看分时电价信息
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  选择省份
                </label>
                <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                  <SelectTrigger className="w-full bg-slate-900/50 border-slate-600 text-white hover:border-blue-500 transition-colors">
                    <SelectValue placeholder="请选择省份" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {provinceList.map(province => (
                      <SelectItem 
                        key={province} 
                        value={province}
                        className="text-white hover:bg-slate-700 focus:bg-slate-700"
                      >
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  选择月份
                </label>
                <Select 
                  value={selectedMonth.toString()} 
                  onValueChange={(v) => setSelectedMonth(parseInt(v))}
                >
                  <SelectTrigger className="w-full bg-slate-900/50 border-slate-600 text-white hover:border-blue-500 transition-colors">
                    <SelectValue placeholder="请选择月份" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {monthOptions.map(month => (
                      <SelectItem 
                        key={month.value} 
                        value={month.value.toString()}
                        className="text-white hover:bg-slate-700 focus:bg-slate-700"
                      >
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 未选择省份提示 */}
        {!selectedProvince && (
          <Alert className="mb-8 backdrop-blur-xl bg-blue-900/20 border-blue-500/30">
            <Info className="h-5 w-5 text-blue-400" />
            <AlertDescription className="text-blue-200">
              请先选择省份和月份，系统将显示对应的分时电价信息
            </AlertDescription>
          </Alert>
        )}

        {/* 不执行分时电价的提示 */}
        {provinceInfo && !provinceInfo.hasTimeOfUsePricing && (
          <Alert className="mb-8 backdrop-blur-xl bg-amber-900/20 border-amber-500/30">
            <AlertCircle className="h-5 w-5 text-amber-400" />
            <AlertDescription className="text-amber-200">
              {provinceInfo.note || '该省份不执行分时电价政策'}
            </AlertDescription>
          </Alert>
        )}

        {/* 分时电价展示区域 */}
        {provinceInfo && provinceInfo.hasTimeOfUsePricing && monthData && (
          <div className="space-y-8">
            {/* 时段统计卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {(Object.keys(PRICE_RATIOS) as PriceType[]).map((type, index) => {
                const hours = timeSlotStats[type] || 0;
                if (hours === 0) return null;
                const premiumColor = PREMIUM_COLORS[type];
                return (
                  <Card 
                    key={type} 
                    className="backdrop-blur-xl bg-slate-800/40 border-slate-700/50 overflow-hidden group hover:scale-105 transition-all duration-300 cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div 
                      className="h-1.5 transition-all duration-500 group-hover:h-2"
                      style={{ background: premiumColor.gradient }}
                    />
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div 
                          className="w-4 h-4 rounded-full shadow-lg transition-all duration-300 group-hover:scale-125"
                          style={{ 
                            background: premiumColor.gradient,
                            boxShadow: premiumColor.glow
                          }}
                        />
                        <span className="text-sm font-medium text-slate-300">{type}</span>
                      </div>
                      <p className="text-3xl font-bold text-white mb-1">{hours}h</p>
                      <p className="text-xs text-slate-400">{PRICE_RATIOS[type]}倍基准</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* 柱状图 */}
            <Card className="backdrop-blur-xl bg-slate-800/40 border-slate-700/50 shadow-2xl shadow-black/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  24小时电价分布图
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {selectedProvince} · {selectedMonth}月 · 电价相对比例（以平段为基准1.0）
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[450px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart 
                      data={chartData} 
                      margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
                      onMouseMove={(e: any) => {
                        if (e && e.activeTooltipIndex !== undefined) {
                          setHoveredBar(e.activeTooltipIndex);
                        }
                      }}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      <defs>
                        {(Object.keys(PREMIUM_COLORS) as PriceType[]).map(type => (
                          <linearGradient key={type} id={`gradient-${type}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={PREMIUM_COLORS[type].main} stopOpacity={1} />
                            <stop offset="100%" stopColor={PREMIUM_COLORS[type].main} stopOpacity={0.3} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                      <XAxis 
                        dataKey="hour" 
                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                        interval={1}
                        axisLine={{ stroke: '#475569' }}
                      />
                      <YAxis 
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        domain={[0, 2]}
                        axisLine={{ stroke: '#475569' }}
                        label={{ value: '电价比例', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                      <ReferenceLine y={1} stroke="#22c55e" strokeDasharray="5 5" opacity={0.5} />
                      <Bar 
                        dataKey="value" 
                        radius={[6, 6, 0, 0]}
                        animationDuration={1500}
                        animationBegin={0}
                      >
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.type ? `url(#gradient-${entry.type})` : '#1e293b'}
                            stroke={entry.type ? PREMIUM_COLORS[entry.type as PriceType].main : 'transparent'}
                            strokeWidth={hoveredBar === index ? 2 : 0}
                            style={{
                              filter: hoveredBar === index && entry.type 
                                ? PREMIUM_COLORS[entry.type as PriceType].glow 
                                : 'none',
                              transition: 'all 0.3s ease'
                            }}
                          />
                        ))}
                      </Bar>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="none"
                        fill="url(#gradient-平段)"
                        opacity={0.1}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                
                {/* 图例 */}
                <div className="flex flex-wrap justify-center gap-6 mt-8">
                  {(Object.keys(PRICE_TYPE_INFO) as PriceType[]).map(type => (
                    <div 
                      key={type} 
                      className="flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-700/50 hover:border-slate-600 transition-colors cursor-pointer group"
                    >
                      <div 
                        className="w-4 h-4 rounded shadow-lg group-hover:scale-110 transition-transform"
                        style={{ 
                          background: PREMIUM_COLORS[type].gradient,
                          boxShadow: PREMIUM_COLORS[type].glow
                        }}
                      />
                      <span className="text-sm text-slate-300 font-medium">{PRICE_TYPE_INFO[type].label}</span>
                      <span className="text-xs text-slate-500">{PRICE_RATIOS[type]}倍</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 时段详情 */}
            <Card className="backdrop-blur-xl bg-slate-800/40 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  时段详情
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {selectedProvince} · {selectedMonth}月 · 各时段具体时间范围
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {(Object.keys(PRICE_RATIOS) as PriceType[]).map((type, index) => {
                    const slots = monthData.timeSlots.filter(s => s.type === type);
                    if (slots.length === 0) return null;
                    const premiumColor = PREMIUM_COLORS[type];
                    
                    return (
                      <div key={type} className="group">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge 
                            className="px-3 py-1 text-sm font-bold border-0"
                            style={{ 
                              background: premiumColor.gradient,
                              boxShadow: premiumColor.glow
                            }}
                          >
                            {PRICE_TYPE_INFO[type].label}
                          </Badge>
                          <span className="text-sm text-slate-400">
                            {PRICE_TYPE_INFO[type].desc}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 ml-2">
                          {slots.map((slot, idx) => (
                            <div 
                              key={idx}
                              className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/50 transition-all duration-300 group/item"
                            >
                              <div 
                                className="p-2 rounded-lg"
                                style={{ background: premiumColor.gradient }}
                              >
                                <Clock className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <span className="text-sm font-bold text-white">
                                  {slot.startTime} - {slot.endTime}
                                </span>
                                {slot.description && (
                                  <p className="text-xs text-slate-500 mt-0.5">{slot.description}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <Separator className="mt-6 bg-slate-700/50" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 说明信息 */}
        <Card className="mt-8 backdrop-blur-xl bg-slate-800/30 border-slate-700/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-white">
              <Info className="w-4 h-4 text-blue-400" />
              说明
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-slate-400 space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                数据来源于各省电网公司代理购电价格公告
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                电价比例为相对值，以平段电价为基准1.0
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                尖峰电价最高，深谷电价最低
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                部分省份在特定月份执行尖峰或深谷电价
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                具体电价金额请以当地电网公司公告为准
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="relative backdrop-blur-xl bg-slate-900/50 border-t border-slate-700/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">
              全国分时电价查询系统 · 数据更新时间：2026年2月
            </p>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Sun className="w-4 h-4" />
              <span>白天</span>
              <span className="mx-2">·</span>
              <Moon className="w-4 h-4" />
              <span>夜晚</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;