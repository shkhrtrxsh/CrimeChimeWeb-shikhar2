import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Box,
  useMediaQuery,
  useTheme,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import { DatePicker, TimePicker, LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import NextButton from 'src/components/Button/NextButton';
import { useDispatch, useSelector } from 'react-redux';
import { setPage, setWarnings } from 'src/store/reducers/registerReport';
import ProgressBar from 'src/layouts/Report/ProgressBar';
import { splitISODatetime, splitLocaleDatetime } from 'src/utils/formatTime';

function Page1() {
  const { date_time: datetime } = useSelector((state) => state.reportRegister.data);
  const dispatch = useDispatch();

  useEffect(() => {
    if (datetime === null) {
      dispatch(setPage({ date_time: new Date(Date.now()).toISOString() }));
    }
  }, []);

  const changeDate = (e) => {
    const { date, time } = splitISODatetime(e);
    const newTime = datetime === null ? time : splitISODatetime(e)?.time;
    dispatch(setPage({ date_time: date + 'T' + newTime + 'Z'}));
  };

  const changeTime = (selectedHour, selectedMinute) => {
    const selectedTime = new Date(datetime);
    const hours = selectedTime.getHours() >= 12 ? selectedHour + 12 : selectedHour;
    const minutes = selectedTime.getMinutes();
  
    selectedTime.setHours(hours);
    selectedTime.setMinutes(minutes);
    dispatch(setPage({ date_time: selectedTime.toISOString()}));
  };

  const theme = useTheme();
  const mnTime = (date) => {
    const dt = new Date(date);
    var newDate = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 0, 0, 0, 0);
    return Number(newDate);
  };
  const dateNow = new Date(Date.now());

  const days = Array.from({ length: 31 }, (_, index) => index + 1);
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];
  const years = Array.from({ length: 2 }, (_, index) => dateNow.getFullYear() - index);

const dateTime=new Date(datetime||dateNow)
  
const [dateValue, setDateValue] = useState(dateTime); // Set the initial date value to the current local date
const [timeValue, setTimeValue] = useState(dateTime); // Set the initial time value to the current local time
const [amPmValue, setAmPmValue] = useState(dateTime.getHours() >= 12 ? 'pm' : 'am'); // Set the initial amPmValue based on the current local time
const [futureDateWarning, setFutureDateWarning] = useState(false); 
const [futureTimeWarning, setFutureTimeWarning] = useState(false);

  const handleDayChange = (e) => {
    const selectedDay = e.target.value;
    const selectedDate = new Date(dateValue);
    selectedDate.setDate(selectedDay);
    setDateValue(selectedDate);
    

    const currentDate = new Date();
    const isFutureDate = selectedDate > currentDate;
    setFutureDateWarning(isFutureDate);
    dispatch(setWarnings({ futureDateWarning: isFutureDate }));
    changeDate(selectedDate);
  };

  const handleMonthChange = (e) => {
    const selectedMonth = e.target.value;
    const selectedDate = new Date(dateValue);
    selectedDate.setMonth(selectedMonth - 1);
    setDateValue(selectedDate);
    

    const currentDate = new Date();
    const isFutureDate = selectedDate > currentDate;
    setFutureDateWarning(isFutureDate);
    dispatch(setWarnings({ futureDateWarning: isFutureDate }));
    changeDate(selectedDate);
  };

  const handleYearChange = (e) => {
    const selectedYear = e.target.value;
    const selectedDate = new Date(dateValue);
    selectedDate.setFullYear(selectedYear);
    setDateValue(selectedDate);
    

    const currentDate = new Date();
    const isFutureDate = selectedDate > currentDate;
    setFutureDateWarning(isFutureDate);
    dispatch(setWarnings({ futureDateWarning: isFutureDate }));
    changeDate(selectedDate);
  };

  const handleHourChange = (e) => {
    const selectedHour = parseInt(e.target.value, 10);
    const selectedTime = new Date(timeValue);
    selectedTime.setHours(selectedHour);
    setTimeValue(selectedTime);
    
    const currentDate = new Date();
    const isToday = dateValue.toDateString() === currentDate.toDateString();
    
    const isFutureTime = isToday && selectedHour > (currentDate.getHours() % 12 || 12) ;
    setFutureTimeWarning(isFutureTime);
    dispatch(setWarnings({ futureTimeWarning: isFutureTime }));
    changeTime(selectedHour, selectedTime.getMinutes());
  };
  
  const handleMinuteChange = (e) => {
    const selectedMinute = parseInt(e.target.value, 10);
    const selectedTime = new Date(timeValue);
    selectedTime.setMinutes(selectedMinute);
    setTimeValue(selectedTime);
    
    const currentDate = new Date();
    const isToday = dateValue.toDateString() === currentDate.toDateString();
    const isFutureTime = isToday && selectedTime > currentDate;
    setFutureTimeWarning(isFutureTime);
    dispatch(setWarnings({ futureTimeWarning: isFutureTime }));
    changeTime(selectedTime.getHours(), selectedMinute);
  };
  
  
  
  const handleAmPmChange = (e) => {
    const selectedAmPm = e.target.value;
    setAmPmValue(selectedAmPm);
  
    const selectedTime = new Date(timeValue);
    const hours = selectedTime.getHours();
    let newHours = hours;
  
    // Get the current time
    const currentTime = new Date();
  
    // Check if the current time is in PM
    const isCurrentTimePM = currentTime.getHours() >= 12;
  
    // Check if the selected day is the same as today's date
    const isSameDay =
      dateValue.getDate() === currentTime.getDate() &&
      dateValue.getMonth() === currentTime.getMonth() &&
      dateValue.getFullYear() === currentTime.getFullYear();
  
    // Set the futureTimeWarning to true if the selected day is the same as today's date, the current time is in AM, and the selected time is in PM
    const isFutureTime = isSameDay && isCurrentTimePM && selectedAmPm === 'pm';
    setFutureTimeWarning(isFutureTime);
  
    if (selectedAmPm === 'am' && hours >= 12) {
      newHours -= 12;
    } else if (selectedAmPm === 'pm' && hours < 12) {
      newHours += 12;
    }
  
    selectedTime.setHours(newHours);
    setTimeValue(selectedTime);
    dispatch(setWarnings({ futureTimeWarning: isFutureTime }));
    dispatch(
      setPage({
        date_time: selectedTime.toISOString(),
         // Update the futureTimeWarning value
        
      })
    );
  };
  
  
  
  const isMdBreakpoint = useMediaQuery(theme.breakpoints.up('md'));
  const hours = Array.from({ length: 12 }, (_, index) => index + 1);
  const minutes = Array.from({ length: 60 }, (_, index) => index);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="sm" style={{ padding: theme.spacing(5, 0) }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Typography
                variant="h1"
                sx={{
                  textAlign: 'center',
                  borderBottom: `2px solid ${theme.palette.warning.main}`,
                  paddingBottom: '2px',
                }}
                className="font-bold pb-2 text-3xl"
              >
                Report Crime
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              paddingTop={isMdBreakpoint ? '40px' : '80px'}
              paddingBottom={isMdBreakpoint ? '40px' : '35px'}
            >
              <Box borderBottom={2} borderColor={theme.palette.warning.main} style={{ marginRight: '5px', width: '20px' }} />
              <Typography variant="h4" sx={{ fontWeight: 'normal', textAlign: 'center', paddingTop: '0px', paddingBottom: '0px' }}>
                Select Date
              </Typography>
              <Box borderBottom={2} borderColor={theme.palette.warning.main} style={{ marginLeft: '5px', width: '20px' }} />
            </Box>
          </Grid>
          <Grid item xs={3} sx={{ textAlign: 'center' }}>
            <TextField
              select
              label="Day"
              value={dateValue.getDate()}
              onChange={handleDayChange}
              fullWidth
            >
              {days.map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={3} sx={{ textAlign: 'center' }}>
            <TextField
              select
              label="Month"
              value={dateValue.getMonth() + 1}
              onChange={handleMonthChange}
              fullWidth
            >
              {months.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={3} sx={{ textAlign: 'center' }}>
            <TextField
              select
              label="Year"
              value={dateValue.getFullYear()}
              onChange={handleYearChange}
              fullWidth
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {futureDateWarning && ( // Display the warning if futureDateWarning is true
            <Grid item xs={7}>
              <Typography variant="body2" color="error">
                Please note that the selected date is in the future.
              </Typography>
            </Grid>
          )}
          <Box style={{ display: 'flex', flexDirection: 'column', width: '75%' }}>
            <Grid item xs={12}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                paddingTop={isMdBreakpoint ? '40px' : '80px'}
                paddingBottom={isMdBreakpoint ? '40px' : '40px'}
              >
                <Box borderBottom={2} borderColor={theme.palette.warning.main} style={{ marginRight: '5px', width: '20px' }} />
                <Typography variant="h4" sx={{ fontWeight: 'normal', textAlign: 'center', paddingTop: '5px', paddingBottom: '5px' }}>
                  Select Time
                </Typography>
                <Box borderBottom={2} borderColor={theme.palette.warning.main} style={{ marginLeft: '5px', width: '20px' }} />
              </Box>
            </Grid>
            <Box display="flex" flexDirection="row" width="100%" justifyContent='end'>
              <Grid item xs={3.8} sx={{ textAlign: 'center',paddingX: '5px' }}>
                <TextField select label="Hour" value={timeValue.getHours() % 12 || 12} onChange={handleHourChange} fullWidth>
                  {hours.map((hour) => (
                    <MenuItem key={hour} value={hour}>
                      {hour}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={3.9} sx={{ textAlign: 'center', width: '100%',paddingX: '5px' }}>
                <TextField select label="Minute" value={timeValue.getMinutes()} onChange={handleMinuteChange} fullWidth>
                  {minutes.map((minute) => (
                    <MenuItem key={minute} value={minute}>
                      {minute.toString().padStart(2, '0')}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={3.9} sx={{ textAlign: 'center', width: '100%', paddingX: '5px' }}>
                <TextField
                  select
                  label="AM/PM"
                  value={amPmValue}
                  onChange={handleAmPmChange}
                  fullWidth
                >
                  <MenuItem value="am">AM</MenuItem>
                  <MenuItem value="pm">PM</MenuItem>
                </TextField>
              </Grid>
              
            </Box>
          </Box>
{futureTimeWarning && ( // Display the warning if futureTateWarning is true
            <Grid item xs={7} sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="error">
                Please note that the selected time is in the future.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </LocalizationProvider>
  );
}

export default Page1;