import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

export default function AppLayout() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Layout.Content
        style={{
          padding: '24px',
          maxWidth: 960,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <Outlet />
      </Layout.Content>
      <Footer />
    </Layout>
  );
}
