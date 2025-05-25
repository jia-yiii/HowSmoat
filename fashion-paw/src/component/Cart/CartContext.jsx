// src/context/CartContext.jsx
import React, { Component, createContext } from 'react';
import cookie from 'js-cookie';

export const CartContext = createContext();

export class CartProvider extends Component {
    state = {
        cartList: [],
        sellers: [],
    };

    render() {
        return (
            <CartContext.Provider
                value={{
                    cartList: this.state.cartList,
                    addToCart: this.addToCart,
                    updateQuantity: this.updateQuantity,
                    removeFromCart: this.removeFromCart,
                    clearCart: this.clearCart,
                    setSellers: this.setSellers,
                    getSellerName: this.getSellerName,
                    normalizeCartItem: this.normalizeCartItem
                }}
            >
                {this.props.children}
            </CartContext.Provider>
        );
    }

    // 設定 seller 名單
    setSellers = (userList) => {

        if (Array.isArray(userList)) {
            const merged = [
                ...this.state.sellers,
                ...userList.map(user => ({
                    uid: String(user.uid),
                    username: user.username,  // ✅ 僅保留需要的欄位
                }))
            ];
            const uniqueSellers = Array.from(
                new Map(merged.map(user => [String(user.uid), user])).values()
            );
            this.setState({ sellers: uniqueSellers });
        } else {
            console.warn("❌ 傳入 setSellers 的不是陣列：", userList);
        }
    };

    // 透過 uid 找 seller username
    getSellerName = (uid) => {
        if (!uid) return '未知賣家';

        const seller = this.state.sellers.find(user => String(user.uid) === String(uid));

        // 避免 seller 為 undefined 時就嘗試存取 .username
        if (seller) {
            //   console.log("🔍 找到 seller =", seller.username);
            return seller.username;
        } else {
            //   console.log("⚠️ 沒有找到 seller：uid =", uid);
            return `UID: ${uid}（未找到賣家）`;
        }
    };

    componentDidMount() {
        const savedCart = localStorage.getItem('cartList');
        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart);
                const formatted = parsed.map(item => {
                    const cartId = String(item.cart_id || item.pid);
                    return {
                        ...item,
                        cart_id: cartId,
                    };
                });
                this.setState({ cartList: formatted });
            } catch (err) {
                console.error("❌ 載入 cartList 時 JSON 解析失敗：", err);
            }
        }

        const savedSellers = localStorage.getItem('sellers');
        if (savedSellers) {
            try {
                this.setState({ sellers: JSON.parse(savedSellers) });
            } catch (err) {
                console.error("❌ 載入 sellers 時 JSON 解析失敗：", err);
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.cartList !== this.state.cartList) {
            localStorage.setItem('cartList', JSON.stringify(this.state.cartList));
        }
        if (prevState.sellers !== this.state.sellers) {
            localStorage.setItem('sellers', JSON.stringify(this.state.sellers));
        }
    }

    addToCart = (newItem) => {
        // const normalized = this.normalizeCartItem(newItem);
        // console.log("🧪 加入購物車 normalized：", normalized);
        const normalized = this.normalizeCartItem(newItem);

        // 比對 cartList 裡每一筆 pid=》字串vs數字
        // this.state.cartList.forEach(item => {
        //     console.log("🧪 比對中：", {
        //         cart_pid: item.pid,
        //         new_pid: normalized.pid,
        //         equal: item.pid === normalized.pid
        //     });
        // });


        let result = 'new';

        this.setState((prevState) => {
            const existingIndex = prevState.cartList.findIndex(item =>
                String(item.pid) === String(normalized.pid)
            );

            if (existingIndex !== -1) {
                const updatedCartList = [...prevState.cartList];
                const currentQty = updatedCartList[existingIndex].quantity || 0;
                updatedCartList[existingIndex].quantity = currentQty + (normalized.quantity || 1);
                result = 'updated';
                return { cartList: updatedCartList };
            } else {
                return {
                    cartList: [
                        ...prevState.cartList,
                        { ...normalized, quantity: normalized.quantity || 1 }
                    ]
                };
            }
        });

        return result;
    };


    updateQuantity = (cart_id, quantity) => {
        this.setState((prev) => ({
            cartList: prev.cartList.map((item) =>
                item.cart_id === cart_id ? { ...item, quantity } : item
            ),
        }));
    };

    removeFromCart = (cart_id) => {
        this.setState((prev) => ({
            cartList: prev.cartList.filter((item) => item.cart_id !== cart_id),
        }));
    };

    clearCart = () => this.setState({ cartList: [] });



    normalizeCartItem = (item) => {
        if (item._normalized) return item;

        // 取圖路徑
        const rawPath =
            (Array.isArray(item.images) && item.images[0]?.img_path) ||
            item.img_path ||
            item.image ||
            null;

        const fullImagePath = rawPath || "/media/default/no-image.png";
        const cartId = String(item.cart_id || item.pid);
        const priceSource = item.price !== undefined ? item.price : item.unit_price;
        const parsedPrice = parseInt(priceSource, 10);

        // ✨ 修正：買家 uid 從 cookie 抓，賣家 uid 從 item 中抓
        const buyerUid = cookie.get('user_uid') || null;
        const sellerUid = item.seller_uid || item.uid || null;
        if (!item.image && item.img_path) {
            item.image = item.img_path; // 確保至少一張圖片有值
        }
        return {
            _normalized: true,
            cart_id: cartId,
            pid: item.pid,
            uid: buyerUid ? String(buyerUid) : null,         // 👉 買家
            seller_uid: sellerUid ? String(sellerUid) : null, // 👉 賣家
            condition: item.condition || "new",
            quantity: item.quantity || 1,
            productName: item.pd_name || item.productName || item.name,
            unit_price: isNaN(parsedPrice) ? 0 : parsedPrice,
            image: fullImagePath,
            images: item.images || [],
        };
    };

}