import { API_CONFIG } from "@/config/api";
import { StockInfo } from "@/types/stock";
import axios from "axios";
import { useEffect, useState } from "react";

interface ApiResponse {
  msg: string;
  status: number;
  data: StockInfo[];
}

export const useStockInfo = (stockId: string) => {
  const [data, setData] = useState<StockInfo | null>(null);
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
              data_id: stockId,
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

        // 取得最新的股票資訊
        const latestInfo = response.data.data[0];
        if (!latestInfo) {
          throw new Error("無法取得股票資訊");
        }
        setData(latestInfo);
      } catch (err) {
        console.error("API Error:", err);
        setError(err instanceof Error ? err.message : "發生錯誤，請稍後再試");
        setData(null);
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
