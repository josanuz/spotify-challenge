/**
 * React component to display a grid of podcasts with options to add or view details.
 * It shows a list of podcasts with their cover images, titles, publishers, and descriptions.
 * Users can add podcasts to their library or view more details about them.
 * If a podcast is already in the user's library, it shows a checkmark instead of the add button.
 */
import { Check, Plus, View } from 'lucide-react';
import type { SpotifyPodcast } from '../types/spotify-api';
import type { LibraryItem } from '../types/spotify-api';

/**
 * Props interface for the PodcastGrid component.
 * @property podcasts - An array of SpotifyPodcast objects to display.
 * @property library - An array of LibraryItem objects representing the user's podcast library.
 * @property onAdd - Optional callback function to handle adding a podcast to the library.
 * @property onView - Optional callback function to handle viewing podcast details.
 */
type Props = {
    podcasts: SpotifyPodcast[];
    library: LibraryItem[];
    onAdd?: (podcast: SpotifyPodcast) => void;
    onView?: (podcast: SpotifyPodcast) => void;
};

export default function PodcastGrid({ podcasts, onAdd, onView, library }: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            {podcasts.map(podcast => (
                <div
                    key={podcast.id}
                    className="relative bg-white rounded-xl shadow-lg overflow-hidden transition hover:shadow-xl hover:scale-105"
                >
                    <img
                        src={podcast.images[0]?.url}
                        alt={podcast.name}
                        className="w-full h-48 object-cover"
                    />
                    <button
                        onClick={() => onView?.(podcast)}
                        className="absolute top-2 right-12 bg-teal-600 hover:bg-teal-700 text-white rounded-full p-2 shadow-md transition"
                        aria-label={`View ${podcast.name}`}
                    >
                        <View size={20} />
                    </button>
                    {/* If the items is in library, show a blue check otherwise check add button */}
                    {library.some(item => item.podcast_id === podcast.id) ? (
                        <span
                            className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-2 shadow-md"
                            aria-label={`${podcast.name} is on library`}
                        >
                            <Check size={20} />
                        </span>
                    ) : (
                        <button
                            onClick={() => onAdd?.(podcast)}
                            className="absolute top-2 right-2 bg-green-600 hover:bg-green-700 text-white rounded-full p-2 shadow-md transition"
                            aria-label={`Add ${podcast.name}`}
                        >
                            <Plus size={20} />
                        </button>
                    )}

                    <div className="p-4">
                        <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">
                            {podcast.name}
                        </h2>
                        <p className="text-sm text-green-600 font-medium line-clamp-1">
                            {podcast.publisher}
                        </p>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                            {podcast.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
