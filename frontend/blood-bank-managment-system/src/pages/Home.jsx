import React, { useEffect, useState } from 'react'
import MyNavbar from '../components/MyNavbar'
import MyTabs from '../components/MyTabs'
import {MyToast} from '../components/MyToast'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  useEffect(()=>{
    if(Cookies.get('login') != 'true'){
      navigate('/')
    }
  })
  
  return (
    <>
      <MyToast>
        <MyNavbar/>
        <MyTabs/>
      </MyToast>
    </>
  )
}

