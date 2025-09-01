'use client';

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  return (
    <header className="flex text-black items-center justify-between bg-white shadow px-4 py-5">
      {/* Sidebar toggle button (mobile only) */}
      <button
        className="lg:hidden p-2 rounded hover:bg-gray-200 text-2xl"
        onClick={toggleSidebar}>
        ☰
      </button>

      <h1 className="text-lg font-semibold">Dashboard Header</h1>
      <div>User Menu</div>
    </header>
  );
}
