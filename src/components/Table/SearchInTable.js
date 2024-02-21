import {useEffect, useState} from 'react'
import {
  InputAdornment,
  OutlinedInput,
  Toolbar,
  FormControl,
  Select, 
  MenuItem,
  Typography,
  Box
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Iconify from 'src/components/Iconify';
import palette from 'src/theme/palette';
import API from 'src/config/api';
import { toast } from 'react-toastify';

export default function SearchInTable(props) {

  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("latest");
  const [status, setStatus] = useState("");
  const [searchParams] = useSearchParams();

  const [includePublicUser,setIncludePublicUser] = useState("")
  const [corporateId,setCorporateId] = useState('')
  const [corporateDropdownList,setCorporateDropdownList] = useState([])
  const navigate=useNavigate();

  const setSearchByParam = (param) => {
    navigate(`/user?${param}`)
  }
  const getCorporateList = async () => {
    const response = await API.get("/corporateList")
    if(response.data.code == 200){
      setCorporateDropdownList(response.data.data)
    }else{
      toast.error(response.data.message,{
        toastId:'lsooo'
      })
    }
  }
  useEffect(()=>{
    getCorporateList()
  },[])
  useEffect(() => {
    let query = `order-by=${orderBy}`;
    if(search.length >= 0){
      query += `&search=${search}`;
    }
    if(status !== ""){
      query += `&status=${status}`;
    }
    if(includePublicUser !== ""){
      query += `&incluedPublicUser=${includePublicUser}`;
    }
    if(corporateId !== ""){
      query += `&CorporateName=${corporateId}`;
    }
    setSearchByParam(query)


  }, [orderBy, status,includePublicUser,corporateId])

  useEffect(() => {
    if(search.length >= 0){
      let query = `order-by=${orderBy}`;

      query += `&search=${search}&`;

      if(status !== ""){
        query += `&status=${status}`;
      }

      setSearchByParam(query)
    }

  }, [search])

  useEffect(() => {
    if(searchParams.get('search')){
      setSearch(searchParams.get('search'))
    }
    if(searchParams.get('order-by')){
      setOrderBy(searchParams.get('order-by'))
    }
    if(searchParams.get('status')){
      setStatus(searchParams.get('status'))
    }
    
  }, [])

  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        // background: `${palette.primary.main}`
        // padding: 0, 1, 0, 3,
      }}
    >
      <OutlinedInput
        sx={{
          width: 250,
        }}
        size="small"
        color="form"
        value={search}
        onChange={(e) => { setSearch(e.target.value) }}
        placeholder="Search user..."
        startAdornment={
        <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
        </InputAdornment>
        }
      />
      
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small" color="form">
        <Select
          value={status}
          onChange={(e) => { setStatus(e.target.value) }}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value="" >All Status</MenuItem>
          <MenuItem value="1" >Active</MenuItem>
          <MenuItem value="0">Inactive</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small" color="form">
        <Select
          value={includePublicUser}
          onChange={(e) => { setIncludePublicUser(e.target.value) }}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value="" >All Users</MenuItem>
          <MenuItem value="0" >Corporate</MenuItem>
          <MenuItem value="1">Public</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small" color="form">
        <Select
          value={corporateId}
          onChange={(e) => { setCorporateId(e.target.value) }}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          style={{maxHeight:"250px",overflowX:"auto"}}
        >
          <MenuItem value="" >All Corporates</MenuItem>
          {corporateDropdownList?.map((item,index)=><MenuItem key={index} value={item.id}>{item.name}</MenuItem>)}
        </Select>
      </FormControl>
      <Box sx={{ flexGrow: 1 }} />
      
      <Typography component="h6">
        Sort By : 
      </Typography>
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small" color="form">
        <Select
          value={orderBy}
          onChange={(e) => { setOrderBy(e.target.value) }}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          {/* <MenuItem value="">
            Sort By
          </MenuItem> */}
          <MenuItem value="latest" >Latest</MenuItem>
          <MenuItem value="oldest">Oldest</MenuItem>
          <MenuItem value="asc">A to Z</MenuItem>
          <MenuItem value="desc">Z to A</MenuItem>
        </Select>
      </FormControl>
    </Toolbar>
  )
}