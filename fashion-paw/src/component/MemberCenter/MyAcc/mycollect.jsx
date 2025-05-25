import React, { Component } from 'react';
import FavoriteCard from './mycollect/Favorite';
import cookie from "js-cookie";
import axios from 'axios';

class mycollect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            favorites: [
                { id: 1, img: '/logo512.png', pd_name: '貓飼料', price: 350 },
                { id: 2, img: '/logo512.png', pd_name: '貓飼料', price: 350 },
                { id: 3, img: '/logo512.png', pd_name: '貓飼料', price: 350 },
                { id: 4, img: '/logo512.png', pd_name: '貓飼料', price: 350 },
                { id: 5, img: '/logo512.png', pd_name: '貓飼料', price: 350 },
                { id: 6, img: '/logo512.png', pd_name: '貓飼料', price: 350 },
                { id: 7, img: '/logo192.png', pd_name: '狗狗玩具', price: 250 }
            ]

        };
    }

    removeFavorite = (id) => {
        this.setState(prevState => ({
            favorites: prevState.favorites.filter(fav => fav.id !== id)
        }));
    }
    componentDidUpdate() {
        console.log(this.state.favorites);

    }


    componentDidMount() {
        this.getcollect()
    }

    getcollect = () => {
        const uid = cookie.get("user_uid")
        axios.get(`http://localhost:8000/get/getcollect/${uid}`).then(response => {

            console.log(response.data);

            this.setState({
                favorites: response.data
            })


        }).catch(error => {
            console.error("發送請求錯誤:", error);
        });
    }






    render() {
        return (
        <>
            <h4 style={{color:"#333"}}>我的收藏</h4>
            <div className="d-flex flex-wrap">
                {this.state.favorites.map(fav => (
                    <FavoriteCard
                        key={fav.id}
                        img={fav.img}
                        pd_name={fav.pd_name}
                        price={fav.price}
                        id={fav.id}
                        cid={fav.cid}
                        onRemove={() => this.removeFavorite(fav.id)}
                        getcollect={() => this.getcollect()}
                    />
                ))}
            </div></>
        );
    }
}

export default mycollect;
