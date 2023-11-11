import React from 'react'
import { Spinner } from 'react-bootstrap'
export default function MySpinner() {
  return (
    <div>
        <center>
            <Spinner animation="border" style={{'marginTop' : '2px','width' : '50px', 'height' : '50px'}} variant='light'/>
        </center>
    </div>
  )
}
