import { useQuery } from '@tanstack/react-query';
import React from 'react';
import toast from 'react-hot-toast';
import { getLibrary, removeFromLibrary } from '../api/podcast';
import { PodcastListFolder } from '../components/podcast-list-folder';
import { type LibraryItem } from '../types/spotify-api';

const PodcastLibraryGrid: React.FC = () => {
    const libraryQuery = useQuery({
        queryKey: ['library'],
        queryFn: () => getLibrary(),
    });

    const handleDelete = async (item: LibraryItem) => {
        removeFromLibrary(item.podcast_id)
            .then(() => {
                toast.success('Item deleted');
                // Refetch the library data after deletion
                libraryQuery.refetch();
            })
            .catch(() => toast.error('Could not delete element form library'));
    };

    if (libraryQuery.isError) {
        return <p className="text-red-500">Error loading library</p>;
    }

    return (
        <PodcastListFolder
            items={libraryQuery.data || []}
            onItemDelete={handleDelete}
            isLoading={libraryQuery.isLoading}
        />
    );
};

export default PodcastLibraryGrid;
