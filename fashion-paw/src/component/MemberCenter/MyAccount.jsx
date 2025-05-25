import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Sidebar from './MyAcc/Sidebar';
import Profile from './MyAcc/Profile';
import Orders from './MyAcc/Orders';
import Credit_Card from './MyAcc/Credit_Card';
import mycollect from './MyAcc/mycollect';
import MyCoupon from './MyAcc/MyCoupon';
import myAddress from './MyAcc/myAddress';
import Change_Password from './MyAcc/Change_Password';
import manage_market from './MyAcc/manage_market';
import Content_manage from './MyAcc/Content_manage';
import AutoLoginByToken from './AutoLoginByToken';

class MyAccount extends Component {
    state = {}
    render() {
        return (
            <>
                <Router>
                    <div className='d-flex'>
                        <Sidebar />
                        <div className="p-4 flex-grow-1">
                            <Switch>
                                <Route path="/MemberCenter/profile" component={Profile} />
                                <Route path="/MemberCenter/orders" component={Orders} />
                                {/* <Route path="/MemberCenter/credit-card" component={Credit_Card} /> */}
                                <Route path="/MemberCenter/mycollect" component={mycollect} />
                                <Route path="/MemberCenter/mycoupon" component={MyCoupon} />
                                <Route path="/MemberCenter/myAddress" component={myAddress} />
                                <Route path="/MemberCenter/change-password" component={Change_Password} />
                                <Route path="/MemberCenter/manage-market" component={manage_market} />
                                <Route path="/MemberCenter/Content-manage" component={Content_manage} />

                                <Route path="/MemberCenter" exact>
                                    <Redirect to="/MemberCenter/profile" />
                                </Route>
                                <Route path="/MemberCenter/autoLoginByToken" component={AutoLoginByToken} />

                            </Switch>
                        </div>

                    </div>

                </Router>
            </>
        );
    }
}

export default MyAccount;