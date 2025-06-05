/*
    this file provides a dialog component for displaying detailed information about a podcast.
    It fetches the podcast details using the podcast ID from the URL parameters and displays them in a modal dialog.    
*/
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';
import { getPodcast } from '../api/podcast';
import { PodcastDetails } from './PodcastDetails';

const PodcastDialog = () => {
    const navigate = useNavigate();
    const params = useParams();

    const query = useQuery({
        queryKey: ['podcast', params.id!],
        queryFn: async () => getPodcast(params.id!),
        enabled: !!params.id,
    });

    return (
        <Dialog open onClose={() => navigate(-1)} className="relative z-50">
            <DialogBackdrop className="fixed inset-0 bg-black/60" />
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel className="h-auto max-h-[90vh] xl:w-[60%] md:w-[90%] lg:aspect-[3/2] aspect-[2/3] bg-white rounded-2xl shadow-xl overflow-y-auto">
                    {/* Waiting for query to complete */}
                    {query.isLoading && (
                        <>
                            <div className="flex items-center justify-center h-[64px] w-[64px]">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-200" />
                            </div>
                        </>
                    )}
                    {/* Query Error */}
                    {query.isError && (
                        <>
                            <div className="p-6 text-red-600">
                                <p>Error loading podcast details. Please try again later.</p>
                            </div>
                        </>
                    )}
                    {/* Query Sucess */}
                    {query.isSuccess && query.data && (
                        <>
                            <PodcastDetails podcast={query.data} />
                        </>
                    )}
                </DialogPanel>
            </div>
        </Dialog>
    );
};

export default PodcastDialog;
