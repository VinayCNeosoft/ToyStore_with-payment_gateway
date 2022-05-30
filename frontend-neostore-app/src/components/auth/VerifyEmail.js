import React,{useState,useEffect,useRef} from 'react'
import { Alert, Button, Container,Modal,Form } from 'react-bootstrap'
import { Link,useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { getVerifyEmailState, resend_VerifyEmail, verifyEmail } from '../../config/NodeService'

/*
    Web applications commonly require that users register using a valid email address.
    A working email address is crucial for common tasks, such as resetting passwords and
    account management. Email verification is also essential for ensuring sign ups are from
    real users.

    1 . A user registers for an account. The user is created, but the user still needs to be
    verified via an email confirmation. The user cannot login until their account is verified.
    2. A verification token is emailed to the user.
    3. The user receives the verification email in their inbox. A link is provided in the email that
    passes the verification token back into your application.
*/
const RegForEmail = RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.com$");


function VerifyEmail() {
    const [isEmailVerified,setisEmailVerified] = useState()
    const [et,setet] = useState({eToken:localStorage.getItem("mail_VERIFICATION_TOKEN")})
    const u = localStorage.getItem("email")

    const [send,setSend] = useState(false)
    //code for modal
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [values, setValues] = useState({email: ""})

    const [errors,setErrors] = useState({email:""})

    const emailRef = useRef(null)

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
    //formSubmit function to submit values to server
    const formSubmit = () => {
        if ( values.email !== "") {
            if ( errors.email === "") {
                console.log(values);
                localStorage.setItem("email",values.email)
                resend_VerifyEmail(values).then((res) => {
                    if (res.data.success === true) {
                        handleClose()
                        toast(`${res.data.message}`)
                        localStorage.setItem("mail_VERIFICATION_TOKEN",res.data.email_verification_token)
                        setSend(true)
                    }
                    else if (res.data.success === false) {
                        console.log(res.data);
                        toast(`${res.data.message}`)
                    }
                })

            } else {
                alert("Validation Error");
            }
        }
        else {
            alert("Input Fields must not be blank");
        }
    };
    //end

    const navigate = useNavigate()

    useEffect(()=>{
        if(localStorage.getItem("mail_VERIFICATION_TOKEN")===""){
            navigate("/")
        }
        else{
            getVerifyEmailState(u)
            .then(res=>{
                if(res.data.success===true){
                    console.log(res.data.state)
                    setisEmailVerified(res.data.state)
                }
                else if(res.data.success===false){
                    console.log(res.data)
                    toast(`${res.data.message}`)
                }
                else{
                    console.log("")
                }
            })
        }
    },[u,navigate])

    const verify = () =>{
        verifyEmail(et).then((res) => {
            if (res.data.success === true) {
                setisEmailVerified(true)
                toast(`${res.data.message}`)
                localStorage.setItem("mail_VERIFICATION_TOKEN",null)
                localStorage.removeItem("email")
            }
            else if (res.data.success === false) {
                console.log(res.data);
                toast(`${res.data.message}`)
            }
        })
    }
    const resendVerifyMail=()=>{
        setShow(true)
        localStorage.setItem("email",)
    }
    return (
        <div>
            <Container>

                {!send?<>
                    <div className='App'>
                        {!isEmailVerified ? <><Alert variant='danger'><h1 className='text-center'>Verify Your Mail ! </h1>
                        <hr/><div className='text-center'>
                                <Button variant='primary' onClick={verify}>Click to Verify</Button>
                        </div>
                        </Alert><div><Button variant='info' onClick={resendVerifyMail}>Resend Verification Mail</Button></div></>:<><div><Alert variant='success'><h1 className='text-center text-success'>Email verified Successfully</h1><hr/><Link to="/login"><h3 className='text-center'>Click to Login</h3></Link></Alert></div></>}
                </div></>:<><div className='App'><Alert variant='success'><div className='text-center'><h1 className='text-primary'>Successfully sent Verification mail to your mail Address !</h1><hr/><Link to="/login"><h2 className='text-center text-danger'>Click to Login</h2></Link></div></Alert></div></>}

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <div className="App_verify">
                        <Form className="form" encType="multipart/form-data">
                        <Form.Group className="mb-3">
                            <Form.Label className="label">Email</Form.Label>
                            <Form.Control
                            type="text"
                            name="email"
                            ref={emailRef}
                            isValid={values.email !== "" ? true : false}
                            isInvalid={errors.email !== "" ? true : false}
                            onChange={(e) => handler(e)}
                            ></Form.Control>
                            <Form.Control.Feedback type="invalid">
                            {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                        </Form>
                    </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={formSubmit}>
                        Send
                    </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    )
}

export default VerifyEmail
