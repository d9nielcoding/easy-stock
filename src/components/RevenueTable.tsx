import TimeRange from "@/config/timerange";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useRef } from "react";

interface RevenueData {
  date: string;
  revenue: number;
  yoyGrowthRate: number;
}

interface RevenueTableProps {
  data: RevenueData[];
  timeRange: TimeRange.Range;
}

const formatRevenue = (value: number) => {
  const thousands = Math.round(value / 1000);
  const formatter = new Intl.NumberFormat("zh-TW");
  return formatter.format(thousands);
};

export const RevenueTable = ({ data, timeRange }: RevenueTableProps) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Take the last n months of data based on timeRange
  const recentData = useMemo(() => {
    const months = timeRange * 12;
    return data.slice(-months);
  }, [data, timeRange]);

  useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollLeft =
        tableContainerRef.current.scrollWidth;
    }
  }, [recentData]);

  return (
    <div>
      <Typography
        variant="subtitle1"
        sx={{
          mb: 1.5,
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          padding: "6px 12px",
          borderRadius: 1,
          display: "inline-block",
        }}
      >
        詳細數據
      </Typography>
      <TableContainer
        ref={tableContainerRef}
        component={Paper}
        sx={{
          maxWidth: "fit-content",
          "& .MuiTableCell-root": {
            padding: "8px 16px",
            borderColor: (theme) => theme.palette.divider,
          },
          "& .sticky-column": {
            position: "sticky",
            left: 0,
            zIndex: 1,
            backgroundColor: (theme) => theme.palette.background.paper,
            width: "180px",
            minWidth: "180px",
            "&::after": {
              content: '""',
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: "2px",
              backgroundColor: (theme) => theme.palette.divider,
            },
          },
          "& .sticky-header": {
            zIndex: 2,
          },
        }}
      >
        <Table
          size="small"
          sx={{
            "& .MuiTableCell-root": {
              borderWidth: 1,
              borderStyle: "solid",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                className="sticky-column sticky-header"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: (theme) => theme.palette.action.hover,
                }}
              >
                年度月份
              </TableCell>
              {recentData.map((row) => (
                <TableCell
                  key={row.date}
                  align="right"
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: (theme) => theme.palette.action.hover,
                  }}
                >
                  {row.date}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell
                component="th"
                scope="row"
                className="sticky-column"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: (theme) => theme.palette.action.hover,
                }}
              >
                每月營收
              </TableCell>
              {recentData.map((row) => (
                <TableCell key={row.date} align="right">
                  {formatRevenue(row.revenue)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell
                component="th"
                scope="row"
                className="sticky-column"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: (theme) => theme.palette.action.hover,
                }}
              >
                單月營收年增率 (%)
              </TableCell>
              {recentData.map((row) => (
                <TableCell
                  key={row.date}
                  align="right"
                  sx={{
                    color: row.yoyGrowthRate >= 0 ? "#4caf50" : "#f44336",
                  }}
                >
                  {row.yoyGrowthRate.toFixed(2)}%
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Typography
        variant="caption"
        sx={{
          display: "block",
          textAlign: "right",
          p: 1,
          color: "text.secondary",
        }}
      >
        圖表單位：千元，數據來自公開資訊觀測站
      </Typography>
    </div>
  );
};
