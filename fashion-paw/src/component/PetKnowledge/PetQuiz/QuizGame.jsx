import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import styles from './QuizGame.module.css'

// 先宣告 ProgressBar 在上面
function ProgressBar({ current, total }) {
    return (
        <div className="progress">
            <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${((current + 1) / total) * 100}%`, backgroundColor:'#F8A07F' }}
                aria-valuenow={current + 1}
                aria-valuemin={1}
                aria-valuemax={total}
            />
        </div>
    )
}

function QuizGame({ pet, questions, onRestart }) {
    // 1. 管理「第幾題」
    const [currentQuestion, setCurrentQuestion] = useState(0)
    // 2. 管理「答對幾題」
    const [score, setScore] = useState(0)
    // 3. 管理「是否已經結束」
    const [finished, setFinished] = useState(false)
    // 4. 管理「回饋訊息」(null 表示還沒按過／已經消失)
    const [feedback, setFeedback] = useState(null)
    // <-- 拿到 navigation
    const history = useHistory();

    // 按鈕點擊後呼叫
    const answer = (isYes) => {
        // 還在答題中
        const q = questions[currentQuestion]
        // 檢查答案
        const correct = q.answerIsYes

        if (isYes === correct) {
            setScore(score + 1)
            setFeedback({
                title: '答對了！',
                // message: '恭喜你答對囉！',
                message: q.explanation.yes,
                isCorrect: true
            })
        }
        else {
            // 假設你的 JSON 裡每題都有一個 explanation 欄位
            setFeedback({
                title: '答錯了…',
                message: q.explanation.no,
                isCorrect: false
            })
        }
    }

    // 按「下一題」才真的推進到下一題或結算
    const nextQuestion = () => {
        setFeedback(null)  // 關掉彈跳窗
        if (currentQuestion + 1 < questions.length) {
            setCurrentQuestion(currentQuestion + 1)
        } else {
            setFinished(true)
        }
    }

    // 已經答完
    if (finished) {
        return (
            <div className={`quiz-game ${styles.quiz}`}>
                <h2>完成了！</h2>
                <p>總分：{score} / {questions.length}</p>
                <div className="mt-2 flex justify-center">
                    {/* 重新遊戲：把本元件的 state 重置回初始 */}
                    <button
                        className={styles.returnBtn}
                        
                        onClick={() => {
                            // 如果同時想在 QuizGame 裡也重置題目進度：
                            setCurrentQuestion(0);
                            setScore(0);
                            setFinished(false);
                            onRestart();    // ← 這行把畫面 reset 回選擇模式
                        }}
                    >
                        重新遊戲
                    </button>
                    {/* 回首頁 */}
                    <button
                        className={styles.homeBtn}
                        onClick={() => history.push('/')}
                    >
                        回首頁
                    </button>
                </div>
            </div >
        )
    }

    const q = questions[currentQuestion]

    return (
        <div className="quiz-game container-lg">
            <div className={styles.quiz}>
                <img
                    src={pet.img}
                    alt={pet.name}
                    className="quiz-pet-img"
                    style={{
                        width: 100,
                        height: 100
                    }}
                />

                <p className="question-text">{q.text}</p>

                <div className="btn-group">
                    <button className={styles.btncorrect} onClick={() => answer(true)}>可以</button>
                    <button className={styles.btnwrong} onClick={() => answer(false)}>不可以</button>
                </div>
            </div>
            {/* 這裡放進度文字 */}
            <div className="text-center mb-2">
                目前第 <strong>{currentQuestion + 1}</strong> 題 / 共 <strong>{questions.length}</strong> 題
            </div>

            {/* 這裡放進度條 */}
            <ProgressBar current={currentQuestion} total={questions.length} />

            {/* 4. 如果 feedback 不為 null，就顯示彈跳窗 */}
            {feedback && (
                <div className={styles.feedbackModal}>
                    <div className={styles.feedbackContent}>
                        <h3>{feedback.title}</h3>
                        <p style={{ margin: '1rem 0' }}>{feedback.message}</p>
                        <p style={{ margin: '1rem 0' }}>{feedback.detail}</p>
                        <button className={styles.feedbackBtn} onClick={nextQuestion}>下一題</button>
                    </div>
                </div>
            )}

        </div>
    )
}

export default QuizGame
