import React, { createContext } from 'react'
import { db } from '../Config/Config'

export const OrdersContext = createContext();

export class OrdersContextProvider extends React.Component {

    state = {
        products: [],
        productTypes: [],
        userProducts: [],
        allorders: []
    }
    componentDidMount() {

        this.deleteOrders = this.deleteOrders.bind(this);
        this.getOrders = this.getOrders.bind(this);
        this.deleteUserProducts = this.deleteUserProducts.bind(this);
        this.updateOrderStatus = this.updateOrderStatus.bind(this);

        const userProducts = this.state.userProducts;
        db.collection('UserProduct').onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type === 'added') {
                    userProducts.push({
                        userProduct: change.doc.id,
                        userId: change.doc.data().UserId,
                        productId: change.doc.data().ProductId,
                    })
                }
                this.setState({
                    userProducts: userProducts
                })
            });
        })
        
        const prevProducts = this.state.products;
        db.collection('Products').onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type === 'added') {
                    prevProducts.push({
                        ProductID: change.doc.id,
                        ProductName: change.doc.data().ProductName,
                        ProductPrice: change.doc.data().ProductPrice,
                        ProductImg: change.doc.data().ProductImg,
                        ProductType: change.doc.data().ProductType,
                        ProductSale: change.doc.data().ProductSale,
                    })
                }
                this.setState({
                    products: prevProducts
                })
            })
        })

        const productTypes = this.state.productTypes;
        db.collection('ProductType').onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type === 'added') {
                    productTypes.push({
                        Type: change.doc.data().Type,
                    })
                }
                this.setState({
                    productTypes: productTypes
                })
            })
        })

        const prevOrders = [];
        db.collection('AllBuyer').onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type === 'added') {
                    prevOrders.push({
                        DocId: change.doc.id,
                        OrderId: change.doc.data().OrderId,
                        payerName: change.doc.data().payerName,
                        status: change.doc.data().status,
                        userId: change.doc.data().UserId,
                        BuyerName: change.doc.data().BuyerName,
                        BuyerQuantity: change.doc.data().BuyerQuantity,
                        BuyerPayment: change.doc.data().BuyerPayment,
                        BuyerEmail: change.doc.data().BuyerEmail,
                        BuyerCell: change.doc.data().BuyerCell,
                        BuyerAddress: change.doc.data().BuyerAddress,
                    })
                }
            })
            this.setState({ allorders: prevOrders });
        })
    }

    deleteOrders  = (p) => {
        db.collection('Products').doc(p.ProductID).delete().then(() => {
            const prevProducts = [];
            db.collection('Products').onSnapshot(snapshot => {
                let changes = snapshot.docChanges();
                changes.forEach(change => {
                    if (change.type === 'added') {
                        prevProducts.push({
                            ProductID: change.doc.id,
                            ProductName: change.doc.data().ProductName,
                            ProductPrice: change.doc.data().ProductPrice,
                            ProductImg: change.doc.data().ProductImg,
                            ProductType: change.doc.data().ProductType,
                            ProductSale: change.doc.data().ProductSale,
                        })
                    }
                    this.setState({
                        products: prevProducts
                    })
                })
            })
        })
    }

    deleteUserProducts = (userId) => {
        db.collection('UserProduct').where('UserId', '==', userId).get()
        .then(snapshot => {
            snapshot.forEach(up => {
                db.collection('UserProduct').doc(up.id).delete().then(()=>{
                    const userProducts = [];
                    db.collection('UserProduct').onSnapshot(snapshot => {
                        let changes = snapshot.docChanges();
                        changes.forEach(change => {
                            if (change.type === 'added') {
                                userProducts.push({
                                    userProduct: change.doc.id,
                                    userId: change.doc.data().UserId,
                                    productId: change.doc.data().ProductId,
                                })
                            }
                    this.setState({
                    userProducts: userProducts
                })
            });
        })
                });
            })
        })
    }

    getOrders = () => {
        const prevOrders = [];
        db.collection('AllBuyer').onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type === 'added') {
                    prevOrders.push({
                        DocId: change.doc.id,
                        OrderId: change.doc.data().OrderId,
                        payerName: change.doc.data().payerName,
                        status: change.doc.data().status,
                        userId: change.doc.data().UserId,
                        BuyerName: change.doc.data().BuyerName,
                        BuyerQuantity: change.doc.data().BuyerQuantity,
                        BuyerPayment: change.doc.data().BuyerPayment,
                        BuyerEmail: change.doc.data().BuyerEmail,
                        BuyerCell: change.doc.data().BuyerCell,
                        BuyerAddress: change.doc.data().BuyerAddress,

                    })
                }
                this.setState({ allorders: prevOrders })
            })
        })
    }

    updateOrderStatus = (orderId, status) => {
        let orderRef = db.collection('AllBuyer').doc(orderId);
        orderRef.update({
            status: status
        }).then(()=>{
            this.getOrders();
        });
    }

    render() {
        return (
            <OrdersContext.Provider  value={{ allorders: [...this.state.allorders], getOrders: this.getOrders, updateOrderStatus: this.updateOrderStatus}}>
                {this.props.children}
            </OrdersContext.Provider>
        )
    }
}

