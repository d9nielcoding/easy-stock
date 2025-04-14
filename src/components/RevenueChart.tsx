import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  BarPlot,
  ChartContainer,
  ChartsXAxis,
  ChartsYAxis,
  LinePlot,
} from "@mui/x-charts";
import { useEffect, useRef, useState } from "react";

// 定義數據類型
interface RevenueData {
  date: string;
  revenue: number;
  yoyGrowthRate: number;
  [key: string]: string | number;
}

interface RevenueChartProps {
  data: RevenueData[];
}

const StyledChartContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  height: 400,
  padding: theme.spacing(2),
  "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
    transform: "rotate(-45deg)",
    transformOrigin: "top left",
  },
}));

const timeRangeOptions = [
  { value: "1y", label: "1年" },
  { value: "3y", label: "3年" },
  { value: "5y", label: "5年" },
];

export const RevenueChart = ({ data }: RevenueChartProps) => {
  const [timeRange, setTimeRange] = useState("1y");
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(800);
  const theme = useTheme();

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        // Convert theme spacing to number (removes 'px' from the end)
        const padding = Number(theme.spacing(4).replace("px", ""));
        setChartWidth(width - padding);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [theme]);

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value);
  };

  // 根據選擇的時間範圍過濾數據
  const filteredData = data.slice(-getMonthsFromTimeRange(timeRange));

  // 準備圖表數據
  const xLabels = filteredData.map((d) => d.date);
  const revenueData = filteredData.map((d) => d.revenue);
  const growthData = filteredData.map((d) => d.yoyGrowthRate);

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

      <StyledChartContainer ref={containerRef}>
        <ChartContainer
          width={chartWidth}
          height={350}
          margin={{ left: 70, right: 70, top: 20, bottom: 50 }}
          series={[
            {
              type: "bar",
              data: revenueData,
              label: "月營收",
              yAxisKey: "revenue",
              color: "#ffa726",
            },
            {
              type: "line",
              data: growthData,
              label: "年增率",
              yAxisKey: "growth",
              color: "#2196f3",
            },
          ]}
          xAxis={[
            {
              id: "timestamp",
              data: xLabels,
              scaleType: "band",
              tickLabelStyle: {
                angle: 45,
                textAnchor: "start",
              },
            },
          ]}
          yAxis={[
            {
              id: "revenue",
              scaleType: "linear",
              valueFormatter: (value: number) => `${formatNumber(value)}`,
              label: "千元",
            },
            {
              id: "growth",
              scaleType: "linear",
              valueFormatter: (value: number) => `${value.toFixed(2)}%`,
              label: "年增率 (%)",
              position: "right",
            },
          ]}
        >
          <BarPlot />
          <LinePlot />
          <ChartsXAxis label="日期" position="bottom" axisId="timestamp" />
          <ChartsYAxis label="營收 (千元)" position="left" axisId="revenue" />
          <ChartsYAxis label="年增率 (%)" position="right" axisId="growth" />
        </ChartContainer>
      </StyledChartContainer>
    </Box>
  );
};

// 輔助函數
function getMonthsFromTimeRange(range: string): number {
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
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("zh-TW").format(Math.round(value));
}

export default RevenueChart;
