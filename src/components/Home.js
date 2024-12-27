import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
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