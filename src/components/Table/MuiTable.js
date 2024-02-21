import { 
    Table,
    TableContainer,
  } from '@mui/material';


  
export default function MuiTable({children}) {
    <TableContainer>
        <Table aria-label="simple table">
            {/* {props.children} */}
            { children }
        </Table>
    </TableContainer>
}