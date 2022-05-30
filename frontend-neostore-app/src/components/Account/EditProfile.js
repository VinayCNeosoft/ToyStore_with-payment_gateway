import React,{useState,useEffect,useRef} from 'react'
import { Col, Container, Row ,Button,Form} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'
import avatar from '../../uploads/default_av.png'
import { FaShoppingCart,FaUserCircle,FaAddressCard,FaExchangeAlt,FaUserEdit} from 'react-icons/fa';
import { getCustomer, updateuser ,updateProfileImage} from '../../config/NodeService';
import './acc.css'
import jwt_decode from 'jwt-decode'
import { useDispatch, useSelector } from "react-redux";

//RegEx for Validation
const RegForEmail = RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.com$");
const RegForName = RegExp("^[a-zA-Z]{3,10}$");
const RegForMobile=RegExp('^((\\+91-?)|0)?[0-9]{10}$');

function EditProfile() {
    const [uid,setUid] = useState(null)
    const [cart, setCart] = useState([]);
    const [logo,setLogo] = useState(true)



    const [values, setValues] = useState({
        first_name: "",
        last_name: "",
        email: "",
        dob:"",
        profilePic:"",
        mobile:"",
        gender:""
    });
    const [errors, setErrors] = useState({
        first_name: "",
        last_name: "",
        email: "",
        dob:"",
        mobile:"",
        gender:""
    });

    //useRef Assigning
    const fnameRef = useRef(null);
    const lnameRef = useRef(null);
    const emailRef = useRef(null);
    const dobRef = useRef(null);
    const mobileRef = useRef(null);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    useEffect(()=>{
        if(localStorage.getItem("token")===""){
            navigate("/")
        }
        else{
            let token=localStorage.getItem('token');
            let decode=jwt_decode(token);
            console.log(decode.uid)
            setUid(decode.uid)
            getCustomer(decode.uid)
            .then(res=>{
                if(res.data.success===true){
                    console.log(res.data)
                    setValues({first_name:res.data.data.fname,last_name:res.data.data.lname,email:res.data.data.email,mobile:res.data.data.mobile,gender:res.data.data.gender,dob:res.data.data.dob,profilePic:res.data.data.logo})
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
        const getcart = JSON.parse(localStorage.getItem("cart"));
        if (getcart) {
          setCart(getcart);
          const count =  JSON.parse(localStorage.getItem("cart")).map(item => Number(item.quantity)).reduce((prev, curr) => prev + curr, 0);
          console.log("count"+count)
          dispatch({ type: "count", payload: count });
        }
    },[])

    const handler = (e) => {
        let name = e.target.name;
        switch (name) {
          case "fname":
            setErrors({...errors,first_name: RegForName.test(fnameRef.current.value)? ""
              : " * Please Enter valid First Name",
            });
            setValues({ ...values, first_name: fnameRef.current.value });
          break;
          case "lname":
            setErrors({...errors,last_name: RegForName.test(lnameRef.current.value)? ""
              : " * Please Enter valid Last Name",
            });
            setValues({ ...values, last_name: lnameRef.current.value });
          break;
          case "email":
            setErrors({...errors,email: RegForEmail.test(emailRef.current.value)? ""
              : "* Uh oh! Looks like there is an issue with your email. Please input a correct email.",
            });
            setValues({ ...values, email: emailRef.current.value });
          break;
          case "dob":
            setErrors({...errors,dob: RegForName.test(dobRef.current.value)? ""
              : "* Uh oh! Enter valid birthdate !",
            });
            setValues({ ...values, dob: dobRef.current.value });
          break;
          case "profileImg":
              setValues({...values,profilePic:e.target.files[0]})
            break;
          case "mobile":
            setErrors({...errors,mobile: RegForMobile.test(mobileRef.current.value)? ""
              : "* Uh oh! Please input 10 digit correct mobile number.",
            });
            setValues({ ...values, mobile: mobileRef.current.value });
          break;
          case "gender":
            setErrors({...errors,gender:e.target.value? ""
              : "* Select one Option!",
            });
            setValues({ ...values, gender: e.target.value });
          break;
          default:
          break;
        }
    };

    const formSubmit = () => {
        if ( values.first_name !== "" && values.last_name !== "" && values.email !== "" && values.mobile !==  "" ) {
          if ( errors.first_name === "" && errors.last_name === "" && errors.email === "" && errors.mobile === "") {
            console.log(values)
            updateuser(values,uid)
                .then(res=>{
                    if(res.data.success===true){
                        console.log(res.data)
                        alert(res.data.message)
                        navigate("/profile")
                    }
                    if(res.data.success===false){
                        console.log(res.data)
                        alert(`${res.data.message}`)
                    }
                })
            }
            else {
            alert("Validation Error");
          }
        } else {
          alert("Input Fields must not be blank");
        }
    };
    const profile=()=>{
        navigate("/profile")
    }
    const changePassword=()=>{
        navigate("/changepassword")
    }
    const gotoAddress=()=>{
        navigate("/address")
    }
    const gotoOrders=()=>{
      navigate("/order")
  }
    return (
        <div>
            <Container>
            <Row>
                <Col sm={4}>
                <div><br/>
                    <Container className="border border-secondary text-center"><br/>
                    {logo?<>
                        <img src={avatar} height={"100hv"} width={"auto"} alt="not Found"/><br/><br/></>:
                        <><img src={values.profilePic} height={"100hv"} width={"auto"} alt="not Found"/><br/><br/></>}
                        <br/>
                        <div className='profile-btn btn-primary' onClick={profile}><FaUserCircle/> Profile</div><br/>
                        <div className='profile-btn' onClick={gotoOrders}><FaShoppingCart/> Orders</div><br/>
                        <div className='profile-btn' onClick={gotoAddress}><FaAddressCard/> Address</div><br/>
                        <div className='profile-btn' onClick={changePassword}><FaExchangeAlt/> Change Password</div><br/>
                     </Container>
                </div>
                </Col>
                <Col sm={8}><br/>
                <div className="border border-secondary">
                    <div className='Edit_Pro_div'>
                    <h2 className=" text-center text-danger">Edit Profile</h2>
                    <Form className="form_change" encType="multipart/form-data">
                    <Form.Group className="mb-3">
                        <Form.Label className="label_change">First Name</Form.Label>
                        <Form.Control
                        type="text"
                        name="fname"
                        ref={fnameRef}
                        value={values.first_name}
                        isValid={values.first_name !== "" ? true : false}
                        isInvalid={errors.first_name !== "" ? true : false}
                        onChange={(e) => handler(e)}
                        ></Form.Control>
                        <Form.Control.Feedback type="invalid">
                        {errors.first_name}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="label_change">Last Name</Form.Label>
                        <Form.Control
                        type="text"
                        name="lname"
                        ref={lnameRef}
                        value={values.last_name}
                        isValid={values.last_name !== "" ? true : false}
                        isInvalid={errors.last_name !== "" ? true : false}
                        onChange={(e) => handler(e)}
                        ></Form.Control>
                        <Form.Control.Feedback type="invalid">
                        {errors.last_name}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="label_change">Email</Form.Label>
                        <Form.Control
                        type="text"
                        name="email"
                        ref={emailRef}
                        value={values.email}
                        disabled
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="label_change">DOB</Form.Label>
                        <Form.Control
                        type="date"
                        name="dob"
                        ref={dobRef}
                        defaultValue={"1990-01-01"}
                        isValid={values.dob !== "" ? true : false}
                        onChange={(e) => handler(e)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="label_change">Mobile</Form.Label>
                        <Form.Control
                        type="number"
                        name="mobile"
                        ref={mobileRef}
                        value={values.mobile}
                        isValid={values.mobile !== "" ? true : false}
                        isInvalid={errors.mobile !== "" ? true : false}
                        onChange={(e) => handler(e)}
                        ></Form.Control>
                        <Form.Control.Feedback type="invalid">
                        {errors.mobile}
                        </Form.Control.Feedback>
                    </Form.Group>
                    {/* <Form.Group>
                        <Form.Label className="label">Select Gender -  &nbsp;</Form.Label>
                        <input type="radio" value="Male" name="gender"   onChange={e=>handler(e)}/> Male &nbsp;
                        <input type="radio" value="Female" name="gender"  onChange={e=>handler(e)}/> Female &nbsp;
                    </Form.Group> */}
                    <div>
                        <Button
                        onClick={formSubmit}
                        variant="primary"
                        className="reg-btn_change"
                        >
                        Update Profile
                        </Button>
                    </div>
                    </Form>
                    </div>
                </div>
                </Col>
            </Row>
            </Container>
        </div>
    )
}

export default EditProfile
