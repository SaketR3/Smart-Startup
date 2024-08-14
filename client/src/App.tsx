import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from './Header';
import MainPage from './MainPage'; 
import AccountCreationPage from './AccountCreationPage';
import LoginPage from './LoginPage';
import AccountPage from './AccountPage'; 

export default function App() {
    return (<>
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            <Route path='/' element={<MainPage />} />
            <Route path='/create-account' element={<AccountCreationPage />} />
            <Route path='/login' element={<LoginPage />} /> 
            <Route path='/account' element={<AccountPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </>)
}
