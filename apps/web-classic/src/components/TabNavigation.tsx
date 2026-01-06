import { useState } from 'react';

type Tab = 'home' | 'music' | 'image';

interface TabNavigationProps {
    tab: Tab;
    onChange: (tab: Tab) => void;
}

export function TabNavigation({ tab, onChange }: TabNavigationProps) {
    return (
        <nav className="flex gap-1 p-2 bg-gray-900/50 backdrop-blur-sm border-b border-white/10">
            <TabButton
                active={tab === 'home'}
                onClick={() => onChange('home')}
                icon="🏠"
                label="Dashboard"
            />

            <TabButton
                active={tab === 'music'}
                onClick={() => onChange('music')}
                icon="🎵"
                label="Music Generator"
            />

            <TabButton
                active={tab === 'image'}
                onClick={() => onChange('image')}
                icon="🖼️"
                label="Image Creator"
            />
        </nav>
    );
}

interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    icon: string;
    label: string;
}

function TabButton({ active, onClick, icon, label }: TabButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
        ${active
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }
      `}
        >
            <span className="text-xl">{icon}</span>
            <span>{label}</span>
        </button>
    );
}

export function usePersistedTab(key: string, defaultTab: Tab = 'home'): [Tab, (tab: Tab) => void] {
    const [tab, setTabState] = useState<Tab>(() => {
        try {
            const saved = localStorage.getItem(key);
            return (saved as Tab) || defaultTab;
        } catch {
            return defaultTab;
        }
    });

    const setTab = (newTab: Tab) => {
        try {
            localStorage.setItem(key, newTab);
            setTabState(newTab);
        } catch {
            setTabState(newTab);
        }
    };

    return [tab, setTab];
}
