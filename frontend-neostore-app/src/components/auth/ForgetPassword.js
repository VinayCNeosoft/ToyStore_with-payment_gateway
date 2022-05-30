import React,{useState,useRef} from 'react'
import { Container ,Form,Button} from 'react-bootstrap'
import { useNavigate ,Link} from "react-router-dom";
import "./auth.css"
import { forgetPassword } from '../../config/NodeService';

const RegForEmail = RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.com$");

function ForgetPassword() {
    const [values, setValues] = useState({email: ""})
    const [errors, setErrors] = useState({email: ""})
    const emailRef = useRef(null);
    const navigate = useNavigate();

    //handler function to perform validation
    const handler = (e) => {
    let name = e.target.name;
    switch (name) {
      case "email":
        setErrors({...errors,email: RegForEmail.test(emailRef.current.value)? ""
          : "* Uh oh! Looks like there is an issue with your email. Please input a correct email.",
        });
        setValues({ ...values, email: emailRef.current.value });
      break;
      default:
      break;
    }
    };
    const sendOTP=()=>{
        if(values.email!==''){
            if(errors.email===''){
                console.log(values)
                forgetPassword(values).then(res=>{
                    if(res.data.success===true){
                        console.log(res.data.otp)
                        localStorage.setItem("otp",res.data.otp)
                        alert(`${res.data.message}`)
                        navigate("/resetpassword")
                    }
                    if(res.data.success===false){
                        console.log(res.data)
                        alert(`${res.data.msg}`)
                    }
                })
            }
            else
            {
                alert("Input Fields must not be blank")
            }
        }
        else{
            alert("Input Field must not be blanked")
        }
    }

    return (
        <>
        <div className='App'>
            <h1 className='text-center container text-danger'>Forget Password</h1>
                <Form className="form">
                    <Form.Group className="mb-3">
                        <Form.Label className="label">Email</Form.Label>
                        <Form.Control
                            type="text"
                            name="email"
                            ref={emailRef}
                            isValid={values.email !== "" ? true : false}
                            isInvalid={errors.email !== "" ? true : false}
                            onChange={(e) => handler(e)}
                        >
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </Form.Group>
                    <div>
                        <Button
                            onClick={sendOTP}
                            variant="primary"
                            className="reg-btn">Send OTP
                        </Button>
                        <span style={{ marginLeft: "20px" }}>
                        <Link to="/login" className="label">
                            Click to Login !
                        </Link>
                        </span>
                    </div>
                </Form>
        </div>
        </>
    )
}

export default ForgetPassword
