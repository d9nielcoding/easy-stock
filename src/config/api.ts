export const API_CONFIG = {
  FINMIND_API_URL: "https://api.finmindtrade.com/api/v4/data",
  FINMIND_TOKEN: process.env.NEXT_PUBLIC_FINMIND_TOKEN || "",
} as const;
