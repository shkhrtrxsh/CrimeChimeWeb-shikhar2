  import React, { useState, useEffect } from "react";
  import {
    Container,
    useTheme,
    Typography,
    Grid,
    Box,
    RadioGroup,
    Radio,
    FormControlLabel,
    Checkbox,
  } from "@mui/material";
  import AdapterDateFns from "@mui/lab/AdapterDateFns";
  import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
  import TypoSub from "src/components/Typography/TypoSub";
  import { useDispatch, useSelector } from "react-redux";
  import ProgressBar from "src/layouts/Report/ProgressBar";
  import { setPage } from "src/store/reducers/registerReport";

  function Page17() {
    const { shoplifting: value } = useSelector(
      (state) => state.reportRegister.data
    );
    const dispatch = useDispatch();
    const theme = useTheme();
    const setValue = (shoplifting) => dispatch(setPage({ shoplifting }));

    const handleChange = (event) => {
      setValue(Number(event.target.value));
    };

    const defaultCheckedValue = 0; // Default value for "Does Not Apply"

    const fields = [
      { value: 0, main: "Does Not Apply" },
      { value: 1, main: "Attempted Shoplifting", sub: "goods were not stolen" },
      { value: 2, main: "Shoplifting", sub: "goods were stolen" },
    ];

    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={10} sx={{ pt: { xs: 5, md: 0 }, mt: 5 }}>
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
                  Shoplifting
                </Typography>
                <Box
                  borderBottom={2}
                  borderColor={theme.palette.warning.main}
                  style={{ marginLeft: "5px", width: "20px" }}
                />
              </Box>
            </Grid>

            <Box sx={{ pl: 3, pt: 5 }}>
              <div sx={{ display: "flex", flexDirection: "column" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    my: 5,
                    pl: 8,
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {fields.map((f, ind) => {
                      return (
                        <FormControlLabel
                          control={<Checkbox />}
                          checked={
                            value === f.value ||
                            (f.value === defaultCheckedValue && value === null)
                          }
                          value={f.value}
                          key={ind}
                          label={
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                paddingTop: "20px",
                                paddingBottom: "20px"
                              }}
                            >
                              <TypoSub mainText={f.main} subText={f.sub} />
                            </Box>
                          }
                          onChange={handleChange}
                        />
                      );
                    })}
                  </Box>
                </Box>
              </div>
            </Box>
          </Grid>
        </Container>
      </LocalizationProvider>
    );
  }

  export default Page17;
