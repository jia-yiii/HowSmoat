import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import styles from './component/Homepage/IndexStyle.module.css';
import Header from './component/Homepage/Header';
import Footer from './component/Homepage/Footer';
import Breadcrumbs from './component/share/BreadCrumbs';
import Icon from './component/Homepage/Icon';

import Homepage from './component/Homepage/Homepage';
import MemberCenter from './component/MemberCenter/MyAccount';
import Login from './component/MemberCenter/Login';
import Third_SetCookie from './component/MemberCenter/Login/Third_SetCookie';
import Register from './component/MemberCenter/Register';
import ProductPage from './component/ProductPage/ProductPage';
import SeProductPage from './component/SeProductPage/SeProductPage';
import ProductRouter from './component/ProductDetailPage/router/ProductRouter';
import NewPdDetail from './component/ProductDetailPage/router/NewPdDetail';
import SecondPdDetail from './component/ProductDetailPage/router/SecondPdDetail';


import ShoppingCartPage from './component/Cart/ShoppingCartPage';
import SyncCartOnLogin from './component/Cart/SyncCartOnLogin';
import CheckBillPage from './component/CheckBill/CheckBillPage';
import Helpme from './component/Aboutus/helpme';
import Needhelp from './component/Aboutus/needhelp';
import Chatroom from './component/Aboutus/chatroom';
import ChatWindow from 'component/chatroom/ChatWindow';


import KnowledgeLayout from './component/PetKnowledge/KnowledgeLayout';
import ArticleDetail from './component/PetKnowledge/ArticleDetail';
import Touch from './component/PetKnowledge/PartTouch/Touch';
import Quiz from './component/PetKnowledge/PetQuiz/Quiz';

import { CartProvider } from './component/Cart/CartContext';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Header />
        <SyncCartOnLogin />
        <main className={`mainContent ${styles.mainContent}`}>
          <Breadcrumbs />
          <Switch>
            <Route path="/" component={Homepage} exact />
            <Route path="/MemberCenter" component={MemberCenter} />
            <Route path="/Login" component={Login} />
            <Route path="/Third_SetCookie" component={Third_SetCookie} />
            <Route path="/Register" component={Register} />
            <Route path="/ProductPage/:pid" component={NewPdDetail} exact/>
            <Route path="/ProductPage" component={ProductPage} />
            <Route path="/SeProductPage" component={SeProductPage} exact />
            <Route path="/product/:pid" component={ProductRouter} exact />
            <Route path="/SeProductPage/:pid" component={SecondPdDetail} exact />
            <Route path="/ShoppingCartPage" component={ShoppingCartPage} exact />
            <Route path="/CheckBillPage" component={CheckBillPage} exact />
            <Route path="/Aboutus" component={Helpme} exact />
            <Route path="/Help" component={Needhelp} exact />
            <Route path="/Chatroom" component={Chatroom} exact />

            {/* 寵物小知識：列表頁 */}
            <Route
              path="/Novicefeeding/:pet"
              exact
              render={props => <KnowledgeLayout {...props} topic="Novicefeeding" />}
            />
            <Route
              path="/HealthCheck/:pet"
              exact
              render={props => <KnowledgeLayout {...props} topic="HealthCheck" />}
            />

            {/* 寵物小知識：詳細頁 (統一用 articleId) */}
            <Route
              path="/Novicefeeding/:pet/:articleId"
              exact
              render={props => <ArticleDetail {...props} topic="Novicefeeding" />}
            />
            <Route
              path="/HealthCheck/:pet/:articleId"
              exact
              render={props => <ArticleDetail {...props} topic="HealthCheck" />}
            />

            {/* 其他 */}
            <Route path="/PetKnowledge" component={KnowledgeLayout} exact />
            <Route path="/PartTouch/Touch" component={Touch} exact />
            <Route path="/PetQuiz/Quiz" component={Quiz} exact />
          </Switch>
        </main>
        <Footer />
      </CartProvider>

      <Icon />
    </BrowserRouter>
  );
}

export default App;
