import { StockInfo } from "@/types/stock";
import SearchIcon from "@mui/icons-material/Search";
import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  Container,
  InputBase,
  styled,
  Tab,
  Tabs,
  Toolbar,
} from "@mui/material";
import { useState } from "react";

interface HeaderProps {
  onSearch: (value: string) => void;
  stockList: StockInfo[];
}

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "24px",
  border: `2px solid ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.common.white,
    borderColor: theme.palette.primary.dark,
    "& .MuiButton-root": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  width: "100%",
  display: "flex",
  alignItems: "center",
  maxWidth: "400px",
  transition: theme.transitions.create(["width", "border-color"], {
    duration: theme.transitions.duration.standard,
    easing: theme.transitions.easing.easeInOut,
  }),
  [theme.breakpoints.up("sm")]: {
    width: "400px",
    "&:focus-within": {
      width: "400px",
      borderColor: theme.palette.primary.dark,
      "& .MuiButton-root": {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  },
}));

const SearchButton = styled(Button)(({ theme }) => ({
  position: "absolute",
  right: -2,
  top: -2,
  bottom: -2,
  height: "auto",
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
  borderRadius: "0 24px 24px 0",
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  transition: theme.transitions.create(["background-color", "border-color"], {
    duration: theme.transitions.duration.shortest,
  }),
  boxShadow: "none",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: "none",
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 14, 1, 2),
    width: "100%",
    "&::placeholder": {
      color: theme.palette.text.secondary,
      opacity: 1,
    },
  },
}));

export const Header = ({ onSearch, stockList }: HeaderProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [tabValue, setTabValue] = useState(0);

  const handleSearch = () => {
    // 檢查是否有完全符合的股票
    const hasExactMatch = stockList.some(
      (stock) => stock.stock_id === searchValue
    );

    if (searchValue && hasExactMatch) {
      onSearch(searchValue);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
          boxShadow: "0 1px 2px 0 rgba(0,0,0,0.03)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            sx={{
              display: "grid",
              gridTemplateColumns: "minmax(auto, 1fr) auto minmax(auto, 1fr)",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <img src="/stockcat.png" alt="Logo" style={{ height: "32px" }} />
              <Tabs
                value={tabValue}
                onChange={(_, value) => setTabValue(value)}
                sx={{
                  minHeight: 64,
                  "& .MuiTab-root": {
                    color: "text.secondary",
                    minHeight: 64,
                    padding: "6px 8px",
                    minWidth: "unset",
                    marginRight: "4px",
                    fontWeight: "normal",
                    fontSize: "0.875rem",
                    "&.Mui-selected": {
                      color: "primary.main",
                      fontWeight: "bold",
                    },
                    "&.Mui-disabled": {
                      color: "text.disabled",
                      opacity: 0.6,
                    },
                    "&[disabled]": {
                      cursor: "not-allowed",
                      pointerEvents: "auto",
                    },
                  },
                }}
              >
                <Tab label="個股" />
                <Tab label="選股" disabled />
                <Tab label="觀點" disabled />
                <Tab label="產業" disabled />
                <Tab label="購買" disabled />
                <Tab
                  label="更多"
                  disabled
                  sx={{
                    "&[disabled]": {
                      cursor: "not-allowed",
                      pointerEvents: "auto",
                    },
                  }}
                />
              </Tabs>
            </Box>
            <Search>
              <Autocomplete
                freeSolo
                options={stockList}
                getOptionLabel={(option) =>
                  typeof option === "string"
                    ? option
                    : `${option.stock_id} ${option.stock_name}`
                }
                value={undefined}
                inputValue={searchValue}
                onInputChange={(_, newValue) => setSearchValue(newValue)}
                onChange={(_, newValue) => {
                  if (newValue && typeof newValue !== "string") {
                    setSearchValue(newValue.stock_id);
                    onSearch(newValue.stock_id);
                  }
                }}
                renderInput={(params) => (
                  <StyledInputBase
                    {...params.InputProps}
                    ref={params.InputProps.ref}
                    placeholder="搜尋股票代號..."
                    onKeyPress={handleKeyPress}
                    inputProps={{
                      ...params.inputProps,
                      type: "search",
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    {option.stock_id} {option.stock_name}
                  </li>
                )}
                filterOptions={(options, { inputValue }) => {
                  const searchText = inputValue.toLowerCase();
                  if (!searchText) return [];
                  return options
                    .filter((option) =>
                      option.stock_id.toLowerCase().startsWith(searchText)
                    )
                    .slice(0, 10);
                }}
                disableClearable
                popupIcon={null}
                componentsProps={{
                  paper: {
                    sx: {
                      marginTop: 1,
                    },
                  },
                }}
                sx={{
                  width: "100%",
                  "& .MuiAutocomplete-endAdornment": {
                    display: "none",
                  },
                  "& .MuiInputBase-root": {
                    padding: 0,
                  },
                }}
              />
              <SearchButton onClick={handleSearch}>
                <SearchIcon />
              </SearchButton>
            </Search>
            <Box /> {/* Spacer */}
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar /> {/* 補償 fixed AppBar 的空間 */}
    </>
  );
};
