import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import clsx from 'clsx';
import { ChevronDownIcon } from 'lucide-react';
import type { LibraryItem } from '../types/spotify-api';
import { PodcastListCard } from './podcast-list-card';

interface PodcastListFolderProps {
    items: LibraryItem[];
    isLoading: boolean;
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
        <div
            className={`w-full max-h-11/12 overflow-auto rounded-md border border-white/60 px-2 ${clsx(props.isLoading && 'h-[80%]')}`}
        >
            {props.isLoading && (
                <div className="w-full h-full flex items-center justify-center">
                    <b>Loading Library</b>
                </div>
            )}
            {Array.from(items.entries()).map(([libraryName, items], idx) => (
                <Disclosure
                    key={libraryName}
                    as="div"
                    className="w-full lg:p-4 lg:pl-8 p-2 pl-4 border-b border-white/40 relative"
                    defaultOpen={idx === 0}
                >
                    <DisclosureButton className="group flex w-full items-center justify-between h-8 m-1 sticky top-0 right-0 bg-[var(--bg-color)]">
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
