import React, { Component } from 'react';
import Step from './Step';
import StepEmail from './StepEmail';
import StepPassword from './StepPassword';
import StepBasicInfo from './StepBasicInfo';
import axios from 'axios';
import styles from './Register_Compute.module.css'
import ThirdLogin from '../Login/Third_login';
class Register_Compute extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentStep: 1,
            steps: [
                { number: "1", content: "驗證email" },
                { number: "2", content: "輸入密碼" },
                { number: "3", content: "基本資料" }
            ]
        };
    }

    componentDidMount() {
        const params = new URLSearchParams(window.location.search);
        const email = params.get("email");
        const provider = params.get("provider");
        const provider_id = params.get("provider_id");

        // 如果是從第三方登入來，就直接跳到 Step 3
        if (email && provider && provider_id) {
            this.setState({
                currentStep: 3, // ⬅️ 直接跳基本資料
                email,
                provider,
                provider_id
            });
        }
    }


    handleNext = () => {
        //按下一步 currentStep+1
        this.setState((prevState) => ({
            currentStep: Math.min(prevState.currentStep + 1, prevState.steps.length)
        }));
    };

    getemail = (value) => {
        console.log(value);

        this.setState({
            email: value
        })
    }

    getpassword = (value) => {
        console.log(value);

        this.setState({
            password: value
        })
    }

    getallinfo = (value) => {
        console.log(value);
        let userinfo = value
        this.setState({
            userinfo
        }, () => {
            console.log(this.state);
            console.log(this.state.userinfo);
            const newuserinfo = {
                email: this.state.email,
                username: this.state.userinfo.username,
                password: this.state.password,
                firstname: this.state.userinfo.firstname,
                lastname: this.state.userinfo.lastname,
                birthday: this.state.userinfo.birthday,
                power: this.state.userinfo.power,
                Aboutme: this.state.userinfo.syoukai,
                fullname: this.state.userinfo.userfullname,

                // ✅ 加上條件式展開（如果有 provider 才加這兩欄）
                ...(this.state.provider && {
                    provider: this.state.provider,
                    provider_id: this.state.provider_id
                })
            };

            axios.post("http://localhost:8000/post/createuserinfo", newuserinfo).then(response => {
                console.log("新增成功！", response.data);
            })
                .catch(error => {
                    console.error("新增失敗", error);
                });

            this.getcoupon()

        })
    }


    getcoupon = () => {
        const email = encodeURIComponent(this.state.email);

        axios.get(`http://localhost:8000/get/useruid/${email}`).then(response => {
            console.log("查詢成功！", response.data);

            this.setState({
                uid: response.data
            }, () => {
                // 確保 uid 更新後再呼叫 newusercoupon
                this.newusercoupon();
            });

        })
            .catch(error => {
                // 處理錯誤
            });
    }



    newusercoupon = () => {
        let uid = this.state.uid;

        // 確保 uid 有被正確設置
        if (uid === 0 || !uid) {
            console.error("UID 不存在或為 0");
            return;
        }

        axios.post(`http://localhost:8000/post/newusercoupon/${uid}`).then(response => {
            console.log("新增成功！", response.data);
            this.newusercoupon2()
        })
            .catch(error => {
                console.error("新增失敗", error);
            });
    }

    newusercoupon2 = () => {
        let uid = this.state.uid;

        // 確保 uid 有被正確設置
        if (uid === 0 || !uid) {
            console.error("UID 不存在或為 0");
            return;
        }

        axios.post(`http://localhost:8000/post/newusercoupon2/${uid}`).then(response => {
            console.log("新增成功！", response.data);
            this.newusercoupon3()
        })
            .catch(error => {
                console.error("新增失敗", error);
            });
    }

    newusercoupon3 = () => {
        let uid = this.state.uid;

        // 確保 uid 有被正確設置
        if (uid === 0 || !uid) {
            console.error("UID 不存在或為 0");
            return;
        }

        axios.post(`http://localhost:8000/post/newusercoupon3/${uid}`).then(response => {
            console.log("新增成功！", response.data);
            this.newuseraddress()
            // window.location.href = "/Login"
        })
            .catch(error => {
                console.error("新增失敗", error);
            });

    }


    newuseraddress = () => {
        const newuseraddress = {
            uid: this.state.uid,
            City: this.state.userinfo.city,
            District: this.state.userinfo.district,
            address: this.state.userinfo.adress,
            AdressName: this.state.userinfo.userfullname,
            AdressPhone: this.state.userinfo.phone
        };

        axios.post("http://localhost:8000/post/newuseraddress", newuseraddress)
            .then(response => {
                console.log("新增成功！", response.data);
                window.location.href = "/Login";  // 成功後重定向
            })
            .catch(error => {
                console.error("新增失敗", error);
            });
    }











    // getemail={this.getemail}

    renderStepContent = (value) => {
        //根據進行到的步驟切換表單 next=傳送handleNext function供表單元件使用
        if (this.state.currentStep == 1) {
            return <StepEmail next={this.handleNext} getemail={this.getemail} />
        }
        else if (this.state.currentStep == 2) {


            console.log("step2");

            return <StepPassword next={this.handleNext} getpassword={this.getpassword} />
        }
        else {
            return <StepBasicInfo next={this.handleNext} getallinfo={this.getallinfo} provider={this.state.provider}
                provider_id={this.state.provider_id}
                email={this.state.email} />
        }
    }
    render() {

        const { currentStep, steps } = this.state;
        console.log(currentStep);

        return (
            <div className={styles.register}>
                <h1 className={styles.registerTitle}>會員註冊</h1>
                <div className={styles.registercircle}>
                    {//建立註冊表單商方的步驟圈圈 statement判斷是否完成該步驟true為完成
                        steps.map((step, index) => (
                            <Step
                                key={index}
                                number={step.number}
                                content={step.content}
                                statement={currentStep >= index + 1}
                            />
                        ))}
                </div>
                <form className={styles.registerfrom}>
                    {this.renderStepContent()}
                </form>
                <ThirdLogin />
            </div>
        );
    }
}

export default Register_Compute;
