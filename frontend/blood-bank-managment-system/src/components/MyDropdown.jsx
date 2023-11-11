import React, { useState } from 'react'
import { Form } from 'react-bootstrap'

export default function MyDropdown(params) {

  return (
    <Form.Select{
      ...params
    }>
      <option value={null}>Select</option>
      {
        params.optionList.map((title,index)=>{
          return <option key={index} value={title}>{title}</option>
        })
      }
    </Form.Select>
  )
}
