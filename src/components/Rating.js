import React, { useEffect, useState } from 'react';
import axios from "axios";
import './style.css';

const Rating = () => {
    const [questions, setQuestions] = useState([]);
    const [currentKey, setCurrentKey] = useState(1);
    const [selectedOption, setSelectedOption] = useState(null);
    const [sudmitButton, setsudmitButton] = useState(true)
    const [Displaymessage, setDisplaymessage] = useState("")
    const [question1, setQuestion1] = useState(null)
    const [option1, setOption1] = useState(null)
    const [details, setDetails] = useState(null)
    const [Displaywelcome, setDisplaywelcome] = useState("Welcome")
    const [welcomeButton, setWelcomeButton] = useState(true)
    const [Custom, setCustom] = useState(false)
    const fetchData = async () => {
        try {
            const details = await axios.get("http://localhost:5000/api/getData");
            console.log(details.data.details);
            setQuestions(details.data.details);
            setWelcomeButton(false)
            setCustom(true)
            setCurrentKey(1)
        } catch (err) {
            console.log("Error while fetching", err);
        }
    };


    const handleNext = () => {
        setCurrentKey(currentKey + 1);

    };

    const handlePrevious = () => {
        if (currentKey > 1) {
            setCurrentKey(currentKey - 1);
        }
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setOption1(option)
        const data = questions.filter((item) => {
            return item.key == currentKey
        })
        const data2 = data.map((item) => {
            return item.Question
        })

        let object =
        {
            question: data2[0],
            option: option
        }


        const localstorageitems = localStorage.getItem("Answers")
        const parseditems = JSON.parse(localstorageitems)
        console.log(parseditems)
        if (parseditems) {
            localStorage.setItem("Answers", JSON.stringify([...parseditems, object]))
        } else {
            localStorage.setItem("Answers", JSON.stringify([object]))
        }
    };
    useEffect(() => {
        const togglecolour = () => {
            setSelectedOption("")
        }
        togglecolour()
        const data = () => {
            const data1 = questions?.find((item) => {
                return item.key == currentKey
            })
            setQuestion1(data1?.Question)
        }
        data()
    }, [currentKey])

    const sudmit = () => {
        localStorage.setItem("result", "COMPLETED")
        setsudmitButton(false)
    }
    useEffect(() => {
        if (sudmitButton == false) {
            setTimeout(() => {

                setCurrentKey(0)
                setWelcomeButton(true)
                setsudmitButton(true)
                localStorage.removeItem("Answers")
                localStorage.removeItem("result")
            
            }, 5000)
        }
    }, [sudmitButton])

    useEffect(() => {
        const getAnswers = () => {
            const localstorageitems = localStorage.getItem("Answers");
            const parseditems = JSON.parse(localstorageitems);
            const details = parseditems?.find((item) =>
                item?.question == question1);
            setDetails(details?.option)

        }
        getAnswers();
    }, [question1])
    return (
        <>

            <div className="container">
                {Custom && <h1>Customer Survey</h1>}
                <div className="welcome-card">
                    {welcomeButton && (
                        <>
                            <div className="welcome-message">{Displaywelcome}</div>
                            <button onClick={fetchData} className="welcome-button">Start the Survey</button>
                        </>
                    )}
                </div>
                {questions?.map((item, index) => {
                    if (currentKey === item?.key) {
                        return (
                            <div key={item?.key} className="question-container">
                                <div className="question-header">
                                    <span>{item?.key}/5</span>
                                </div>
                                <div className="question-text">
                                    {item?.Question}
                                </div>
                                <div className="options">
                                    {[item?.Option1, item?.Option2, item?.Option3, item?.Option4, item?.Option5].map((option, i) => (
                                        <button
                                            className={`option-button ${selectedOption === option || details === option ? 'selected' : ''}`}

                                            onClick={() => handleOptionClick(option, item?.Question)}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                                <div className="navigation-buttons">
                                    <button onClick={handlePrevious} className="prev-button">Prev</button>
                                    <button onClick={handleNext} className="prev-button">Skip</button>
                                    <button onClick={handleNext} className="next-button">Next</button>

                                </div>

                            </div>
                        );
                    }

                })}
                {currentKey > 5 && sudmitButton == true ? <button className='prev-button' onClick={sudmit}>Submit</button> : ""}
                {currentKey > 5 && sudmitButton == false ? <div style={{ fontSize: "30px", marginTop: "3%", fontWeight: "bold" }}>Thankyou</div> : ""}

            </div>
        </>
    );
};

export default Rating;
