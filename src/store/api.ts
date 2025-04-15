import { API_CONFIG } from "@/config/api";
import { RevenueData } from "@/types/revenue";
import { StockInfo } from "@/types/stock";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface ApiResponse<T> {
  msg: string;
  status: number;
  data: T;
}

interface RevenueApiData {
  date: string;
  stock_id: string;
  country: string;
  revenue: number;
  revenue_month: number;
  revenue_year: number;
}

// 格式化日期為 YYYY/MM
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
};

// 計算年增率：(當月營收/去年同月營收 - 1) * 100%
const calculateYoyGrowthRate = (
  currentRevenue: number,
  previousYearRevenue: number
): number => {
  if (!previousYearRevenue) return 0;
  return (currentRevenue / previousYearRevenue - 1) * 100;
};

export const api = createApi({
  reducerPath: "finmindApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_CONFIG.FINMIND_API_URL }),
  endpoints: (builder) => ({
    getStockList: builder.query<StockInfo[], void>({
      query: () => ({
        url: "",
        method: "GET",
        params: {
          dataset: "TaiwanStockInfo",
          token: API_CONFIG.FINMIND_TOKEN,
        },
      }),
      transformResponse: (response: ApiResponse<StockInfo[]>) => {
        if (response.status !== 200) {
          throw new Error(response.msg || "API 回應異常");
        }
        // 過濾並去重股票列表
        return response.data.reduce((acc: StockInfo[], current) => {
          // 檢查是否為純數字的股票代號
          if (!/^\d+$/.test(current.stock_id)) {
            return acc;
          }
          // 檢查是否已經存在相同 stock_id 的股票
          const exists = acc.some(
            (stock) => stock.stock_id === current.stock_id
          );
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, []);
      },
    }),
    getStockInfo: builder.query<StockInfo, string>({
      query: (stockId) => ({
        url: "",
        method: "GET",
        params: {
          dataset: "TaiwanStockInfo",
          data_id: stockId,
          token: API_CONFIG.FINMIND_TOKEN,
        },
      }),
      transformResponse: (response: ApiResponse<StockInfo[]>) => {
        if (response.status !== 200) {
          throw new Error(response.msg || "API 回應異常");
        }
        if (!response.data?.[0]) {
          throw new Error("無法取得股票資訊");
        }
        return response.data[0];
      },
    }),
    getRevenueData: builder.query<RevenueData[], string>({
      query: (stockId) => {
        const end = new Date();
        const start = new Date();
        start.setFullYear(start.getFullYear() - 6); // 5年+1年（用於計算年增率）

        return {
          url: "",
          method: "GET",
          params: {
            dataset: "TaiwanStockMonthRevenue",
            data_id: stockId,
            start_date: start.toISOString().split("T")[0],
            end_date: end.toISOString().split("T")[0],
            token: API_CONFIG.FINMIND_TOKEN,
          },
        };
      },
      transformResponse: (response: ApiResponse<RevenueApiData[]>) => {
        if (response.status !== 200) {
          throw new Error(response.msg || "API 回應異常");
        }

        // 建立一個 Map 來存儲每個月的營收
        const revenueMap = new Map<string, number>();
        response.data.forEach((item) => {
          const key = `${item.revenue_year}-${item.revenue_month}`;
          revenueMap.set(key, item.revenue);
        });

        // 轉換資料格式並計算年增率
        return response.data
          .map((item) => {
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
      },
    }),
  }),
});
