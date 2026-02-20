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

// 辅助函数：创建月份数据
const createMonthData = (configs: Array<{months: number[], slots: TimeSlot[]}>): MonthData[] => {
  const result: MonthData[] = [];
  for (let m = 1; m <= 12; m++) {
    const config = configs.find(c => c.months.includes(m));
    if (config) {
      result.push({
        month: m,
        monthName: `${m}月`,
        hasPeak: config.slots.some(s => s.type === '尖峰'),
        hasDeepValley: config.slots.some(s => s.type === '深谷'),
        timeSlots: JSON.parse(JSON.stringify(config.slots)),
      });
    }
  }
  return result;
};

// 1. 河南省 - 高峰含尖峰，尖峰时段单独标注
// 1,2,12月: 高峰16-24(含尖峰17-19), 低谷0-7, 平段7-16
// 3-5,9-11月: 高峰16-24, 低谷0-6+11-14, 平段6-11+14-16
// 6-8月: 高峰16-24(含尖峰20-23), 低谷0-7, 平段7-16
const henanSlots = {
  winter: [
    { type: '高峰', startTime: '16:00', endTime: '17:00', description: '高峰时段' },
    { type: '尖峰', startTime: '17:00', endTime: '19:00', description: '尖峰时段' },
    { type: '高峰', startTime: '19:00', endTime: '24:00', description: '高峰时段' },
    { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷时段' },
    { type: '平段', startTime: '07:00', endTime: '16:00', description: '平段' },
  ] as TimeSlot[],
  springAutumn: [
    { type: '高峰', startTime: '16:00', endTime: '24:00', description: '高峰时段' },
    { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' },
    { type: '低谷', startTime: '11:00', endTime: '14:00', description: '低谷中午' },
    { type: '平段', startTime: '06:00', endTime: '11:00', description: '平段上午' },
    { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' },
  ] as TimeSlot[],
  summer: [
    { type: '高峰', startTime: '16:00', endTime: '20:00', description: '高峰时段' },
    { type: '尖峰', startTime: '20:00', endTime: '23:00', description: '尖峰时段' },
    { type: '高峰', startTime: '23:00', endTime: '24:00', description: '高峰时段' },
    { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷时段' },
    { type: '平段', startTime: '07:00', endTime: '16:00', description: '平段' },
  ] as TimeSlot[],
};

// 2. 云南省 - 全年统一
const yunnanSlots = [
  { type: '高峰', startTime: '07:00', endTime: '09:00', description: '高峰上午' },
  { type: '高峰', startTime: '18:00', endTime: '24:00', description: '高峰晚间' },
  { type: '平段', startTime: '00:00', endTime: '02:00', description: '平段凌晨' },
  { type: '平段', startTime: '06:00', endTime: '07:00', description: '平段早晨' },
  { type: '平段', startTime: '09:00', endTime: '12:00', description: '平段上午' },
  { type: '平段', startTime: '16:00', endTime: '18:00', description: '平段下午' },
  { type: '低谷', startTime: '02:00', endTime: '06:00', description: '低谷凌晨' },
  { type: '低谷', startTime: '12:00', endTime: '16:00', description: '低谷中午' },
] as TimeSlot[];

// 3. 江苏省
const jiangsuSlots = {
  summerWinter: [
    { type: '高峰', startTime: '14:00', endTime: '22:00', description: '高峰时段' },
    { type: '平段', startTime: '06:00', endTime: '11:00', description: '平段上午' },
    { type: '平段', startTime: '13:00', endTime: '14:00', description: '平段下午' },
    { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段深夜' },
    { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' },
    { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' },
  ] as TimeSlot[],
  springAutumn: [
    { type: '高峰', startTime: '15:00', endTime: '22:00', description: '高峰时段' },
    { type: '平段', startTime: '06:00', endTime: '10:00', description: '平段上午' },
    { type: '平段', startTime: '14:00', endTime: '15:00', description: '平段下午' },
    { type: '平段', startTime: '22:00', endTime: '02:00', description: '平段深夜' },
    { type: '低谷', startTime: '02:00', endTime: '06:00', description: '低谷凌晨' },
    { type: '低谷', startTime: '10:00', endTime: '14:00', description: '低谷中午' },
  ] as TimeSlot[],
};

// 4. 安徽省
const anhuiSlots = {
  special: [
    { type: '高峰', startTime: '16:00', endTime: '24:00', description: '高峰时段' },
    { type: '平段', startTime: '09:00', endTime: '11:00', description: '平段上午' },
    { type: '平段', startTime: '13:00', endTime: '16:00', description: '平段下午' },
    { type: '低谷', startTime: '02:00', endTime: '09:00', description: '低谷凌晨' },
    { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' },
  ] as TimeSlot[],
  other: [
    { type: '高峰', startTime: '06:00', endTime: '08:00', description: '高峰早晨' },
    { type: '高峰', startTime: '16:00', endTime: '22:00', description: '高峰晚间' },
    { type: '平段', startTime: '08:00', endTime: '11:00', description: '平段上午' },
    { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' },
    { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段深夜' },
    { type: '低谷', startTime: '11:00', endTime: '14:00', description: '低谷中午' },
    { type: '低谷', startTime: '23:00', endTime: '06:00', description: '低谷凌晨' },
  ] as TimeSlot[],
};

// 5. 广东省 - 7-9月有尖峰
const guangdongSlots = {
  summer: [
    { type: '尖峰', startTime: '11:00', endTime: '12:00', description: '尖峰时段1' },
    { type: '尖峰', startTime: '15:00', endTime: '17:00', description: '尖峰时段2' },
    { type: '高峰', startTime: '10:00', endTime: '11:00', description: '高峰上午' },
    { type: '高峰', startTime: '12:00', endTime: '14:00', description: '高峰中午' },
    { type: '高峰', startTime: '17:00', endTime: '19:00', description: '高峰下午' },
    { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' },
    { type: '平段', startTime: '14:00', endTime: '15:00', description: '平段下午1' },
    { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' },
    { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' },
  ] as TimeSlot[],
  other: [
    { type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' },
    { type: '高峰', startTime: '14:00', endTime: '19:00', description: '高峰下午' },
    { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' },
    { type: '平段', startTime: '12:00', endTime: '14:00', description: '平段中午' },
    { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' },
    { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' },
  ] as TimeSlot[],
};

// 6. 山东省 - 冬季尖峰在高峰内
const shandongSlots = {
  winter: [
    { type: '尖峰', startTime: '17:00', endTime: '22:00', description: '尖峰时段' },
    { type: '平段', startTime: '07:00', endTime: '09:00', description: '平段上午' },
    { type: '平段', startTime: '16:00', endTime: '17:00', description: '平段下午' },
    { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段深夜' },
    { type: '低谷', startTime: '02:00', endTime: '07:00', description: '低谷凌晨' },
    { type: '低谷', startTime: '09:00', endTime: '16:00', description: '低谷白天' },
    { type: '平段', startTime: '23:00', endTime: '02:00', description: '平段深夜' },
  ] as TimeSlot[],
  summer: [
    { type: '尖峰', startTime: '17:00', endTime: '22:00', description: '尖峰时段' },
    { type: '平段', startTime: '07:00', endTime: '09:00', description: '平段上午' },
    { type: '平段', startTime: '16:00', endTime: '17:00', description: '平段下午' },
    { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段深夜' },
    { type: '低谷', startTime: '02:00', endTime: '07:00', description: '低谷凌晨' },
    { type: '低谷', startTime: '09:00', endTime: '16:00', description: '低谷白天' },
    { type: '平段', startTime: '23:00', endTime: '02:00', description: '平段深夜' },
  ] as TimeSlot[],
  other: [
    { type: '高峰', startTime: '16:00', endTime: '21:00', description: '高峰时段' },
    { type: '平段', startTime: '07:00', endTime: '09:00', description: '平段上午' },
    { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' },
    { type: '平段', startTime: '21:00', endTime: '23:00', description: '平段深夜' },
    { type: '低谷', startTime: '02:00', endTime: '07:00', description: '低谷凌晨' },
    { type: '低谷', startTime: '09:00', endTime: '14:00', description: '低谷白天' },
    { type: '平段', startTime: '23:00', endTime: '02:00', description: '平段深夜' },
  ] as TimeSlot[],
};

// 7. 山西省
const shanxiSlots = {
  summer: [
    { type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' },
    { type: '高峰', startTime: '17:00', endTime: '23:00', description: '高峰晚间' },
    { type: '平段', startTime: '07:00', endTime: '08:00', description: '平段早晨' },
    { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' },
    { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段深夜' },
    { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷凌晨' },
    { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' },
  ] as TimeSlot[],
  winter: [
    { type: '高峰', startTime: '17:00', endTime: '23:00', description: '高峰时段' },
    { type: '平段', startTime: '07:00', endTime: '08:00', description: '平段早晨' },
    { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' },
    { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段深夜' },
    { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷凌晨' },
    { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' },
  ] as TimeSlot[],
  other: [
    { type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' },
    { type: '高峰', startTime: '17:00', endTime: '23:00', description: '高峰晚间' },
    { type: '平段', startTime: '07:00', endTime: '08:00', description: '平段早晨' },
    { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' },
    { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段深夜' },
    { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷凌晨' },
    { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' },
  ] as TimeSlot[],
};

// 8. 北京市 - 尖峰在高峰内
const beijingSlots = {
  summer: [
    { type: '尖峰', startTime: '11:00', endTime: '13:00', description: '尖峰时段1' },
    { type: '尖峰', startTime: '16:00', endTime: '17:00', description: '尖峰时段2' },
    { type: '高峰', startTime: '10:00', endTime: '11:00', description: '高峰上午1' },
    { type: '高峰', startTime: '13:00', endTime: '16:00', description: '高峰下午' },
    { type: '高峰', startTime: '17:00', endTime: '22:00', description: '高峰晚间' },
    { type: '平段', startTime: '07:00', endTime: '10:00', description: '平段上午' },
    { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段深夜' },
    { type: '低谷', startTime: '23:00', endTime: '07:00', description: '低谷时段' },
  ] as TimeSlot[],
  winter: [
    { type: '尖峰', startTime: '18:00', endTime: '21:00', description: '尖峰时段' },
    { type: '高峰', startTime: '10:00', endTime: '13:00', description: '高峰上午' },
    { type: '高峰', startTime: '17:00', endTime: '18:00', description: '高峰下午1' },
    { type: '高峰', startTime: '21:00', endTime: '22:00', description: '高峰晚间' },
    { type: '平段', startTime: '07:00', endTime: '10:00', description: '平段上午' },
    { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' },
    { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段深夜' },
    { type: '低谷', startTime: '23:00', endTime: '07:00', description: '低谷时段' },
  ] as TimeSlot[],
  other: [
    { type: '高峰', startTime: '10:00', endTime: '13:00', description: '高峰上午' },
    { type: '高峰', startTime: '17:00', endTime: '22:00', description: '高峰晚间' },
    { type: '平段', startTime: '07:00', endTime: '10:00', description: '平段上午' },
    { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' },
    { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段深夜' },
    { type: '低谷', startTime: '23:00', endTime: '07:00', description: '低谷时段' },
  ] as TimeSlot[],
};

// 9. 河北省（北网）
const hebeiNorthSlots = {
  summer: [
    { type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' },
    { type: '高峰', startTime: '13:00', endTime: '17:00', description: '高峰下午' },
    { type: '高峰', startTime: '21:00', endTime: '22:00', description: '高峰晚间' },
    { type: '平段', startTime: '07:00', endTime: '08:00', description: '平段早晨' },
    { type: '平段', startTime: '11:00', endTime: '13:00', description: '平段中午' },
    { type: '平段', startTime: '17:00', endTime: '21:00', description: '平段下午' },
    { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段深夜' },
    { type: '低谷', startTime: '23:00', endTime: '07:00', description: '低谷时段' },
  ] as TimeSlot[],
  winter: [
    { type: '高峰', startTime: '17:00', endTime: '19:00', description: '高峰下午1' },
    { type: '高峰', startTime: '21:00', endTime: '23:00', description: '高峰晚间' },
    { type: '平段', startTime: '07:00', endTime: '17:00', description: '平段白天' },
    { type: '平段', startTime: '19:00', endTime: '21:00', description: '平段傍晚' },
    { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段深夜' },
    { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷时段' },
  ] as TimeSlot[],
  other: [
    { type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' },
    { type: '高峰', startTime: '16:00', endTime: '18:00', description: '高峰下午' },
    { type: '高峰', startTime: '21:00', endTime: '23:00', description: '高峰晚间' },
    { type: '平段', startTime: '07:00', endTime: '08:00', description: '平段早晨' },
    { type: '平段', startTime: '11:00', endTime: '16:00', description: '平段白天' },
    { type: '平段', startTime: '18:00', endTime: '21:00', description: '平段傍晚' },
    { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段深夜' },
    { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷时段' },
  ] as TimeSlot[],
};

// 10. 河北省（南网）
const hebeiSouthSlots = {
  spring: [
    { type: '深谷', startTime: '12:00', endTime: '15:00', description: '深谷时段' },
    { type: '低谷', startTime: '03:00', endTime: '07:00', description: '低谷凌晨' },
    { type: '低谷', startTime: '11:00', endTime: '12:00', description: '低谷中午' },
    { type: '平段', startTime: '00:00', endTime: '03:00', description: '平段深夜' },
    { type: '平段', startTime: '07:00', endTime: '11:00', description: '平段上午' },
    { type: '平段', startTime: '15:00', endTime: '16:00', description: '平段下午' },
    { type: '高峰', startTime: '16:00', endTime: '24:00', description: '高峰时段' },
  ] as TimeSlot[],
  summer: [
    { type: '尖峰', startTime: '19:00', endTime: '22:00', description: '尖峰时段' },
    { type: '高峰', startTime: '16:00', endTime: '19:00', description: '高峰下午' },
    { type: '高峰', startTime: '22:00', endTime: '24:00', description: '高峰深夜' },
    { type: '平段', startTime: '00:00', endTime: '01:00', description: '平段深夜' },
    { type: '平段', startTime: '07:00', endTime: '12:00', description: '平段上午' },
    { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' },
    { type: '低谷', startTime: '01:00', endTime: '07:00', description: '低谷凌晨' },
    { type: '低谷', startTime: '12:00', endTime: '14:00', description: '低谷中午' },
  ] as TimeSlot[],
  autumn: [
    { type: '深谷', startTime: '12:00', endTime: '14:00', description: '深谷时段' },
    { type: '低谷', startTime: '02:00', endTime: '06:00', description: '低谷凌晨' },
    { type: '低谷', startTime: '11:00', endTime: '12:00', description: '低谷中午1' },
    { type: '低谷', startTime: '14:00', endTime: '15:00', description: '低谷中午2' },
    { type: '平段', startTime: '00:00', endTime: '02:00', description: '平段深夜' },
    { type: '平段', startTime: '06:00', endTime: '11:00', description: '平段上午' },
    { type: '平段', startTime: '15:00', endTime: '16:00', description: '平段下午' },
    { type: '高峰', startTime: '16:00', endTime: '24:00', description: '高峰时段' },
  ] as TimeSlot[],
  winter: [
    { type: '尖峰', startTime: '17:00', endTime: '19:00', description: '尖峰时段' },
    { type: '高峰', startTime: '07:00', endTime: '09:00', description: '高峰上午' },
    { type: '高峰', startTime: '19:00', endTime: '23:00', description: '高峰晚间' },
    { type: '平段', startTime: '00:00', endTime: '02:00', description: '平段深夜' },
    { type: '平段', startTime: '06:00', endTime: '07:00', description: '平段早晨' },
    { type: '平段', startTime: '09:00', endTime: '11:00', description: '平段上午' },
    { type: '平段', startTime: '15:00', endTime: '17:00', description: '平段下午' },
    { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段深夜2' },
    { type: '低谷', startTime: '02:00', endTime: '06:00', description: '低谷凌晨' },
    { type: '低谷', startTime: '11:00', endTime: '15:00', description: '低谷中午' },
  ] as TimeSlot[],
};

// 31省份数据
export const provinceData: ProvinceData[] = [
  // 1. 河南省
  {
    name: '河南省',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [1, 2, 12], slots: henanSlots.winter },
      { months: [3, 4, 5, 9, 10, 11], slots: henanSlots.springAutumn },
      { months: [6, 7, 8], slots: henanSlots.summer },
    ])
  },
  
  // 2. 云南省
  {
    name: '云南省',
    hasTimeOfUsePricing: true,
    note: '尖峰暂缓执行',
    months: Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      monthName: `${i + 1}月`,
      hasPeak: false,
      hasDeepValley: false,
      timeSlots: JSON.parse(JSON.stringify(yunnanSlots)),
    }))
  },
  
  // 3. 江苏省
  {
    name: '江苏省',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [1, 2, 6, 7, 8, 12], slots: jiangsuSlots.summerWinter },
      { months: [3, 4, 5, 9, 10, 11], slots: jiangsuSlots.springAutumn },
    ])
  },
  
  // 4. 安徽省
  {
    name: '安徽省',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [1, 7, 8, 9, 12], slots: anhuiSlots.special },
      { months: [2, 3, 4, 5, 6, 10, 11], slots: anhuiSlots.other },
    ])
  },
  
  // 5. 广东省（珠三角五市）
  {
    name: '广东省（珠三角五市）',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [7, 8, 9], slots: guangdongSlots.summer },
      { months: [1, 2, 3, 4, 5, 6, 10, 11, 12], slots: guangdongSlots.other },
    ])
  },
  
  // 6. 山东省
  {
    name: '山东省',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [1, 2, 12], slots: shandongSlots.winter },
      { months: [7, 8], slots: shandongSlots.summer },
      { months: [3, 4, 5, 6, 9, 10, 11], slots: shandongSlots.other },
    ])
  },
  
  // 7. 山西省
  {
    name: '山西省',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [7, 8], slots: shanxiSlots.summer },
      { months: [1, 12], slots: shanxiSlots.winter },
      { months: [2, 3, 4, 5, 6, 9, 10, 11], slots: shanxiSlots.other },
    ])
  },
  
  // 8. 北京市
  {
    name: '北京市',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [7, 8], slots: beijingSlots.summer },
      { months: [1, 12], slots: beijingSlots.winter },
      { months: [2, 3, 4, 5, 6, 9, 10, 11], slots: beijingSlots.other },
    ])
  },
  
  // 9. 河北省（北网）
  {
    name: '河北省（北网）',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [6, 7, 8], slots: hebeiNorthSlots.summer },
      { months: [1, 2, 12], slots: hebeiNorthSlots.winter },
      { months: [3, 4, 5, 9, 10, 11], slots: hebeiNorthSlots.other },
    ])
  },
  
  // 10. 河北省（南网）
  {
    name: '河北省（南网）',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [3, 4, 5], slots: hebeiSouthSlots.spring },
      { months: [6, 7, 8], slots: hebeiSouthSlots.summer },
      { months: [9, 10, 11], slots: hebeiSouthSlots.autumn },
      { months: [1, 2, 12], slots: hebeiSouthSlots.winter },
    ])
  },
  
  // 11. 冀北地区
  {
    name: '冀北地区',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [6, 7, 8], slots: [
        { type: '尖峰', startTime: '18:00', endTime: '21:00', description: '尖峰时段' },
        { type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' },
        { type: '高峰', startTime: '16:00', endTime: '18:00', description: '高峰下午1' },
        { type: '高峰', startTime: '21:00', endTime: '22:00', description: '高峰晚间' },
        { type: '平段', startTime: '07:00', endTime: '10:00', description: '平段上午' },
        { type: '平段', startTime: '12:00', endTime: '16:00', description: '平段中午' },
        { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷时段' },
      ]},
      { months: [1, 11, 12], slots: [
        { type: '尖峰', startTime: '17:00', endTime: '19:00', description: '尖峰时段' },
        { type: '高峰', startTime: '07:00', endTime: '09:00', description: '高峰上午' },
        { type: '高峰', startTime: '16:00', endTime: '17:00', description: '高峰下午1' },
        { type: '高峰', startTime: '19:00', endTime: '22:00', description: '高峰晚间' },
        { type: '平段', startTime: '00:00', endTime: '07:00', description: '平段凌晨' },
        { type: '平段', startTime: '09:00', endTime: '12:00', description: '平段上午' },
        { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' },
        { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '07:00', endTime: '09:00', description: '低谷早晨' },
        { type: '低谷', startTime: '12:00', endTime: '14:00', description: '低谷中午' },
        { type: '深谷', startTime: '12:00', endTime: '15:00', description: '深谷时段' },
      ]},
      { months: [2, 3, 4, 5, 9, 10], slots: [
        { type: '高峰', startTime: '16:00', endTime: '22:00', description: '高峰时段' },
        { type: '平段', startTime: '00:00', endTime: '01:00', description: '平段深夜' },
        { type: '平段', startTime: '06:00', endTime: '12:00', description: '平段上午' },
        { type: '平段', startTime: '15:00', endTime: '16:00', description: '平段下午' },
        { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段深夜2' },
        { type: '低谷', startTime: '01:00', endTime: '06:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '12:00', endTime: '15:00', description: '低谷中午' },
      ]},
    ])
  },
  
  // 12. 浙江省
  {
    name: '浙江省',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [2, 3, 4, 5, 6, 9, 10, 11], slots: [
        { type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' },
        { type: '高峰', startTime: '13:00', endTime: '17:00', description: '高峰下午' },
        { type: '平段', startTime: '17:00', endTime: '24:00', description: '平段晚间' },
        { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' },
      ]},
      { months: [1, 7, 8, 12], slots: [
        { type: '尖峰', startTime: '09:00', endTime: '11:00', description: '尖峰上午' },
        { type: '尖峰', startTime: '15:00', endTime: '17:00', description: '尖峰下午' },
        { type: '高峰', startTime: '08:00', endTime: '09:00', description: '高峰早晨' },
        { type: '高峰', startTime: '17:00', endTime: '23:00', description: '高峰晚间' },
        { type: '平段', startTime: '13:00', endTime: '15:00', description: '平段下午' },
        { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' },
        { type: '深谷', startTime: '10:00', endTime: '14:00', description: '深谷时段（节假日）' },
      ]},
    ])
  },
  
  // 13. 上海市
  {
    name: '上海市',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [7, 8, 9], slots: [
        { type: '尖峰', startTime: '12:00', endTime: '14:00', description: '尖峰时段' },
        { type: '高峰', startTime: '08:00', endTime: '12:00', description: '高峰上午' },
        { type: '高峰', startTime: '14:00', endTime: '15:00', description: '高峰中午' },
        { type: '高峰', startTime: '18:00', endTime: '21:00', description: '高峰晚间' },
        { type: '平段', startTime: '06:00', endTime: '08:00', description: '平段早晨' },
        { type: '平段', startTime: '15:00', endTime: '18:00', description: '平段下午' },
        { type: '平段', startTime: '21:00', endTime: '22:00', description: '平段深夜' },
        { type: '低谷', startTime: '22:00', endTime: '06:00', description: '低谷时段' },
      ]},
      { months: [1, 12], slots: [
        { type: '尖峰', startTime: '19:00', endTime: '21:00', description: '尖峰时段' },
        { type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' },
        { type: '高峰', startTime: '18:00', endTime: '19:00', description: '高峰傍晚' },
        { type: '高峰', startTime: '21:00', endTime: '22:00', description: '高峰深夜' },
        { type: '平段', startTime: '06:00', endTime: '08:00', description: '平段早晨' },
        { type: '平段', startTime: '11:00', endTime: '18:00', description: '平段白天' },
        { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段深夜' },
        { type: '低谷', startTime: '23:00', endTime: '06:00', description: '低谷时段' },
      ]},
      { months: [2, 3, 4, 5, 6, 10, 11], slots: [
        { type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' },
        { type: '高峰', startTime: '18:00', endTime: '21:00', description: '高峰晚间' },
        { type: '平段', startTime: '06:00', endTime: '08:00', description: '平段早晨' },
        { type: '平段', startTime: '11:00', endTime: '18:00', description: '平段白天' },
        { type: '平段', startTime: '21:00', endTime: '22:00', description: '平段深夜' },
        { type: '低谷', startTime: '22:00', endTime: '06:00', description: '低谷时段' },
      ]},
    ])
  },
  
  // 14. 四川省
  {
    name: '四川省',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [3, 4, 5, 6, 10, 11], slots: [
        { type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' },
        { type: '高峰', startTime: '17:00', endTime: '22:00', description: '高峰晚间' },
        { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' },
        { type: '平段', startTime: '12:00', endTime: '17:00', description: '平段下午' },
        { type: '平段', startTime: '22:00', endTime: '08:00', description: '平段夜间' },
        { type: '低谷', startTime: '22:00', endTime: '08:00', description: '低谷时段' },
      ]},
      { months: [7, 8, 9], slots: [
        { type: '高峰', startTime: '11:00', endTime: '18:00', description: '高峰白天' },
        { type: '高峰', startTime: '20:00', endTime: '23:00', description: '高峰晚间' },
        { type: '平段', startTime: '07:00', endTime: '11:00', description: '平段上午' },
        { type: '平段', startTime: '18:00', endTime: '20:00', description: '平段傍晚' },
        { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷时段' },
      ]},
      { months: [1, 12], slots: [
        { type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' },
        { type: '高峰', startTime: '16:00', endTime: '22:00', description: '高峰晚间' },
        { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' },
        { type: '平段', startTime: '12:00', endTime: '16:00', description: '平段下午' },
        { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' },
      ]},
    ])
  },
  
  // 15. 黑龙江省
  {
    name: '黑龙江省',
    hasTimeOfUsePricing: true,
    note: '尖峰电价暂停执行',
    months: Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      monthName: `${i + 1}月`,
      hasPeak: false,
      hasDeepValley: false,
      timeSlots: [
        { type: '高峰', startTime: '07:00', endTime: '08:00', description: '高峰早晨' },
        { type: '高峰', startTime: '09:00', endTime: '11:30', description: '高峰上午' },
        { type: '高峰', startTime: '15:30', endTime: '20:00', description: '高峰下午' },
        { type: '平段', startTime: '08:00', endTime: '09:00', description: '平段上午' },
        { type: '平段', startTime: '11:30', endTime: '12:00', description: '平段中午' },
        { type: '平段', startTime: '14:00', endTime: '15:30', description: '平段下午' },
        { type: '平段', startTime: '20:00', endTime: '23:30', description: '平段晚间' },
        { type: '平段', startTime: '05:30', endTime: '07:00', description: '平段凌晨' },
        { type: '低谷', startTime: '12:00', endTime: '14:00', description: '低谷中午' },
        { type: '低谷', startTime: '23:30', endTime: '05:30', description: '低谷凌晨' },
      ],
    }))
  },
  
  // 16. 辽宁省 - 不执行分时电价
  {
    name: '辽宁省',
    hasTimeOfUsePricing: false,
    note: '2025年3月1日起开展电力现货市场连续结算试运行，实际购电价格按市场价格结算，不执行固定分时电价',
    months: []
  },
  
  // 17. 吉林省
  {
    name: '吉林省',
    hasTimeOfUsePricing: true,
    note: '尖峰电价调整为灵活启动机制',
    months: Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      monthName: `${i + 1}月`,
      hasPeak: false,
      hasDeepValley: false,
      timeSlots: [
        { type: '高峰', startTime: '08:00', endTime: '10:00', description: '高峰上午' },
        { type: '高峰', startTime: '16:00', endTime: '21:00', description: '高峰晚间' },
        { type: '平段', startTime: '05:00', endTime: '08:00', description: '平段早晨' },
        { type: '平段', startTime: '10:00', endTime: '11:00', description: '平段上午' },
        { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' },
        { type: '平段', startTime: '21:00', endTime: '23:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '05:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '11:00', endTime: '14:00', description: '低谷中午' },
        { type: '低谷', startTime: '23:00', endTime: '24:00', description: '低谷深夜' },
      ],
    }))
  },
  
  // 18. 内蒙古东部
  {
    name: '内蒙古东部',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [6, 7, 8], slots: [
        { type: '尖峰', startTime: '18:00', endTime: '20:00', description: '尖峰时段' },
        { type: '高峰', startTime: '06:00', endTime: '09:00', description: '高峰上午' },
        { type: '高峰', startTime: '17:00', endTime: '18:00', description: '高峰下午1' },
        { type: '高峰', startTime: '20:00', endTime: '22:00', description: '高峰晚间' },
        { type: '平段', startTime: '05:00', endTime: '06:00', description: '平段早晨' },
        { type: '平段', startTime: '09:00', endTime: '11:00', description: '平段上午' },
        { type: '平段', startTime: '14:00', endTime: '17:00', description: '平段下午' },
        { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '11:00', endTime: '14:00', description: '低谷中午' },
        { type: '低谷', startTime: '00:00', endTime: '05:00', description: '低谷凌晨' },
        { type: '深谷', startTime: '12:00', endTime: '14:00', description: '深谷时段' },
      ]},
      { months: [1, 11, 12], slots: [
        { type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' },
        { type: '高峰', startTime: '19:00', endTime: '21:00', description: '高峰晚间' },
        { type: '平段', startTime: '00:00', endTime: '08:00', description: '平段凌晨' },
        { type: '平段', startTime: '11:00', endTime: '19:00', description: '平段白天' },
        { type: '平段', startTime: '21:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '04:00', description: '低谷时段' },
      ]},
      { months: [2, 3, 4, 5, 9, 10], slots: [
        { type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' },
        { type: '高峰', startTime: '19:00', endTime: '24:00', description: '高峰晚间' },
        { type: '平段', startTime: '00:00', endTime: '08:00', description: '平段凌晨' },
        { type: '平段', startTime: '11:00', endTime: '19:00', description: '平段白天' },
        { type: '低谷', startTime: '00:00', endTime: '04:00', description: '低谷时段' },
      ]},
    ])
  },
  
  // 19. 内蒙古西部（蒙西）
  {
    name: '内蒙古西部（蒙西）',
    hasTimeOfUsePricing: true,
    months: Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      monthName: `${i + 1}月`,
      hasPeak: false,
      hasDeepValley: false,
      timeSlots: [
        { type: '高峰', startTime: '07:00', endTime: '09:00', description: '高峰上午' },
        { type: '高峰', startTime: '17:00', endTime: '23:00', description: '高峰晚间' },
        { type: '平段', startTime: '00:00', endTime: '07:00', description: '平段凌晨' },
        { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '09:00', endTime: '17:00', description: '低谷白天' },
      ],
    }))
  },
  
  // 20. 江西省
  {
    name: '江西省',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [1, 12], slots: [
        { type: '尖峰', startTime: '18:00', endTime: '20:00', description: '尖峰时段' },
        { type: '高峰', startTime: '09:00', endTime: '12:00', description: '高峰上午' },
        { type: '高峰', startTime: '18:00', endTime: '21:00', description: '高峰晚间' },
        { type: '平段', startTime: '06:00', endTime: '09:00', description: '平段上午' },
        { type: '平段', startTime: '12:00', endTime: '18:00', description: '平段下午' },
        { type: '平段', startTime: '21:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷时段' },
      ]},
      { months: [2], slots: [
        { type: '高峰', startTime: '16:00', endTime: '22:00', description: '高峰时段' },
        { type: '平段', startTime: '06:00', endTime: '16:00', description: '平段白天' },
        { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷时段' },
      ]},
      { months: [7, 8, 9], slots: [
        { type: '尖峰', startTime: '20:30', endTime: '22:30', description: '尖峰时段（7、8月）' },
        { type: '高峰', startTime: '17:00', endTime: '20:30', description: '高峰下午' },
        { type: '高峰', startTime: '22:30', endTime: '23:00', description: '高峰深夜' },
        { type: '平段', startTime: '05:00', endTime: '11:30', description: '平段上午' },
        { type: '平段', startTime: '14:30', endTime: '17:00', description: '平段下午' },
        { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '01:00', endTime: '05:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '11:30', endTime: '14:30', description: '低谷中午' },
        { type: '深谷', startTime: '12:00', endTime: '14:00', description: '深谷时段' },
      ]},
      { months: [3, 4, 5, 6, 10, 11], slots: [
        { type: '高峰', startTime: '16:00', endTime: '22:00', description: '高峰时段' },
        { type: '平段', startTime: '05:00', endTime: '11:30', description: '平段上午' },
        { type: '平段', startTime: '14:30', endTime: '16:00', description: '平段下午' },
        { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '01:00', endTime: '05:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '11:30', endTime: '14:30', description: '低谷中午' },
        { type: '深谷', startTime: '12:00', endTime: '14:00', description: '深谷时段' },
      ]},
    ])
  },
  
  // 21. 湖北省
  {
    name: '湖北省',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [7, 8], slots: [
        { type: '尖峰', startTime: '20:00', endTime: '22:00', description: '尖峰时段' },
        { type: '高峰', startTime: '16:00', endTime: '20:00', description: '高峰下午' },
        { type: '高峰', startTime: '22:00', endTime: '24:00', description: '高峰深夜' },
        { type: '平段', startTime: '06:00', endTime: '12:00', description: '平段上午' },
        { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' },
        { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '12:00', endTime: '14:00', description: '低谷中午' },
      ]},
      { months: [1, 2, 3, 4, 5, 6, 9, 10, 11, 12], slots: [
        { type: '高峰', startTime: '18:00', endTime: '20:00', description: '高峰时段' },
        { type: '平段', startTime: '06:00', endTime: '12:00', description: '平段上午' },
        { type: '平段', startTime: '14:00', endTime: '18:00', description: '平段下午' },
        { type: '平段', startTime: '20:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '12:00', endTime: '14:00', description: '低谷中午' },
      ]},
    ])
  },
  
  // 22. 湖南省
  {
    name: '湖南省',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [1, 12], slots: [
        { type: '尖峰', startTime: '18:00', endTime: '22:00', description: '尖峰时段' },
        { type: '高峰', startTime: '16:00', endTime: '18:00', description: '高峰下午' },
        { type: '高峰', startTime: '22:00', endTime: '24:00', description: '高峰深夜' },
        { type: '平段', startTime: '06:00', endTime: '12:00', description: '平段上午' },
        { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' },
        { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '12:00', endTime: '14:00', description: '低谷中午' },
      ]},
      { months: [7, 8], slots: [
        { type: '尖峰', startTime: '20:00', endTime: '24:00', description: '尖峰时段' },
        { type: '高峰', startTime: '16:00', endTime: '20:00', description: '高峰时段' },
        { type: '平段', startTime: '06:00', endTime: '12:00', description: '平段上午' },
        { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' },
        { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '12:00', endTime: '14:00', description: '低谷中午' },
      ]},
      { months: [2, 3, 4, 5, 6, 9, 10, 11], slots: [
        { type: '高峰', startTime: '16:00', endTime: '24:00', description: '高峰时段' },
        { type: '平段', startTime: '06:00', endTime: '12:00', description: '平段上午' },
        { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' },
        { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '12:00', endTime: '14:00', description: '低谷中午' },
      ]},
    ])
  },
  
  // 23. 青海省
  {
    name: '青海省',
    hasTimeOfUsePricing: true,
    months: Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      monthName: `${i + 1}月`,
      hasPeak: false,
      hasDeepValley: false,
      timeSlots: [
        { type: '高峰', startTime: '07:00', endTime: '09:00', description: '高峰上午' },
        { type: '高峰', startTime: '17:00', endTime: '23:00', description: '高峰晚间' },
        { type: '平段', startTime: '00:00', endTime: '07:00', description: '平段凌晨' },
        { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '09:00', endTime: '17:00', description: '低谷白天' },
      ],
    }))
  },
  
  // 24. 宁夏回族自治区
  {
    name: '宁夏回族自治区',
    hasTimeOfUsePricing: true,
    months: Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      monthName: `${i + 1}月`,
      hasPeak: false,
      hasDeepValley: false,
      timeSlots: [
        { type: '高峰', startTime: '07:00', endTime: '09:00', description: '高峰上午' },
        { type: '高峰', startTime: '17:00', endTime: '23:00', description: '高峰晚间' },
        { type: '平段', startTime: '00:00', endTime: '07:00', description: '平段凌晨' },
        { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '09:00', endTime: '17:00', description: '低谷白天' },
      ],
    }))
  },
  
  // 25. 陕西省（不含榆林）
  {
    name: '陕西省（不含榆林）',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [7, 8], slots: [
        { type: '尖峰', startTime: '19:00', endTime: '21:00', description: '尖峰时段' },
        { type: '高峰', startTime: '16:00', endTime: '19:00', description: '高峰下午1' },
        { type: '高峰', startTime: '21:00', endTime: '23:00', description: '高峰晚间' },
        { type: '平段', startTime: '06:00', endTime: '11:00', description: '平段上午' },
        { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' },
        { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '11:00', endTime: '14:00', description: '低谷中午' },
      ]},
      { months: [1, 12], slots: [
        { type: '尖峰', startTime: '18:00', endTime: '20:00', description: '尖峰时段' },
        { type: '高峰', startTime: '16:00', endTime: '18:00', description: '高峰下午1' },
        { type: '高峰', startTime: '20:00', endTime: '23:00', description: '高峰晚间' },
        { type: '平段', startTime: '06:00', endTime: '11:00', description: '平段上午' },
        { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' },
        { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '11:00', endTime: '14:00', description: '低谷中午' },
      ]},
      { months: [2, 3, 4, 5, 6, 9, 10, 11], slots: [
        { type: '高峰', startTime: '16:00', endTime: '23:00', description: '高峰时段' },
        { type: '平段', startTime: '06:00', endTime: '11:00', description: '平段上午' },
        { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' },
        { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '11:00', endTime: '14:00', description: '低谷中午' },
      ]},
    ])
  },
  
  // 26. 天津市
  {
    name: '天津市',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [7, 8], slots: [
        { type: '尖峰', startTime: '20:00', endTime: '22:00', description: '尖峰时段' },
        { type: '高峰', startTime: '15:00', endTime: '20:00', description: '高峰下午' },
        { type: '高峰', startTime: '22:00', endTime: '23:00', description: '高峰深夜' },
        { type: '平段', startTime: '00:00', endTime: '01:00', description: '平段深夜' },
        { type: '平段', startTime: '09:00', endTime: '15:00', description: '平段白天' },
        { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段深夜2' },
        { type: '低谷', startTime: '01:00', endTime: '09:00', description: '低谷时段' },
      ]},
      { months: [1, 2, 12], slots: [
        { type: '尖峰', startTime: '18:00', endTime: '20:00', description: '尖峰时段' },
        { type: '高峰', startTime: '08:00', endTime: '10:00', description: '高峰上午' },
        { type: '高峰', startTime: '16:00', endTime: '18:00', description: '高峰下午1' },
        { type: '高峰', startTime: '20:00', endTime: '22:00', description: '高峰晚间' },
        { type: '平段', startTime: '06:00', endTime: '08:00', description: '平段早晨' },
        { type: '平段', startTime: '10:00', endTime: '12:00', description: '平段上午' },
        { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' },
        { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '12:00', endTime: '14:00', description: '低谷中午' },
      ]},
      { months: [3, 4, 5, 6, 9, 10, 11], slots: [
        { type: '高峰', startTime: '08:00', endTime: '10:00', description: '高峰上午' },
        { type: '高峰', startTime: '16:00', endTime: '22:00', description: '高峰晚间' },
        { type: '平段', startTime: '06:00', endTime: '08:00', description: '平段早晨' },
        { type: '平段', startTime: '10:00', endTime: '12:00', description: '平段上午' },
        { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' },
        { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '12:00', endTime: '14:00', description: '低谷中午' },
      ]},
    ])
  },
  
  // 27. 甘肃省
  {
    name: '甘肃省',
    hasTimeOfUsePricing: true,
    months: Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      monthName: `${i + 1}月`,
      hasPeak: false,
      hasDeepValley: false,
      timeSlots: [
        { type: '高峰', startTime: '06:00', endTime: '08:00', description: '高峰早晨' },
        { type: '高峰', startTime: '18:00', endTime: '23:00', description: '高峰晚间' },
        { type: '平段', startTime: '23:00', endTime: '06:00', description: '平段夜间' },
        { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' },
        { type: '平段', startTime: '16:00', endTime: '18:00', description: '平段下午' },
        { type: '低谷', startTime: '10:00', endTime: '16:00', description: '低谷白天' },
      ],
    }))
  },
  
  // 28. 新疆维吾尔自治区
  {
    name: '新疆维吾尔自治区',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [5, 6, 7, 8], slots: [
        { type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' },
        { type: '高峰', startTime: '19:00', endTime: '24:00', description: '高峰晚间' },
        { type: '平段', startTime: '00:00', endTime: '08:00', description: '平段凌晨' },
        { type: '平段', startTime: '11:00', endTime: '19:00', description: '平段白天' },
        { type: '低谷', startTime: '00:00', endTime: '04:00', description: '低谷凌晨' },
        { type: '深谷', startTime: '14:00', endTime: '16:00', description: '深谷时段' },
      ]},
      { months: [1, 11, 12], slots: [
        { type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' },
        { type: '高峰', startTime: '19:00', endTime: '21:00', description: '高峰晚间' },
        { type: '平段', startTime: '00:00', endTime: '08:00', description: '平段凌晨' },
        { type: '平段', startTime: '11:00', endTime: '19:00', description: '平段白天' },
        { type: '平段', startTime: '21:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '04:00', description: '低谷凌晨' },
      ]},
      { months: [2, 3, 4, 9, 10], slots: [
        { type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' },
        { type: '高峰', startTime: '19:00', endTime: '24:00', description: '高峰晚间' },
        { type: '平段', startTime: '00:00', endTime: '08:00', description: '平段凌晨' },
        { type: '平段', startTime: '11:00', endTime: '19:00', description: '平段白天' },
        { type: '低谷', startTime: '00:00', endTime: '04:00', description: '低谷凌晨' },
      ]},
    ])
  },
  
  // 29. 海南省
  {
    name: '海南省',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [5, 6, 7], slots: [
        { type: '尖峰', startTime: '20:00', endTime: '22:00', description: '尖峰时段' },
        { type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' },
        { type: '高峰', startTime: '16:00', endTime: '20:00', description: '高峰下午' },
        { type: '高峰', startTime: '22:00', endTime: '24:00', description: '高峰深夜' },
        { type: '平段', startTime: '07:00', endTime: '10:00', description: '平段上午' },
        { type: '平段', startTime: '12:00', endTime: '16:00', description: '平段下午' },
        { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段深夜' },
        { type: '低谷', startTime: '23:00', endTime: '07:00', description: '低谷时段' },
      ]},
      { months: [1, 2, 3, 4, 8, 9, 10, 11, 12], slots: [
        { type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' },
        { type: '高峰', startTime: '16:00', endTime: '22:00', description: '高峰下午' },
        { type: '平段', startTime: '07:00', endTime: '10:00', description: '平段上午' },
        { type: '平段', startTime: '12:00', endTime: '16:00', description: '平段下午' },
        { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段深夜' },
        { type: '低谷', startTime: '23:00', endTime: '07:00', description: '低谷时段' },
      ]},
    ])
  },
  
  // 30. 贵州省
  {
    name: '贵州省',
    hasTimeOfUsePricing: true,
    months: Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      monthName: `${i + 1}月`,
      hasPeak: false,
      hasDeepValley: false,
      timeSlots: [
        { type: '高峰', startTime: '10:00', endTime: '11:00', description: '高峰上午' },
        { type: '高峰', startTime: '17:00', endTime: '22:00', description: '高峰晚间' },
        { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' },
        { type: '平段', startTime: '11:00', endTime: '13:00', description: '平段中午' },
        { type: '平段', startTime: '15:00', endTime: '17:00', description: '平段下午' },
        { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '13:00', endTime: '15:00', description: '低谷中午' },
      ],
    }))
  },
  
  // 31. 深圳市 - 7-9月有尖峰
  {
    name: '深圳市',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [7, 8, 9], slots: [
        { type: '尖峰', startTime: '11:00', endTime: '12:00', description: '尖峰时段1' },
        { type: '尖峰', startTime: '15:00', endTime: '17:00', description: '尖峰时段2' },
        { type: '高峰', startTime: '10:00', endTime: '11:00', description: '高峰上午' },
        { type: '高峰', startTime: '12:00', endTime: '14:00', description: '高峰中午' },
        { type: '高峰', startTime: '17:00', endTime: '19:00', description: '高峰下午' },
        { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' },
        { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' },
        { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' },
      ]},
      { months: [1, 2, 3, 4, 5, 6, 10, 11, 12], slots: [
        { type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' },
        { type: '高峰', startTime: '14:00', endTime: '19:00', description: '高峰下午' },
        { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' },
        { type: '平段', startTime: '12:00', endTime: '14:00', description: '平段中午' },
        { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' },
        { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' },
      ]},
    ])
  },
  
  // 32. 福建省
  {
    name: '福建省',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [7, 8, 9], slots: [
        { type: '尖峰', startTime: '11:00', endTime: '12:00', description: '尖峰时段1' },
        { type: '尖峰', startTime: '17:00', endTime: '18:00', description: '尖峰时段2' },
        { type: '高峰', startTime: '10:00', endTime: '11:00', description: '高峰上午1' },
        { type: '高峰', startTime: '12:00', endTime: '15:00', description: '高峰中午' },
        { type: '高峰', startTime: '18:00', endTime: '20:00', description: '高峰下午' },
        { type: '高峰', startTime: '21:00', endTime: '22:00', description: '高峰晚间' },
        { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' },
        { type: '平段', startTime: '15:00', endTime: '17:00', description: '平段下午' },
        { type: '平段', startTime: '20:00', endTime: '21:00', description: '平段傍晚' },
        { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' },
      ]},
      { months: [1, 2, 3, 4, 5, 6, 10, 11, 12], slots: [
        { type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' },
        { type: '高峰', startTime: '15:00', endTime: '20:00', description: '高峰下午' },
        { type: '高峰', startTime: '21:00', endTime: '22:00', description: '高峰晚间' },
        { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' },
        { type: '平段', startTime: '12:00', endTime: '15:00', description: '平段中午' },
        { type: '平段', startTime: '20:00', endTime: '21:00', description: '平段傍晚' },
        { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' },
      ]},
    ])
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
