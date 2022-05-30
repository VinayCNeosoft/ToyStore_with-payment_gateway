import React,{useState,useRef,useEffect} from 'react'
import { Col, Container, Row ,Button,Form} from 'react-bootstrap'
import avatar from '../../uploads/default_av.png'
import {useNavigate} from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import { FaShoppingCart,FaUserCircle,FaAddressCard,FaExchangeAlt} from 'react-icons/fa';
import { updatePassword, getCustomer } from '../../config/NodeService';

const RegForPassword = RegExp("^[a-zA-Z0-9@*!&%$]{8,15}$");

function ChangePassword() {
    const [uid,setUid] = useState(null)
    const [logo,setLogo] = useState(true)

    const [user, setUser] = useState({
        profilePic:"",
    });

    let u = JSON.parse(localStorage.getItem("user"))
    console.log(u)

    const [values, setValues] = useState({
        oldpassword:'',
        password: "",
        cpassword: "",
    });
      const [errors, setErrors] = useState({
        oldpassword:'',
        password: "",
        cpassword: ""
    });

    const oldpasswordRef = useRef(null)
    const passwordRef = useRef(null);
    const cpasswordRef = useRef(null);
    const navigate = useNavigate()

    useEffect(()=>{
        if(localStorage.getItem("token")===""){
            navigate("/")
        }
        else{
            let token=localStorage.getItem('token');
            let decode=jwt_decode(token);
            console.log(decode)
            console.log(decode.uid)
            setUid(decode.uid)
            navigate("/changepassword")
            getCustomer(decode.uid)
            .then(res=>{
                if(res.data.success===true){
                    console.log(res.data)
                    setUser({profilePic:res.data.data.logo})
                    if(res.data.data.logo===undefined){
                      console.log("profile pic not present")
                      setLogo(true)
                    }
                    else{
                      console.log("profile pic present")
                      setLogo(false)
                    }
                  }
                else if(res.data.success===false){
                    console.log(res.data)
                    alert(`${res.data.message}`)
                }
                else{
                    console.log("")
                }
            })
        }
    },[navigate])


    //handler function to perform validation
    const handler = (e) => {
    let name = e.target.name;
    switch (name) {
        case "oldpassword":
        setErrors({...errors,oldpassword: RegForPassword.test(oldpasswordRef.current.value)? ""
          : "* Please Enter Password in Alphanumeric and Symbols",
        });
        setValues({ ...values, oldpassword: oldpasswordRef.current.value });
      break;
      case "password":
        setErrors({...errors,password: RegForPassword.test(passwordRef.current.value)? ""
          : "* Please Enter Password in Alphanumeric and Symbols",
        });
        setValues({ ...values, password: passwordRef.current.value });
      break;
      case "cpassword":
        setErrors({...errors,cpassword:values.password === cpasswordRef.current.value? ""
          : "* Password and Confirm Password must be match",
        });
        setValues({ ...values, cpassword: cpasswordRef.current.value });
      break;
      default:
      break;
    }
    };
    const profile=()=>{
        navigate("/profile")
    }
    const changePasss=()=>{
        navigate("/changepassword")
    }
    const gotoAddress=()=>{
        navigate("/address")
    }
    const updatePass=()=>{
        if(values.oldpassword!=='' && values.password!==''&& values.cpassword!==''){
            if(errors.oldpassword==='' && errors.password==='' && errors.cpassword===''){
                console.log(values)
                updatePassword(values,uid)
                .then(res=>{
                    if(res.data.success===true){
                        console.log(res.data)
                        alert(`${res.data.message}`)
                        navigate("/profile")
                    }
                    if(res.data.success===false){
                        console.log(res.data)
                        alert(`${res.data.message}`)
                    }
                })
            }
            else{
                alert("Input Fields must not be blank")
            }
        }
        else{
            alert("Input Field must not be blanked")
        }
    }
    const gotoOrders=()=>{
        navigate("/order")
    }
    return (
        <>
        <h1 className='text-center text-secondary'>My Account</h1>
        <Container>
        <Row>
            <Col sm={4}>
            <div>
                <Container className="border border-secondary text-center"><br/>
                {logo?<>
                    <img src={avatar} height={"100hv"} width={"auto"} alt="not Found"/><br/><br/></>:
                    <><img src={user.profilePic} height={"100hv"} width={"auto"} alt="not Found"/><br/><br/></>}
                    <br/>
                    <div className='profile-btn' onClick={profile}><FaUserCircle/> Profile</div><br/>
                        <div className='profile-btn' onClick={gotoOrders}><FaShoppingCart/> Orders</div><br/>
                        <div className='profile-btn' onClick={gotoAddress}><FaAddressCard/> Address</div><br/>
                        <div className='profile-btn btn-primary' onClick={changePasss}><FaExchangeAlt/> Change Password</div><br/>
                      </Container>
            </div>
            </Col>
            <Col sm={8}>
            <div>
                <Container className="border border-secondary">
                    <h1 className='text-center'>Change Password</h1>
                    <Form className="form">
                        <Form.Group className="mb-3">
                            <Form.Label className="label">Old Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="oldpassword"
                                ref={oldpasswordRef}
                                isValid={values.oldpassword !== "" ? true : false}
                                isInvalid={errors.oldpassword !== "" ? true : false}
                                onChange={(e) => handler(e)}>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.oldpassword}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="label">New Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                ref={passwordRef}
                                isValid={values.password !== "" ? true : false}
                                isInvalid={errors.password !== "" ? true : false}
                                onChange={(e) => handler(e)}>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="label">Confirm New Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="cpassword"
                                ref={cpasswordRef}
                                isValid={values.cpassword !== "" ? true : false}
                                isInvalid={errors.cpassword !== "" ? true : false}
                                onChange={(e) => handler(e)}>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                            {errors.cpassword}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div>
                        <Button
                            onClick={updatePass}
                            variant="primary"
                            className="reg-btn"
                        > Update Password
                        </Button>
                        </div>
                    </Form>
                </Container>
            </div>
            </Col>
        </Row>
        </Container>
    </>
    )
}

export default ChangePassword
