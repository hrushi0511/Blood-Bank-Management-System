import React, { createContext, useState } from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'


export const ToastContext = createContext();

export function MyToast({children}) {

  const [toastConfig, setToastConfig] = useState({'show' : false})

  function openToast(heading,message){
    setToastConfig({
      'show' : true,
      'heading' : heading,
      'message' : message
    })
  }

  function closeToast(){
    setToastConfig({
      ...toastConfig,
      'show' : false
    })
  }

  return (
        <ToastContext.Provider value={openToast}>
          {children}
          <ToastContainer
            className="p-3"
            position={'bottom-end'}
            style={{ zIndex: 100 }}
          >
            <Toast bg = 'dark' show={toastConfig.show} 
            onClose={closeToast} delay={2000} autohide
            animation={true}>

              <Toast.Header closeButton={false}>
                <h6 className="me-auto">{toastConfig.heading}</h6>
              </Toast.Header>

              <Toast.Body className={'text-white'}>{toastConfig.message}</Toast.Body>

            </Toast>

          </ToastContainer>
        </ToastContext.Provider>
  )
}
