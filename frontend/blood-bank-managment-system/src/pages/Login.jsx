import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const [form, setForm] = useState({})
    const [invalid, setInvalid] = useState(false)
    const navigate = useNavigate()
    const users = {
        'Hrushikesh' : 'hrushikesh123',
        'Tharun' : 'tharun123'
    }

    function fillForm(key,value){
        setForm({
            ...form,
            [key] : value
        })
        setInvalid(false)
    }

    function handleSubmit(){
        let usernames = Object.keys(users)
        for(var i = 0; i < usernames.length; i++){
            if(usernames[i] == form['user'] && users[usernames[i]] == form['pass']){
                Cookies.set('login', true)
                navigate('/home')
                return
            }
        }
        setInvalid(true)
    }

    useEffect(()=>{
        if(Cookies.get('login') == 'true'){
            navigate('/home');
        }
    },[])

  return (
    <center>
        <div style={{'width' : '400px', 'color':'white', 'height' : '50vh',
         'marginTop' : '10%', 'marginBottom' : '10%'}}>
            <h4>Admin Login</h4>
            <div style={{'textAlign' : 'left'}}>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail1">
                    <Form.Label>User Name</Form.Label>
                    <Form.Control required type="text" placeholder="User Name"
                    value={form['user']}
                    onChange={(e)=>{fillForm('user',e.target.value)}}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail2">
                    <Form.Label>Password</Form.Label>
                    <Form.Control required type="password" placeholder="Password"
                    value={form['pass']}
                    onChange={(e)=>{fillForm('pass',e.target.value)}}/>
                </Form.Group>
            </Form>
            </div>
            {invalid && <p style={{'color' : 'red'}}>Invalid Credentials</p>}
            <Button type='submit' variant='outline-light' onClick={handleSubmit}>Log In</Button>
        </div>
    </center>
  )
}
