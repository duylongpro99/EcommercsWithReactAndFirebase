import React, { Component } from 'react'
import { ProductsContextProvider } from './Global/ProductsContext'
import { Home } from './Components/Home'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Signup } from './Components/Signup'
import { Login } from './Components/Login'
import { NotFound } from './Components/NotFound'
import { auth, db } from './Config/Config'
import { CartContextProvider } from './Global/CartContext'
import { Cart } from './Components/Cart'
import { AddProducts } from './Components/AddProducts'
import { Cashout } from './Components/Cashout'
import { AddProductType } from './Components/AddProductType';
import { ProductDetail } from './Components/ProductDetail';
import { UserDetail } from './Components/UserDetail';
import { ChatHub } from './Components/ChatHub'
import Orders from './Components/Orders'
import { ChatContextProvider} from './Global/ChatContext';
import AllOrders from './Components/AllOrders'; 
import { OrdersContextProvider } from './Global/OrdersContext'; 
// import { Accessory } from './Components/Accessory';
export class App extends Component {

    state = {
        user: null,
        userId: null
    }

    componentDidMount() {

        // getting user info for navigation bar
        auth.onAuthStateChanged(user => {
            if (user) {
                db.collection('SignedUpUsersData').doc(user.uid).get().then(snapshot => {
                    this.setState({
                        userId: user.uid,
                        user: snapshot.data().Name,
                        avatar: snapshot.data().Avatar,
                        isAdmin: snapshot.data().IsAdmin ? true : false 
                    }, ()=>{
                    })
                })
            }
            else {
                this.setState({
                    user: null
                })
            }
        })

    }

    reGetUser = () => {
        auth.onAuthStateChanged(user => {
            if (user) {
                db.collection('SignedUpUsersData').doc(user.uid).get().then(snapshot => {
                    this.setState({
                        userId: user.uid,
                        user: snapshot.data().Name,
                        avatar: snapshot.data().Avatar,
                        isAdmin: snapshot.data().IsAdmin ? true : false 
                    })
                })
            }
            else {
                this.setState({
                    user: null
                })
            }
        })
    }

    render() {
        return (
            <ChatContextProvider>
                <OrdersContextProvider>
                    
                    <ProductsContextProvider>
                        <CartContextProvider>
                            <BrowserRouter>
                                <Switch>
                                    {/* home */}
                                    <Route exact path='/' component={() => <Home isAdmin = {this.state.isAdmin} avatar = {this.state.avatar} user={this.state.user} userId ={this.state.userId}/>} />
                                    {/* signup */}
                                    <Route path="/signup" component={() => <Signup history = {this.state} user={this.state.user} />} />
                                    {/* login */}
                                    <Route path="/login" component={() => <Login history = {this.state} user={this.state.user}/>} />
                                    {/* cart products */}
                                    <Route path="/cartproducts" component={() => <Cart  isAdmin = {this.state.isAdmin} avatar = {this.state.avatar} user={this.state.user} userId = {this.state.userId} />} />
                                    {/* add products */}
                                    <Route path="/addproducts" component={() => <AddProducts  isAdmin = {this.state.isAdmin} avatar = {this.state.avatar} user={this.state.user} userId ={this.state.userId} />} />
                                    {/* add product type */}
                                    <Route path="/addproduct-type" component={() => <AddProductType  isAdmin = {this.state.isAdmin} avatar = {this.state.avatar} user={this.state.user} userId ={this.state.userId}/>} />
                                    {/* cashout */}
                                    <Route path='/cashout' component={() => <Cashout  isAdmin = {this.state.isAdmin} avatar = {this.state.avatar} user={this.state.user} userId ={this.state.userId} />} />
                                    {/* product detail */}
                                    <Route path="/product-detail/:productId" component={() => <ProductDetail  isAdmin = {this.state.isAdmin} history = {this.state} user={this.state.user} userId ={this.state.userId} avatar = {this.state.avatar} /> } />
                                    {/* user detail */}
                                    <Route path="/user-detail/:userId" component={() => <UserDetail  isAdmin = {this.state.isAdmin} history = {this.state} user={this.state.user} userId ={this.state.userId} reGetUser = {this.reGetUser}/> }/>
                                    {/* chat */}
                                    <Route path="/chat/:userId" component={() => <ChatHub  isAdmin = {this.state.isAdmin} history = {this.state} user={this.state.user} userId ={this.state.userId} avatar = {this.state.avatar} reGetUser = {this.reGetUser}/> }/>
                                    {/* accessories */}
                                    {/* <Route path="/accessories" component={() => <Accessory  isAdmin = {this.state.isAdmin} history = {this.state} user={this.state.user} userId ={this.state.userId} avatar = {this.state.avatar} /> }/> */}
                                    <Route path="/orders" component={() => <Orders  isAdmin = {this.state.isAdmin} history = {this.state} user={this.state.user} userId ={this.state.userId} reGetUser = {this.reGetUser} avatar = {this.state.avatar}/> }/>
                                    <Route path="/all-orders" component={() => <AllOrders  isAdmin = {this.state.isAdmin} history = {this.state} user={this.state.user} userId ={this.state.userId} reGetUser = {this.reGetUser} avatar = {this.state.avatar}/> }/>
                                    <Route component={NotFound} />
                                </Switch>
                            </BrowserRouter>
                        </CartContextProvider>
                    </ProductsContextProvider>
                </OrdersContextProvider>
            </ChatContextProvider>
        )
    }
}

export default App
