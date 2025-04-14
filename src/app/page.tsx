"use client";

import { RevenueChart } from "@/components/RevenueChart";
import { RevenueTable } from "@/components/RevenueTable";
import TimeRange from "@/config/timerange";
import { useRevenueData } from "@/hooks/useRevenueData";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Paper,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";

const timeRangeOptions = TimeRange.values().map((timeRange) => ({
  value: timeRange,
  label: `近${timeRange}年`,
}));

export default function Home() {
  const [timeRange, setTimeRange] = useState<TimeRange.Range>(
    TimeRange.Range.FIVE_YEAR
  );
  const { data, isLoading, error } = useRevenueData("2867"); // 三商壽

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value as unknown as TimeRange.Range);
  };

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  if (isLoading) {
    return (
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
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
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
  );
}
