'use client';

import { Loader2 } from 'lucide-react';

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
}

export function Sidebar({
  subfolders,
  selectedSubfolder,
  onSelectSubfolder,
  loading,
}: SidebarProps) {
  const colors = {
    primary: '#8e6c54',
    dark: '#080e1d',
    accent: '#65fbda',
    secondary: '#5b8382',
  };

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
        Projects
      </h2>
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
                selectedSubfolder?.id === subfolder.id
                  ? 'bg-opacity-20'
                  : 'bg-opacity-0'
              }`}
              style={{
                color:
                  selectedSubfolder?.id === subfolder.id
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
