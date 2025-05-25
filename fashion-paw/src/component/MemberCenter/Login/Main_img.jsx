import React, { Component } from 'react';
class Main_img
 extends Component {
    state = { 
        class: this.props.className
     } 
    render() { 
        return (
            <div className={this.state.class}>
                <img src={this.props.source} alt="主視覺" className="img-fluid" />
            </div>
        );
    }
}
 
export default Main_img
;