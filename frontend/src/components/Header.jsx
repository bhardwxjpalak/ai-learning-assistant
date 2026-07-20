function Header() {
  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-8">

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Kortex AI
        </h1>

        <p className="text-sm text-gray-500">
          Enterprise Knowledge Intelligence Platform
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500"></div>

        <span className="text-sm text-gray-500">
          AI Service Online
        </span>
      </div>

    </header>
  );
}

export default Header;