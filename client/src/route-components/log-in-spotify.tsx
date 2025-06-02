import { useSearchParams } from "react-router"

export const LoginInSpotify = () => {

    const [params] = useSearchParams()

    return <div className="flex items-center justify-center h-screen flex-col gap-4">

        <form action="/auth/login" method="get" className="flex flex-col items-center">
            <button type="submit" className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors">
                Log in with Spotify
            </button>
        </form>

        {params.get('error') && (
            <div className="text-red-500 text-center mb-4">
                <p className="text-base">Error: {params.get('error')}</p>
                <p className="text-sm">Please try again.</p>
            </div>
        )}
    </div>
}