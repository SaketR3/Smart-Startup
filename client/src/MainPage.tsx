import useSWRMutation from 'swr/mutation';
import './App.css'
import { useState, useEffect } from 'react';

export default function MainPage() {
  var inputData: Array<Number> = [];
  var ragData: Array<Number> = [];
  const token = localStorage.getItem('token');
  
  const [state, setState] = useState(0);
  const [city, setCity] = useState(0);
  const [cityType, setCityType] = useState(1);
  const [category, setCategory] = useState(1);
  const [length, setLength] = useState(0);
  const [revolvingLineCredit, setRevolvingLineCredit] = useState(0);
  const [lowDoc, setLowDoc] = useState(0);
  const [employees, setEmployees] = useState(0);
  const [jobsCreated, setJobsCreated] = useState(0);
  const [jobsRetained, setJobsRetained] = useState(0);
  const [amount, setAmount] = useState(0);

  const predictFetcher = async () => {
    const response = await fetch('http://localhost:5000/model-api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "data": inputData
      }), 
    });
    return response.json();
  }

  const { trigger: predictTrigger, data: prediction, error: predictError } = useSWRMutation('http://localhost:5000/model-api', predictFetcher);
  const [predictLoading, setPredictLoading] = useState(false);

  const ragFetcher = async () => {
    const response = await fetch('http://localhost:3001/api/rag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "data": ragData
      }), 
    });
    return response.json();
  }

  const { trigger: ragTrigger, data: rag, error: ragError } = useSWRMutation('http://localhost:3001/api/rag', ragFetcher);
  const [ragLoading, setRagLoading] = useState(false);

  const dbFetcher = async () => {
    const response = await fetch('http://localhost:3001/api/startups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        "city": city,
        "state": state,
        "category": category,
        "length": length / 10,
        "employees": employees,
        "jobsCreated": jobsCreated,
        "jobsRetained": jobsRetained,
        "cityType": cityType,
        "revolvingLineCredit": revolvingLineCredit,
        "lowDoc": lowDoc,
        "amount": amount / 10000000,
        "prediction": prediction.prediction,
        "advice": rag.advice
      }), 
    });
    return response.json();
  }

  const { trigger: dbTrigger, data: startupData, error: dbError } = useSWRMutation('http://localhost:3001/api/startups', dbFetcher);
  const [dbLoading, setDbLoading] = useState(false);

  const handleFormSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault(); 
    setPredictLoading(true); 
    inputData = [city, state, category, length / 10, employees, jobsCreated, jobsRetained, cityType, revolvingLineCredit, lowDoc, amount / 10000000];
    predictTrigger(); 
  }

  const handleSaveData = () => {
    setDbLoading(true); 
    dbTrigger(); 
  }

  useEffect(() => {
    if (prediction) {
      setPredictLoading(false);
      setRagLoading(true); 
      ragData = [city, state, category, length / 10, employees, jobsCreated, jobsRetained, cityType, revolvingLineCredit, lowDoc, amount / 10000000, prediction.prediction];
      ragTrigger();
    } 
  }, [prediction]);

  useEffect(() => {
    setRagLoading(false);
  }, [rag])

  useEffect(() => {
    if (prediction) {
      localStorage.setItem('hasCreatedPrediction', 'true');
    }
    setDbLoading(false); 
  }, [dbLoading]);

  const predictionMeaning = () => {
    if (prediction.prediction < .25) {
      return 'Very Unlikely';
    }
    if (prediction.prediction < .5) {
      return 'Moderately Unlikely';
    }
    if (prediction.prediction < .75) {
      return 'Moderately Likely';
    }
    return 'Very Likely'; 
  }

  return (
    <>
        <div className='banner banner-smart-startup'>
          <h1 className='banner-heading'>Smart Start-Up</h1>
        </div>

        <div className='description'>
          <p className='description-paragraph'>
            When it comes to start-ups, there can be a lot of difficulties involved. Developing your product or service, meeting customer demand, finding effective marketing channels, and more, 
            can all be time-consuming and strenuous. Not to mention that finding a source of funding until you can sustain your business is both extremely arduous and extremely critical to the 
            survival of your start-up. 
          </p>
          <p className='description-paragraph'>
            That's where Smart Start-Up comes in. Instead of trying to guess whether you'll qualify for the SBA loan you want or potentially being under-prepared, with Smart Start-Up all you have 
            to do is input a bit of information about your start-up and the loan you're looking for. Smart Start-Up will then tell you how likely you are to receive the loan you're interested in. 
            Behind the scenes, a custom deep neural network trained on over 315,000 prior SBA loan interactions will crunch the data to see where your business stands. 
          </p>
        </div>
        
        <div className='form-background'>
          <div className='banner'>
            <h1 className='banner-heading'>Create a Prediction</h1>
          </div>
          <div className='container'>
            <form onSubmit={handleFormSubmit} className='box'>
              <p>Note: You are welcome to use this tool without creating an account! However, you'll need to create an account if you'd like to save your results.</p>
              
              <div>
                  <label htmlFor='state'>What state is your start-up in? </label>
                  <select id='state' name='state' value={state} onChange={e => setState(Number(e.target.value))}>
                      <option value={0}>AK</option>
                      <option value={1}>AL</option>
                      <option value={2}>AR</option>
                      <option value={3}>AZ</option>
                      <option value={4}>CA</option>
                      <option value={5}>CO</option>
                      <option value={6}>CT</option>
                      <option value={7}>DC</option>
                      <option value={8}>DE</option>
                      <option value={9}>FL</option>
                      <option value={10}>GA</option>
                      <option value={11}>HI</option>
                      <option value={12}>IA</option>
                      <option value={13}>ID</option>
                      <option value={14}>IL</option>
                      <option value={15}>IN</option>
                      <option value={16}>KS</option>
                      <option value={17}>KY</option>
                      <option value={18}>LA</option>
                      <option value={19}>MA</option>
                      <option value={20}>MD</option>
                      <option value={21}>ME</option>
                      <option value={22}>MI</option>
                      <option value={23}>MN</option>
                      <option value={24}>MO</option>
                      <option value={25}>MS</option>
                      <option value={26}>MT</option>
                      <option value={27}>NC</option>
                      <option value={28}>ND</option>
                      <option value={29}>NE</option>
                      <option value={30}>NH</option>
                      <option value={31}>NJ</option>
                      <option value={32}>NM</option>
                      <option value={33}>NV</option>
                      <option value={34}>NY</option>
                      <option value={35}>OH</option>
                      <option value={36}>OK</option>
                      <option value={37}>OR</option>
                      <option value={38}>PA</option>
                      <option value={39}>RI</option>
                      <option value={40}>SC</option>
                      <option value={41}>SD</option>
                      <option value={42}>TN</option>
                      <option value={43}>TX</option>
                      <option value={44}>UT</option>
                      <option value={45}>VA</option>
                      <option value={46}>VT</option>
                      <option value={47}>WA</option>
                      <option value={48}>WI</option>
                      <option value={49}>WV</option>
                      <option value={50}>WY</option>
                  </select>
              </div>

              <div>
                  <label htmlFor='city'>What city is your start-up in? </label>
                  <select id='city' name='city' value={city} onChange={e => setCity(Number(e.target.value))}>
                      <option value={0}>Los Angeles</option>
                      <option value={1}>Houston</option>
                      <option value={2}>New York</option>
                      <option value={3}>Miami</option>
                      <option value={4}>Chicago</option>
                      <option value={5}>Dallas</option>
                      <option value={6}>San Diego</option>
                      <option value={7}>Las Vegas</option>
                      <option value={8}>Brooklyn</option>
                      <option value={9}>Phoenix</option>
                      <option value={10}>Atlanta</option>
                      <option value={11}>San Antonio</option>
                      <option value={12}>Denver</option>
                      <option value={13}>Philadelphia</option>
                      <option value={14}>Austin</option>
                      <option value={15}>Springfield</option>
                      <option value={16}>Salt Lake City</option>
                      <option value={17}>Seattle</option>
                      <option value={18}>Portland</option>
                      <option value={19}>San Francisco</option>
                      <option value={20}>Other</option>
                  </select>
              </div>

              <div>
                  <label htmlFor='city-type'>What type of location is your start-up in? </label>
                  <select id='city-type' name='city-type' value={cityType} onChange={e => setCityType(Number(e.target.value))}>
                      <option value={1}>Urban</option>
                      <option value={2}>Rural</option>
                      <option value={0}>Not sure</option>
                  </select>
              </div>

              <div>
                  <label htmlFor='category'>What category is your start-up? </label>
                  <select id='category' name='category' value={category} onChange={e => setCategory(Number(e.target.value))}>
                      <option value={1}>Agriculture, forestry, or fishing</option>
                      <option value={2}>Mining, quarrying, or oil and gas extraction</option>
                      <option value={3}>Utilities</option>
                      <option value={4}>Construction</option>
                      <option value={5}>Manufacturing</option>
                      <option value={8}>Wholesale trade</option>
                      <option value={9}>Retail trade</option>
                      <option value={11}>Transportation or warehousing</option>
                      <option value={13}>Information</option>
                      <option value={14}>Finance or insurance</option>
                      <option value={15}>Real estate, rental, or leasing</option>
                      <option value={16}>Professional, scientific, or technical services</option>
                      <option value={17}>Management of companies or enterprises</option>
                      <option value={18}>Administrative, support, waste management, or remediation services</option>
                      <option value={19}>Educational services</option>
                      <option value={20}>Health care or social assistance</option>
                      <option value={21}>Arts, entertainment, or recreation</option>
                      <option value={22}>Accommodation or food services</option>
                      <option value={24}>Public administration</option>
                      <option value={23}>Other</option>
                  </select>
              </div>

              <div>
                  <label htmlFor='length'>What would the loan term be? </label>
                  <span><input type='number' id='length' name='length' onChange={e => setLength(Number(e.target.value))}/> months</span>
              </div>

              <div>
                  <label htmlFor='revolving-line-credit'>Would the loan be a revolving line of credit loan? </label>
                  <select id='revolving-line-credit' name='revolving-line-credit' value={revolvingLineCredit} onChange={e => setRevolvingLineCredit(Number(e.target.value))}>
                      <option value={0}>No</option>
                      <option value={2}>Yes</option>
                      <option value={1}>Not sure or N/A</option>
                  </select>
              </div>

              <div>
                  <label htmlFor='low-doc'>Would the loan be a low-doc loan? </label>
                  <select id='low-doc' name='low-doc' value={lowDoc} onChange={e => setLowDoc(Number(e.target.value))}>
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                      <option value={2}>Not sure or N/A</option>
                  </select>
              </div>

              <div>
                  <label htmlFor='amount'>What would the loan amount be? </label>
                  <span>$<input type='number' id='amount' name='amount' onChange={e => setAmount(Number(e.target.value))}/></span>
              </div>

              <div>
                  <label htmlFor='employees'>How many employees does your start-up have? </label>
                  <span><input type='number' id='employees' name='employees' onChange={e => setEmployees(Number(e.target.value))}/> employees</span>
              </div>

              <div>
                  <label htmlFor='jobs-created'>How many jobs has your start-up created? (Leave blank if unsure) </label>
                  <span><input type='number' id='jobs-created' name='jobs-created' onChange={e => setJobsCreated(Number(e.target.value))}/> jobs created</span>
              </div>

              <div>
                  <label htmlFor='jobs-retained'>How many jobs has your start-up retained? (Leave blank if unsure) </label>
                  <span><input type='number' id='jobs-retained' name='jobs-retained' onChange={e => setJobsRetained(Number(e.target.value))}/> jobs retained</span>
              </div>

              <input id='submit' type='submit' value='Submit' />
            </form>
          </div>

          {(predictLoading || predictError || prediction) && (<div className='container center-container bottom-container'>
            <div className='box'>
              {(predictLoading && !predictError) && <p>Loading model prediction...</p>}
              {predictError && <p>An error occurred while accessing the model; please try again later.</p>}
              {(!predictLoading && prediction) && <p><span className='bold'>Prediction</span>: {(parseFloat((prediction.prediction * 100).toFixed(2)))}% — You are <strong>{predictionMeaning()}</strong> to qualify for this loan.</p>}

              {(ragLoading && !ragError) && <p>Loading advice...</p>}
              {ragError && <p>An error occurred during retrieval augmented generation; please try again later.</p>}
              {(!ragLoading && rag) && <p style={{ textAlign: 'left' }}>{rag.advice}</p>}

              {(token && !predictLoading && !ragLoading && prediction && rag) && <button onClick={handleSaveData}>Save Data</button>} 

              {(dbLoading && !dbError) && <p>Saving data to the database...</p>}
              {dbError && <p>An error occurred while saving your data; please try again later.</p>}
              {(!dbLoading && startupData) && <p>Your start-up data has been successfully saved to the database!</p>}
            </div>
          </div>)}
        </div>
    </>
  ); 
}