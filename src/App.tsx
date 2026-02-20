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
  ReferenceLine
} from 'recharts';
import { 
  Zap, 
  MapPin, 
  Info, 
  Clock,
  TrendingUp,
  TrendingDown,
  AlertCircle
} from 'lucide-react';

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
    icon: <TrendingDown className="w-4 h-4" />
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
      const color = PRICE_COLORS[data.type];
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{data.hour}</p>
          <div className="flex items-center gap-2 mt-1">
            <span 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: color }}
            />
            <span className="text-sm font-medium" style={{ color: color }}>
              {info.label}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">{info.desc}</p>
        </div>
      );
    }
  }
  return null;
};

function App() {
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">全国分时电价查询系统</h1>
              <p className="text-sm text-slate-500">数据时间：2026年2月 | 执行范围：电网代理购电工商业用户</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 选择器区域 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              选择查询条件
            </CardTitle>
            <CardDescription>请选择省份和月份查看分时电价信息</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  选择省份
                </label>
                <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="请选择省份" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinceList.map(province => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  选择月份
                </label>
                <Select 
                  value={selectedMonth.toString()} 
                  onValueChange={(v) => setSelectedMonth(parseInt(v))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="请选择月份" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map(month => (
                      <SelectItem key={month.value} value={month.value.toString()}>
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
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              请先选择省份和月份，系统将显示对应的分时电价信息
            </AlertDescription>
          </Alert>
        )}

        {/* 不执行分时电价的提示 */}
        {provinceInfo && !provinceInfo.hasTimeOfUsePricing && (
          <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {provinceInfo.note || '该省份不执行分时电价政策'}
            </AlertDescription>
          </Alert>
        )}

        {/* 分时电价展示区域 */}
        {provinceInfo && provinceInfo.hasTimeOfUsePricing && monthData && (
          <div className="space-y-6">
            {/* 时段统计 */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {(Object.keys(PRICE_RATIOS) as PriceType[]).map(type => {
                const hours = timeSlotStats[type] || 0;
                if (hours === 0) return null;
                return (
                  <Card key={type} className="overflow-hidden">
                    <div 
                      className="h-1" 
                      style={{ backgroundColor: PRICE_COLORS[type] }}
                    />
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: PRICE_COLORS[type] }}
                        />
                        <span className="text-sm font-medium text-slate-700">{type}</span>
                      </div>
                      <p className="text-2xl font-bold text-slate-900">{hours}h</p>
                      <p className="text-xs text-slate-500">{PRICE_RATIOS[type]}倍</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* 柱状图 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  24小时电价分布图
                </CardTitle>
                <CardDescription>
                  {selectedProvince} · {selectedMonth}月 · 电价相对比例（以平段为基准1.0）
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="hour" 
                        tick={{ fontSize: 12 }}
                        interval={1}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        domain={[0, 2]}
                        label={{ value: '电价比例', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <ReferenceLine y={1} stroke="#22c55e" strokeDasharray="3 3" />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.type ? PRICE_COLORS[entry.type] : '#e2e8f0'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                {/* 图例 */}
                <div className="flex flex-wrap justify-center gap-4 mt-6">
                  {(Object.keys(PRICE_TYPE_INFO) as PriceType[]).map(type => (
                    <div key={type} className="flex items-center gap-2">
                      <span 
                        className="w-4 h-4 rounded" 
                        style={{ backgroundColor: PRICE_COLORS[type] }}
                      />
                      <span className="text-sm text-slate-700">{PRICE_TYPE_INFO[type].label}</span>
                      <span className="text-xs text-slate-500">({PRICE_RATIOS[type]}倍)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 时段详情 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  时段详情
                </CardTitle>
                <CardDescription>
                  {selectedProvince} · {selectedMonth}月 · 各时段具体时间范围
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(Object.keys(PRICE_RATIOS) as PriceType[]).map(type => {
                    const slots = monthData.timeSlots.filter(s => s.type === type);
                    if (slots.length === 0) return null;
                    
                    return (
                      <div key={type}>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge 
                            style={{ 
                              backgroundColor: PRICE_COLORS[type],
                              color: 'white'
                            }}
                          >
                            {PRICE_TYPE_INFO[type].label}
                          </Badge>
                          <span className="text-sm text-slate-500">
                            {PRICE_TYPE_INFO[type].desc}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 ml-4">
                          {slots.map((slot, idx) => (
                            <div 
                              key={idx}
                              className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg"
                            >
                              <Clock className="w-4 h-4 text-slate-400" />
                              <span className="text-sm font-medium text-slate-700">
                                {slot.startTime} - {slot.endTime}
                              </span>
                            </div>
                          ))}
                        </div>
                        <Separator className="mt-4" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 说明信息 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Info className="w-4 h-4 text-blue-600" />
              说明
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-slate-600 space-y-2">
              <li>• 数据来源于各省电网公司代理购电价格公告</li>
              <li>• 电价比例为相对值，以平段电价为基准1.0</li>
              <li>• 尖峰电价最高，深谷电价最低</li>
              <li>• 部分省份在特定月份执行尖峰或深谷电价</li>
              <li>• 具体电价金额请以当地电网公司公告为准</li>
            </ul>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-slate-500">
            全国分时电价查询系统 · 数据更新时间：2026年2月
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
