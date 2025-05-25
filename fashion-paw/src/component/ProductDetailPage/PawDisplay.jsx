// PawDisplay.jsx
import React, { Component } from 'react';
import pawOrange from './image/pawLight_final.svg'; // 橘色腳印
import pawGray from './image/pawDark_final.svg';    // 灰色腳印

class PawDisplay extends Component {
  render() {
    const { rating } = this.props;
    return (
      <div style={{ display: 'inline-flex', gap: '1px', verticalAlign: 'middle' }}>
        {[1, 2, 3, 4, 5].map((index) => (
         <img
         key={index}
         src={index <= rating ? pawOrange : pawGray}
         alt={`paw-${index}`}
         style={{ width: '24px', height: '24px'}}
       />
        ))}
      </div>
    );
  }
}

export default PawDisplay;