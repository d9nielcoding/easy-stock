import SearchIcon from "@mui/icons-material/Search";
import {
  AppBar,
  Button,
  Container,
  InputBase,
  Toolbar,
  alpha,
  styled,
} from "@mui/material";
import { useState } from "react";

interface HeaderProps {
  onSearch: (stockId: string) => void;
}

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: "auto",
  marginRight: "auto",
  width: "100%",
  display: "flex",
  alignItems: "center",
  maxWidth: "500px",
  transition: theme.transitions.create(["width", "background-color"], {
    duration: theme.transitions.duration.standard,
    easing: theme.transitions.easing.easeInOut,
  }),
  [theme.breakpoints.up("sm")]: {
    width: "400px",
    "&:focus-within": {
      width: "500px",
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
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    paddingRight: theme.spacing(12),
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

const SearchButton = styled(Button)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(1),
  color: theme.palette.common.white,
  borderColor: theme.palette.common.white,
  "&:hover": {
    borderColor: theme.palette.common.white,
    backgroundColor: alpha(theme.palette.common.white, 0.1),
  },
}));

export const Header = ({ onSearch }: HeaderProps) => {
  const [searchValue, setSearchValue] = useState("");

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

  return (
    <AppBar position="static" elevation={0} color="primary">
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            justifyContent: "center",
            minHeight: 64,
          }}
        >
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="搜尋股票代號或名稱…"
              inputProps={{ "aria-label": "search" }}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <SearchButton
              variant="outlined"
              size="small"
              onClick={handleSearch}
            >
              搜尋
            </SearchButton>
          </Search>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
