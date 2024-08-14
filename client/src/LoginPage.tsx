import useSWRMutation from 'swr/mutation';
import './App.css'
import { useState, useEffect } from 'react';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const fetcher = async () => {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "username": username,
          "password": password
        }), 
      });
      return response.json();
    }

    const { trigger, data: user, error } = useSWRMutation('http://localhost:3001/api/login', fetcher);
    const [loading, setLoading] = useState(false);

    const handleFormSubmit = (e: { preventDefault: () => void; }) => {
      e.preventDefault(); 
      setLoading(true); 
      trigger(); 
    }

    useEffect(() => {
      if (user) {
        localStorage.setItem('token', user.token);
        localStorage.setItem('id', user.id); 
      }
      setLoading(false); 
    }, [user]);

    return (
      <div className='background'>
        <div className='banner'>
          <h1 className='banner-heading'>Log-In</h1>
        </div>

        <div className='container'>
          <form onSubmit={handleFormSubmit} className='box'>
              <div>
                <label htmlFor='username'>Username: </label>
                <input id='username' name='username' onChange={e => setUsername(e.target.value)} required/>
              </div>
              <div>
                <label htmlFor='password'>Password: </label>
                <input id='password' name='password' type='password' onChange={e => setPassword(e.target.value)} required/>
              </div>
              <input id='submit' type='submit' value='Submit' />
          </form>
        </div>

        {(loading || error || user) && (<div className='container center-container bottom-container'>
          <div className='box'>
            {(loading && !error) && <p>Loading...</p>}
            {(error || (user && user.name == null)) && <p>Your username or password is incorrect.</p>}
            {(!loading && user && user.name != null) && <p>{user.name}, you have been successfully logged-in!</p>}
          </div>
        </div>)}
      </div> 
    ); 
}