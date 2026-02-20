// 全国31省份分时电价数据
// 数据时间：2026年2月
// 执行范围：电网代理购电工商业用户
// 电价类型（价格从高到低）：尖峰 > 高峰 > 平段 > 低谷 > 深谷

export type PriceType = '尖峰' | '高峰' | '平段' | '低谷' | '深谷';

export interface TimeSlot {
  type: PriceType;
  startTime: string;
  endTime: string;
  description?: string;
}

export interface MonthData {
  month: number;
  monthName: string;
  timeSlots: TimeSlot[];
  hasPeak?: boolean;
  hasDeepValley?: boolean;
}

export interface ProvinceData {
  name: string;
  hasTimeOfUsePricing: boolean;
  note?: string;
  months: MonthData[];
}

// 电价相对比例（用于柱状图高度）
export const PRICE_RATIOS: Record<PriceType, number> = {
  '尖峰': 1.8,
  '高峰': 1.5,
  '平段': 1.0,
  '低谷': 0.5,
  '深谷': 0.3,
};

// 电价颜色配置
export const PRICE_COLORS: Record<PriceType, string> = {
  '尖峰': '#ef4444',
  '高峰': '#f97316',
  '平段': '#22c55e',
  '低谷': '#3b82f6',
  '深谷': '#6366f1',
};

// 辅助函数：创建全年统一时段
const createYearRoundData = (timeSlots: TimeSlot[]): MonthData[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    monthName: `${i + 1}月`,
    hasPeak: timeSlots.some(t => t.type === '尖峰'),
    hasDeepValley: timeSlots.some(t => t.type === '深谷'),
    timeSlots: JSON.parse(JSON.stringify(timeSlots)),
  }));
};

// 31省份数据
export const provinceData: ProvinceData[] = [
  {
    name: '河南省',
    hasTimeOfUsePricing: true,
    months: [
      { month: 1, monthName: '1月', hasPeak: true, timeSlots: [{ type: '尖峰', startTime: '17:00', endTime: '19:00', description: '尖峰时段' }, { type: '高峰', startTime: '16:00', endTime: '24:00', description: '高峰时段（含尖峰）' }, { type: '平段', startTime: '07:00', endTime: '16:00', description: '其他时段' }, { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷时段' }] },
      { month: 2, monthName: '2月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '16:00', endTime: '24:00', description: '高峰时段' }, { type: '平段', startTime: '07:00', endTime: '16:00', description: '其他时段' }, { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷时段' }] },
      { month: 3, monthName: '3月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '16:00', endTime: '24:00', description: '高峰时段' }, { type: '平段', startTime: '06:00', endTime: '11:00', description: '平段上午' }, { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' }, { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' }, { type: '低谷', startTime: '11:00', endTime: '14:00', description: '低谷中午' }] },
      { month: 4, monthName: '4月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '16:00', endTime: '24:00', description: '高峰时段' }, { type: '平段', startTime: '06:00', endTime: '11:00', description: '平段上午' }, { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' }, { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' }, { type: '低谷', startTime: '11:00', endTime: '14:00', description: '低谷中午' }] },
      { month: 5, monthName: '5月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '16:00', endTime: '24:00', description: '高峰时段' }, { type: '平段', startTime: '06:00', endTime: '11:00', description: '平段上午' }, { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' }, { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' }, { type: '低谷', startTime: '11:00', endTime: '14:00', description: '低谷中午' }] },
      { month: 6, monthName: '6月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '16:00', endTime: '24:00', description: '高峰时段' }, { type: '平段', startTime: '07:00', endTime: '16:00', description: '其他时段' }, { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷时段' }] },
      { month: 7, monthName: '7月', hasPeak: true, timeSlots: [{ type: '尖峰', startTime: '20:00', endTime: '23:00', description: '尖峰时段' }, { type: '高峰', startTime: '16:00', endTime: '24:00', description: '高峰时段（含尖峰）' }, { type: '平段', startTime: '07:00', endTime: '16:00', description: '其他时段' }, { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷时段' }] },
      { month: 8, monthName: '8月', hasPeak: true, timeSlots: [{ type: '尖峰', startTime: '20:00', endTime: '23:00', description: '尖峰时段' }, { type: '高峰', startTime: '16:00', endTime: '24:00', description: '高峰时段（含尖峰）' }, { type: '平段', startTime: '07:00', endTime: '16:00', description: '其他时段' }, { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷时段' }] },
      { month: 9, monthName: '9月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '16:00', endTime: '24:00', description: '高峰时段' }, { type: '平段', startTime: '06:00', endTime: '11:00', description: '平段上午' }, { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' }, { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' }, { type: '低谷', startTime: '11:00', endTime: '14:00', description: '低谷中午' }] },
      { month: 10, monthName: '10月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '16:00', endTime: '24:00', description: '高峰时段' }, { type: '平段', startTime: '06:00', endTime: '11:00', description: '平段上午' }, { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' }, { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' }, { type: '低谷', startTime: '11:00', endTime: '14:00', description: '低谷中午' }] },
      { month: 11, monthName: '11月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '16:00', endTime: '24:00', description: '高峰时段' }, { type: '平段', startTime: '06:00', endTime: '11:00', description: '平段上午' }, { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' }, { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' }, { type: '低谷', startTime: '11:00', endTime: '14:00', description: '低谷中午' }] },
      { month: 12, monthName: '12月', hasPeak: true, timeSlots: [{ type: '尖峰', startTime: '17:00', endTime: '19:00', description: '尖峰时段' }, { type: '高峰', startTime: '16:00', endTime: '24:00', description: '高峰时段（含尖峰）' }, { type: '平段', startTime: '07:00', endTime: '16:00', description: '其他时段' }, { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷时段' }] },
    ]
  },
  {
    name: '云南省',
    hasTimeOfUsePricing: true,
    note: '尖峰暂缓执行',
    months: createYearRoundData([
      { type: '高峰', startTime: '07:00', endTime: '09:00', description: '高峰上午' },
      { type: '高峰', startTime: '18:00', endTime: '24:00', description: '高峰晚间' },
      { type: '平段', startTime: '00:00', endTime: '02:00', description: '平段凌晨' },
      { type: '平段', startTime: '06:00', endTime: '07:00', description: '平段早晨' },
      { type: '平段', startTime: '09:00', endTime: '12:00', description: '平段上午' },
      { type: '平段', startTime: '16:00', endTime: '18:00', description: '平段下午' },
      { type: '低谷', startTime: '02:00', endTime: '06:00', description: '低谷凌晨' },
      { type: '低谷', startTime: '12:00', endTime: '16:00', description: '低谷中午' },
    ])
  },
  {
    name: '江苏省',
    hasTimeOfUsePricing: true,
    months: [
      { month: 1, monthName: '1月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '14:00', endTime: '22:00', description: '高峰时段' }, { type: '平段', startTime: '06:00', endTime: '11:00', description: '平段上午' }, { type: '平段', startTime: '13:00', endTime: '14:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' }, { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' }] },
      { month: 2, monthName: '2月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '14:00', endTime: '22:00', description: '高峰时段' }, { type: '平段', startTime: '06:00', endTime: '11:00', description: '平段上午' }, { type: '平段', startTime: '13:00', endTime: '14:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' }, { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' }] },
      { month: 3, monthName: '3月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '15:00', endTime: '22:00', description: '高峰时段' }, { type: '平段', startTime: '06:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '14:00', endTime: '15:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '02:00', description: '平段晚间' }, { type: '低谷', startTime: '02:00', endTime: '06:00', description: '低谷凌晨' }, { type: '低谷', startTime: '10:00', endTime: '14:00', description: '低谷中午' }] },
      { month: 4, monthName: '4月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '15:00', endTime: '22:00', description: '高峰时段' }, { type: '平段', startTime: '06:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '14:00', endTime: '15:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '02:00', description: '平段晚间' }, { type: '低谷', startTime: '02:00', endTime: '06:00', description: '低谷凌晨' }, { type: '低谷', startTime: '10:00', endTime: '14:00', description: '低谷中午' }] },
      { month: 5, monthName: '5月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '15:00', endTime: '22:00', description: '高峰时段' }, { type: '平段', startTime: '06:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '14:00', endTime: '15:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '02:00', description: '平段晚间' }, { type: '低谷', startTime: '02:00', endTime: '06:00', description: '低谷凌晨' }, { type: '低谷', startTime: '10:00', endTime: '14:00', description: '低谷中午' }] },
      { month: 6, monthName: '6月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '14:00', endTime: '22:00', description: '高峰时段' }, { type: '平段', startTime: '06:00', endTime: '11:00', description: '平段上午' }, { type: '平段', startTime: '13:00', endTime: '14:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' }, { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' }] },
      { month: 7, monthName: '7月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '14:00', endTime: '22:00', description: '高峰时段' }, { type: '平段', startTime: '06:00', endTime: '11:00', description: '平段上午' }, { type: '平段', startTime: '13:00', endTime: '14:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' }, { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' }] },
      { month: 8, monthName: '8月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '14:00', endTime: '22:00', description: '高峰时段' }, { type: '平段', startTime: '06:00', endTime: '11:00', description: '平段上午' }, { type: '平段', startTime: '13:00', endTime: '14:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' }, { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' }] },
      { month: 9, monthName: '9月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '15:00', endTime: '22:00', description: '高峰时段' }, { type: '平段', startTime: '06:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '14:00', endTime: '15:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '02:00', description: '平段晚间' }, { type: '低谷', startTime: '02:00', endTime: '06:00', description: '低谷凌晨' }, { type: '低谷', startTime: '10:00', endTime: '14:00', description: '低谷中午' }] },
      { month: 10, monthName: '10月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '15:00', endTime: '22:00', description: '高峰时段' }, { type: '平段', startTime: '06:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '14:00', endTime: '15:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '02:00', description: '平段晚间' }, { type: '低谷', startTime: '02:00', endTime: '06:00', description: '低谷凌晨' }, { type: '低谷', startTime: '10:00', endTime: '14:00', description: '低谷中午' }] },
      { month: 11, monthName: '11月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '15:00', endTime: '22:00', description: '高峰时段' }, { type: '平段', startTime: '06:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '14:00', endTime: '15:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '02:00', description: '平段晚间' }, { type: '低谷', startTime: '02:00', endTime: '06:00', description: '低谷凌晨' }, { type: '低谷', startTime: '10:00', endTime: '14:00', description: '低谷中午' }] },
      { month: 12, monthName: '12月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '14:00', endTime: '22:00', description: '高峰时段' }, { type: '平段', startTime: '06:00', endTime: '11:00', description: '平段上午' }, { type: '平段', startTime: '13:00', endTime: '14:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' }, { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' }] },
    ]
  },
  {
    name: '安徽省',
    hasTimeOfUsePricing: true,
    months: [
      { month: 1, monthName: '1月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '16:00', endTime: '24:00', description: '高峰时段' }, { type: '平段', startTime: '09:00', endTime: '11:00', description: '平段上午' }, { type: '平段', startTime: '13:00', endTime: '16:00', description: '平段下午' }, { type: '低谷', startTime: '02:00', endTime: '09:00', description: '低谷凌晨' }, { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' }] },
      { month: 2, monthName: '2月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '06:00', endTime: '08:00', description: '高峰早晨' }, { type: '高峰', startTime: '16:00', endTime: '22:00', description: '高峰晚间' }, { type: '平段', startTime: '08:00', endTime: '11:00', description: '平段上午' }, { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '11:00', endTime: '14:00', description: '低谷中午' }, { type: '低谷', startTime: '23:00', endTime: '06:00', description: '低谷凌晨' }] },
      { month: 3, monthName: '3月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '06:00', endTime: '08:00', description: '高峰早晨' }, { type: '高峰', startTime: '16:00', endTime: '22:00', description: '高峰晚间' }, { type: '平段', startTime: '08:00', endTime: '11:00', description: '平段上午' }, { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '11:00', endTime: '14:00', description: '低谷中午' }, { type: '低谷', startTime: '23:00', endTime: '06:00', description: '低谷凌晨' }] },
      { month: 4, monthName: '4月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '06:00', endTime: '08:00', description: '高峰早晨' }, { type: '高峰', startTime: '16:00', endTime: '22:00', description: '高峰晚间' }, { type: '平段', startTime: '08:00', endTime: '11:00', description: '平段上午' }, { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '11:00', endTime: '14:00', description: '低谷中午' }, { type: '低谷', startTime: '23:00', endTime: '06:00', description: '低谷凌晨' }] },
      { month: 5, monthName: '5月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '06:00', endTime: '08:00', description: '高峰早晨' }, { type: '高峰', startTime: '16:00', endTime: '22:00', description: '高峰晚间' }, { type: '平段', startTime: '08:00', endTime: '11:00', description: '平段上午' }, { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '11:00', endTime: '14:00', description: '低谷中午' }, { type: '低谷', startTime: '23:00', endTime: '06:00', description: '低谷凌晨' }] },
      { month: 6, monthName: '6月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '06:00', endTime: '08:00', description: '高峰早晨' }, { type: '高峰', startTime: '16:00', endTime: '22:00', description: '高峰晚间' }, { type: '平段', startTime: '08:00', endTime: '11:00', description: '平段上午' }, { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '11:00', endTime: '14:00', description: '低谷中午' }, { type: '低谷', startTime: '23:00', endTime: '06:00', description: '低谷凌晨' }] },
      { month: 7, monthName: '7月', hasPeak: true, timeSlots: [{ type: '尖峰', startTime: '20:00', endTime: '22:00', description: '尖峰时段' }, { type: '高峰', startTime: '16:00', endTime: '24:00', description: '高峰时段' }, { type: '平段', startTime: '09:00', endTime: '11:00', description: '平段上午' }, { type: '平段', startTime: '13:00', endTime: '16:00', description: '平段下午' }, { type: '低谷', startTime: '02:00', endTime: '09:00', description: '低谷凌晨' }, { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' }] },
      { month: 8, monthName: '8月', hasPeak: true, timeSlots: [{ type: '尖峰', startTime: '20:00', endTime: '22:00', description: '尖峰时段' }, { type: '高峰', startTime: '16:00', endTime: '24:00', description: '高峰时段' }, { type: '平段', startTime: '09:00', endTime: '11:00', description: '平段上午' }, { type: '平段', startTime: '13:00', endTime: '16:00', description: '平段下午' }, { type: '低谷', startTime: '02:00', endTime: '09:00', description: '低谷凌晨' }, { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' }] },
      { month: 9, monthName: '9月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '06:00', endTime: '08:00', description: '高峰早晨' }, { type: '高峰', startTime: '16:00', endTime: '22:00', description: '高峰晚间' }, { type: '平段', startTime: '08:00', endTime: '11:00', description: '平段上午' }, { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '11:00', endTime: '14:00', description: '低谷中午' }, { type: '低谷', startTime: '23:00', endTime: '06:00', description: '低谷凌晨' }] },
      { month: 10, monthName: '10月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '06:00', endTime: '08:00', description: '高峰早晨' }, { type: '高峰', startTime: '16:00', endTime: '22:00', description: '高峰晚间' }, { type: '平段', startTime: '08:00', endTime: '11:00', description: '平段上午' }, { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '11:00', endTime: '14:00', description: '低谷中午' }, { type: '低谷', startTime: '23:00', endTime: '06:00', description: '低谷凌晨' }] },
      { month: 11, monthName: '11月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '06:00', endTime: '08:00', description: '高峰早晨' }, { type: '高峰', startTime: '16:00', endTime: '22:00', description: '高峰晚间' }, { type: '平段', startTime: '08:00', endTime: '11:00', description: '平段上午' }, { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '11:00', endTime: '14:00', description: '低谷中午' }, { type: '低谷', startTime: '23:00', endTime: '06:00', description: '低谷凌晨' }] },
      { month: 12, monthName: '12月', hasPeak: true, timeSlots: [{ type: '尖峰', startTime: '19:00', endTime: '21:00', description: '尖峰时段' }, { type: '高峰', startTime: '16:00', endTime: '24:00', description: '高峰时段' }, { type: '平段', startTime: '09:00', endTime: '11:00', description: '平段上午' }, { type: '平段', startTime: '13:00', endTime: '16:00', description: '平段下午' }, { type: '低谷', startTime: '02:00', endTime: '09:00', description: '低谷凌晨' }, { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' }] },
    ]
  },
  // 继续添加更多省份...
  {
    name: '广东省（珠三角五市）',
    hasTimeOfUsePricing: true,
    months: [
      { month: 1, monthName: '1月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' }, { type: '高峰', startTime: '14:00', endTime: '19:00', description: '高峰下午' }, { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' }] },
      { month: 2, monthName: '2月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' }, { type: '高峰', startTime: '14:00', endTime: '19:00', description: '高峰下午' }, { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' }] },
      { month: 3, monthName: '3月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' }, { type: '高峰', startTime: '14:00', endTime: '19:00', description: '高峰下午' }, { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' }] },
      { month: 4, monthName: '4月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' }, { type: '高峰', startTime: '14:00', endTime: '19:00', description: '高峰下午' }, { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' }] },
      { month: 5, monthName: '5月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' }, { type: '高峰', startTime: '14:00', endTime: '19:00', description: '高峰下午' }, { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' }] },
      { month: 6, monthName: '6月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' }, { type: '高峰', startTime: '14:00', endTime: '19:00', description: '高峰下午' }, { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' }] },
      { month: 7, monthName: '7月', hasPeak: true, timeSlots: [{ type: '尖峰', startTime: '11:00', endTime: '12:00', description: '尖峰时段1' }, { type: '尖峰', startTime: '15:00', endTime: '17:00', description: '尖峰时段2' }, { type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' }, { type: '高峰', startTime: '14:00', endTime: '19:00', description: '高峰下午' }, { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' }] },
      { month: 8, monthName: '8月', hasPeak: true, timeSlots: [{ type: '尖峰', startTime: '11:00', endTime: '12:00', description: '尖峰时段1' }, { type: '尖峰', startTime: '15:00', endTime: '17:00', description: '尖峰时段2' }, { type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' }, { type: '高峰', startTime: '14:00', endTime: '19:00', description: '高峰下午' }, { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' }] },
      { month: 9, monthName: '9月', hasPeak: true, timeSlots: [{ type: '尖峰', startTime: '11:00', endTime: '12:00', description: '尖峰时段1' }, { type: '尖峰', startTime: '15:00', endTime: '17:00', description: '尖峰时段2' }, { type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' }, { type: '高峰', startTime: '14:00', endTime: '19:00', description: '高峰下午' }, { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' }] },
      { month: 10, monthName: '10月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' }, { type: '高峰', startTime: '14:00', endTime: '19:00', description: '高峰下午' }, { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' }] },
      { month: 11, monthName: '11月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' }, { type: '高峰', startTime: '14:00', endTime: '19:00', description: '高峰下午' }, { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' }] },
      { month: 12, monthName: '12月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' }, { type: '高峰', startTime: '14:00', endTime: '19:00', description: '高峰下午' }, { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' }] },
    ]
  },
  {
    name: '深圳市',
    hasTimeOfUsePricing: true,
    months: [
      { month: 1, monthName: '1月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' }, { type: '高峰', startTime: '14:00', endTime: '19:00', description: '高峰下午' }, { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' }] },
      { month: 2, monthName: '2月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' }, { type: '高峰', startTime: '14:00', endTime: '19:00', description: '高峰下午' }, { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' }] },
      { month: 3, monthName: '3月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' }, { type: '高峰', startTime: '14:00', endTime: '19:00', description: '高峰下午' }, { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' }] },
      { month: 4, monthName: '4月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' }, { type: '高峰', startTime: '14:00', endTime: '19:00', description: '高峰下午' }, { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' }] },
      { month: 5, monthName: '5月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' }, { type: '高峰', startTime: '14:00', endTime: '19:00', description: '高峰下午' }, { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' }] },
      { month: 6, monthName: '6月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' }, { type: '高峰', startTime: '14:00', endTime: '19:00', description: '高峰下午' }, { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' }] },
      { month: 7, monthName: '7月', hasPeak: true, timeSlots: [{ type: '尖峰', startTime: '11:00', endTime: '12:00', description: '尖峰时段1' }, { type: '尖峰', startTime: '15:00', endTime: '17:00', description: '尖峰时段2' }, { type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' }, { type: '高峰', startTime: '14:00', endTime: '19:00', description: '高峰下午' }, { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' }] },
      { month: 8, monthName: '8月', hasPeak: true, timeSlots: [{ type: '尖峰', startTime: '11:00', endTime: '12:00', description: '尖峰时段1' }, { type: '尖峰', startTime: '15:00', endTime: '17:00', description: '尖峰时段2' }, { type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' }, { type: '高峰', startTime: '14:00', endTime: '19:00', description: '高峰下午' }, { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' }] },
      { month: 9, monthName: '9月', hasPeak: true, timeSlots: [{ type: '尖峰', startTime: '11:00', endTime: '12:00', description: '尖峰时段1' }, { type: '尖峰', startTime: '15:00', endTime: '17:00', description: '尖峰时段2' }, { type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' }, { type: '高峰', startTime: '14:00', endTime: '19:00', description: '高峰下午' }, { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' }] },
      { month: 10, monthName: '10月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' }, { type: '高峰', startTime: '14:00', endTime: '19:00', description: '高峰下午' }, { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' }] },
      { month: 11, monthName: '11月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' }, { type: '高峰', startTime: '14:00', endTime: '19:00', description: '高峰下午' }, { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' }] },
      { month: 12, monthName: '12月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' }, { type: '高峰', startTime: '14:00', endTime: '19:00', description: '高峰下午' }, { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' }] },
    ]
  },
  {
    name: '山东省',
    hasTimeOfUsePricing: true,
    months: [
      { month: 1, monthName: '1月', hasPeak: true, timeSlots: [{ type: '尖峰', startTime: '17:00', endTime: '22:00', description: '尖峰时段' }, { type: '高峰', startTime: '17:00', endTime: '22:00', description: '高峰时段' }, { type: '平段', startTime: '07:00', endTime: '09:00', description: '平段上午' }, { type: '平段', startTime: '16:00', endTime: '17:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '02:00', endTime: '07:00', description: '低谷凌晨' }, { type: '低谷', startTime: '09:00', endTime: '16:00', description: '低谷白天' }] },
      { month: 2, monthName: '2月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '16:00', endTime: '21:00', description: '高峰时段' }, { type: '平段', startTime: '07:00', endTime: '09:00', description: '平段上午' }, { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' }, { type: '平段', startTime: '21:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '02:00', endTime: '07:00', description: '低谷凌晨' }, { type: '低谷', startTime: '09:00', endTime: '14:00', description: '低谷白天' }] },
      { month: 3, monthName: '3月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '16:00', endTime: '21:00', description: '高峰时段' }, { type: '平段', startTime: '07:00', endTime: '09:00', description: '平段上午' }, { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' }, { type: '平段', startTime: '21:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '02:00', endTime: '07:00', description: '低谷凌晨' }, { type: '低谷', startTime: '09:00', endTime: '14:00', description: '低谷白天' }] },
      { month: 4, monthName: '4月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '16:00', endTime: '21:00', description: '高峰时段' }, { type: '平段', startTime: '07:00', endTime: '09:00', description: '平段上午' }, { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' }, { type: '平段', startTime: '21:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '02:00', endTime: '07:00', description: '低谷凌晨' }, { type: '低谷', startTime: '09:00', endTime: '14:00', description: '低谷白天' }] },
      { month: 5, monthName: '5月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '16:00', endTime: '21:00', description: '高峰时段' }, { type: '平段', startTime: '07:00', endTime: '09:00', description: '平段上午' }, { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' }, { type: '平段', startTime: '21:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '02:00', endTime: '07:00', description: '低谷凌晨' }, { type: '低谷', startTime: '09:00', endTime: '14:00', description: '低谷白天' }] },
      { month: 6, monthName: '6月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '16:00', endTime: '21:00', description: '高峰时段' }, { type: '平段', startTime: '07:00', endTime: '09:00', description: '平段上午' }, { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' }, { type: '平段', startTime: '21:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '02:00', endTime: '07:00', description: '低谷凌晨' }, { type: '低谷', startTime: '09:00', endTime: '14:00', description: '低谷白天' }] },
      { month: 7, monthName: '7月', hasPeak: true, timeSlots: [{ type: '尖峰', startTime: '17:00', endTime: '22:00', description: '尖峰时段' }, { type: '高峰', startTime: '17:00', endTime: '22:00', description: '高峰时段' }, { type: '平段', startTime: '07:00', endTime: '09:00', description: '平段上午' }, { type: '平段', startTime: '16:00', endTime: '17:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '02:00', endTime: '07:00', description: '低谷凌晨' }, { type: '低谷', startTime: '09:00', endTime: '16:00', description: '低谷白天' }] },
      { month: 8, monthName: '8月', hasPeak: true, timeSlots: [{ type: '尖峰', startTime: '17:00', endTime: '22:00', description: '尖峰时段' }, { type: '高峰', startTime: '17:00', endTime: '22:00', description: '高峰时段' }, { type: '平段', startTime: '07:00', endTime: '09:00', description: '平段上午' }, { type: '平段', startTime: '16:00', endTime: '17:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '02:00', endTime: '07:00', description: '低谷凌晨' }, { type: '低谷', startTime: '09:00', endTime: '16:00', description: '低谷白天' }] },
      { month: 9, monthName: '9月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '16:00', endTime: '21:00', description: '高峰时段' }, { type: '平段', startTime: '07:00', endTime: '09:00', description: '平段上午' }, { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' }, { type: '平段', startTime: '21:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '02:00', endTime: '07:00', description: '低谷凌晨' }, { type: '低谷', startTime: '09:00', endTime: '14:00', description: '低谷白天' }] },
      { month: 10, monthName: '10月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '16:00', endTime: '21:00', description: '高峰时段' }, { type: '平段', startTime: '07:00', endTime: '09:00', description: '平段上午' }, { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' }, { type: '平段', startTime: '21:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '02:00', endTime: '07:00', description: '低谷凌晨' }, { type: '低谷', startTime: '09:00', endTime: '14:00', description: '低谷白天' }] },
      { month: 11, monthName: '11月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '16:00', endTime: '21:00', description: '高峰时段' }, { type: '平段', startTime: '07:00', endTime: '09:00', description: '平段上午' }, { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' }, { type: '平段', startTime: '21:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '02:00', endTime: '07:00', description: '低谷凌晨' }, { type: '低谷', startTime: '09:00', endTime: '14:00', description: '低谷白天' }] },
      { month: 12, monthName: '12月', hasPeak: true, timeSlots: [{ type: '尖峰', startTime: '17:00', endTime: '22:00', description: '尖峰时段' }, { type: '高峰', startTime: '17:00', endTime: '22:00', description: '高峰时段' }, { type: '平段', startTime: '07:00', endTime: '09:00', description: '平段上午' }, { type: '平段', startTime: '16:00', endTime: '17:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '02:00', endTime: '07:00', description: '低谷凌晨' }, { type: '低谷', startTime: '09:00', endTime: '16:00', description: '低谷白天' }] },
    ]
  },
  {
    name: '山西省',
    hasTimeOfUsePricing: true,
    months: [
      { month: 1, monthName: '1月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '17:00', endTime: '23:00', description: '高峰时段' }, { type: '平段', startTime: '07:00', endTime: '08:00', description: '平段早晨' }, { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' }, { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷凌晨' }, { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' }] },
      { month: 2, monthName: '2月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' }, { type: '高峰', startTime: '17:00', endTime: '23:00', description: '高峰晚间' }, { type: '平段', startTime: '07:00', endTime: '08:00', description: '平段早晨' }, { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' }, { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷凌晨' }, { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' }] },
      { month: 3, monthName: '3月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' }, { type: '高峰', startTime: '17:00', endTime: '23:00', description: '高峰晚间' }, { type: '平段', startTime: '07:00', endTime: '08:00', description: '平段早晨' }, { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' }, { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷凌晨' }, { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' }] },
      { month: 4, monthName: '4月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' }, { type: '高峰', startTime: '17:00', endTime: '23:00', description: '高峰晚间' }, { type: '平段', startTime: '07:00', endTime: '08:00', description: '平段早晨' }, { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' }, { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷凌晨' }, { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' }] },
      { month: 5, monthName: '5月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' }, { type: '高峰', startTime: '17:00', endTime: '23:00', description: '高峰晚间' }, { type: '平段', startTime: '07:00', endTime: '08:00', description: '平段早晨' }, { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' }, { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷凌晨' }, { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' }] },
      { month: 6, monthName: '6月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' }, { type: '高峰', startTime: '17:00', endTime: '23:00', description: '高峰晚间' }, { type: '平段', startTime: '07:00', endTime: '08:00', description: '平段早晨' }, { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' }, { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷凌晨' }, { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' }] },
      { month: 7, monthName: '7月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' }, { type: '高峰', startTime: '17:00', endTime: '23:00', description: '高峰晚间' }, { type: '平段', startTime: '07:00', endTime: '08:00', description: '平段早晨' }, { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' }, { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷凌晨' }, { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' }] },
      { month: 8, monthName: '8月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' }, { type: '高峰', startTime: '17:00', endTime: '23:00', description: '高峰晚间' }, { type: '平段', startTime: '07:00', endTime: '08:00', description: '平段早晨' }, { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' }, { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷凌晨' }, { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' }] },
      { month: 9, monthName: '9月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' }, { type: '高峰', startTime: '17:00', endTime: '23:00', description: '高峰晚间' }, { type: '平段', startTime: '07:00', endTime: '08:00', description: '平段早晨' }, { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' }, { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷凌晨' }, { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' }] },
      { month: 10, monthName: '10月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' }, { type: '高峰', startTime: '17:00', endTime: '23:00', description: '高峰晚间' }, { type: '平段', startTime: '07:00', endTime: '08:00', description: '平段早晨' }, { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' }, { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷凌晨' }, { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' }] },
      { month: 11, monthName: '11月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' }, { type: '高峰', startTime: '17:00', endTime: '23:00', description: '高峰晚间' }, { type: '平段', startTime: '07:00', endTime: '08:00', description: '平段早晨' }, { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' }, { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷凌晨' }, { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' }] },
      { month: 12, monthName: '12月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '17:00', endTime: '23:00', description: '高峰时段' }, { type: '平段', startTime: '07:00', endTime: '08:00', description: '平段早晨' }, { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' }, { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段晚间' }, { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷凌晨' }, { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' }] },
    ]
  },
  {
    name: '北京市',
    hasTimeOfUsePricing: true,
    months: [
      { month: 1, monthName: '1月', hasPeak: true, timeSlots: [{ type: '尖峰', startTime: '18:00', endTime: '21:00', description: '尖峰时段' }, { type: '高峰', startTime: '10:00', endTime: '13:00', description: '高峰上午' }, { type: '高峰', startTime: '17:00', endTime: '22:00', description: '高峰晚间' }, { type: '平段', startTime: '07:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '23:00', endTime: '07:00', description: '低谷时段' }] },
      { month: 2, monthName: '2月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '10:00', endTime: '13:00', description: '高峰上午' }, { type: '高峰', startTime: '17:00', endTime: '22:00', description: '高峰晚间' }, { type: '平段', startTime: '07:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '23:00', endTime: '07:00', description: '低谷时段' }] },
      { month: 3, monthName: '3月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '10:00', endTime: '13:00', description: '高峰上午' }, { type: '高峰', startTime: '17:00', endTime: '22:00', description: '高峰晚间' }, { type: '平段', startTime: '07:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '23:00', endTime: '07:00', description: '低谷时段' }] },
      { month: 4, monthName: '4月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '10:00', endTime: '13:00', description: '高峰上午' }, { type: '高峰', startTime: '17:00', endTime: '22:00', description: '高峰晚间' }, { type: '平段', startTime: '07:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '23:00', endTime: '07:00', description: '低谷时段' }] },
      { month: 5, monthName: '5月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '10:00', endTime: '13:00', description: '高峰上午' }, { type: '高峰', startTime: '17:00', endTime: '22:00', description: '高峰晚间' }, { type: '平段', startTime: '07:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '23:00', endTime: '07:00', description: '低谷时段' }] },
      { month: 6, monthName: '6月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '10:00', endTime: '13:00', description: '高峰上午' }, { type: '高峰', startTime: '17:00', endTime: '22:00', description: '高峰晚间' }, { type: '平段', startTime: '07:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '23:00', endTime: '07:00', description: '低谷时段' }] },
      { month: 7, monthName: '7月', hasPeak: true, timeSlots: [{ type: '尖峰', startTime: '11:00', endTime: '13:00', description: '尖峰时段1' }, { type: '尖峰', startTime: '16:00', endTime: '17:00', description: '尖峰时段2' }, { type: '高峰', startTime: '10:00', endTime: '13:00', description: '高峰上午' }, { type: '高峰', startTime: '17:00', endTime: '22:00', description: '高峰晚间' }, { type: '平段', startTime: '07:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '23:00', endTime: '07:00', description: '低谷时段' }] },
      { month: 8, monthName: '8月', hasPeak: true, timeSlots: [{ type: '尖峰', startTime: '11:00', endTime: '13:00', description: '尖峰时段1' }, { type: '尖峰', startTime: '16:00', endTime: '17:00', description: '尖峰时段2' }, { type: '高峰', startTime: '10:00', endTime: '13:00', description: '高峰上午' }, { type: '高峰', startTime: '17:00', endTime: '22:00', description: '高峰晚间' }, { type: '平段', startTime: '07:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '23:00', endTime: '07:00', description: '低谷时段' }] },
      { month: 9, monthName: '9月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '10:00', endTime: '13:00', description: '高峰上午' }, { type: '高峰', startTime: '17:00', endTime: '22:00', description: '高峰晚间' }, { type: '平段', startTime: '07:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '23:00', endTime: '07:00', description: '低谷时段' }] },
      { month: 10, monthName: '10月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '10:00', endTime: '13:00', description: '高峰上午' }, { type: '高峰', startTime: '17:00', endTime: '22:00', description: '高峰晚间' }, { type: '平段', startTime: '07:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '23:00', endTime: '07:00', description: '低谷时段' }] },
      { month: 11, monthName: '11月', hasPeak: false, timeSlots: [{ type: '高峰', startTime: '10:00', endTime: '13:00', description: '高峰上午' }, { type: '高峰', startTime: '17:00', endTime: '22:00', description: '高峰晚间' }, { type: '平段', startTime: '07:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '23:00', endTime: '07:00', description: '低谷时段' }] },
      { month: 12, monthName: '12月', hasPeak: true, timeSlots: [{ type: '尖峰', startTime: '18:00', endTime: '21:00', description: '尖峰时段' }, { type: '高峰', startTime: '10:00', endTime: '13:00', description: '高峰上午' }, { type: '高峰', startTime: '17:00', endTime: '22:00', description: '高峰晚间' }, { type: '平段', startTime: '07:00', endTime: '10:00', description: '平段上午' }, { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' }, { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' }, { type: '低谷', startTime: '23:00', endTime: '07:00', description: '低谷时段' }] },
    ]
  },
  // 不执行分时电价的省份
  {
    name: '西藏自治区',
    hasTimeOfUsePricing: false,
    note: '全区执行统一电价，不实行分时电价政策',
    months: []
  },
  {
    name: '重庆市',
    hasTimeOfUsePricing: false,
    note: '不实行分时电价政策',
    months: []
  },
  {
    name: '广西壮族自治区',
    hasTimeOfUsePricing: false,
    note: '不实行分时电价政策',
    months: []
  },
  {
    name: '辽宁省',
    hasTimeOfUsePricing: false,
    note: '2025年3月1日起开展电力现货市场连续结算试运行，实际购电价格按市场价格结算，不执行固定分时电价',
    months: []
  },
];

// 获取省份列表
export const getProvinceList = (): string[] => {
  return provinceData.map(p => p.name);
};

// 获取省份数据
export const getProvinceData = (provinceName: string): ProvinceData | undefined => {
  return provinceData.find(p => p.name === provinceName);
};

// 获取月份数据
export const getMonthData = (provinceName: string, month: number): MonthData | undefined => {
  const province = getProvinceData(provinceName);
  if (!province) return undefined;
  return province.months.find(m => m.month === month);
};

// 获取所有月份选项
export const monthOptions = [
  { value: 1, label: '1月' },
  { value: 2, label: '2月' },
  { value: 3, label: '3月' },
  { value: 4, label: '4月' },
  { value: 5, label: '5月' },
  { value: 6, label: '6月' },
  { value: 7, label: '7月' },
  { value: 8, label: '8月' },
  { value: 9, label: '9月' },
  { value: 10, label: '10月' },
  { value: 11, label: '11月' },
  { value: 12, label: '12月' },
];
