import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import ReactPhoneInput from 'react-phone-input-material-ui';
import { TextField } from '@mui/material';

RHFTextField3.propTypes = {
  name: PropTypes.string,
  phoneInput: PropTypes.bool, // New prop for using PhoneInput
};

export default function RHFTextField3({ name, errorOther, phoneInput, ...other }) {
  const { control } = useFormContext();

  if (phoneInput) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <ReactPhoneInput
            inputProps={{
              ...field,
              value: typeof field.value === 'number' && field.value === 0 ? '' : field.value,
            }}
            fullWidth
            defaultCountry={'za'} // Set the default country
            onlyCountries={['za']} // Set the allowed country (South Africa in this case)
            masks={{ za: '... ... ....' }} // Optional: customize the input mask
            disableDropdown // Hide the dropdown
            error={!!error || errorOther}
            helperText={errorOther ? errorOther : error?.message}
            containerStyle={{ position: 'relative', width: '100%' }}
            inputStyle={{ width: '100%', padding: '12px', paddingLeft: '35px' }}
            buttonStyle={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '5px' }}
            {...other}
          />
        )}
      />
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          color="form"
          sx={{ background: 'white' }}
          value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
          error={!!error || errorOther}
          helperText={errorOther ? errorOther : error?.message}
          {...other}
        />
      )}
    />
  );
}
