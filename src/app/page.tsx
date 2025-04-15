"use client";

import { Header } from "@/components/Header";
import { RevenueChart } from "@/components/RevenueChart";
import { RevenueTable } from "@/components/RevenueTable";
import { StockInfo } from "@/components/StockInfo";
import TimeRange from "@/config/timerange";
import {
  useGetRevenueDataQuery,
  useGetStockInfoQuery,
  useGetStockListQuery,
} from "@/store/store";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Paper,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [timeRange, setTimeRange] = useState<TimeRange.Range>(
    TimeRange.Range.FIVE_YEAR
  );
  const [stockId, setStockId] = useState<string>("2867");

  const {
    data: stockList,
    isLoading: stockListLoading,
    error: stockListError,
  } = useGetStockListQuery();

  const {
    data: stockInfo,
    isLoading: stockInfoLoading,
    error: stockInfoError,
  } = useGetStockInfoQuery(stockId);

  const { data, isLoading, error } = useGetRevenueDataQuery(stockId);

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value as unknown as TimeRange.Range);
  };

  const handleSearch = (newStockId: string) => {
    setStockId(newStockId);
  };

  if (error || stockInfoError) {
    const errorMessage = error
      ? "error" in error
        ? error.error
        : "data" in error
        ? JSON.stringify(error.data)
        : "未知錯誤"
      : stockInfoError
      ? "error" in stockInfoError
        ? stockInfoError.error
        : "data" in stockInfoError
        ? JSON.stringify(stockInfoError.data)
        : "未知錯誤"
      : "發生錯誤";

    return (
      <>
        <Header onSearch={handleSearch} stockList={stockList || []} />
        <Container maxWidth="lg">
          <Box sx={{ py: 4 }}>
            <Alert severity="error">{errorMessage}</Alert>
          </Box>
        </Container>
      </>
    );
  }

  if (isLoading || stockInfoLoading) {
    return (
      <>
        <Header onSearch={handleSearch} stockList={stockList || []} />
        <Container maxWidth="lg">
          <Box
            sx={{
              py: 4,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header onSearch={handleSearch} stockList={stockList || []} />
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <StockInfo
            stockId={stockId}
            stockName={stockInfo?.stock_name ?? ""}
          />
          <Paper sx={{ p: 3, mb: 3 }}>
            <RevenueChart
              data={data || []}
              timeRange={timeRange}
              onTimeRangeChange={handleTimeRangeChange}
            />
          </Paper>
          <Paper sx={{ p: 3 }}>
            <RevenueTable data={data || []} timeRange={timeRange} />
          </Paper>
        </Box>
      </Container>
    </>
  );
}
