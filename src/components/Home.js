import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { setUser } from '../app/reducers/appConfigSlice';
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";
function Home() {
  const {user} = useSelector((state) => state.appConfig); 
  const navigate = useNavigate();
  useEffect(()=>{
    if(!user){
      navigate("/login");
    }
  },[])
  return (
    <div>This is Dashboard</div>
  )
}

export default Home