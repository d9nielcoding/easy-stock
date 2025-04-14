import { Box, Paper, Typography } from "@mui/material";

interface StockInfoProps {
  stockId: string;
  stockName: string;
}

export const StockInfo = ({ stockId, stockName }: StockInfoProps) => {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="h6" component="h1">
          {stockName}
        </Typography>
        <Typography
          variant="h6"
          component="span"
          sx={{ color: "text.secondary" }}
        >
          ({stockId})
        </Typography>
      </Box>
    </Paper>
  );
};
