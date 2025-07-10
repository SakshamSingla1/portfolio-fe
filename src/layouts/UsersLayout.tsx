import React from 'react';
import Navbar from '../components/common/Navbar/Navbar';
import { Outlet } from 'react-router-dom';

const UsersLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default UsersLayout;
