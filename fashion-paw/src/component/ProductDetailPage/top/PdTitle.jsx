import React, { Component } from 'react';
class PdTitle extends Component {
 
    render() { 
        const { pdname } = this.props
        return (
            <>
            <div className='my-3'>
                <h3>{pdname}</h3>
            </div>
            </>
        );
    }
}
 
export default PdTitle;