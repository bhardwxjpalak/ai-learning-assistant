import Sidebar from "./Sidebar";
import Header from "./Header";
function Layout({ children }) {
  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <Sidebar />
      

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <Header />

        {/* Page Content */}
        <div className="flex-1 p-6 bg-gray-100">
          {children}
        </div>

      </div>

    </div>
  );
}

export default Layout;