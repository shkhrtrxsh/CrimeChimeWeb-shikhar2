import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  useTheme,
  Grid,
  Box,
  Checkbox,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useDispatch, useSelector } from "react-redux";
import { setLock, setPage } from "src/store/reducers/registerReport";
import ProgressBar from "src/layouts/Report/ProgressBar";

const Page12 = () => {
  const { kidnapping: checked, kidnapping_people: value } = useSelector(
    (state) => state.reportRegister.data
  );
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const theme = useTheme();

  const setChecked = (kidnapping) => dispatch(setPage({ kidnapping }));
  const setValue = (kidnapping_people) =>
    dispatch(setPage({ kidnapping_people }));

  const handleChange = (event) => {
    const checked = event.target?.checked;
    if (checked) {
      setChecked(Number(event.target.value));
      if (checked === 0 || checked === 1) {
        dispatch(setLock(false));
        setError("");
      } else {
        setValue(1);
      }
    } else {
      setValue(event.target.value);
    }
  };

  useEffect(() => {
    if (value) {
      dispatch(setLock(false));
      setError("");
    } else if (checked === 1) {
      dispatch(setLock(true));
      setError("*required");
    }
  }, [value]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container>
        <Grid
          container
          spacing={2}
          justifyContent="center"
          sx={{ paddingY: 0 }}
          mt={5}
        >
          <Grid item xs={10}>
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
                Kidnapping
              </Typography>
              <Box
                borderBottom={2}
                borderColor={theme.palette.warning.main}
                style={{ marginLeft: "5px", width: "20px" }}
              />
            </Box>
          </Grid>

          <Grid item xs={8} style={{ paddingLeft: "40px" }}>
            <Typography id="number-picker-label" style={{ paddingBottom: '16px', textAlign: 'center', fontSize: '16px' }}>
              Was kidnapping involved?
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                paddingLeft: "20px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  my: 4,
                }}
              >
                <Checkbox
                  checked={checked == 0}
                  value={0}
                  onChange={handleChange}
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "normal", px: 2, textAlign: "left" }}
                >
                  Does not apply
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  my: 4,
                }}
              >
                <Checkbox
                  checked={checked == 1}
                  value={1}
                  onChange={handleChange}
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "normal", pl: 2, textAlign: "left" }}
                >
                  Attempted kidnapping
                  <br />
                  <Typography variant="body2" sx={{ textAlign: "left" }}>
                    (unsuccessful kidnapping attempt)
                  </Typography>
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  my: 4,
                }}
              >
                <Checkbox
                  checked={checked == 2}
                  value={2}
                  onChange={handleChange}
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "normal", pl: 2, textAlign: "left" }}
                >
                  Kidnapping
                  <br />
                  <Typography variant="body2" sx={{ textAlign: "left" }}>
                    (Number of persons kidnapped)
                  </Typography>
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  my: 4,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <Select
                    value={value || ""}
                    onChange={(event) => setValue(event.target.value)}
                    disabled={checked === 0 || checked === 1}
                    error={error ? true : false}
                  >
                    {Array.from({ length: 30 }, (_, index) => index).map(
                      (num) => (
                        <MenuItem key={num} value={num + 1}>
                          {num + 1}
                        </MenuItem>
                      )
                    )}
                  </Select>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "normal", textAlign: "left", pl: 1 }}
                  >
                    How many were kidnapped?
                  </Typography>
                </Box>
              </Box>
              {error && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
};

export default Page12;
