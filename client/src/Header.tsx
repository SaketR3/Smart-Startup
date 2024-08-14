import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <>
            <div className='header'>
                <p className='logo'>Smart Start-Up</p>
                <div className='header-links'>
                    <Link to='/' className='link' onClick={() => window.scroll(0, 0)}>Home</Link>
                    <Link to='/create-account' className='link' onClick={() => window.scroll(0, 0)}>Create Account</Link>
                    <Link to='/login' className='link' onClick={() => window.scroll(0, 0)}>Log-In</Link>
                    <Link to='/account' className='link' onClick={() => window.scroll(0, 0)}>Account Dashboard</Link>
                </div>
            </div>
            <div className='header-spacer'></div>
        </>
    );
}