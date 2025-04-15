import SearchIcon from "@mui/icons-material/Search";
import {
  AppBar,
  Box,
  Button,
  Container,
  InputBase,
  styled,
  Tab,
  Tabs,
  Toolbar,
} from "@mui/material";
import Image from "next/image";
import { useState } from "react";

interface HeaderProps {
  onSearch: (stockId: string) => void;
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

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.primary.main,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    paddingRight: theme.spacing(14),
    transition: theme.transitions.create("width"),
    width: "100%",
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

export const Header = ({ onSearch }: HeaderProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [tabValue, setTabValue] = useState(0);

  const handleSearch = () => {
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
      setSearchValue(""); // Reset input after search
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
            disableGutters
            sx={{
              display: "grid",
              gridTemplateColumns: "minmax(auto, 1fr) auto minmax(auto, 1fr)",
              alignItems: "center",
              minHeight: 64,
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Image
                src="/stockcat.png"
                alt="Stock Cat Logo"
                width={40}
                height={40}
                style={{ marginRight: "16px" }}
              />
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
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
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="輸入台股代號/美股代號/關鍵字"
                inputProps={{ "aria-label": "search" }}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <SearchButton
                variant="contained"
                size="small"
                onClick={handleSearch}
              >
                搜尋
              </SearchButton>
            </Search>
            <Box /> {/* Empty box for the third column */}
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar /> {/* 這個是為了補償 fixed AppBar 的空間 */}
    </>
  );
};
