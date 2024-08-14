import useSWRMutation from 'swr/mutation';
import './App.css'
import { useState, useEffect } from 'react';

interface Startup {
    id: number;
    city: number;
    state: number;
    category: number;
    length: number;
    employees: number;
    jobsCreated: number;
    jobsRetained: number;
    cityType: number;
    revolvingLineCredit: number;
    lowDoc: number;
    amount: number;
    prediction: number;
    advice: string;
}

const stateCodeMap = new Map<number, string>([
    [0, 'AK'],
    [1, 'AL'],
    [2, 'AR'],
    [3, 'AZ'],
    [4, 'CA'],
    [5, 'CO'],
    [6, 'CT'],
    [7, 'DC'],
    [8, 'DE'],
    [9, 'FL'],
    [10, 'GA'],
    [11, 'HI'],
    [12, 'IA'],
    [13, 'ID'],
    [14, 'IL'],
    [15, 'IN'],
    [16, 'KS'],
    [17, 'KY'],
    [18, 'LA'],
    [19, 'MA'],
    [20, 'MD'],
    [21, 'ME'],
    [22, 'MI'],
    [23, 'MN'],
    [24, 'MO'],
    [25, 'MS'],
    [26, 'MT'],
    [27, 'NC'],
    [28, 'ND'],
    [29, 'NE'],
    [30, 'NH'],
    [31, 'NJ'],
    [32, 'NM'],
    [33, 'NV'],
    [34, 'NY'],
    [35, 'OH'],
    [36, 'OK'],
    [37, 'OR'],
    [38, 'PA'],
    [39, 'RI'],
    [40, 'SC'],
    [41, 'SD'],
    [42, 'TN'],
    [43, 'TX'],
    [44, 'UT'],
    [45, 'VA'],
    [46, 'VT'],
    [47, 'WA'],
    [48, 'WI'],
    [49, 'WV'],
    [50, 'WY'],
]);

const cityMap = new Map<number, string>([
    [0, 'Los Angeles'],
    [1, 'Houston'],
    [2, 'New York'],
    [3, 'Miami'],
    [4, 'Chicago'],
    [5, 'Dallas'],
    [6, 'San Diego'],
    [7, 'Las Vegas'],
    [8, 'Brooklyn'],
    [9, 'Phoenix'],
    [10, 'Atlanta'],
    [11, 'San Antonio'],
    [12, 'Denver'],
    [13, 'Philadelphia'],
    [14, 'Austin'],
    [15, 'Springfield'],
    [16, 'Salt Lake City'],
    [17, 'Seattle'],
    [18, 'Portland'],
    [19, 'San Francisco'],
    [20, 'Other'],
]);

const cityTypeMap = new Map<number, string>([
    [1, 'Urban'],
    [2, 'Rural'],
    [0, 'Not sure'],
]); 

const categoryMap = new Map<number, string>([
    [1, 'Agriculture, forestry, or fishing'],
    [2, 'Mining, quarrying, or oil and gas extraction'],
    [3, 'Utilities'],
    [4, 'Construction'],
    [5, 'Manufacturing'],
    [8, 'Wholesale trade'],
    [9, 'Retail trade'],
    [11, 'Transportation or warehousing'],
    [13, 'Information'],
    [14, 'Finance or insurance'],
    [15, 'Real estate, rental, or leasing'],
    [16, 'Professional, scientific, or technical services'],
    [17, 'Management of companies or enterprises'],
    [18, 'Administrative, support, waste management, or remediation services'],
    [19, 'Educational services'],
    [20, 'Health care or social assistance'],
    [21, 'Arts, entertainment, or recreation'],
    [22, 'Accommodation or food services'],
    [24, 'Public administration'],
    [23, 'Other'],
]);

const revolvingLineCreditMap = new Map<number, string>([
    [0, 'No'],
    [2, 'Yes'],
    [1, 'Not sure or N/A'],
]); 

const lowDocMap = new Map<number, string>([
    [0, 'No'],
    [1, 'Yes'],
    [2, 'Not sure or N/A'],
]); 

export default function AccountPage() {
    const id = localStorage.getItem('id');
    if (!id) {
        return (
            <div className='background'>
                <div className='container account-loading-container'>
                    <p className='box'>Please log-in first!</p>
                </div>
            </div>
        ); 
    }
    
    const fetcher = async (url: RequestInfo | URL) => {
        const response = await fetch(url); 
        return response.json(); 
    }

    const { trigger, data: startupData, error } = useSWRMutation(`http://localhost:3001/api/users/${id}`, fetcher); 
    const [loading, setLoading] = useState(false); 

    const [latestData, setLatestData] = useState<Startup | null>(null);
    const [noPrediction, setNoPrediction] = useState(false);
    
    useEffect(() => {
        setLoading(true); 
        trigger(); 
    }, []); 

    useEffect(() => {
        if (startupData && startupData.startups.length === 0) {
            setNoPrediction(true);  
        }
        if (startupData && (startupData.startups.length > 0) && Array.isArray(startupData.startups)) {
            const latestStartup = startupData.startups.reduce((prev: Startup, current: Startup) => {
                return (prev.id > current.id) ? prev : current
            });
            setLatestData(latestStartup);
        }
        setLoading(false); 
    }, [startupData]);

    if (noPrediction) {
        return (
            <div className='background'>
                <div className='container account-loading-container'>
                    <p className='box'>Welcome to your account dashboard! Please create a prediction to get started!</p>
                </div>
            </div>
        ); 
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        window.location.reload();
    }

    const predictionMeaning = () => {
        if (latestData!.prediction < .25) {
          return 'Very Unlikely';
        }    
        if (latestData!.prediction < .5) {
          return 'Moderately Unlikely';
        }   
        if (latestData!.prediction < .75) {
          return 'Moderately Likely';
        }   
        return 'Very Likely'; 
    }

    return (
        <div>
            {(!loading && startupData && latestData) ? <div className='background'>
                <div className='banner'>
                    <h1 className='banner-heading'>Your Start-Up</h1>
                </div>
                <div className='container'> 
                    <div className='box'>
                        <p><span className='bold'>State:</span> {stateCodeMap.get(latestData.state)}</p>
                        <p><span className='bold'>City:</span> {cityMap.get(latestData.city)}</p>
                        <p><span className='bold'>Location Type:</span> {cityTypeMap.get(latestData.cityType)}</p>
                        <p><span className='bold'>Category:</span> {categoryMap.get(latestData.category)}</p>
                        <p><span className='bold'>Loan Term:</span> {latestData.length * 10}</p>
                        <p><span className='bold'>Revolving Line of Credit Loan:</span> {revolvingLineCreditMap.get(latestData.revolvingLineCredit)}</p>
                        <p><span className='bold'>Low-Doc Loan:</span> {lowDocMap.get(latestData.lowDoc)}</p>
                        <p><span className='bold'>Loan Amount:</span> ${latestData.amount * 10000000}</p>
                        <p><span className='bold'>Number of Employees:</span> {latestData.employees}</p>
                        <p><span className='bold'>Number of Jobs Created:</span> {latestData.jobsCreated}</p>
                        <p><span className='bold'>Number of Jobs Retained:</span> {latestData.jobsRetained}</p>
                        <p><span className='bold'>Prediction</span>: {(parseFloat((latestData.prediction * 100).toFixed(2)))}% — You are <strong>{predictionMeaning()}</strong> to qualify for this loan.</p>
                        <p><span className='bold'>Advice:</span> {latestData.advice}</p>
                        <button onClick={logout}>Logout</button>
                    </div> 
                </div>
            </div>
            :
            <div className='background'>
                <div className='container account-loading-container'>
                    {error ? <p className='box'>Error</p> : <p className='box'>Loading...</p>}
                </div>
            </div>}
        </div>
    ); 
}