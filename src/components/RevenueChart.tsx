import TimeRange from "@/config/timerange";
import { RevenueData } from "@/types/revenue";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import {
  BarPlot,
  ChartContainer,
  ChartsLegend,
  ChartsTooltip,
  ChartsXAxis,
  ChartsYAxis,
  LinePlot,
} from "@mui/x-charts";
import { useEffect, useRef, useState } from "react";

interface RevenueChartProps {
  data: RevenueData[];
  timeRange: TimeRange.Range;
  onTimeRangeChange: (event: SelectChangeEvent) => void;
}

const StyledChartContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  height: 400,
  padding: theme.spacing(2),
  position: "relative",
  "& .axis-label": {
    position: "absolute",
    top: theme.spacing(2),
    fontSize: "0.875rem",
    color: theme.palette.text.secondary,
    minWidth: "60px",
    textAlign: "center",
    "&::after": {
      content: '""',
      position: "absolute",
      left: -10,
      right: -10,
      bottom: "-4px",
      height: "1px",
      backgroundColor: theme.palette.divider,
    },
  },
  "& .revenue-label": {
    left: theme.spacing(4),
  },
  "& .growth-label": {
    right: theme.spacing(4),
  },
}));

// const timeRangeOptions = [
//   { value: "1y", label: "近1年" },
//   { value: "5y", label: "近5年" },
// ];
const timeRangeOptions = TimeRange.values().map((timeRange) => ({
  value: timeRange,
  label: `近${timeRange}年`,
}));

// 格式化營收數字（以千元為單位）
const formatRevenue = (value: number) => {
  const thousands = Math.round(value / 1000);
  return new Intl.NumberFormat("zh-TW").format(thousands);
};

// 格式化年增率
const formatGrowthRate = (value: number) => {
  return Math.round(value).toString();
};

export const RevenueChart = ({
  data,
  timeRange,
  onTimeRangeChange,
}: RevenueChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(800);
  const theme = useTheme();

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const padding = Number(theme.spacing(4).replace("px", ""));
        setChartWidth(width - padding);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [theme]);

  // 確保有資料才進行處理
  if (!data || data.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography>尚無資料</Typography>
      </Box>
    );
  }

  // 根據選擇的時間範圍過濾數據
  const months = timeRange * 12;
  const filteredData = data.slice(-months);

  // 確保數據按時間順序排列（從舊到新）
  const sortedData = [...filteredData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const xLabels = sortedData.map((d) => d.date);
  const revenueData = sortedData.map((d) => d.revenue);
  const growthData = sortedData.map((d) => d.yoyGrowthRate);

  // X 軸標籤格式化函數
  const formatXAxisLabel = (value: string) => {
    const index = xLabels.indexOf(value);
    if (index < 0) return "";

    const [year, month] = value.split(/[-\/]/);
    const prevValue = index > 0 ? xLabels[index - 1] : null;
    const [prevYear] = prevValue ? prevValue.split(/[-\/]/) : [null];

    if (index === 0 || year !== prevYear) {
      return `${year}`;
    }
    return "";
  };

  // 計算營收的最大值來設定 y 軸範圍
  const maxRevenue = Math.max(...revenueData);
  const yAxisMax = Math.ceil(maxRevenue / 5000000) * 5000000;

  // 計算年增率的範圍
  const maxGrowth = Math.ceil(Math.max(...growthData));
  const minGrowth = Math.floor(Math.min(...growthData));
  const growthRange = maxGrowth - minGrowth;
  const growthTickCount = 5;

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
        <Typography
          variant="h6"
          sx={{
            backgroundColor: "#1976d2",
            color: "white",
            padding: "8px 16px",
            borderRadius: 1,
          }}
        >
          月營收與年增率
        </Typography>
        <FormControl size="small" sx={{ width: 120 }}>
          <InputLabel>時間範圍</InputLabel>
          <Select
            value={timeRange.toString()}
            label="時間範圍"
            onChange={onTimeRangeChange}
          >
            {timeRangeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <StyledChartContainer ref={containerRef}>
        <Typography className="axis-label revenue-label">千元</Typography>
        <Typography className="axis-label growth-label">%</Typography>
        <ChartContainer
          width={chartWidth}
          height={350}
          margin={{ left: 80, right: 80, top: 40, bottom: 50 }}
          series={[
            {
              type: "bar",
              data: revenueData,
              label: "每月營收",
              yAxisKey: "revenue",
              color: "#e8ae00",
            },
            {
              type: "line",
              data: growthData,
              label: "年增率",
              yAxisKey: "growth",
              color: "#cb4b4b",
              valueFormatter: (value: number) => `${value.toFixed(2)}%`,
            },
          ]}
          xAxis={[
            {
              id: "timestamp",
              data: sortedData.map((d) => d.date),
              scaleType: "band",
              dataKey: "month",
              tickLabelStyle: {
                angle: 0,
                textAnchor: "middle",
                fontSize: 12,
              },
            },
          ]}
          yAxis={[
            {
              id: "revenue",
              scaleType: "linear",
              valueFormatter: formatRevenue,
              min: 0,
              max: yAxisMax,
              tickSize: yAxisMax / 5,
            },
            {
              id: "growth",
              scaleType: "linear",
              valueFormatter: formatGrowthRate,
              position: "right",
              min: Math.floor(minGrowth / 2) * 2,
              max: Math.ceil(maxGrowth / 2) * 2,
              tickSize: Math.ceil(growthRange / growthTickCount),
            },
          ]}
        >
          <BarPlot />
          <LinePlot />
          <ChartsTooltip
            trigger="item"
            formatter={(value: number | string | Date, name: string) => {
              if (name === "每月營收") {
                const thousands = Math.round((value as number) / 1000);
                return [
                  `${new Intl.NumberFormat("zh-TW").format(thousands)} 千元`,
                  name,
                ];
              }
              return [`${(value as number).toFixed(2)}%`, name];
            }}
          />
          <ChartsXAxis position="bottom" axisId="timestamp" disableTicks />
          <ChartsYAxis
            position="left"
            axisId="revenue"
            disableTicks
            disableLine
          />
          <ChartsYAxis
            position="right"
            axisId="growth"
            disableTicks
            disableLine
          />
          <ChartsLegend position={{ vertical: "top", horizontal: "middle" }} />
        </ChartContainer>
      </StyledChartContainer>
    </Box>
  );
};

export default RevenueChart;
