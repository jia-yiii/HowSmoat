import React, { Component } from 'react';
import style from './chatroom.css';

class Chatroom extends Component {
  constructor(props) {
    super(props);
    this.thechatroom = React.createRef();  // 改成正確的寫法
    this.thechat = React.createRef();
    this.chatgo = React.createRef();
  }

  sendmessage = () => {
    const thechatroom = this.thechatroom.current;
    const thechat = this.thechat.current;

    // 創建新的 chat 元素
    const newchat = document.createElement('div');
    newchat.classList.add('chatinner');
    newchat.textContent = thechat.value;

    // 將新訊息加到聊天室
    thechatroom.appendChild(newchat);

    // 滾動到最底部
    thechatroom.scrollTop = thechatroom.scrollHeight;

    // 清空輸入框
    thechat.value = '';
  };

  render() {
    return (
      <>
        <div className="chatroom" ref={this.thechatroom}></div>
        <textarea rows="4" cols="50" className="chat" ref={this.thechat} />
        <button ref={this.chatgo} onClick={this.sendmessage}>
          發送
        </button>
      </>
    );
  }
}

export default Chatroom;
