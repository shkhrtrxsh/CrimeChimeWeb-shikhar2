import { Grid } from '@mui/material';
import styled from '@emotion/styled';

export const StyledGrid = styled(Grid)`
    display: flex;
    flex-direction: column;
    width:100%;
    height:calc( 100vh - 65px );
    max-height:calc( 100vh - 65px );
    justify-content: center;
    align-items: center;
`;
