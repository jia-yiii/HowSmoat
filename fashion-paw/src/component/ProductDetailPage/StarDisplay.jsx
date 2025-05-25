// PawDisplay.jsx
import React, { Component } from 'react';
import star_yellow from './image/Star y 6 .svg'; // 黃色星星
import star_grey from './image/star_grey.svg';    // 灰色星星

class StarDisplay extends Component {
  render() {
    const { rating } = this.props;
    return (
      <div style={{ display: 'inline-flex', gap: '1px', verticalAlign: 'middle' }}>
        {[1, 2, 3, 4, 5].map((index) => (
         <img
         key={index}
         src={index <= rating ? star_yellow : star_grey}
         alt={`star-${index}`}
         style={{ width: '22px', height: '24px'}}
       />
        ))}
      </div>
    );
  }
}

export default StarDisplay;