import {
  ChevronLeft,
  ChevronRight,
  Folder,
  FolderOpen,
  Loader2,
  Menu,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Image {
  id: string;
  name: string;
  thumbnailLink: string;
  webContentLink: string;
}

interface Subfolder {
  id: string;
  name: string;
  files: Image[];
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
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // Detect if we're on mobile
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Handle screen resize
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);

      // Auto-collapse sidebar on mobile
      if (window.innerWidth < 768) {
        setCollapsed(true);
        setMobileOpen(false);
      } else {
        setCollapsed(false);
      }
    };

    // Check initially
    checkIsMobile();

    // Add event listener
    window.addEventListener('resize', checkIsMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const handleFolderClick = (subfolder: Subfolder) => {
    onSelectSubfolder(subfolder);
    // Close sidebar automatically on mobile after selection
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Color palette
  const colors = {
    primary: '#5b8382',
    dark: '#080e1d',
    accent: '#65fbda',
    secondary: '#8e6c54',
    lightAccent: 'rgba(101, 251, 218, 0.1)',
  };

  // Mobile toggle button - fixed position
  const MobileToggle = () => (
    <button
      onClick={toggleSidebar}
      className="md:hidden fixed z-20 bottom-4 left-4 p-3 rounded-full shadow-lg"
      style={{ backgroundColor: colors.primary, color: colors.accent }}
      aria-label="Toggle Sidebar"
    >
      {mobileOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );

  // Sidebar content
  const SidebarContent = () => (
    <div
      className={`
        fixed top-0 left-0 z-10 h-full transition-all duration-300
        md:static md:block mt-12 pt-3 pl-5
        ${isMobile ? (mobileOpen ? 'translate-x-0' : '-translate-x-full') : ''}
        ${!isMobile && collapsed ? 'w-16' : 'w-64'}
      `}
      style={{ backgroundColor: colors.dark, color: 'white' }}
    >
      <div
        className="p-4 flex justify-between items-center border-b"
        style={{ borderColor: `${colors.primary}50` }}
      >
        <h3
          className={`font-semibold ${
            collapsed && !isMobile ? 'hidden' : 'block'
          }`}
          style={{ color: colors.accent }}
        >
          Galleries
        </h3>
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-opacity-20 lg:hidden"
            style={{
              color: colors.accent,
              backgroundColor: `${colors.accent}10`,
            }}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        )}
      </div>
      <div className="overflow-y-auto h-[calc(100%-64px)]">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2
              className="animate-spin w-6 h-6"
              style={{ color: colors.accent }}
            />
          </div>
        ) : (
          <ul className="py-2">
            {subfolders.map((subfolder) => (
              <li key={subfolder.id} className="px-2 py-1">
                <button
                  onClick={() => handleFolderClick(subfolder)}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg flex items-center
                    transition-all duration-200
                  `}
                  style={{
                    backgroundColor:
                      selectedSubfolder?.id === subfolder.id
                        ? colors.lightAccent
                        : 'transparent',
                    color:
                      selectedSubfolder?.id === subfolder.id
                        ? colors.accent
                        : 'white',
                  }}
                >
                  {selectedSubfolder?.id === subfolder.id ? (
                    <FolderOpen
                      size={20}
                      className="mr-2 flex-shrink-0"
                      style={{ color: colors.accent }}
                    />
                  ) : (
                    <Folder
                      size={20}
                      className="mr-2 flex-shrink-0"
                      style={{ color: colors.secondary }}
                    />
                  )}
                  <span
                    className={`truncate ${
                      collapsed && !isMobile ? 'hidden' : 'block'
                    }`}
                  >
                    {subfolder.name}
                  </span>
                  {collapsed &&
                    !isMobile &&
                    selectedSubfolder?.id === subfolder.id && (
                      <span
                        className="w-2 h-2 rounded-full ml-1"
                        style={{ backgroundColor: colors.accent }}
                      ></span>
                    )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  return (
    <>
      <MobileToggle />
      <SidebarContent />

      {/* Overlay for mobile */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-0"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
