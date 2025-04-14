import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface RevenueData {
  date: string;
  revenue: number;
  yoyGrowthRate: number;
}

interface RevenueBarChartProps {
  data: RevenueData[];
}

const timeRangeOptions = [
  { value: "1y", label: "近1年" },
  { value: "3y", label: "近3年" },
  { value: "5y", label: "近5年" },
];

const formatRevenue = (value: number) => {
  const formatter = new Intl.NumberFormat("zh-TW", {
    notation: "compact",
    compactDisplay: "short",
  });
  return formatter.format(value);
};

const formatRevenueDetailed = (value: number) => {
  const formatter = new Intl.NumberFormat("zh-TW");
  return formatter.format(value);
};

export const RevenueBarChart = ({ data }: RevenueBarChartProps) => {
  const [timeRange, setTimeRange] = useState("1y");

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value);
  };

  // Filter data based on selected time range
  const getMonthsFromTimeRange = (range: string): number => {
    switch (range) {
      case "1y":
        return 12;
      case "3y":
        return 36;
      case "5y":
        return 60;
      default:
        return 12;
    }
  };

  const recentData = useMemo(() => {
    return data.slice(-getMonthsFromTimeRange(timeRange));
  }, [data, timeRange]);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">月營收與年增率</Typography>
        <FormControl size="small" sx={{ width: 120 }}>
          <InputLabel>時間範圍</InputLabel>
          <Select
            value={timeRange}
            label="時間範圍"
            onChange={handleTimeRangeChange}
          >
            {timeRangeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <ComposedChart data={recentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12 }}
              tickFormatter={formatRevenue}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === "月營收") {
                  return [formatRevenueDetailed(value), "月營收"];
                }
                return [`${value.toFixed(2)}%`, "年增率"];
              }}
            />
            <Legend />
            <Bar
              dataKey="revenue"
              name="月營收"
              fill="#ffa726"
              yAxisId="left"
              barSize={20}
            />
            <Line
              type="monotone"
              dataKey="yoyGrowthRate"
              name="年增率"
              stroke="#2196f3"
              yAxisId="right"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};
