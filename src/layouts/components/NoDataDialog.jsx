import { useDispatch, useSelector } from 'react-redux';
import { setError } from 'src/store/reducers/registerReport';
import { NoDataDialogRoot } from './NoDataDialogRoot';

export const NoDataDialog = () => {
    const {error} = useSelector(state=>state.reportRegister);
    const dispatch = useDispatch();
    const handleClose = ()=>dispatch(setError(null));
    return <NoDataDialogRoot error={error} handleClose={handleClose}/>
};
