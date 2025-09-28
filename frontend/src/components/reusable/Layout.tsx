import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <header className="bg-primary text-primary-foreground p-4">
        <h1 className="inline text-2xl font-bold text-gray-800 pl-4 rounded-2xl bg-gray-50 overflow-hidden">Hamro<span className='text-pink-600 bg-pink-50 pr-4 rounded-tr-2xl rounded-br-2xl pl-1'>Menu</span></h1>
      </header>
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;
