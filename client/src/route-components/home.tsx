import { useAtomValue } from '@zedux/react';
import { userProfileAtom } from '../state/app-state';
import { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchPodcasts } from '../api/search';
import { Outlet, useNavigate, useSearchParams } from 'react-router';
import PodcastGrid from '../components/podcast-grid';
import { clsx } from 'clsx';
import { SearchBar } from '../components/search-bar';
import { addToLibrary, getLibrary } from '../api/podcast';

export const Home = () => {
    const loggedUser = useAtomValue(userProfileAtom);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const currentLibraryQuery = useQuery({
        queryKey: ['library'],
        queryFn: () => getLibrary(),
        enabled: !!loggedUser,
    });

    const audioBookQuery = useQuery({
        queryKey: ['search', searchParams.get('query')],
        queryFn: () => searchPodcasts({ query: searchParams.get('query') || '' }),
        enabled: !!searchParams.get('query'), // Only run the query if query is not empty
        refetchOnWindowFocus: false,
    });

    if (currentLibraryQuery.isError || audioBookQuery.isError) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-red-500">Error loading data</p>
            </div>
        );
    }

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
                        <SearchBar
                            onsubmit={query => setSearchParams({ query })}
                            current={searchParams.get('query')}
                        />
                    </section>
                    <section
                        id="search-results"
                        className={`overflow-auto shrink grow basis-0 ${clsx(audioBookQuery.isLoading || audioBookQuery.isError ? 'flex items-center justify-center' : 'inline-block')}`}
                    >
                        {(currentLibraryQuery.isLoading || audioBookQuery.isLoading) && (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-white">Loading</p>
                            </div>
                        )}
                        {audioBookQuery.isSuccess && (
                            <PodcastGrid
                                library={currentLibraryQuery.data ?? []}
                                podcasts={audioBookQuery.data?.items ?? []}
                                onAdd={podcast => {
                                    addToLibrary(podcast.id).then(() => {
                                        currentLibraryQuery.refetch();
                                        audioBookQuery.refetch();
                                    });
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
;
