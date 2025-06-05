import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from '@zedux/react';
import { clsx } from 'clsx';
import { Suspense, useMemo } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router';
import { addToLibrary, getLibrary } from '../api/podcast';
import { searchPodcasts } from '../api/search';
import PodcastGrid from '../components/podcast-grid';
import { SearchBar } from '../components/search-bar';
import { userProfileAtom } from '../state/app-state';

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

    const querySuccessNData = useMemo(() => {
        if (!audioBookQuery.isSuccess && currentLibraryQuery.isSuccess) return false;
        const hasData = audioBookQuery.data != null && audioBookQuery.data.items.length > 0;
        const hasLibrary = currentLibraryQuery.data != null;
        return hasData && hasLibrary;
    }, [audioBookQuery, currentLibraryQuery]);

    const querySuccessNNoData = useMemo(() => {
        if (!audioBookQuery.isSuccess && currentLibraryQuery.isSuccess) return false;
        const noData = audioBookQuery.data == null || audioBookQuery.data.items.length < 1;
        const noLibrary = currentLibraryQuery.data == null;
        return noData || noLibrary;
    }, [audioBookQuery, currentLibraryQuery]);

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
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-200" />
                        )}
                        {querySuccessNNoData && (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-white">No Results found</p>
                            </div>
                        )}
                        {querySuccessNData && (
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
