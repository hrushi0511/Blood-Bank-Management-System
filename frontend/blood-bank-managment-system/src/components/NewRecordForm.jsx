import React, { useContext, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import MyDropdown from './MyDropdown'
import axios from 'axios'
import { ToastContext } from './MyToast'
import { RefereshPage } from './RefreshComponent'

export default function NewRecordForm(params){
  const genderList = ['Male', 'Female', 'Other']
  const bloodGroupList = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  const seeker_status = ['Pending', 'Aceepted', 'Declined']

  const [form, setForm] = useState(params.modify)
  const [errors, setErrors] = useState({})
  const showToast = useContext(ToastContext)
  const refresh = useContext(RefereshPage).refresh_page

  let modify_status = true
  if(params.tab == 'Blood Seekers' && !!params.modify['Status'] 
  && params.modify['Status'] != seeker_status[0] && Object.keys(params.modify).length > 0){
    modify_status = false
  }

  function fillForm(key, value){
    setForm({
      ...form,
      [key] : value
    })

    if(!!errors[key]){
      setErrors({
        ...errors,
        [key] : null
      })
    }
  }

  async function formValidation(){
    let newErrors = {}
    if(!form['Gender']){
      newErrors['Gender'] = 'Please Select a Valid Gender.'
    }
    if(!form['Blood Group']){
      newErrors['Blood Group'] = 'Please Select a Valid Blood Group.'
    }
    if(form['Phone No'] && form['Phone No'].length != 10){
      newErrors['Phone No'] = 'Please Enter a Valid Phone No.'
    }
    if(params.tab == 'Blood Seekers'){
      if(!form['Status']){
        newErrors['Status'] = 'Please Enter the Status of Seeker Request.'
      }
      if(form['Status'] == 'Aceepted'){
        let response = await axios.post('http://127.0.0.1:8000/searchinventory', form)
        if(response.status != 200){
          showToast(params.tab, 'Server Error')
        }
        if(response.status == 200 && parseInt(form['Units']) > parseInt(response.data['Units'])){
          newErrors['Units'] = "Required blood quantity is not available."
        }
      }
    }
    //Check if id is available
    const search_urls = {
      'Blood Donors' : 'http://127.0.0.1:8000/searchdonor',
      'Blood Seekers' : 'http://127.0.0.1:8000/searchseeker'
    }
    let response = await axios.post(search_urls[params.tab],form)
    if(response.status == 200){
      if(Object.keys(params.modify).length == 0 && Object.keys(response.data).length > 0){
        console.log('ok')
        newErrors['ID'] = 'ID already exists.'
      }
      else if(Object.keys(params.modify).length > 0 && Object.keys(response.data).length > 0){
        console.log('not ok')
        Object.keys(params.modify).map((key,index)=>{
          if(params.modify[key] != response.data[key]){
            newErrors['ID'] = 'ID already Exists.'
          }
        })
        
      }
    }

    return newErrors
  }
  

  async function formSubmit(event){
    event.preventDefault();
    let formErrors = await formValidation();
    console.log(formErrors)
    try{
        if(Object.keys(formErrors).length > 0){
          setErrors(formErrors)
        }
        else{
          //Code to generate report on seeker
          if(form['Status'] == 'Aceepted'){
            const url = 'http://127.0.0.1:8000/makereport'
            const res = await axios.post(url,form)
            if(res.status != 200){
              setForm({
                ...form,
                'Status' : seeker_status[0]
              })
            }else{
              showToast(params.tab, 'Report Generated.')
            }
          }

          //Code to add donor or seeker
          if(Object.keys(params.modify).length != 0){
            const modify_record_urls = {
              'Blood Donors' : 'http://127.0.0.1:8000/modifydonor',
              'Blood Seekers' : 'http://127.0.0.1:8000/modifyseeker'
            }
            const data = {
              'old' : params.modify,
              'new' : form
            }
            const response = await axios.post(modify_record_urls[params.tab],data)
            if(response.status == 200){
              showToast(params.tab, `${params.modify['Name']} Updated.`)
              params.hideModal()
              refresh()
            }else{
              showToast(params.tab, 'Server Error.')
            }
          }
          else{
            const new_record_urls = {
              'Blood Donors' : 'http://127.0.0.1:8000/writedonor',
              'Blood Seekers' : 'http://127.0.0.1:8000/writeseeker'
            }
            const response = await axios.post(new_record_urls[params.tab],form)
            if(response.status == 200){
              showToast(params.tab, `${form['Name']} added succesfully`)
              params.hideModal();
              refresh()
            }
            else{
              showToast(params.tab, `Server Error`)
            }
            
          }
        }
    }
    catch(err){
      console.log(err)
      showToast(params.tab, 'Internal Error')
    }
    
  }


  return (
    <div style={{'overflowY': 'scroll',}}>
    <Form onSubmit={formSubmit} style={{'height' : '75vh', 'width' : '95%'}}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>ID</Form.Label>
        <Form.Control required type="number" placeholder="ID" 
        value = {form['ID']}
        disabled={!modify_status}
        isInvalid = {!!errors['ID']}
        onChange={(e)=>{fillForm('ID', e.target.value)}}/>
        <Form.Control.Feedback type='invalid'>{errors['ID']}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Date</Form.Label>
        <Form.Control required type="date" placeholder="Date" 
        value = {form['Date']}
        disabled={!modify_status}
        onChange={(e)=>{fillForm('Date', e.target.value)}}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Name</Form.Label>
        <Form.Control required type="text" placeholder="Name" 
        value = {form['Name']}
        disabled={!modify_status}
        onChange={(e)=>{fillForm('Name', e.target.value)}}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Gender</Form.Label>
        <MyDropdown optionList={genderList}
        value={form['Gender']}
        disabled={!modify_status}
        onChange={(e)=>{fillForm('Gender', e.target.value)}}
        isInvalid = {!!errors['Gender']}/>
        <Form.Control.Feedback type='invalid'>{errors['Gender']}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Phone No</Form.Label>
        <Form.Control required type="number" placeholder="Phone No" 
        value={form['Phone No']}
        disabled={!modify_status}
        onChange={(e)=>{fillForm('Phone No', e.target.value)}}
        isInvalid={errors['Phone No']}/>
        <Form.Control.Feedback type='invalid'>{errors['Phone No']}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Blood Group</Form.Label>
        <MyDropdown optionList={bloodGroupList}
        value={form['Blood Group']}
        disabled={!modify_status}
        onChange={(e)=>{fillForm('Blood Group', e.target.value)}}
        isInvalid={errors['Blood Group']}/>
        <Form.Control.Feedback type='invalid'>{errors['Blood Group']}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Units</Form.Label>
        <Form.Control required type="number" placeholder="Units" 
        value={form['Units']}
        disabled={!modify_status}
        onChange={(e)=>{fillForm('Units', e.target.value)}}
        isInvalid={errors['Units']}/>
        <Form.Control.Feedback type='invalid'>{errors['Units']}</Form.Control.Feedback>
      </Form.Group>
      {
        params.tab == 'Blood Seekers' &&
        <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Request Status</Form.Label>
        <MyDropdown optionList={seeker_status}
        value={form['Status']}
        disabled={!modify_status}
        onChange={(e)=>{fillForm('Status', e.target.value)}}
        isInvalid = {!!errors['Status']}/>
        <Form.Control.Feedback type='invalid'>{errors['Status']}</Form.Control.Feedback>
        </Form.Group>
      }

      {
        params.tab == 'Blood Seekers' && form['Status'] == 'Aceepted' && 
        <>
          <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Price per Unit of Blood</Form.Label>
          <Form.Control required type="number" placeholder="Price" 
          value = {form['Price']}
          disabled={!modify_status}
          onChange={(e)=>{fillForm('Price', e.target.value)}}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Total</Form.Label>
          <Form.Control required type="number" placeholder="Price" 
          value = {!!form['Units'] && !!form['Price'] ? form['Units'] * form['Price'] : 0}
          disabled={true}/>
          </Form.Group>
        </>
      }
      <Button variant="outline-light" type="submit" disabled={!modify_status}>
        {Object.keys(params.modify).length != 0 ? 'Update' : 'Add'}
      </Button>
    </Form>
    </div>
  )
}
