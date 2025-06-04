import React from 'react';

import { getLibrary, removeFromLibrary } from '../api/podcast';
import { type LibraryItem } from '../types/spotify-api';
import { useQuery } from '@tanstack/react-query';

import { ChevronDownIcon, Trash } from 'lucide-react';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';

const PodcastLibraryGrid: React.FC = () => {
    const libraryQuery = useQuery({
        queryKey: ['library'],
        queryFn: () => getLibrary(),
    });

    const handleDelete = async (item: LibraryItem) => {
        removeFromLibrary(item.podcast_id).then(() => {
            // Refetch the library data after deletion
            libraryQuery.refetch();
        });
        // TODO: Handle error case
    };

    if (libraryQuery.isLoading || libraryQuery.isFetching || libraryQuery.isPending) {
        return <p className="text-center text-xl">Loading library...</p>;
    }

    if (libraryQuery.isError) {
        return <p className="text-red-500">Error loading library</p>;
    }

    return (
        // <div className="flex flex-col items-center justify-start gap-2 w-full h-full overflow-x-auto">
        //     {libraryQuery.data?.map(item => (
        //         <PodcastListCard key={item.podcast_id} item={item} onDelete={handleDelete} />
        //     ))}
        // </div>
        <PodcastListFolder items={libraryQuery.data || []} onItemDelete={handleDelete} />
    );
};

interface PodcastListFolderProps {
    items: LibraryItem[];
    onItemDelete: (item: LibraryItem) => void;
}

export const PodcastListFolder = (props: PodcastListFolderProps) => {
    const items = props.items.reduce((acc, item) => {
        if (acc.has(item.library_name)) {
            acc.get(item.library_name)?.push(item);
        } else {
            acc.set(item.library_name, [item]);
        }
        return acc;
    }, new Map<string, LibraryItem[]>());

    return (
        <div className="h-full w-full rounded-md border border-white/60 px-2">
            {Array.from(items.entries()).map(([libraryName, items], idx) => (
                <Disclosure
                    key={libraryName}
                    as="div"
                    className="w-full lg:p-4 lg:pl-8 p-2 pl-4 border-b border-white/40 "
                    defaultOpen={idx === 0}
                >
                    <DisclosureButton className="group flex w-full items-center justify-between pb-4">
                        <span className="text-sm/6 font-bold text-white group-data-hover:text-white/80">
                            {libraryName.toUpperCase()}
                        </span>
                        <ChevronDownIcon className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
                    </DisclosureButton>
                    <DisclosurePanel>
                        <div className="flex flex-col items-center justify-start gap-2 w-full h-full overflow-x-auto">
                            {items.map(item => (
                                <PodcastListCard
                                    key={item.podcast_id}
                                    item={item}
                                    onDelete={props.onItemDelete}
                                />
                            ))}
                        </div>
                    </DisclosurePanel>
                </Disclosure>
            ))}
        </div>
    );
};

interface PodcastListCardProps {
    item: LibraryItem;
    onDelete: (item: LibraryItem) => void;
}

export const PodcastListCard = ({ item, onDelete }: PodcastListCardProps) => {
    return (
        <div className="flex flex-row items-center gap-2 p-2 border-b border-white/10 w-full">
            <div
                id="image-miniature"
                className="flex items-center gap-2 flex-basis-[50px] box-border shrink-0"
            >
                <img
                    src={item.podcast_info?.images?.[0]?.url}
                    alt={item.podcast_info?.name}
                    width="40"
                    height="40"
                />
            </div>
            <div className="flex grow shrink items-start py-2 gap-2 whitespace-pre overflow-x-hidden">
                <strong>{item.podcast_info?.name}</strong>
                <span>-</span>
                <span className="text-ellipsis">{item.podcast_info?.publisher}</span>
            </div>
            <div className="flex items-center justify-end shrink-0">
                <button
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => onDelete(item)}
                >
                    <Trash className="h-[30px]" />
                </button>
            </div>
        </div>
    );
};

export default PodcastLibraryGrid;
