"use client";

import { Header } from "@/components/Header";
import { RevenueChart } from "@/components/RevenueChart";
import { RevenueTable } from "@/components/RevenueTable";
import { StockInfo } from "@/components/StockInfo";
import TimeRange from "@/config/timerange";
import { useRevenueData } from "@/hooks/useRevenueData";
import { useStockInfo } from "@/hooks/useStockInfo";
import { useStockList } from "@/hooks/useStockList";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Paper,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function Home() {
  const [timeRange, setTimeRange] = useState<TimeRange.Range>(
    TimeRange.Range.FIVE_YEAR
  );
  const [stockId, setStockId] = useState<string>("2867");
  const { data, isLoading, error } = useRevenueData(stockId);
  const {
    data: stockInfo,
    isLoading: stockInfoLoading,
    error: stockInfoError,
  } = useStockInfo(stockId);
  const {
    data: stockList,
    isLoading: stockListLoading,
    error: stockListError,
  } = useStockList();

  useEffect(() => {
    if (stockList) {
      console.log("Stock List Response:", stockList);
    }
  }, [stockList]);

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value as unknown as TimeRange.Range);
  };

  const handleSearch = (newStockId: string) => {
    setStockId(newStockId);
  };

  if (error || stockInfoError || stockListError) {
    return (
      <>
        <Header onSearch={handleSearch} stockList={[]} />
        <Container maxWidth="lg">
          <Box sx={{ py: 4 }}>
            <Alert severity="error">
              {error || stockInfoError || stockListError}
            </Alert>
          </Box>
        </Container>
      </>
    );
  }

  if (isLoading || stockInfoLoading || stockListLoading) {
    return (
      <>
        <Header onSearch={handleSearch} stockList={[]} />
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
      <Header onSearch={handleSearch} stockList={stockList} />
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <StockInfo
            stockId={stockId}
            stockName={stockInfo?.stock_name ?? ""}
          />
          <Paper sx={{ p: 3, mb: 3 }}>
            <RevenueChart
              data={data}
              timeRange={timeRange}
              onTimeRangeChange={handleTimeRangeChange}
            />
          </Paper>
          <Paper sx={{ p: 3 }}>
            <RevenueTable data={data} timeRange={timeRange} />
          </Paper>
        </Box>
      </Container>
    </>
  );
}
