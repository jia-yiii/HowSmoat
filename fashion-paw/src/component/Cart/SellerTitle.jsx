import React, { Component } from 'react';
import { CartContext } from './CartContext';

class SellerTitle extends Component {
  static contextType = CartContext;

  render() {
    const { uid } = this.props;
    if (!uid) return null;

    const sellerName = this.context.getSellerName(uid);

    return (
      <div className="mt-3 mb-1">
        <span style={{ fontWeight: "500" }}>{sellerName}</span>
      </div>
    );
  }
}

export default SellerTitle;