import React, { useEffect, useState } from 'react';
import axios from "axios";
import './style.css'; // Make sure this file contains the required styles

const Rating = () => {
    const [questions, setQuestions] = useState([]);
    const [currentKey, setCurrentKey] = useState(1);
    const [selectedOption, setSelectedOption] = useState(null);
     const [Button, setButton] = useState(true)
    const fetchData = async () => {
        try {
            const details = await axios.get("http://localhost:5000/api/getData");
            console.log(details.data.details);
            setQuestions(details.data.details);
        } catch (err) {
            console.log("Error while fetching", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleNext = () => {
        setCurrentKey(currentKey + 1);
        setButton(false)
    };

    const handlePrevious = () => {
        if (currentKey > 1) {
            setCurrentKey(currentKey - 1);
        }
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        const data = questions.filter((item)=>{
          return item.key == currentKey
        })
        const data2 = data.map((item)=>{
            return item.Question
        })
        // console.log(data2)
        let object = [
            {
                question: data2[0],
                option : option
            }
        ] 
        // localStorage.setItem("Answers", JSON.stringify(object))
        const localstorageitems = localStorage.getItem("Answers")
        const parseditems = JSON.parse(localstorageitems)
        console.log(parseditems)
        if(parseditems){
           localStorage.setItem("Answers",JSON.stringify([...parseditems,object]))
        } else {
            localStorage.setItem("Answers", JSON.stringify(object))
        }
        // const details = parseditems?.filter((item)=>{
        //     return item.option == currentKey
            
        // })
        // console.log(details)
    };
     useEffect(()=>{
       const togglecolour = () => {
        setSelectedOption("")
       }
       togglecolour()
     },[currentKey])

    return (
        <div className="container">
            <h1>Customer Survey</h1>
            {questions?.map((item, index) => {
                if (currentKey === item.key) {
                    return (
                        <div key={item.key} className="question-container">
                            <div className="question-header">
                                <span>{item.key}/5</span>
                            </div>
                            <div className="question-text">
                                {item.Question}
                            </div>
                            <div className="options">
                                {[item.Option1, item.Option2, item.Option3, item.Option4, item.Option5].map((option, i) => (
                                    <button
                                    className={`option-button ${selectedOption === option ? 'selected' : ''}`}
                    
                                        onClick={() => handleOptionClick(option)}
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
                return null;
            })}
        </div>
    );
};

export default Rating;
