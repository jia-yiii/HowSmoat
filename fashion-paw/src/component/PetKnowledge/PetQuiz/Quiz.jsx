import React, { useState } from 'react';
import Selector from './Selector';
import QuizGame from './QuizGame';
import SelDogImg from '../images/selectdog.png';
import SelCatImg from '../images/selectcat.png';
import SelHamsterImg from '../images/selecthamster.png';
import SelBirdImg from '../images/selectbird.png';
import dogQuestions from './DogQuestions.json';
import catQuestions from './CatQuestions.json';
import hamsterQuestions from './HamsterQuestions.json';
import birdQuestions from './BirdQuestions.json';
import titleIcon from '../images/pawicon.svg';
import styles from './Quiz.module.css';
import QuizBg from './QuizBg.jpg';

function Quiz() {
    const pets = ['貓咪', '狗狗', '倉鼠', '鳥'];
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [petIndex, setPetIndex] = useState(null);
    const [gameQuestions, setGameQuestions] = useState([]);
    const [showTransition, setShowTransition] = useState(false);

    const petList = [
        { name: '貓咪', img: SelCatImg, questions: catQuestions },
        { name: '狗狗', img: SelDogImg, questions: dogQuestions },
        { name: '倉鼠', img: SelHamsterImg, questions: hamsterQuestions },
        { name: '鳥', img: SelBirdImg, questions: birdQuestions },
    ];

    const startGame = () => {
        const list = petList[selectedIndex].questions;
        const shuffled = [...list].sort(() => Math.random() - 0.5);
        setShowTransition(true);
        setTimeout(() => {
            setPetIndex(selectedIndex);
            setGameQuestions(shuffled);
            setShowTransition(false);
        }, 1500);
    };

    return (
        <div className={`${styles.quizContainer} container-xl py-5`}>
            {showTransition && (
                <div className={styles.transitionOverlay}>
                    <img
                        src={petList[selectedIndex].img}
                        className={styles.jumpIn}
                        alt="跳進中央動畫"
                    />
                    <div className={styles.spotlight}></div>
                </div>
            )}

            {petIndex === null ? (
                <div className={styles.selectorBox}>
                    <h2 className="border paw-bg-pri-darkbrown text-center rounded d-block mx-auto" style={{ width: 200 }}>寵物知多少</h2>
                    <Selector
                        options={petList.map(p => p.name)}
                        onChange={idx => setSelectedIndex(idx)} />

                    <div className={styles.petRow}>
                        <img
                            src={petList[selectedIndex].img}
                            alt={petList[selectedIndex].name}
                            className={`${styles.footerIcon}`}
                        />
                    </div>

                    <div className="text-center mt-3">
                        <button
                            className={styles.startBtn}
                            onClick={startGame}
                        >
                            開始遊戲
                        </button>
                    </div>
                </div>
            ) : (
                <QuizGame
                    pet={petList[petIndex]}
                    questions={gameQuestions}
                    onRestart={() => setPetIndex(null)} />
            )}
        </div>
    );
}

export default Quiz;
