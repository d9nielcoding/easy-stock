import { API_CONFIG } from "@/config/api";
import { StockInfo } from "@/types/stock";
import axios from "axios";
import { useEffect, useState } from "react";

interface ApiResponse {
  msg: string;
  status: number;
  data: StockInfo[];
}

export const useStockList = () => {
  const [data, setData] = useState<StockInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get<ApiResponse>(
          API_CONFIG.FINMIND_API_URL,
          {
            params: {
              dataset: "TaiwanStockInfo",
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

        // 設置股票列表
        const uniqueStocks = response.data.data.reduce(
          (acc: StockInfo[], current) => {
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
          },
          []
        );

        setData(uniqueStocks);
      } catch (err) {
        console.error("API Error:", err);
        setError(err instanceof Error ? err.message : "發生錯誤，請稍後再試");
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // 只在組件掛載時執行一次

  return { data, isLoading, error };
};
