import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatWindow.module.css';
import userAvatar from './user.png';
import botAvatar from './dog.png';
import cookie from 'js-cookie';
import axios from 'axios';

export default function ChatApp() {
  const user_id = cookie.get('user_uid')
  const [users, setUsers] = useState(
    [//api多uid欄位
      { id: 'u3', name: '好拾汪', avatar: userAvatar, lastTime: '前天 09:20', snippet: '嗨(好)嗨(的)～本週熱門商…' },
      { id: 'u2', name: '好拾啾', avatar: userAvatar, lastTime: '昨天 09:20', snippet: '感謝主人在好拾毛成功完成購…' },
      { id: 'u1', name: '毛毛主人', avatar: userAvatar, lastTime: '今天 10:22', snippet: '好的，因為是二手商品所…' },
    ]
  )
  // 1. 使用者清單
  const messagesEndRef = useRef(null);
  const [typing, settyping] = useState(false)
  // 2. selected user
  const [selected, setSelected] = useState(users[0]);
  // 1. 把「自己」獨立出來
  const [me, setMe] = useState({
    avatar: userAvatar,
    name: 'WAKA',
    lastTime: '剛上線'
  });
  // 3. 把訊息依 user.id 分開
  const [messagesMap, setMessagesMap] = useState({
    u1: [
      { id: 1, from: 'bot', text: '好的，因為是二手商品所以不關我的事哦，汪!', time: '10:20' },

    ],
    u2: [
      { id: 1, from: 'bot', text: '感謝主人在好拾毛成功完成購買! 商品很快就會送達汪!', time: '09:20' },
    ],
    u3: [
      { id: 1, from: 'bot', text: '我是AI客服機器人,你需要甚麼幫忙嗎?', time: '09:20' },
    ],

  });

  // 4. 當下顯示的訊息
  const messages = messagesMap[selected.id] || [];

  const [input, setInput] = useState('');
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    console.log(messages, selected);

  }, [messages]);

  useEffect(() => {

    //拿「我」的檔案
    axios.get(`http://localhost:8000/get/back-userinfo/${user_id}`)
      .then(res => {
        // res.data 就是單一物件 { uid, email, username, photo, fullname, birthday, power, lastTime, aboutMe, device }
        setMe({
          avatar: res.data.photo,    // 假設 photo 是 Buffer 物件
          name: res.data.username,   // 或 fullname
          lastTime: res.data.last_time_login
        });
      })
      .catch(err => console.error('profile 讀取失敗', err));


    axios.get(`http://localhost:8000/channel/${user_id}`)
      .then(res => {
        console.log(users);
        setUsers(res.data)
        console.log(users);
        if (res.data.length > 0) {
          setSelected(res.data[0]); // 只有在拿到数据后才设 selected

        }
      })

    console.log(users[0]);
    axios.get(`http://localhost:8000/message/${user_id}`)
      .then(msg => {
        console.log(msg.data);
        setMessagesMap(msg.data);

      })

  }, [])




  useEffect(() => {
    const handleDevReport = e => {
      const { text, from } = e.detail;
      const now = new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
      setMessagesMap(prev => ({
        ...prev,
        ['2']: [                   // '2' 就是開發者聊天室 ID
          ...(prev['2'] || []),
          { id: Date.now(), from, text, time: now }
        ]
      }));
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    window.addEventListener('newChatMessage', handleDevReport);
    return () => window.removeEventListener('newChatMessage', handleDevReport);
  }, []);
  // 5. 送出訊息要更新對應那位使用者的陣列
  const handleSend = () => {
    console.log('>> send to bot? selected.uid =', selected.uid, typeof selected.uid);

    if (!input.trim()) return;//輸入為空
    const newMsg = {
      id: user_id,
      from: 'user',
      text: input.trim(),
      time: Date.now()
    };
    setMessagesMap(prev => ({
      ...prev,
      [selected.id]: [...(prev[selected.id] || []), newMsg]
    }));
    axios.post('http://localhost:8000/post/insert/message',
      {
        ChatroomID: selected.id,
        speakerID: user_id,
        message: input.trim(),
        isRead: 1
      })
      .then(() => console.log('[DB] user 訊息已 insert'))
      .catch(err => console.error('[DB] user insert 失敗', err));
    //insert newMsg
    setInput('');
    console.log((selected.uid));

    if (selected.uid == '1') {//對方是機器人才會回答
      console.log((selected.uid));
      settyping(true);
      axios.post('http://localhost:8000/robot', { message: input })
        .then(res => {
          let func = res.data.functions
          console.log(func);
          if (func === 'search_products') {
            let pd3 = '<div class="row bg-light">'
            res.data.answer.map((pd, idx) => {
              pd3 += `
              <div class='border position-relative col-6'>
              <span class='badge position-absolute top-0 start-0'>${idx + 1}</span>
              <img  src='${pd.img}'/>
              <a class='d-block fw-bold text-truncate mb-1' href="${pd.url}">${pd.pd_name}</a><br>
              <span>NT$${pd.price}</span>
              </div>
              
              `
            })
            pd3 += `</div>`
            let newAIMsg = {
              id: selected.uid,
              from: 'bot',
              text: pd3,
              time: Date.now()
            };
            //insert api
            axios.post('http://localhost:8000/post/insert/message',
              {
                ChatroomID: selected.id,
                speakerID: selected.uid,
                message: newAIMsg.text,
                isRead: 1
              })
              .then(() => console.log('[DB] user 訊息已 insert'))
              .catch(err => console.error('[DB] user insert 失敗', err));
            setMessagesMap(prev => ({
              ...prev,
              [selected.id]: [...(prev[selected.id] || []), newAIMsg]
            }));
            settyping(false);

          }
          else if (func === 'get_hot_ranking') {
            let top3 = `
  <div class="row  justify-content-start flex-wrap">
`;

            res.data.answer.forEach((pd, idx) => {
              top3 += `
    <div class="col-4  rounded p-2 position-relative" style="width: 150px; background-color: white;">
      <span class="badge bg-primary position-absolute top-0 start-0">${idx + 1}</span>
      <img src="${pd.imageUrl}" class="w-100 rounded mb-2" style="height: 120px; object-fit: cover;" />
      <a href="http://localhost:3000/product/${pd.pid}" 
         class="d-block  fw-bold text-truncate mb-1" 
         style="max-width: 100%;" 
         title="${pd.pd_name}">
         ${pd.pd_name}
      </a>
      <span class="text-danger fw-bold">NT$${pd.price}</span>
    </div>
  `;
            });

            top3 += `</div>`;


            let newAIMsg = {
              id: selected.uid,
              from: 'bot',
              text: top3,
              time: Date.now()
            };
            //insert api
            axios.post('http://localhost:8000/post/insert/message',
              {
                ChatroomID: selected.id,
                speakerID: selected.uid,
                message: newAIMsg.text,
                isRead: 1
              })
              .then(() => console.log('[DB] user 訊息已 insert'))
              .catch(err => console.error('[DB] user insert 失敗', err));
            setMessagesMap(prev => ({
              ...prev,
              [selected.id]: [...(prev[selected.id] || []), newAIMsg]
            }));

            settyping(false);

          }
          else {
            let newAIMsg = {
              id: selected.uid,
              from: 'bot',
              text: res.data.answer,
              time: Date.now()
            };
            //insert api
            axios.post('http://localhost:8000/post/insert/message',
              {
                ChatroomID: selected.id,
                speakerID: selected.uid,
                message: newAIMsg.text,
                isRead: 1
              })
              .then(() => console.log('[DB] user 訊息已 insert'))
              .catch(err => console.error('[DB] user insert 失敗', err));
            setMessagesMap(prev => ({
              ...prev,
              [selected.id]: [...(prev[selected.id] || []), newAIMsg]
            }));
          }
          settyping(false);

        })
    }


  };

  /**
 * 不管傳進來的是 Blob 還是 mimicked Buffer (nodejs Buffer 物件)
 * 都能轉成一條可給 <img src> 的 URL
 */
  const blobtoURL = input => {
    let blob;

    // 如果已經是瀏覽器 Blob
    if (input instanceof Blob) {
      blob = input;

      // 如果像 { type:'Buffer', data: [...] }  
    } else if (input && Array.isArray(input.data)) {
      // Uint8Array 從原生 Array 建
      const uint8 = new Uint8Array(input.data);
      // 第二個參數的 MIME type 要跟你資料庫存的檔案格式對應
      blob = new Blob([uint8], { type: 'image/jpeg' });

    } else {
      console.error('blobtoURL: 不支援的輸入格式', input);
      return '';
    }

    return URL.createObjectURL(blob);
  };

  return (
    <div className={styles.container}>
      {/* 左側 Sidebar */}
      <aside className={styles.sidebar}>
        <header className={styles.sidebarHeader}>
          <img src={blobtoURL(me.avatar)} alt={me.name} className={styles.avatar} />
          <div>
            <p className={styles.name}>{me.name}</p>
            <p className={styles.sub}>上次上線時間：{new Date(me.lastTime).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </header>
        <ul className={styles.userList}>
          {users.map(u => (
            <li
              key={u.id}
              className={`${styles.userItem} ${u.id === selected.id ? styles.active : ''}`}
              onClick={() => setSelected(u)}
            >
              <img src={blobtoURL(u.avatar)} alt={u.name} className={styles.avatarSm} />
              <div className={styles.meta}>
                <p className={styles.nameSm}>{u.name}</p>
                <p className={styles.subSm}>{u.snippet}</p>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* 右側 ChatWindow */}
      <main className={styles.chatWindow}>
        <header className={styles.header}>
          <img src={blobtoURL(selected.avatar)} alt="客服汪" className={styles.avatar} />
          <div>
            <p className={styles.name}>{selected.name}</p>
            <p className={styles.sub}>官網客服｜上次上線時間：使命必達汪汪時間</p>
          </div>
        </header>

        <div key={selected.id} className={styles.messages}>
          <div className={styles.dateSep}>今天</div>
          {messages.map((m, idx) => (
            <>
              {
                (idx > 0) ?
                  (new Date(messages[idx - 1].time).toLocaleDateString() !== new Date(m.time).toLocaleDateString())
                    ?
                    <div className={styles.dateSep}>{
                      (new Date(m.time).toLocaleDateString() === new Date().toLocaleDateString())
                        ? '今天'
                        : new Date(m.time).toLocaleDateString()
                    }</div>
                    :
                    <div />
                  : <div className={styles.dateSep}>{new Date(m.time).toLocaleDateString()}</div>
              }
              <div key={idx} className={`${styles.message} ${m.from === 'bot' ? styles.bot : styles.user}`}>
                <div className={styles.text} dangerouslySetInnerHTML={{ __html: m.text }}></div>
                <span className={styles.time}>{new Date(m.time).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </>
          ))}
          {
            typing && <div className={`${styles.typingBubble} ${styles.bot}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          }
          <div ref={messagesEndRef} />

        </div>
        {/* ...原本的聊天訊息 */}




        <div className={styles.quickBtns}>
          <button onClick={() => setInput('熱門商品TOP3')}>熱門商品TOP3</button>
          <button onClick={() => setInput('尋找商品 ')}>尋找商品</button>
        </div>

        <div className={styles.inputArea}>
          <button className={styles.btn}>＋</button>
          <button className={styles.btn}>😊</button>
          <input
            className={styles.input}
            value={input}
            onChange={e => setInput(e.target.value)}//這裡改成函示
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="輸入訊息…"
          />
          <button className={styles.send} onClick={handleSend}>🐾</button>
        </div>
      </main >

    </div >
  );
}