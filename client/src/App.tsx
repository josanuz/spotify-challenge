import { useAtomValue } from '@zedux/react';
import { type JSX, useEffect } from 'react';
import { useNavigate } from 'react-router';
import TabNavigation from './components/tab-navigation';
import { userProfileAtom } from './state/app-state';
import { authenticationAtom } from './state/app-state';

/**
 * this component serves as the main application component.
 * It checks if the user is authenticated and redirects to the login page if not.
 * If the user is authenticated, it renders the TabNavigation component.
 * @returns {JSX.Element} The main application component.
 */
function App(): JSX.Element {
    const navigate = useNavigate();
    const { token } = useAtomValue(authenticationAtom);
    const curentUser = useAtomValue(userProfileAtom);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

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
