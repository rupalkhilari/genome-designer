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
          <div className="InspectorContent-section-group"
               key={order.id}>
            <div className="InspectorContent-section-group-heading">{order.getName()}</div>
            <div className="InspectorContent-section-group-text">
              {(new Date(order.dateSubmitted())).toLocaleString()}
              <a className="InspectorContent-section-group-link"
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
