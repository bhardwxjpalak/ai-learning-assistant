function Header() {
  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-8">

      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          AI Learning Assistant
        </h1>

        <p className="text-sm text-gray-500">
          Learn from your uploaded documents
        </p>
      </div>

      <div className="text-sm text-gray-500">
        Backend Connected
      </div>

    </header>
  );
}

export default Header;