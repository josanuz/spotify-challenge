// this provides a view component for displaying detailed information about a podcast.
// It includes the podcast's image, name, publisher, description, languages, total episodes, and explicit content status.
import type { SpotifyPodcast } from '../types/spotify-api';

/**
 * Props interface for the PodcastDetails component.
 * @property podcast - The SpotifyPodcast object containing details about the podcast.
 */
export interface PodcastDetailsProps {
    podcast: SpotifyPodcast;
}

/**
 * PodcastDetails component for displaying detailed information about a podcast.
 * this component renders the podcast's image, name, publisher, description, languages, total episodes, and explicit content status.
 * @param {PodcastDetailsProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered component.
 */
export const PodcastDetails = ({ podcast }: PodcastDetailsProps) => {
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
                <p
                    className="text-sm grow text-gray-700 whitespace-pre-line overflow-auto"
                    dangerouslySetInnerHTML={{
                        __html: podcast.html_description || podcast.description,
                    }}
                />

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
