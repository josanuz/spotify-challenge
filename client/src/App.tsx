import { useAtomValue } from '@zedux/react';
import TabNavigation from './components/tab-navigation';

import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { authenticationAtom, userProfileAtom } from './main';

function App() {
    const navigate = useNavigate();
    const { token } = useAtomValue(authenticationAtom);
    const curentUser = useAtomValue(userProfileAtom);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token]);

    if (token == null || curentUser == null) {
        return (
            <div className="flex items-center justify-center h-screen">
                <h1 className="text-4xl font-bold">Loading...</h1>
            </div>
        );
    }

    return <TabNavigation />;
}

export default App;
