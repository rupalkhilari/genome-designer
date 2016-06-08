import React, { PropTypes } from 'react';

import '../../styles/OrderList.css';

export default function OrderList({ orders, onClick, ...rest }) {

  if (!orders.length) {
    return null;
  }

  return (
    <div className="OrderList">
      {orders.map(order => {
        return (
          <div className="OrderList-group"
               key={order.id}>
            <div className="OrderList-group-heading">{order.getName()}</div>
            <div className="OrderList-group-time">
              {(new Date(order.dateSubmitted())).toLocaleString()}
              <a className="OrderList-group-action"
                 onClick={() => onClick(order.id)}>Order Details...</a>
            </div>
          </div>
        );
      })}
    </div>
  );
}

OrderList.propTypes = {
  orders: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
};