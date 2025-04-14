import { API_CONFIG } from "@/config/api";
import TimeRange from "@/config/timerange";
import { RevenueData } from "@/types/revenue";
import axios from "axios";
import { useEffect, useState } from "react";

interface ApiResponseData {
  date: string;
  stock_id: string;
  country: string;
  revenue: number;
  revenue_month: number;
  revenue_year: number;
}

interface ApiResponse {
  msg: string;
  status: number;
  data: ApiResponseData[];
}

// 取得當前日期和五年前的日期，格式為 YYYY-MM-DD
const getDateRange = () => {
  const end = new Date();
  const start = new Date();
  start.setFullYear(start.getFullYear() - (TimeRange.MAX_YEAR + 1));

  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  };
};

// 計算年增率：(當月營收/去年同月營收 - 1) * 100%
const calculateYoyGrowthRate = (
  currentRevenue: number,
  previousYearRevenue: number
): number => {
  if (!previousYearRevenue) return 0;
  return (currentRevenue / previousYearRevenue - 1) * 100;
};

// 格式化日期為 YYYY/MM
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
};

export const useRevenueData = (stockId: string) => {
  const [data, setData] = useState<RevenueData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      const { startDate, endDate } = getDateRange();

      try {
        const response = await axios.get<ApiResponse>(
          API_CONFIG.FINMIND_API_URL,
          {
            params: {
              dataset: "TaiwanStockMonthRevenue",
              data_id: stockId,
              start_date: startDate,
              end_date: endDate,
              token: API_CONFIG.FINMIND_TOKEN,
            },
          }
        );

        // 檢查 API 回應狀態
        if (response.data.status !== 200) {
          throw new Error(response.data.msg || "API 回應異常");
        }

        // 確保資料存在且為陣列
        if (!response.data.data || !Array.isArray(response.data.data)) {
          throw new Error("無法取得資料");
        }

        // 建立一個 Map 來存儲每個月的營收，key 為 "年份-月份"
        const revenueMap = new Map<string, number>();
        response.data.data.forEach((item) => {
          const key = `${item.revenue_year}-${item.revenue_month}`;
          revenueMap.set(key, item.revenue);
        });

        // 轉換 API 回傳的資料格式並計算年增率
        const transformedData = response.data.data
          .map((item) => {
            // 取得去年同月的營收
            const previousYearKey = `${item.revenue_year - 1}-${
              item.revenue_month
            }`;
            const previousYearRevenue = revenueMap.get(previousYearKey);

            return {
              date: formatDate(item.date),
              revenue: item.revenue,
              yoyGrowthRate: calculateYoyGrowthRate(
                item.revenue,
                previousYearRevenue || 0
              ),
            };
          })
          .sort((a, b) => a.date.localeCompare(b.date));

        setData(transformedData);
      } catch (err) {
        console.error("API Error:", err);
        setError(err instanceof Error ? err.message : "發生錯誤，請稍後再試");
        setData([]); // 錯誤時清空資料
      } finally {
        setIsLoading(false);
      }
    };

    if (stockId) {
      fetchData();
    }
  }, [stockId]);

  return { data, isLoading, error };
};
