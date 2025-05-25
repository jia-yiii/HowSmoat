
import React, { Component } from 'react';
import PdDetailPage from '../ProductDetailPage'; 

export default class NewPdDetail extends Component {
  render() {
    const { pid } = this.props.match.params;
    return <PdDetailPage pid={pid} />;
  }
}