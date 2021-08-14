import {
  Popover
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { auth } from "../Config/Config";
import { OrdersContext } from "../Global/OrdersContext";
import { Navbar } from "./Navbar";

function AllOrders({ userId, user, avatar, isAdmin }) {
  const [orders, setOrders] = useState([]);
  const [stars, setStars] = useState(1);
  const [comment, setComment] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [openedPopoverId, setOpenedPopoverId] = useState(-1);
  const [checked, setChecked] = useState([]);
  const { allorders, updateOrderStatus } = useContext(OrdersContext);


  const steps = ["Confirmed", "Shipped", "Delivered"];

  const stepActive = {
    confirmed: 1,
    shipped: 2,
    delivered: 3,
  };

  const handleOrderDetail = (id) => {
    let temp = checked;
    temp = temp.map((item) =>
      item.id === id ? { id: id, checked: !item.checked } : item
    );
    setChecked(temp);
  };

  const handleClickRating = (event, id) => {
    setOpenedPopoverId(id);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseRating = () => {
    setAnchorEl(null);
    setOpenedPopoverId(-1);
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        history.push("/login");
      }
    });

    if(!isAdmin){
      history.push("/");
    }
  }, [allorders.length]);

  const onUpdateOrder = (e, status, orderId) => {
    e.preventDefault();
    updateOrderStatus(orderId, status);
  }

  const history = useHistory();
  const OrderComponent = ({ title, value, orderId }) => {
    return (
      <div className="d-flex flex-column">
        <div className="text-muted">{title}</div>
        <div style={{ fontWeight: "bold" }} className={title === "Status" ? statusColor[value] : ""} >
          {value}{title === "Total" ? "$" : " "}
          {title === "Status" && value === "confirmed" ? <button className="ml-2 btn btn-info" onClick={(e) => onUpdateOrder(e, 'shipped', orderId)}>shipped</button>: null}
          {title === "Status" && value === "shipped" ? <button className="ml-2 btn btn-success" onClick={(e) => onUpdateOrder(e, 'delivered', orderId)}>delivered</button>: null}
        </div>
      </div>
    );
  };
  const statusColor = {
    confirmed: "text-warning",
    shipped: "text-primary",
    delivered: "text-danger",
  };
  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar user={user} userId={userId} avatar={avatar} />
      <h1>Orders</h1>
      <div className="container">
        <div className="row">
          <div className="col-md-12 col-sm-12">
            {allorders && allorders.length && allorders.map((item, index) => (
              <div key={index} className="mb-5" style={{ maxWidth: "100%", width: "100%" }} >
                <span style={{ fontWeight: "bold" }}>Order #</span>
                <div key={item.id} className="border border-2 rounded bg-white" style={{ maxWidth: "100%", width: "100%" }} >
                  <div className="d-flex d-flex justify-content-between align-items-center p-3">
                    <OrderComponent title={"Total"} value={item.BuyerPayment} orderId={item.DocId}/>
                    <OrderComponent title={"Status"} value={item.status} orderId={item.DocId}/>  
                    <OrderComponent title={"Name"} value={item.BuyerName} orderId={item.DocId}/>  
                    <OrderComponent title={"Email"} value={item.BuyerEmail} orderId={item.DocId}/>  
                  </div>
                  
                  {item.status === "delivered" && (
                    <div className="border-top p-2 bg-light">
                      <button
                        onClick={(e) => handleClickRating(e, index)}
                        style={{
                          border: "none",
                          outline: "none",
                          backgroundColor: "transparent",
                          fontWeight: "bold",
                        }}
                        className="text-primary"
                      >
                        <i className="fa fa-heart"></i> Review and Rating
                      </button>
                      <Popover
                        open={openedPopoverId === index}
                        anchorEl={anchorEl}
                        onClose={handleCloseRating}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                      >
                        <div className="p-3" style={{}}>
                          <div
                            className="d-flex flex-column justify-content-center align-items-center"
                            style={{ fontWeight: "bold" }}
                          >
                            How many stars do you rate this product?
                            <Rating
                              name="simple-controlled"
                              value={stars}
                              onChange={(event, newValue) => {
                                setStars(newValue);
                              }}
                            />
                          </div>
                          {/* <TextField
                            id="filled-multiline-flexible"
                            label="Write comment"
                            multiline
                            rowsMax={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            variant="filled"
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    style={{ outline: "none" }}
                                    aria-label="toggle password visibility"
                                    onClick={() =>
                                      handleSendComment(item.data.products)
                                    }
                                  >
                                    Send
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          /> */}
                        </div>
                      </Popover>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllOrders;
