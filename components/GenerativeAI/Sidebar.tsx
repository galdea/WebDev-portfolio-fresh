'use client';

import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

interface Subfolder {
  id: string;
  name: string;
  files: any[];
}

interface SidebarProps {
  subfolders: Subfolder[];
  selectedSubfolder: Subfolder | null;
  onSelectSubfolder: (subfolder: Subfolder) => void;
  loading: boolean;
  onSelectFilms: () => void;
  selectedView: 'films' | 'folder';
}

export function Sidebar({
  subfolders,
  selectedSubfolder,
  onSelectSubfolder,
  loading,
  onSelectFilms,
  selectedView,
}: SidebarProps) {
  const colors = {
    primary: '#5b8382',
    dark: '#080e1d',
    accent: '#65fbda',
    secondary: '#8e6c54',
  };

  // Automatically select Films if no subfolders are available and not loading
  useEffect(() => {
    if (!loading && subfolders.length === 0 && selectedView !== 'films') {
      onSelectFilms();
    }
  }, [loading, subfolders, selectedView, onSelectFilms]);

  return (
    <div
      className="w-64 h-screen overflow-y-auto p-4 border-r"
      style={{
        backgroundColor: colors.dark,
        borderColor: `${colors.accent}30`,
      }}
    >
      <h2
        className="text-xl font-semibold mb-4"
        style={{ color: colors.accent }}
      >
        Folders
      </h2>

      {/* Static Films Folder */}
      <ul
        className="space-y-2 mb-4"
        style={{
          backgroundColor:
            selectedView === 'films' ? `${colors.accent}20` : 'transparent',
          color: selectedView === 'films' ? colors.accent : 'white',
        }}
        onClick={onSelectFilms}
      >
        <li
          className={`p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-opacity-20 ${
            selectedView === 'films' ? 'bg-opacity-20' : 'bg-opacity-0'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="truncate">🎬 Films</span>
          </div>
        </li>
      </ul>

      {/* Dynamic Folders */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2
            className="animate-spin w-6 h-6"
            style={{ color: colors.accent }}
          />
        </div>
      ) : (
        <ul className="space-y-2">
          {subfolders.map((subfolder) => (
            <li
              key={subfolder.id}
              className={`p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-opacity-20 ${
                selectedSubfolder?.id === subfolder.id &&
                selectedView === 'folder'
                  ? 'bg-opacity-20'
                  : 'bg-opacity-0'
              }`}
              style={{
                backgroundColor:
                  selectedSubfolder?.id === subfolder.id &&
                  selectedView === 'folder'
                    ? `${colors.accent}20`
                    : 'transparent',
                color:
                  selectedSubfolder?.id === subfolder.id &&
                  selectedView === 'folder'
                    ? colors.accent
                    : 'white',
              }}
              onClick={() => onSelectSubfolder(subfolder)}
            >
              <div className="flex items-center justify-between">
                <span className="truncate">{subfolder.name}</span>
                <span className="text-sm opacity-70">
                  {subfolder.files.length}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
