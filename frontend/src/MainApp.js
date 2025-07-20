import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Make sure this import is present
const api = process.env.REACT_APP_API_URL;
axios.get(`${api}/api/data`);
function MainApp() {

  const [userData, setUserData] = useState({
    userId: '',
    Gender: '',
    Age: '',
    Height: '',
    Weight: '',
    Duration: '',
    Heart_Rate: '',
    Body_Temp: '',
  });

  const [userId, setUserId] = useState('');
  const [result, setResult] = useState(null);
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [displayedText, setDisplayedText] = useState('');

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://backend:5000/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        setUserData({
          userId: '',
          Gender: '',
          Age: '',
          Height: '',
          Weight: '',
          Duration: '',
          Heart_Rate: '',
          Body_Temp: '',
        });
      })
      .catch((error) => {
        console.error('Error saving data!', error);
        alert('Failed to save data.');
      });
  };

  const handleUserIdChange = (e) => setUserId(e.target.value);

  const calculateResult = () => {
    axios
      .get(`http://backend:5000/res?userId=${userId}`)
      .then((response) => {
        if (response.data.result) {
          setResult(response.data.result['0'] + ' calories');
        } else {
          setResult('No data found for this User ID');
        }
      })
      .catch(() => {
        setResult('No data found for the provided UserId');
      });
  };

  const handleDietQuery = async () => {
    if (!currentWeight || !targetWeight) {
      alert('Please enter both weights');
      return;
    }

    const cw = parseFloat(currentWeight);
    const tw = parseFloat(targetWeight);
    if (isNaN(cw) || isNaN(tw)) {
      alert('Weights must be valid numbers');
      return;
    }

    const query =
      cw > tw
        ? 'What is the best diet plan for weight loss?'
        : 'What is the best diet plan for weight gain?';

    try {
      const response = await fetch('http://backend:5000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      const words = data.result.split(' ');

      setDisplayedText('');
      let index = 0;
      const interval = setInterval(() => {
        if (index < words.length) {
          setDisplayedText((prev) => prev + words[index] + ' ');
          index++;
        } else {
          clearInterval(interval);
        }
      }, 150);
    } catch (error) {
      console.error('Error fetching diet plan:', error);
      setDisplayedText('Failed to fetch result.');
    }
  };

  return (
  
      <div className="container">
        <h1>Health Data Collection</h1>
        <form onSubmit={handleSubmit} className="form-section">
          <input type="number" name="userId" placeholder="User ID" value={userData.userId} onChange={handleChange} required />
          <select name="Gender" value={userData.Gender} onChange={handleChange}>
            <option value="">Gender</option>
            <option value="0">0 (Women)</option>
            <option value="1">1 (Men)</option>
          </select>
          <input type="number" name="Age" placeholder="Age" value={userData.Age} onChange={handleChange} required />
          <input type="number" name="Height" placeholder="Height (cm)" value={userData.Height} onChange={handleChange} required />
          <input type="number" name="Weight" placeholder="Weight (kg)" value={userData.Weight} onChange={handleChange} required />
          <input type="number" name="Duration" placeholder="Duration (min)" value={userData.Duration} onChange={handleChange} required />
          <input type="number" name="Heart_Rate" placeholder="Heart Rate" value={userData.Heart_Rate} onChange={handleChange} required />
          <input type="number" name="Body_Temp" placeholder="Body Temperature" value={userData.Body_Temp} onChange={handleChange} required />
          <button type="submit">Save Data</button>
        </form>

        <div className="calorie-section">
          <h2>Calculate Calories</h2>
          <input type="number" placeholder="Enter User ID" value={userId} onChange={handleUserIdChange} required />
          <button onClick={calculateResult}>Calculate</button>
          {result && <div className="result-box">{result}</div>}
        </div>

        <div className="diet-plan-section">
          <h2>Diet Plan Generator</h2>
          <div className="input-row">
            <label>Current Weight (kg):</label>
            <input type="number" value={currentWeight} onChange={(e) => setCurrentWeight(e.target.value)} />
          </div>
          <div className="input-row">
            <label>Target Weight (kg):</label>
            <input type="number" value={targetWeight} onChange={(e) => setTargetWeight(e.target.value)} />
          </div>
          <button onClick={handleDietQuery}>Get Diet Plan</button>

          {displayedText && (
            <div className="diet-result">
              {displayedText}
            </div>
          )}
        </div>
      </div>
    
    
  );
}

export default MainApp;
