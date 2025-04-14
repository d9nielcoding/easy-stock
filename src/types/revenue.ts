export interface RevenueData {
  date: string;
  revenue: number;
  yoyGrowthRate: number;
  [key: string]: string | number;
}
