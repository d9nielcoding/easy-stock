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
import { useMemo } from "react";

interface RevenueData {
  date: string;
  revenue: number;
  yoyGrowthRate: number;
}

interface RevenueTableProps {
  data: RevenueData[];
}

const formatRevenue = (value: number) => {
  const formatter = new Intl.NumberFormat("zh-TW");
  return formatter.format(value);
};

export const RevenueTable = ({ data }: RevenueTableProps) => {
  // Take the last 6 months of data
  const recentData = useMemo(() => data.slice(-6), [data]);

  return (
    <div>
      <Typography variant="h6" sx={{ mb: 2 }}>
        詳細數據
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>年月份</TableCell>
              <TableCell align="right">月營收</TableCell>
              <TableCell align="right">年增率 (%)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentData.map((row) => (
              <TableRow key={row.date}>
                <TableCell component="th" scope="row">
                  {row.date}
                </TableCell>
                <TableCell align="right">
                  {formatRevenue(row.revenue)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: row.yoyGrowthRate >= 0 ? "#4caf50" : "#f44336",
                  }}
                >
                  {row.yoyGrowthRate.toFixed(2)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
