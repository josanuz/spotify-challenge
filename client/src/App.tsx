import { useAtomState } from '@zedux/react'
import './App.css'
import TabNavigation from './components/tab-navigation'
import { currentUserAtom, jwtTokenAtom } from './main'
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { fetchUserProfile } from './api/user';

function App() {
  const navigate = useNavigate();
  const [jwtToken] = useAtomState(jwtTokenAtom);
  const [curentUser, setCurrentUser] = useAtomState(currentUserAtom);

  useEffect(() => {
    if (!jwtToken) {
      navigate('/login');
    } else {
      // TODO Handle expired JWT token
      fetchUserProfile(jwtToken)
        .then(userProfile => {
          setCurrentUser(userProfile);
        })
    }
  }, [jwtToken]);


  if (jwtToken === null || curentUser == null) {
    return <div className="flex items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Loading...</h1>
    </div>
  }

  return <TabNavigation />
}

export default App
