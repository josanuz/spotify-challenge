// Using headlessui only for the dialog
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import type { SpotifyPodcast } from '../types/spotify-api';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from '@zedux/react';
import { getPodcast } from '../api/podcast';
import { authenticationAtom } from '../main';

export const PodcastDetails = ({ podcast }: { podcast: SpotifyPodcast }) => {
    return (
        <div className="flex flex-col lg:flex-row h-full">
            {/* Image */}
            <div className="flex-shrink-0 w-full lg:w-1/2 h-64 lg:h-full">
                <img
                    src={podcast.images[0]?.url}
                    alt={podcast.name}
                    className="w-full h-full object-cover rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none"
                />
            </div>

            {/* Info */}
            <div className="flex flex-col flex-1 p-6 space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">{podcast.name}</h2>
                <p className="text-sm font-medium text-green-600">{podcast.publisher}</p>
                <p className="text-sm grow text-gray-700 whitespace-pre-line overflow-auto" dangerouslySetInnerHTML={{ __html: podcast.html_description || podcast.description }} />

                <div className="text-sm text-gray-500">
                    <p>
                        <strong>Languages:</strong> {podcast.languages.join(', ')}
                    </p>
                    <p>
                        <strong>Episodes:</strong> {podcast.total_episodes}
                    </p>
                    <p>
                        <strong>Explicit:</strong> {podcast.explicit ? 'Yes' : 'No'}
                    </p>
                </div>
            </div>
        </div>
    );
};

const PodcastDialog = () => {
    const navigate = useNavigate();
    const params = useParams();
    const { token } = useAtomValue(authenticationAtom);

    const query = useQuery({
        queryKey: ['podcast', params.id!],
        queryFn: async () => getPodcast(token!, params.id!),
        enabled: !!token && !!params.id,
    });

    return (
        <Dialog open onClose={() => navigate(-1)} className="relative z-50">
            <DialogBackdrop className="fixed inset-0 bg-black/60" />
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel className="h-auto lg:w-[60%] lg:aspect-[3/2] aspect-[2/3] bg-white rounded-2xl shadow-xl overflow-y-auto">
                    {/* Waiting for query to complete */}
                    {(query.isLoading || query.isFetching || query.isLoading) && (
                        <>
                            {/* <DialogTitle className="font-bold">Loading</DialogTitle> */}
                            <div className="flex items-center justify-center h-full w-full">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-200" />
                            </div>
                        </>
                    )}
                    {/* Query Error */}
                    {query.isError && (
                        <>
                            {/* <DialogTitle className="font-bold">Error</DialogTitle> */}
                            <div className="p-6 text-red-600">
                                <p>Error loading podcast details. Please try again later.</p>
                            </div>
                        </>
                    )}
                    {/* Query Sucess */}

                    {query.isSuccess && query.data && (
                        <>
                            {/* <DialogTitle className="font-bold">{`${query.data.name} - ${query.data.publisher}`}</DialogTitle> */}
                            <PodcastDetails podcast={query.data} />
                        </>
                    )}
                </DialogPanel>
            </div>
        </Dialog>
    );
};

export default PodcastDialog;
