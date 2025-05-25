import React, { Component } from 'react';
import axios from 'axios'
import styles from './StepBasicInfo.module.css'
class StepBasicInfo extends Component {
    constructor(props) {
        super(props)

        this.inputusername = React.createRef();
        this.inputfirstname = React.createRef();
        this.inputlastname = React.createRef();
        this.inputaddress = React.createRef();
        this.inputphone = React.createRef();
        this.inputbirthday = React.createRef();
        this.inputpower = React.createRef();
        this.inputsyoukai = React.createRef();


        this.state = {
            show: false,
            city: [],
            district: [],
            inputinfo: {

            }
        }
    }
    //一進入畫面就帶入所有縣市
    async componentDidMount() {
        let city = await axios.get('/media/member_center/city.json')
        console.log(city.data);
        let newState = { ...this.state }
        newState.city = city.data
        this.setState(newState)

    }
    //縣市改變後,順帶改變鄉鎮市區欄位
    Citychange = (event) => {
        let city = event.target.value
        //找該縣市在city陣列的哪裡
        let city_index = this.state.city.findIndex((cities, index) => {
            console.log(event.target.value);


            //去弄淺層複製，下面的抓鄉式也沒好 


            return cities.name === city
        })
        console.log(city_index);
        let newState = { ... this.state }
        newState.district = this.state.city[city_index].districts
        this.setState(newState)
        let newinputinfo = { ...this.state.inputinfo, city: event.target.value }
        this.setState({
            inputinfo: newinputinfo
        }, () => {
            console.log(this.state.inputinfo);
        })

    }

    getdistrict = (event) => {

        console.log(event.target.value);
        let newState = { ... this.state.inputinfo, district: event.target.value }
        this.setState({
            inputinfo: newState
        }, () => {
            console.log(this.state.inputinfo);
        })
    }

    timetogo = (event) => {
        event.preventDefault()

        const inputusername = this.inputusername.current.value
        const inputfirstname = this.inputfirstname.current.value
        const inputlastname = this.inputlastname.current.value
        const inputaddress = this.inputaddress.current.value
        const fullname = this.inputfirstname.current.value + this.inputlastname.current.value
        const inputphone = this.inputphone.current.value
        const inputbirthday = this.inputbirthday.current.value

        let inputpower = "";
        if (this.inputpower.current.checked) {
            inputpower = "seller"
        } else {
            inputpower = "buyer"
        }

        const inputsyoukai = this.inputsyoukai.current ? this.inputsyoukai.current.value : "";



        const newState = {
            ... this.state.inputinfo, firstname: inputfirstname, username: inputusername,
            userfullname: fullname, lastname: inputlastname, adress: inputaddress, phone: inputphone,
            birthday: inputbirthday, power: inputpower, syoukai: inputsyoukai, provider: this.props.provider,
            provider_id: this.props.provider_id
        }
        this.setState({
            inputinfo: newState
        }, () => {
            // console.log(this.state.inputinfo);
            this.props.getallinfo(this.state.inputinfo)
        })




    }

    render() {
        const { provider } = this.props;
        return (
            <div className={styles.Wrapper}>
                {provider && (
                    <div style={{ color: "green", fontSize: "0.9rem" }}>
                        系統偵測到您已使用 {provider} 登入，請完成資料以完成註冊。
                    </div>
                )}
                <div className={styles.formRow}>
                    <label className={styles.label}>暱稱：</label>
                    <input name="username" className={styles.input} ref={this.inputusername} />
                </div>
                <div>
                    <div className={styles.formRow}>
                        <label className={styles.label}>姓：</label>
                        <input name="firstname" className={styles.input} ref={this.inputfirstname} />
                    </div>
                    <div className={styles.formRow}>
                        <label className={styles.label}>名：</label>
                        <input name="lastname" className={styles.input} ref={this.inputlastname} />
                    </div>
                </div>
                <div className={styles.formRow}>
                    <label className={styles.label}>地址：</label>
                    <select name="city" id="city" className={styles.addselectcity} onChange={this.Citychange}>
                        {this.state.city.map((cities, index) => {
                            return <option key={index} value={cities.name}>{cities.name}</option>
                        })}
                    </select>
                    <select name="district" className={styles.addselectregion} onChange={this.getdistrict}>
                        {this.state.district.map((dist, idx) => {
                            return <option key={idx} value={dist.name}>{dist.name}</option>
                        })}
                    </select>
                    <input type="text" name='address' className={styles.input} ref={this.inputaddress} />
                </div>
                <div className={styles.formRow}>
                    <label className={styles.label}>電話：</label>
                    <input type="text" name='phone' className={styles.input} ref={this.inputphone} />
                </div>
                <div className={styles.formRow}>
                    <label className={styles.label}>生日：</label>
                    <input type="date" name="birthday" className={styles.input} ref={this.inputbirthday} />
                </div>
                <div className={styles.formRow}>
                    <input type="checkbox" name="" id="confirmuse" onChange={this.BeSeller} className={styles.checkbox} ref={this.inputpower} />
                    <label htmlFor="confirmuse" className={styles.labeltext} >是否成為賣家?</label>
                </div>
                <div className={styles.introtextarea}>
                    {this.state.show && <textarea placeholder='自我介紹' className={styles.textarea} ref={this.inputsyoukai}></textarea>}
                </div>
                <div className="text-center">
                    <button type="submit" className={styles.nextBtn} onClick={this.timetogo}>送出</button>
                </div>
            </div>
        );
    }
    BeSeller = (e) => {
        console.log(e.target.checked);
        if (e.target.checked) {
            this.setState({ show: true })
        }
        else {
            this.setState({ show: false })

        }

    }
}

export default StepBasicInfo;