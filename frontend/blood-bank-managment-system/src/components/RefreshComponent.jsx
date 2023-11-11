import React, { createContext, useEffect, useState } from 'react';


export const RefereshPage = createContext()

export function RefreshComponent({children}){

    const [refresh, setRefresh] = useState(false)
    function refresh_page(){
        setRefresh(!refresh)
    }
    
    const refreshVariable = {
      'refresh_page' : refresh_page,
      'refresh' : refresh
    }
  return (
    <RefereshPage.Provider value={refreshVariable}>
        {children}
    </RefereshPage.Provider>
  )
}
