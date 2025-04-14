"use client";

import { RevenueBarChart } from "@/components/RevenueBarChart";
import { RevenueTable } from "@/components/RevenueTable";
import { Box, Container, Paper } from "@mui/material";

// 模擬資料，實際使用時應該從 API 獲取
const mockData = [
  { date: "2023-07", revenue: 587040, yoyGrowthRate: 53.65 },
  { date: "2023-08", revenue: 9901845, yoyGrowthRate: -12.23 },
  { date: "2023-09", revenue: 9704224, yoyGrowthRate: -0.52 },
  { date: "2023-10", revenue: 6431065, yoyGrowthRate: -31.04 },
  { date: "2023-11", revenue: 8169564, yoyGrowthRate: 5.18 },
  { date: "2023-12", revenue: 11548000, yoyGrowthRate: 29.35 },
];

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <RevenueBarChart data={mockData} />
        </Paper>
        <Paper sx={{ p: 3 }}>
          <RevenueTable data={mockData} />
        </Paper>
      </Box>
    </Container>
  );
}
