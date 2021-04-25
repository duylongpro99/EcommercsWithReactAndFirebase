import React, { createContext } from 'react'
import { db } from '../Config/Config'

export const ProductsContext = createContext();

export class ProductsContextProvider extends React.Component {

    state = {
        products: [],
        productTypes: [],
        userProducts: [],
    }

    componentDidMount() {

        this.deleteProduct = this.deleteProduct.bind(this);
        this.getProducts = this.getProducts.bind(this);
        this.deleteUserProducts = this.deleteUserProducts.bind(this);

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
    }

    deleteProduct  = (p) => {
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

    getProducts = () => {
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
    }

    render() {
        return (
            <ProductsContext.Provider  value={{ products: [...this.state.products], productTypes: [...this.state.productTypes], userProducts: [...this.state.userProducts], deleteProduct: this.deleteProduct, getProducts: this.getProducts, deleteUserProducts: this.deleteUserProducts }}>
                {this.props.children}
            </ProductsContext.Provider>
        )
    }
}

