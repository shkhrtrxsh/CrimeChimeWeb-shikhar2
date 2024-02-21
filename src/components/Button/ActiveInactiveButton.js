import {
    Button,  
} from '@mui/material';


export default function ActiveInactiveButton(props) {

  return (
    <Button 
      {...props}
      sx={{
        fontSize:13,
        color: props.status==1 ? "rgb(34, 154, 22)" : "rgb(183, 33, 54)",
        backgroundColor: props.status==1 ? "rgba(84, 214, 44, 0.16)" : "rgba(255, 72, 66, 0.16)",
        padding: "2px 7px",
        minWidth: 'auto',
        marginRight: '8px',
        // marginBottom: '8px',
        '&:hover':{
            backgroundColor: props.status==1 ? "rgba(84, 214, 44, 0.16)" : "rgba(255, 72, 66, 0.16)",
        }
      }}
    >
    </Button>
  );
}