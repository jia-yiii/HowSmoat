import React, { useState, useEffect, useContext } from 'react';
import MainNav from './MainNav'
import { Link, useHistory } from "react-router-dom";
import { BiMenu, BiX } from 'react-icons/bi';
import Logo from "./images/Logo5.png"
import styles from './IndexStyle.module.css'
import navstyles from './MainNav.module.css'
import SearchBar from './SearchBar';
import cookie from 'js-cookie';
import { CartContext } from 'component/Cart/CartContext';
import { useLocation } from "react-router-dom";
import axios from 'axios'


function Header() {
    const { clearCart } = useContext(CartContext);
    const history = useHistory()
    // 設隱藏導覽列的初始值
    const [hideHeader, setHideHeader] = useState(false);
    // 向下滑動隱藏導覽列初始值
    const [lastScrollY, setLastScrollY] = useState(0);
    // 螢幕縮小到768px得時候變成漢堡選單，點擊打開的初始值
    const [openMobileNav, setOpenMobileNav] = useState(false);
    // uid、username、photo
    const [uid, setuid] = useState(null)
    const [username, setusername] = useState('')
    const [photo, setphoto] = useState('')
    const [showSolidHeader, setShowSolidHeader] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === "/";

    useEffect(() => {
        const updateBodyClass = () => {
            const currentPath = window.location.pathname;
            const isHomepage = currentPath === '/';
            const shouldBeHome = isHomepage && !showSolidHeader;

            if (shouldBeHome) {
                document.body.classList.add('home');
                document.body.classList.remove('not-home');
            } else {
                document.body.classList.add('not-home');
                document.body.classList.remove('home');
            }
        };

        updateBodyClass();

        // 每次路由變化都重新執行一次（修正切頁沒變 class 的問題）
        const observer = new MutationObserver(updateBodyClass);
        observer.observe(document.body, { attributes: true, childList: false, subtree: false });

        return () => observer.disconnect();
    }, [location.pathname, showSolidHeader]);

    useEffect(() => {
        const uidFromCookie = cookie.get('user_uid');
        const nameFromCookie = cookie.get('user_name');
        const photoFromCookie = cookie.get('user_photo');

        setuid(uidFromCookie || null);
        setusername(nameFromCookie || '');
        setphoto(photoFromCookie || '');
    }, []);

    // ✅ 關鍵：等 uid 有值才打 API
    useEffect(() => {
        if (!uid) return; // ✅ 沒 uid 不打

        axios.get(`http://localhost:8000/get/userinfo/${uid}`)
            .then(res => {
                const user = res.data;
                setusername(user.username);
                setphoto(user.photo);
            })
            .catch(err => {
                console.error('會員資料載入失敗', err);
            });
    }, [uid]); // ✅ 記得把 uid 放進依賴陣列
    console.log('uid:', uid);
    console.log('photo:', photo);

    // 清洗photo字串
    const getSafePhoto = (rawPhoto) => {
        if (!rawPhoto) return '/images/avatar.png';

        if (rawPhoto.startsWith('data:image')) {
            return rawPhoto; // ✔️ 是完整格式，直接用
        }

        if (rawPhoto.startsWith('data:undefined;base64,')) {
            // ❗修正 imageType 缺失
            return rawPhoto.replace('data:undefined', 'data:image/jpeg');
        }

        // ⛑️ 其他情況就當成純 base64 字串補前綴
        return `data:image/jpeg;base64,${rawPhoto}`;
    };

    // 向下滑隱藏導覽列的判斷
    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;

            // 控制 Header 顯示/隱藏（全部頁面都適用）
            if (currentY > lastScrollY && currentY > 10) {
                setHideHeader(true); // 往下滑 → 隱藏
            } else {
                setHideHeader(false); // 往上滑 → 顯示
            }

            // 額外控制首頁「透明切換白底」的條件
            if (isHome) {
                if (currentY > 150 && currentY < lastScrollY) {
                    setShowSolidHeader(true); // 向上滑且有距離 → 白底
                } else if (currentY <= 100) {
                    setShowSolidHeader(false); // 回到頂部 → 透明
                }
            } else {
                // 非首頁一律為白底
                setShowSolidHeader(true);
            }

            setLastScrollY(currentY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY, isHome]);


    // 點擊登出跳轉到首頁
    const logout = (e) => {
        cookie.remove('user_uid', { path: '/', sameSite: 'Lax' });
        cookie.remove("user_power", { path: '/', sameSite: 'Lax' });
        localStorage.removeItem("cartList");
        localStorage.removeItem("sellers");
        localStorage.removeItem("cartMerged");
        clearCart?.();
        setuid(null)
        // console.log(uid);
        setOpenMobileNav(false);
        // 如果本來就在首頁就不要 push('/')
        if (location.pathname !== '/') {
            history.push('/');
        }
    }



    return (
        <>
            {/* 縮到768px出現漢堡選單 */}
            <div
                // 打開時顯示遮罩
                className={`${navstyles.navOverlay} ${openMobileNav ? navstyles.open : ''}`}
                // click漢堡選單時初始值為false
                onClick={() => setOpenMobileNav(false)}
            />
            {/* ----Header----- */}
            <header className={[
                styles.header,
                !isHome || showSolidHeader ? styles.solidHeader : styles.transparentHeader,
                hideHeader ? styles.hiddenHeader : '', // ← 👈 這一行最關鍵
                (!isHome || showSolidHeader) ? styles.threeColumnLayout : ''  // 三欄啟用條件
            ].join(' ')}>
                {/* 漢堡按鈕icon */}
                <button
                    className={styles.hamburger}
                    // v是函式式更新的寫法，OpenMobileNav傳回false，v就是false，!v是true，反之。v變數名稱可以換。
                    onClick={() => setOpenMobileNav(v => !v)}
                >
                    {/* openMobileNav 是條件（布林值），如果它是 true，則會回傳並渲染 <BiX />（叉叉圖示），如果它是 false，則會回傳並渲染 <BiMenu />（漢堡選單圖示） */}
                    {/* {openMobileNav ? <BiX /> : <BiMenu />} */}
                    <BiMenu />
                </button>

                {/* 三欄版面：非首頁或滑上來才出現 */}
                {(!isHome || showSolidHeader) ? (
                    <div className={styles.threeColContainer}>
                        <div className={styles.colLeft}>
                            <Link to="/"><img src={Logo} alt="Logo" style={{ height: 80 }} /></Link>
                        </div>
                        <div className={styles.colCenter}>
                            <MainNav />
                        </div>
                        <div className={styles.colRight}>
                            <SearchBar />
                            <Link to='/ShoppingCartPage' className={styles.iconBtn}><i className="bi bi-cart"></i></Link>
                            {uid ? (
                                <div className={styles.userInfoWrapper}>
                                    <img
                                        src={getSafePhoto(photo)}
                                        alt="avatar"
                                        className={styles.avatar}
                                    />
                                    <span className={styles.greetingText}>
                                        <Link to="/MemberCenter" className={styles.greeting}>
                                            {username || '拾毛會員'}
                                        </Link>，你好！
                                    </span>
                                    <button className={styles.logoutBtn} onClick={logout}>登出</button>
                                </div>
                            ) : (
                                <span className={styles.logsub}>
                                    <Link to="/Login" className={styles.link}>登入</Link>
                                    <span>|</span>
                                    <Link to="/Register" className={styles.link}>註冊</Link>
                                </span>
                            )}

                        </div>
                    </div>
                ) : (
                    <>
                        {/* 保留首頁原樣式 */}
                        <div className={styles.headerTop}>
                            <SearchBar />
                            <Link to='/ShoppingCartPage' className={styles.iconBtn}><i className="bi bi-cart"></i></Link>
                            {uid ? (
                                <>
                                    <img src={photo || '/media/default/avatar.png'} alt="avatar" className={styles.avatar} />
                                    <span className={styles.greetingText}>
                                        <Link to="/MemberCenter" className={styles.greeting}>
                                            {username || '拾毛會員'}
                                        </Link>，你好！
                                    </span>
                                    <button className={styles.logoutBtn} onClick={logout}>登出</button>
                                </>
                            ) : (
                                <span className={styles.logsub}>
                                    <Link to="/Login" className={styles.link}>登入</Link>
                                    <span>|</span>
                                    <Link to="/Register" className={styles.link}>註冊</Link>
                                </span>
                            )}
                        </div>
                        <div className={styles.headerLogo}>
                            <Link to="/"><img src={Logo} alt="Logo" style={{ height: 120 }} /></Link>
                        </div>
                        <div className={styles.mainNav}><MainNav /></div>
                    </>
                )}
            </header>

            {/* Drawer：側邊欄，裡面包 MainNav */}
            <div className={`${navstyles.drawer} ${openMobileNav ? navstyles.open : ''}`}>
                <button className={navstyles.closeBtn}
                    onClick={() => setOpenMobileNav(false)}>
                    <BiX />
                </button>
                <MainNav />
                <div className={navstyles.accountSection}>
                    <h3>帳戶</h3>
                    <ul className={navstyles.accountList}>
                        {uid ? (
                            <>
                                <li><Link to="/MemberCenter">會員中心</Link></li>
                                <li><button onClick={logout} className={navstyles.drawerLogoutBtn}>登出</button></li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/Login">會員登入</Link></li>
                                <li><Link to="/Register">註冊新會員</Link></li>
                            </>
                        )}
                    </ul>
                </div>

            </div>
        </>
    );
}
export default Header;
