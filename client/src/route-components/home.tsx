import { useAtomValue } from '@zedux/react';
import { authenticationAtom, userProfileAtom } from '../main';
import { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchPodcasts } from '../api/search';
import { Outlet, useNavigate, useSearchParams } from 'react-router';
import PodcastGrid from '../components/podcast-grid';
import { clsx } from 'clsx';
import { SearchBar } from '../components/search-bar';
import { addToLibrary } from '../api/podcast';

export const Home = () => {
    const loggedUser = useAtomValue(userProfileAtom);
    const navigate = useNavigate();
    const { token } = useAtomValue(authenticationAtom);
    const [searchParams, setSearchParams] = useSearchParams();

    const audioBookQuery = useQuery({
        queryKey: ['search', searchParams.get('query')],
        queryFn: () => searchPodcasts({ query: searchParams.get('query') || '', token: token! }),
        enabled: !!searchParams.get('query'), // Only run the query if query is not empty
        refetchOnWindowFocus: false,
    });

    return (
        <Suspense fallback={<p className="text-center text-xl">Loading user profile...</p>}>
            <div className="flex items-center justify-center h-full flex-col gap-4">
                <div className="flex items-center box-border justify-end w-full border-b border-amber-50 p-1 pt-0">
                    {loggedUser?.display_name}
                </div>
                <div className="flex flex-col items-center justify-center grow shrink w-full h-full gap-2">
                    <section
                        id="search-section"
                        className="flex flex-row items-center justify-center w-full"
                    >
                        <SearchBar onsubmit={query => setSearchParams({ query })} />
                    </section>
                    <section
                        id="search-results"
                        className={`overflow-auto shrink grow basis-0 ${clsx(audioBookQuery.isLoading || audioBookQuery.isError ? 'flex items-center justify-center' : 'inline-block')}`}
                    >
                        {audioBookQuery.isLoading ? (
                            <p className="text-center text-xl">Loading search results...</p>
                        ) : audioBookQuery.isError ? (
                            <p className="text-red-500">Error loading search results</p>
                        ) : (
                            <PodcastGrid
                                podcasts={audioBookQuery.data?.items ?? []}
                                onAdd={podcast => {
                                    addToLibrary(token!, podcast.id).then(() =>
                                        audioBookQuery.refetch(),
                                    );
                                }}
                                onView={podcast =>
                                    navigate(`./${podcast.id}/?${searchParams.toString()}`, {
                                        relative: 'path',
                                    })
                                }
                            />
                        )}
                    </section>
                </div>
            </div>
            <Outlet />
        </Suspense>
    );
};
7;
