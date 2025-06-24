import { Trash } from 'lucide-react';
import type { LibraryItem } from '../types/spotify-api';

interface PodcastListCardProps {
    item: LibraryItem;
    onDelete: (item: LibraryItem) => void;
}

export const PodcastListCard = ({ item, onDelete }: PodcastListCardProps) => {
    if (item.podcast_info == null)
        return <div className="w-full h-[40px]">No Item Information</div>;

    return (
        <div className="flex flex-row items-center gap-2 p-2 border-b border-white/10 w-full">
            <div
                id="image-miniature"
                className="flex items-center gap-2 flex-basis-[50px] box-border shrink-0"
            >
                <img
                    src={item.podcast_info.images?.[0]?.url}
                    alt={item.podcast_info.name}
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
                    aria-label={`remove ${item.podcast_id}`}
                    onClick={() => onDelete(item)}
                >
                    <Trash className="h-[30px]" />
                </button>
            </div>
        </div>
    );
};
