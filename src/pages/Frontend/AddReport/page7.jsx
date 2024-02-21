import React, { useState, useEffect } from "react";
import {
  Container,
  useTheme,
  Typography,
  Grid,
  Box,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useDispatch, useSelector } from "react-redux";
import { setLock, setPage } from "src/store/reducers/registerReport";
import ProgressBar from "src/layouts/Report/ProgressBar";

function Page7() {
  const { assault: value, assault_people: count } = useSelector(
    (state) => state.reportRegister.data
  );
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const setValue = (assault) => dispatch(setPage({ assault }));
  const setCount = (assault_people) => dispatch(setPage({ assault_people }));

  const theme = useTheme();
  const handleChange = (event) => {
    const value = Number(event.target.value);
    if (value === 0 || value === 2) {
      dispatch(setLock(false));
      setCount(null);
    } else {
      setCount(1);
    }
    setValue(value);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container>
        <Grid
          container
          spacing={2}
          justifyContent="center"
          sx={{ paddingY: 0 }}
        >
          <Grid item xs={10} sx={{ pt: 5, mt: 5 }}>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Box
                borderBottom={2}
                borderColor={theme.palette.warning.main}
                style={{ marginRight: "5px", width: "20px" }}
              />
              <Typography
                variant="h1"
                align="center"
                style={{
                  fontWeight: "bold",
                  paddingBottom: "5px",
                  fontSize: "24px",
                }}
              >
                Assault
              </Typography>
              <Box
                borderBottom={2}
                borderColor={theme.palette.warning.main}
                style={{ marginLeft: "5px", width: "20px" }}
              />
            </Box>
            <Typography
              variant="h2"
              align="center"
              style={{
                fontWeight: "bold",
                paddingBottom: "20px",
                fontSize: "12px",
              }}
            >
              (i.e. injuries due to violence)
            </Typography>
          </Grid>

          <Box sx={{ py: 1 }}>
            <Typography id="number-picker-label" style={{ paddingBottom: '16px', textAlign: 'center', fontSize: '16px' }}>
              Was anyone assaulted?
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                my: 4,
                pl: 14,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={value == 0}
                    value={0}
                    onChange={handleChange}
                    sx={{ paddingY: "20px", paddingLeft: "20px" }}
                  />
                }
                label="Unknown"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={value == 1}
                    value={1}
                    onChange={handleChange}
                    sx={{ paddingY: "20px", paddingLeft: "20px" }}
                  />
                }
                label="Yes"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={value == 2}
                    value={2}
                    onChange={handleChange}
                    sx={{ paddingY: "20px", paddingLeft: "20px" }}
                  />
                }
                label="No"
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "start",
                  alignItems: "center",
                  mt: 3,
                }}
              >
                <Select
                  value={count || ""}
                  onChange={(e) => {
                    const count = e.target.value;
                    if (!count || count <= 0) {
                      dispatch(setLock(true));
                      setError("*required");
                    } else {
                      dispatch(setLock(false));
                      setError("");
                    }
                    setCount(count);
                  }}
                  disabled={value === 0 || value === 2}
                >
                  {Array.from({ length: 30 }, (_, index) => index + 1).map(
                    (num) => (
                      <MenuItem key={num} value={num}>
                        {num}
                      </MenuItem>
                    )
                  )}
                </Select>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "normal", px: 2, textAlign: "center" }}
                >
                  If so, how many were assaulted?
                </Typography>
              </Box>
              {error && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
}

export default Page7;
