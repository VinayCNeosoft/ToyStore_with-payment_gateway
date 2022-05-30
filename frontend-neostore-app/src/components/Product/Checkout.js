import React,{useRef,useState,useEffect} from 'react'
import { Container,Table,Button ,Row,Col} from 'react-bootstrap'
import Stepper from 'react-stepper-horizontal';
import {useNavigate ,useParams} from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { addToCart,getCustAddress } from '../../config/NodeService';
import {FiEdit} from 'react-icons/fi'
import {AiOutlineDelete} from 'react-icons/ai'
import jwt_decode from 'jwt-decode'
import Address from '../Account/Address';
import {steperModel} from './Cart'

// check use Effect in the morning

function Checkout() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState();
  const [gst,setGst]= useState()
  const [netTotal,setNetTotal] = useState()
  const [checkoutdone, setCheckoutdone] = useState(true);
  const refQuantity = useRef(null);
  const [uid,setUid] = useState(null)
  const [allAddress,setAllAddress] = useState([])
  const [isAddressAvailable,setIsAddressAvailable] = useState(true)
  const [addr,setAddr]=useState([])
  const [cartIsEmpty, setIsCartIsEmpty] = useState(true);

  const [placeMyOrder,setPlaceMyOrder] = useState(false)
  const [isAddressSelected,setIsAddressSelected]=useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const u = localStorage.getItem("user")

  useEffect(()=>{
    if(localStorage.getItem("token")===""){
        navigate("/")
    }
    else{
        let token=localStorage.getItem('token');
        let decode=jwt_decode(token);
        console.log(decode.uid)
        setUid(decode.uid)
        getCustAddress(decode.uid)
        .then(res=>{
            if(res.data.success===true){
              console.log(res.data.address)
              if(res.data.address.length === 0)
              {
                setIsAddressAvailable(false)
                console.log("address not present")
              }
              else{
                setIsAddressAvailable(true)
                setAllAddress(res.data.address)
                console.log("address Present")
              }
            }
            else if(res.data.success===false){
                console.log(res.data)
                alert(`${res.data.message}`)
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

  const addAddress= () =>{
    navigate("/address")
  }

  const selectAddress=(d)=>{
    setIsAddressSelected(true)
    console.log(d)
    setAddr(d)
    let delAddress=JSON.stringify(d)
    localStorage.setItem("delivery_Address",delAddress)
    console.log(JSON.parse(localStorage.getItem("delivery_Address")))
  }
  const placeOrder = () =>{
    navigate("/placeorder")
  }

  if(isAddressAvailable){
    return(
      <>
      <div className="mt-3 container">
        {/* {steperModel(1)} */}
        <Stepper steps={ [{title: 'Cart'}, {title: 'Delivery Address'}, {title: 'Place Order'}] } activeStep={ 1 } completedStep={1} completeColor={"#1cac78"} completeBarColor={"#1cac78"} activeColor={"#5096FF"}/>
        <h3 className='text-center text-danger'> Select Delivery Address</h3>
      </div>
      <br/>
      <Container>
      <h2 className='text-center'>All Address</h2>
      <Row className="align-items-center">
      <Col sm={12} md={4} xs="auto">
        {allAddress.map((d,index)=>(
          <div key={index} className='bordered'>
          <br/>
          <Table responsive="sm" style={{border:"2px solid"}} cellSpacing={0} cellPadding={0} onClick={()=>selectAddress(d)}>
            <tbody>
              <tr>
                <td colSpan={2}><b>{index+1}</b></td>
              </tr>
              <tr>
                <td><b>Address : </b></td>
                <td><b>{d.street}</b></td>
              </tr>
              <tr>
                <td><b>Pincode : </b></td>
                <td><b>{d.pincode}</b></td>
              </tr>
              <tr>
                <td><b>City : </b></td>
                <td><b>{d.city}</b></td>
              </tr>
              <tr>
                <td><b>State : </b></td>
                <td><b>{d.state}</b></td>
              </tr>
              <tr>
                <td><b>Country :</b></td>
                <td><b>{d.country}</b></td>
              </tr>
            </tbody>
          </Table>
        </div>
      ))}
      <div className='text-center'><Button variant='info' onClick={addAddress}>Add New Address</Button></div><br/>
      </Col>
      <Col md={8} sm={12}>
        <>
          <div className='mt-2'>
            {isAddressSelected?<><h4 className='text-center'>Delivery to this address</h4>
              <br/>
              <Table style={{border:"2px solid",marginRight:"auto",marginLeft:"auto"}} cellSpacing={0} cellPadding={0}>
                <tbody>
                  <tr>
                    <td><b>Address : </b></td>
                    <td><b>{addr.street}</b></td>
                  </tr>
                  <tr>
                    <td><b>Pincode : </b></td>
                    <td><b>{addr.pincode}</b></td>
                  </tr>
                  <tr>
                    <td><b>City : </b></td>
                    <td><b>{addr.city}</b></td>
                  </tr>
                  <tr>
                    <td><b>State : </b></td>
                    <td><b>{addr.state}</b></td>
                  </tr>
                  <tr>
                    <td><b>Country :</b></td>
                    <td><b>{addr.country}</b></td>
                  </tr>
                </tbody>
              </Table>
              <br/>
              <div className='text-center'>
                <Button variant='success' onClick={placeOrder}>Proceed to Pay</Button>
              </div></>:<><div style={{marginLeft:"auto",marinRight:"auto"}}><h3 className='text-center text-danger'>Delivery Address Not Selected</h3></div></>}
          </div>
        </>
        </Col>
      </Row>
      </Container>

    </>
    )
  }
  else{
    return(
    <>
      <br/>
      <Container style={{height:"28vh"}}>
        <h2>Address Not added </h2>
        <div className='text-center'><Button variant='info' onClick={addAddress}>Add Address</Button></div><br/>
      </Container>
    </>
    )
  }
}

export default Checkout
