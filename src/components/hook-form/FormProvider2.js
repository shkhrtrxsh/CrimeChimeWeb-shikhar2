import PropTypes from 'prop-types';
// form
import { FormProvider as Form } from 'react-hook-form';
import {  
  Card, 
  Container
} from '@mui/material';

// ----------------------------------------------------------------------

FormProvider2.propTypes = {
  children: PropTypes.node.isRequired,
  methods: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
};

export default function FormProvider2({ children, onSubmit, methods }) {
  return (
    <Card sx={{background: 'black'}}>
      <Container sx={{
        margin:'2rem 0',
        
      }}>
        <Form {...methods}>
          <form onSubmit={onSubmit} encType="multipart/form-data">{children}</form>
        </Form>
      </Container>
    </Card>
  );
}