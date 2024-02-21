import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Box, TextField } from '@mui/material';




import AccountCircle from '@mui/icons-material/AccountCircle';
import flag from '../../assets/images/SAflag.png'
import InputAdornment from '@mui/material/InputAdornment';
// ----------------------------------------------------------------------

RHFTextField2.propTypes = {
  name: PropTypes.string,
};

export default function RHFTextField2({ name,flagg,errorOther, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
    name={name}
    control={control}
    
    render={({ field, fieldState: { error } }) => (
      <Box sx={{ display: 'flex' }}>
{/* <TextField
      id="input-with-sx" label={name} variant="standard"
      InputProps={{
        startAdornment: (
          flagg && <InputAdornment position="start">
            <img src={flag} alt="Flag" style={{ height: 24, width: 40 }} />
          </InputAdornment>
        ),
      }}
        {...field}
        fullWidth
        color="form"
        sx={{ background: 'white' }}
        value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
        error={!!error || errorOther}
        helperText={errorOther ? errorOther : error?.message}
        {...other}
      /> */}
      <Box sx={{
  display: 'flex',
  alignItems: 'flex-end',
  width: flagg ? '412px' : '500px',
  '@media (max-width: 600px)': {
    width: '312px',
  },
}}>
        {flagg && <Box sx={{backgroundColor: 'white', pt:'19px',pb:'19px', pl:'6px', pr: '6px'}}>
        <img src={flag} style={{ height: 24, width: 40 }}  />
        </Box>}
        {!flagg && <Box sx={{backgroundColor: 'white', pt:'56px',pb:'6px', px:'8px'}}>
        {/* <img src={} style={{ height: 24, width: 40 }}  /> */}
        </Box>}
        <TextField id="input-with-sx" label="With sx" variant="standard" 
        InputProps={{
          disableUnderline: true,
        }}
        {...field}
        fullWidth
        color="form"
        sx={{ background: 'white',  
          paddingBottom: '14px', // Adjust the value as needed
        }}
        value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
        error={!!error || errorOther}
        helperText={errorOther ? errorOther : error?.message}
        {...other}/>
        
        
      </Box>
      </Box>
      
    )}
  />
  
  );
}