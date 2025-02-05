import React, { useState, useEffect, useContext } from 'react'
import { auth, db } from '../Config/Config'
import { CartContext } from '../Global/CartContext'
import { ProductsContext } from '../Global/ProductsContext'
import { Navbar } from './Navbar';
import { useHistory } from 'react-router-dom';
import  PayPal  from '../Components/PayPal';

export const Cashout = (props) => {

    const history = useHistory();
    const  {deleteUserProducts} = useContext(ProductsContext);
    const { shoppingCart, totalPrice, totalQty, dispatch } = useContext(CartContext);

    // defining state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cell, setCell] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [checkout, setCheckout] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                db.collection('SignedUpUsersData').doc(user.uid).onSnapshot(snapshot => {
                    setName(snapshot.data().Name);
                    setEmail(snapshot.data().Email);
                })
            }
            else {
                history.push('/login')
            }
        })
    })

    const resetCellPhone = (e) => {
        setCell('');
    }

    const resetAddress = (e) => {
        setAddress('');
    }

    const resetSucessNoti = (e) => {
        setSuccessMsg('Your order has been placed successfully. Thanks for visiting us. You will be redirected to home page after 5 seconds');
    }

    const cashoutSubmit = (e) => {
        e.preventDefault();
        setCheckout(true);
        // auth.onAuthStateChanged(user => {
        //     if (user) {
        //         const date = new Date();
        //         const time = date.getTime();
        //         db.collection('Buyer-info ' + user.uid).doc('_' + time).set({
        //             BuyerName: name,
        //             BuyerEmail: email,
        //             BuyerCell: cell,
        //             BuyerAddress: address,
        //             BuyerPayment: totalPrice,
        //             BuyerQuantity: totalQty,
        //             products: shoppingCart.map(item => item.ProductID),
        //             status: 'confirmed'
        //         }).then(() => {
        //             deleteUserProducts(props.userId);
        //             setCell('');
        //             setAddress('');
        //             dispatch({ type: 'EMPTY' })
        //             setSuccessMsg('Your order has been placed successfully. Thanks for visiting us. You will be redirected to home page after 5 seconds');
        //             setTimeout(() => {
        //                 history.push('/')
        //             }, 5000)
        //         }).catch(err => setError(err.message))
        //     }
        // })
    }

    return (
        <>
            <Navbar user={props.user} userId = {props.userId} avatar = {props.avatar} />
            <div className='container'>
                <br />
                <h2 style={{textAlign: 'center'}}>Cashout Details</h2>
                <br />
                {successMsg && <div className='success-msg'>{successMsg}</div>}
                <div className="cashout-form-container">

                    <form autoComplete="off" className='form-group cashout' onSubmit={cashoutSubmit}>
                        <label htmlFor="name">Name</label>
                        <input type="text" className='form-control' required
                            value={name} disabled />
                        <br />
                        <label htmlFor="email">Email</label>
                        <input type="email" className='form-control' required
                            value={email} disabled />
                        <br />
                        <label htmlFor="Cell No">Cell No</label>
                        <input type="number" className='form-control' required
                            onChange={(e) => setCell(e.target.value)} value={cell} placeholder='eg 03123456789' />
                        <br />
                        <label htmlFor="Delivery Address">Delivery Address</label>
                        <input type="text" className='form-control' required
                            onChange={(e) => setAddress(e.target.value)} value={address} />
                        <br />
                        <label htmlFor="Price To Pay">Price To Pay</label>
                        <input type="number" className='form-control' required
                            value={totalPrice} disabled />
                        <br />
                        <label htmlFor="Total No of Products">Total No of Products</label>
                        <input type="number" className='form-control' required
                            value={totalQty} disabled />
                        <br />
                        {
                            checkout ? (
                                <PayPal totalPrice={totalPrice} userId={props.userId} name={name} email={email}
                                    cellPhone={cell} address={address} 
                                    resetCellPhone={() => resetCellPhone()}
                                    resetAddress={() => resetAddress()}
                                    resetSucessNoti={() => resetSucessNoti()}
                                />
                            )
                            : (
                                <button type="submit" className='btn btn-success btn-md mybtn  cashout-button'>Submit</button>
                            )
                        }
                    </form>
                </div>
                {error && <span className='error-msg'>{error}</span>}
            </div>
        </>
    )
}
