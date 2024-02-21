import { Link } from "react-router-dom";
import { styled } from '@mui/material/styles';


const NewButton = styled(Link)(({ theme }) => ({
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: 700,
    display:'inline-block',
    color: theme.palette.primary.main
}));


export default function LinkButton(props) {


  return (
    <NewButton 
      {...props}
    >
    </NewButton>
  );
}