import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom';

import New_Products_Manage from './Content_manage/New_product_manage';
import Second_Products_manage from './Content_manage/Second_product_manage';
import User_manage from './Content_manage/User_manage';
import Article_manage from './Content_manage/Article_manage';
import styles from './Content_manage.module.css'
class Content_manage extends Component {
    state = {}
    render() {
        return (
            <>
                <Router>
                    <h4 style={{ color: "#333" }}>後臺管理</h4>
                    <div className={styles.manangertitle}>
                        <div className={styles.title}><Link to="/MemberCenter/Content-manage/New_Products">新品管理</Link></div>
                        <div className={styles.title}><Link to="/MemberCenter/Content-manage/Second_Products">二手商品管理</Link></div>
                        <div className={styles.title}><Link to="/MemberCenter/Content-manage/User">使用者管理</Link></div>
                        <div className={styles.title}><Link to="/MemberCenter/Content-manage/Article">文章管理</Link></div>
                    </div>
                    <Switch>
                        <Route path="/MemberCenter/Content-manage/New_Products" component={New_Products_Manage} />
                        <Route path="/MemberCenter/Content-manage/Second_Products" component={Second_Products_manage} />
                        <Route path="/MemberCenter/Content-manage/User" component={User_manage} />
                        <Route path="/MemberCenter/Content-manage/Article" component={Article_manage} />
                    </Switch>
                    <Route path="/MemberCenter/Content-manage" exact>
                        <Redirect to="/MemberCenter/Content-manage/New_Products" />
                    </Route>
                </Router >
            </>
        );
    }
}

export default Content_manage;

