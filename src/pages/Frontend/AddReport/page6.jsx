import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  TextField,
  Box,
  Select,
  useTheme,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useDispatch, useSelector } from "react-redux";
import { setLock, setPage } from "src/store/reducers/registerReport";
import ProgressBar from "src/layouts/Report/ProgressBar";

const Page6 = () => {
  const { rape: value, rape_people: count } = useSelector(
    (state) => state.reportRegister.data
  );
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const theme = useTheme();
  const setValue = (rape) => dispatch(setPage({ rape }));
  const setCount = (rape_people) => dispatch(setPage({ rape_people }));

  const handleChange = (event) => {
    const value = Number(event.target.value);
    if (value === 0) {
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
        <Grid container spacing={2} justifyContent="center">
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
                Rape
              </Typography>
              <Box
                borderBottom={2}
                borderColor={theme.palette.warning.main}
                style={{ marginLeft: "5px", width: "20px" }}
              />
            </Box>
          </Grid>

          <Box sx={{ py: 1 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "COLUMN",
                justifyContent: "center",
                my: 4,
                pl: 2,
              }}
            >
              <Typography id="number-picker-label" style={{ paddingBottom: '16px', textAlign: 'center', fontSize: '16px' }}>
                Was anyone raped?
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={value == 0}
                    value={0}
                    onChange={handleChange}
                  />
                }
                label="Does Not Apply"
                sx={{ paddingBottom: "20px" }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={value == 1}
                    value={1}
                    onChange={handleChange}
                  />
                }
                label="Attempted Rape"
                sx={{ paddingTop: "20px", paddingBottom: "20px" }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={value == 2}
                    value={2}
                    onChange={handleChange}
                  />
                }
                label="Rape"
                sx={{ paddingTop: "10px" }}
              />
              <br />
              <br />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "start",
                  alignItems: "center",
                  margin: "3",
                  paddingTop: "15px",
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
                  error={error ? true : false}
                  disabled={value === 0}
                >
                  {Array.from({ length: 30 }, (_, index) => (
                    <MenuItem key={index + 1} value={index + 1}>
                      {index + 1}
                    </MenuItem>
                  ))}
                </Select>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "normal", px: 2, textAlign: "center" }}
                >
                  Multiple rapes
                </Typography>
              </div>
            </Box>
          </Box>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
};

export default Page6;
