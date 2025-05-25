import React, { useEffect, useState, useRef } from 'react';
import goTopIcon from './images/Vector.svg';
import chatIcon1 from './images/chatbot1.png';
import ChatWindow from 'component/chatroom/ChatWindow';
import cookie from 'js-cookie';
import axios from 'axios';


function Icon() {
    const [showGoTop, setShowGoTop] = useState(false);
    const [showChat, setShowChat] = useState(false); // ✅ 控制聊天室開關
    const user_id = cookie.get('user_uid')


    useEffect(() => {
        const onScroll = () => setShowGoTop(window.scrollY > 500);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollToTop = () =>
        window.scrollTo({ top: 0, behavior: 'smooth' });

    const toggleChat = async () => {
        if (user_id) {
            let Has_Room = await axios.get(`http://localhost:8000/AI_check/${user_id}`)
            let Has_Room_boolean = Has_Room.data
            console.log(Has_Room_boolean);
            if (Has_Room_boolean) {
                setShowChat(prev => !prev); // ✅ 切換聊天室狀態    
            }
            else {
                if (window.confirm('建立客服聊天室?')) {
                    setShowChat(prev => !prev); // ✅ 切換聊天室狀態    
                    await axios.get(`http://localhost:8000/build_AIchatroom/${user_id}`)
                    console.log('以建立客服聊天室');

                }
                else {
                    console.log('no');
                    setShowChat(prev => !prev); // ✅ 切換聊天室狀態    

                }

            }



        }
        else
            alert('使用聊天室請先登入!!!')
    };
    const chatRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (chatRef.current && !chatRef.current.contains(event.target)) {
                setShowChat(false);
            }
        };

        if (showChat) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showChat]);


    return (
        <>
            {
                (showChat && (
                    <div ref={chatRef} style={{
                        position: 'fixed',
                        bottom: '0',
                        right: '0',
                        width: '850px',
                        height: '630px',
                        zIndex: 2001,
                        padding: '1rem',
                        animation: 'fadeInUp 0.3s ease'
                    }}>

                        <ChatWindow />

                    </div>
                ))
            }


            {/* 右下角按鈕們 */}
            <div style={{
                position: 'fixed',
                bottom: '1rem',
                right: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                zIndex: 2000,
            }}>
                {/* Chat Icon */}
                <img
                    src={chatIcon1}
                    alt="Chat"
                    style={{
                        width: 120,
                        height: 120,
                        cursor: 'pointer',
                        transition: 'transform 0.5s ease',
                        transform: showChat ? 'scale(1.1)' : 'scale(1)',
                    }}
                    onClick={toggleChat}
                />
                {/* Go Top Icon */}
                {showGoTop && (
                    <img
                        src={goTopIcon}
                        alt="Go to top"
                        style={{ width: 30, height: 30, cursor: 'pointer' }}
                        onClick={scrollToTop}
                    />
                )}
            </div>

            {/* 加入動畫樣式 */}
            <style>
                {`
                    @keyframes fadeInUp {
                        0% {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        100% {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}
            </style>
        </>
    );
}

export default Icon;
