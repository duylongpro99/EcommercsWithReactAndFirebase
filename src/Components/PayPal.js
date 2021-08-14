import React, {useEffect, useRef, useContext} from 'react';
import { auth, db } from '../Config/Config'
import { CartContext } from '../Global/CartContext'
import { ProductsContext } from '../Global/ProductsContext'
import { useHistory } from 'react-router-dom';

const paypalStyle = {
    display: 'flex',
    justifyContent: 'center'
};
export default function PayPal({totalPrice, userId, name, email, cellPhone, address, resetCellPhone, resetSucessNoti, resetAddress}){
    const { shoppingCart, totalQty, dispatch } = useContext(CartContext);
    const  {deleteUserProducts} = useContext(ProductsContext);
    const history = useHistory();
    const paypal = useRef();
    useEffect(()=>{
        window.paypal.Buttons({
            createOrder: (data, actions, err) => {
                return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [
                        {
                            description: "Cool looking table",
                            amount: {
                                currency_code: "USD",
                                value: totalPrice
                            }
                        }
                    ]
                });
            },
            onApprove: async (data, actions) => {
                console.log(data, actions);
                const order = await actions.order.capture();
                console.log("Success order: " + order);
                auth.onAuthStateChanged(user => {
                    if (user) {
                        const date = new Date();
                        const time = date.getTime();
                        db.collection('Buyer-info ' + user.uid).doc('_' + time).set({
                            BuyerName: name,
                            BuyerEmail: email,
                            BuyerCell: cellPhone,
                            BuyerAddress: address,
                            BuyerPayment: totalPrice,
                            BuyerQuantity: totalQty,
                            products: shoppingCart.map(item => item.ProductID),
                            OrderIdPayPal: data.orderID ? data.orderID : null,
                            PayerIdPayPal: data.payerID ? data.payerID : null,
                            status: 'confirmed'
                        }).then(() => {
                            deleteUserProducts(userId);
                            resetCellPhone('');
                            resetAddress('');
                            dispatch({ type: 'EMPTY' })
                            resetSucessNoti('Your order has been placed successfully. Thanks for visiting us. You will be redirected to home page after 5 seconds');
                            setTimeout(() => {
                                history.push('/')
                            }, 5000)
                        })
                    }
                })
            },
            onError: (error)=>{
                console.log(error);
            }
        }).render(paypal.current);
    },[])
    return (
        <div style={paypalStyle} ref={paypal}></div>
    );
}