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
import Vehicle from "../../../assets/images/vehiclee.png";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TypoSub from "src/components/Typography/TypoSub";
import { useDispatch, useSelector } from "react-redux";
import ProgressBar from "src/layouts/Report/ProgressBar";
import { setPage } from "src/store/reducers/registerReport";

function Page8() {
  const { vehicle_theft: value } = useSelector(
    (state) => state.reportRegister.data
  );
  const dispatch = useDispatch();
  const theme = useTheme();
  const setValue = (vehicle_theft) => dispatch(setPage({ vehicle_theft }));

  const handleChange = (event) => {
    setValue(Number(event.target.value));
  };

  const fields = [
    { value: 4, main: "Does Not Apply" },
    { value: 0, main: "Hijacking", sub: "occupied vehicle was stolen" },
    {
      value: 1,
      main: "Attempted Hijacking",
      sub: "unsuccessful hijacking not stolen",
    },
    {
      value: 2,
      main: "Vehicle Theft",
      sub: "unoccupied vehicle vehicle was stolen",
    },
    {
      value: 3,
      main: "Attempted Vehicle Theft",
      sub: "unsuccessful vehicle theft not stolen",
    },
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
                Vehicle Theft
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
                paddingBottom: "0px",
                fontSize: "12px",
              }}
            >
              (excluding cash-in-transit vehicles)
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: "10px",
              }}
            >
              <img
                src={Vehicle}
                alt="Vehicle Theft"
                style={{ height: "80px" }}
              />
            </Box>
            <Typography variant="h1" align="center" style={{ fontWeight: 'bold', paddingBottom: '5px', fontSize: '14px' }}>
              Was vehicle theft involved?
            </Typography>
          </Grid>

          <Box sx={{ pl: 3, pt: 0 }}>
            <div sx={{ display: "flex", flexDirection: "column" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  my: 2,
                  pl: 8,
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  {fields.map((f, ind) => {
                    return (
                      <FormControlLabel
                        control={<Checkbox />}
                        checked={value == f.value}
                        value={f.value}
                        key={ind}
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              paddingTop: "20px",
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

export default Page8;
