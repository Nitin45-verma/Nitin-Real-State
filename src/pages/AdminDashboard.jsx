import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '../utils/imageUrl';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ type: '', message: '' });

  // Property Modal States
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [submittingProperty, setSubmittingProperty] = useState(false);
  const [propertyForm, setPropertyForm] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    latitude: '',
    longitude: '',
    type: 'Apartment',
    contactInfo: '',
    sellerEmail: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [panoramaFile, setPanoramaFile] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: '', message: '' });
    }, 4000);
  };

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get('/api/admin/stats');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    }
  }, []);

  const fetchProperties = useCallback(async () => {
    try {
      const res = await axios.get('/api/admin/properties');
      if (res.data.success) {
        setProperties(res.data.properties);
      }
    } catch (err) {
      console.error('Failed to fetch properties:', err);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get('/api/admin/users');
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  }, []);

  const fetchInquiries = useCallback(async () => {
    try {
      const res = await axios.get('/api/admin/inquiries');
      if (res.data.success) {
        setInquiries(res.data.inquiries);
      }
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
    }
  }, []);

  const fetchContacts = useCallback(async () => {
    try {
      const res = await axios.get('/api/admin/contacts');
      if (res.data.success) {
        setContacts(res.data.contacts);
      }
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await axios.get('/api/admin/transactions');
      if (res.data.success) {
        setTransactions(res.data.transactions);
      }
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await axios.get('/api/admin/bookings');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    }
  }, []);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchStats(),
      fetchProperties(),
      fetchUsers(),
      fetchInquiries(),
      fetchContacts(),
      fetchTransactions(),
      fetchBookings()
    ]);
    setLoading(false);
  }, [fetchStats, fetchProperties, fetchUsers, fetchInquiries, fetchContacts, fetchTransactions, fetchBookings]);

  useEffect(() => {
    let isMounted = true;
    const initData = async () => {
      await loadAllData();
    };
    if (isMounted) {
      initData();
    }
    return () => { isMounted = false; };
  }, [loadAllData]);

  // Modal Control Helpers
  const openAddPropertyModal = () => {
    setEditingProperty(null);
    setPropertyForm({
      title: '',
      description: '',
      price: '',
      location: '',
      latitude: '',
      longitude: '',
      type: 'Apartment',
      contactInfo: '',
      sellerEmail: ''
    });
    setImageFile(null);
    setPanoramaFile(null);
    setShowPropertyModal(true);
  };

  const openEditPropertyModal = (property) => {
    setEditingProperty(property);
    setPropertyForm({
      title: property.title || '',
      description: property.description || '',
      price: property.price || '',
      location: property.location || '',
      latitude: property.latitude || '',
      longitude: property.longitude || '',
      type: property.type || 'Apartment',
      contactInfo: property.contactInfo || '',
      sellerEmail: property.user_id?.email || ''
    });
    setImageFile(null);
    setPanoramaFile(null);
    setShowPropertyModal(true);
  };

  const handlePropertySubmit = async (e) => {
    e.preventDefault();
    setSubmittingProperty(true);
    try {
      const formData = new FormData();
      formData.append('title', propertyForm.title);
      formData.append('description', propertyForm.description);
      formData.append('price', propertyForm.price);
      formData.append('location', propertyForm.location);
      formData.append('type', propertyForm.type);
      formData.append('contactInfo', propertyForm.contactInfo);
      if (propertyForm.latitude) formData.append('latitude', propertyForm.latitude);
      if (propertyForm.longitude) formData.append('longitude', propertyForm.longitude);
      
      if (propertyForm.sellerEmail) {
        formData.append('sellerEmail', propertyForm.sellerEmail);
      }
      if (imageFile) {
        formData.append('image', imageFile);
      }
      if (panoramaFile) {
        formData.append('panoramaImage', panoramaFile);
      }

      let res;
      if (editingProperty) {
        res = await axios.put(`/api/admin/properties/${editingProperty._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await axios.post('/api/admin/properties', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (res.data.success) {
        showNotification('success', res.data.message);
        setShowPropertyModal(false);
        fetchProperties();
        fetchUsers();
        fetchStats();
      }
    } catch (err) {
      showNotification('danger', err.response?.data?.error || 'Failed to save property details');
    } finally {
      setSubmittingProperty(false);
    }
  };

  // Admin User Verification Actions (Verify / Cancel Request)
  const handleSetVerifyUser = async (userId, isVerified) => {
    try {
      const res = await axios.put(`/api/admin/users/${userId}/verify`, { isVerified });
      if (res.data.success) {
        showNotification(isVerified ? 'success' : 'warning', res.data.message);
        fetchUsers();
        fetchStats();
      }
    } catch (err) {
      showNotification('danger', err.response?.data?.error || 'Failed to update user verification status');
    }
  };

  // Admin Actions
  const handleToggleVerification = async (id, currentStatus) => {
    try {
      await axios.put(`/api/properties/verify/${id}`, { isVerified: !currentStatus });
      fetchProperties();
      showNotification('success', 'Property verification status updated successfully!');
    } catch (error) {
      showNotification('danger', 'Failed to update property verification');
    }
  };

  const handleDeleteProperty = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the property "${title}"?`)) return;
    try {
      const res = await axios.delete(`/api/admin/properties/${id}`);
      if (res.data.success) {
        showNotification('success', `Property "${title}" deleted successfully.`);
        fetchProperties();
        fetchStats();
      }
    } catch (err) {
      showNotification('danger', err.response?.data?.error || 'Failed to delete property');
    }
  };

  const handleToggleApproveProperty = async (propertyId, isApproved, title) => {
    try {
      const res = await axios.put(`/api/admin/properties/${propertyId}/verify`, { isApproved });
      if (res.data.success) {
        showNotification(isApproved ? 'success' : 'warning', `Property "${title}" is now ${isApproved ? 'Approved & Live' : 'marked as Pending Verification'}.`);
        fetchProperties();
        fetchStats();
      }
    } catch (err) {
      showNotification('danger', err.response?.data?.error || 'Failed to update property approval status');
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      const res = await axios.put(`/api/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        showNotification('success', res.data.message);
        fetchUsers();
        fetchStats();
      }
    } catch (err) {
      showNotification('danger', err.response?.data?.error || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This will also remove their properties and inquiries.`)) return;
    try {
      const res = await axios.delete(`/api/admin/users/${userId}`);
      if (res.data.success) {
        showNotification('success', res.data.message);
        fetchUsers();
        fetchProperties();
        fetchInquiries();
        fetchStats();
      }
    } catch (err) {
      showNotification('danger', err.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Delete this inquiry record?')) return;
    try {
      const res = await axios.delete(`/api/admin/inquiries/${id}`);
      if (res.data.success) {
        showNotification('success', 'Inquiry deleted successfully.');
        fetchInquiries();
        fetchStats();
      }
    } catch (err) {
      showNotification('danger', err.response?.data?.error || 'Failed to delete inquiry');
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Delete this contact message?')) return;
    try {
      const res = await axios.delete(`/api/admin/contacts/${id}`);
      if (res.data.success) {
        showNotification('success', 'Contact message deleted successfully.');
        fetchContacts();
        fetchStats();
      }
    } catch (err) {
      showNotification('danger', err.response?.data?.error || 'Failed to delete contact message');
    }
  };

  // Search Filters
  const filteredProperties = properties.filter(p =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.user_id?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInquiries = inquiries.filter(i =>
    i.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.property_id?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredContacts = contacts.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = transactions.filter(t =>
    t.user_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.property_id?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBookings = bookings.filter(b =>
    b.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.propertyTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      const res = await axios.put(`/api/admin/bookings/${id}/status`, { status });
      if (res.data.success) {
        showNotification('success', `Booking status updated to "${status}".`);
        fetchBookings();
      }
    } catch (err) {
      showNotification('danger', err.response?.data?.error || 'Failed to update booking status');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Delete this booking record?')) return;
    try {
      const res = await axios.delete(`/api/admin/bookings/${id}`);
      if (res.data.success) {
        showNotification('success', 'Booking deleted.');
        fetchBookings();
      }
    } catch (err) {
      showNotification('danger', err.response?.data?.error || 'Failed to delete booking');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 admin-portal-bg text-light">
        <div className="spinner-border text-warning me-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
        <span className="fs-4 fw-semibold text-gold-gradient">Loading Admin Control Center...</span>
      </div>
    );
  }

  return (
    <div className="min-vh-100 admin-portal-bg text-light pb-5" style={{ paddingTop: '100px' }}>
      <div className="container-fluid px-lg-5">

        {/* Top Header Banner */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom border-secondary border-opacity-50">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge badge-glow-gold px-3 py-1 rounded-pill text-uppercase fw-bold">Admin Portal</span>
              <span className="badge bg-success bg-opacity-20 text-success border border-success border-opacity-30 rounded-pill px-2 py-1 small">
                <i className="bi bi-circle-fill me-1 small"></i> System Active
              </span>
            </div>
            <h1 className="fw-bold mb-1 text-gold-gradient display-5">System Control Center</h1>
            <p className="text-slate-light mb-0">Overview of estate listings, client user accounts, seller verification & revenue logs</p>
          </div>
          <div className="mt-3 mt-md-0 d-flex gap-2">
            <button onClick={loadAllData} className="btn btn-outline-warning rounded-pill px-3 py-2 btn-sm fw-semibold">
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh Data
            </button>
            <button onClick={openAddPropertyModal} className="btn btn-warning rounded-pill px-4 py-2 btn-sm fw-bold shadow-sm">
              <i className="bi bi-plus-lg me-1"></i> Add Property
            </button>
          </div>
        </div>

        {/* Alert Banner */}
        <AnimatePresence>
          {notification.message && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className={`alert alert-${notification.type} border-0 shadow-lg rounded-4 mb-4 d-flex align-items-center`}
              role="alert"
            >
              <i className={`bi bi-${notification.type === 'success' ? 'check-circle-fill text-success' : 'exclamation-triangle-fill text-warning'} fs-4 me-3`}></i>
              <div className="fw-medium">{notification.message}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* KPI STATS GRID */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-xl-3">
            <motion.div whileHover={{ y: -4 }} className="glass-card rounded-4 p-4 h-100">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-uppercase text-slate-light fw-semibold small letter-spacing-1">Properties Listed</span>
                  <h2 className="fw-extrabold mb-1 mt-1 fs-1 text-warning">{stats?.totalProperties || 0}</h2>
                  <div className="small text-warning-emphasis fw-medium">
                    <i className="bi bi-houses me-1"></i>Active property listings
                  </div>
                </div>
                <div className="kpi-icon-wrapper kpi-gold">
                  <i className="bi bi-house-door-fill"></i>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <motion.div whileHover={{ y: -4 }} className="glass-card rounded-4 p-4 h-100">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-uppercase text-slate-light fw-semibold small letter-spacing-1">Registered Users</span>
                  <h2 className="fw-extrabold mb-1 mt-1 fs-1 text-info">{stats?.totalUsers || 0}</h2>
                  <div className="small text-info-emphasis fw-medium">
                    <i className="bi bi-people me-1"></i>{stats?.buyersCount || 0} Buyers | {stats?.sellersCount || 0} Sellers
                  </div>
                </div>
                <div className="kpi-icon-wrapper kpi-cyan">
                  <i className="bi bi-person-fill-gear"></i>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <motion.div whileHover={{ y: -4 }} className="glass-card rounded-4 p-4 h-100">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-uppercase text-slate-light fw-semibold small letter-spacing-1">Lead Inquiries</span>
                  <h2 className="fw-extrabold mb-1 mt-1 fs-1" style={{ color: '#60A5FA' }}>{stats?.totalInquiries || 0}</h2>
                  <div className="small text-primary-emphasis fw-medium">
                    <i className="bi bi-chat-left-dots me-1"></i>Property inquiries received
                  </div>
                </div>
                <div className="kpi-icon-wrapper kpi-blue">
                  <i className="bi bi-envelope-paper-fill"></i>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <motion.div whileHover={{ y: -4 }} className="glass-card rounded-4 p-4 h-100">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-uppercase text-slate-light fw-semibold small letter-spacing-1">Total Revenue</span>
                  <h2 className="fw-extrabold mb-1 mt-1 fs-1" style={{ color: '#34D399' }}>
                    ₹{stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : '0'}
                  </h2>
                  <div className="small text-success-emphasis fw-medium">
                    <i className="bi bi-receipt me-1"></i>{stats?.totalTransactions || 0} logged transactions
                  </div>
                </div>
                <div className="kpi-icon-wrapper kpi-emerald">
                  <i className="bi bi-cash-stack"></i>
                </div>
              </div>
            </motion.div>
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <motion.div whileHover={{ y: -4 }} className="glass-card rounded-4 p-4 h-100">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-uppercase text-slate-light fw-semibold small letter-spacing-1">Visit Bookings</span>
                  <h2 className="fw-extrabold mb-1 mt-1 fs-1" style={{ color: '#FB923C' }}>{stats?.totalBookings || 0}</h2>
                  <div className="small fw-medium" style={{ color: '#FB923C' }}>
                    <i className="bi bi-calendar2-check me-1"></i>Pending: {bookings.filter(b => b.status === 'Pending Verification').length}
                  </div>
                </div>
                <div className="kpi-icon-wrapper" style={{ background: 'rgba(251,146,60,0.12)', color: '#FB923C' }}>
                  <i className="bi bi-calendar2-week"></i>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tab Navigation & Search Bar */}
        <div className="glass-tab-nav rounded-4 p-2 mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <ul className="nav nav-pills gap-1 flex-nowrap overflow-x-auto pb-1" style={{ WebkitOverflowScrolling: 'touch' }}>
            <li className="nav-item">
              <button 
                className={`nav-link rounded-pill px-4 py-2 fw-semibold transition-all text-nowrap ${activeTab === 'overview' ? 'bg-warning text-dark fw-bold shadow-sm' : 'text-light hover-bg-light'}`}
                onClick={() => setActiveTab('overview')}
              >
                <i className="bi bi-speedometer2 me-2"></i> Overview
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link rounded-pill px-4 py-2 fw-semibold transition-all text-nowrap ${activeTab === 'properties' ? 'bg-warning text-dark fw-bold shadow-sm' : 'text-light hover-bg-light'}`}
                onClick={() => setActiveTab('properties')}
              >
                <i className="bi bi-buildings me-2"></i> Properties ({properties.length})
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link rounded-pill px-4 py-2 fw-semibold transition-all text-nowrap ${activeTab === 'users' ? 'bg-warning text-dark fw-bold shadow-sm' : 'text-light hover-bg-light'}`}
                onClick={() => setActiveTab('users')}
              >
                <i className="bi bi-person-gear me-2"></i> Users ({users.length})
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link rounded-pill px-4 py-2 fw-semibold transition-all text-nowrap ${activeTab === 'inquiries' ? 'bg-warning text-dark fw-bold shadow-sm' : 'text-light hover-bg-light'}`}
                onClick={() => setActiveTab('inquiries')}
              >
                <i className="bi bi-chat-dots me-2"></i> Inquiries ({inquiries.length})
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link rounded-pill px-4 py-2 fw-semibold transition-all text-nowrap ${activeTab === 'contacts' ? 'bg-warning text-dark fw-bold shadow-sm' : 'text-light hover-bg-light'}`}
                onClick={() => setActiveTab('contacts')}
              >
                <i className="bi bi-envelope me-2"></i> Messages ({contacts.length})
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link rounded-pill px-4 py-2 fw-semibold transition-all text-nowrap ${activeTab === 'transactions' ? 'bg-warning text-dark fw-bold shadow-sm' : 'text-light hover-bg-light'}`}
                onClick={() => setActiveTab('transactions')}
              >
                <i className="bi bi-receipt me-2"></i> Transactions ({transactions.length})
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link rounded-pill px-4 py-2 fw-semibold transition-all text-nowrap position-relative ${activeTab === 'bookings' ? 'bg-warning text-dark fw-bold shadow-sm' : 'text-light hover-bg-light'}`}
                onClick={() => setActiveTab('bookings')}
              >
                <i className="bi bi-calendar2-check me-2"></i> Bookings ({bookings.length})
                {bookings.filter(b => b.status === 'Pending Verification').length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                    {bookings.filter(b => b.status === 'Pending Verification').length}
                  </span>
                )}
              </button>
            </li>
            <li className="nav-item">
              <button 
                onClick={() => setActiveTab('verification')} 
                className={`nav-link rounded-pill px-4 py-2 fw-semibold transition-all text-nowrap position-relative ${activeTab === 'verification' ? 'bg-warning text-dark fw-bold shadow-sm' : 'text-light hover-bg-light'}`}
              >
                <i className="bi bi-shield-check me-2"></i>Verification Desk
                {properties.filter(p => p.ownershipDocument && !p.isVerified).length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-dark" style={{fontSize: '0.65rem'}}>
                    {properties.filter(p => p.ownershipDocument && !p.isVerified).length}
                  </span>
                )}
              </button>
            </li>
          </ul>

          {activeTab !== 'overview' && (
            <div className="input-group input-group-sm max-w-xs me-2" style={{ maxWidth: '260px' }}>
              <span className="input-group-text bg-dark border-secondary text-slate-light">
                <i className="bi bi-search"></i>
              </span>
              <input 
                type="text" 
                className="form-control bg-dark text-light border-secondary shadow-none px-3 py-2" 
                placeholder="Search items..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="row g-4">
            <div className="col-12 col-lg-6">
              <div className="glass-card rounded-4 p-4 h-100">
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom border-secondary border-opacity-40 pb-3">
                  <h5 className="fw-bold mb-0 text-gold-gradient"><i className="bi bi-clock-history me-2 text-warning"></i>Recent Properties</h5>
                  <button onClick={() => setActiveTab('properties')} className="btn btn-link text-warning text-decoration-none p-0 small fw-semibold">View All →</button>
                </div>
                {stats?.recentProperties?.length > 0 ? (
                  <div className="d-flex flex-column gap-3">
                    {stats.recentProperties.map(p => (
                      <div key={p._id} className="p-3 rounded-3 bg-dark bg-opacity-40 border border-secondary border-opacity-30 d-flex align-items-center justify-content-between gap-3">
                        <div className="d-flex align-items-center gap-3 min-w-0 flex-grow-1 overflow-hidden">
                          <div className="bg-warning bg-opacity-10 p-2 rounded-3 text-warning flex-shrink-0">
                            <i className="bi bi-building fs-4"></i>
                          </div>
                          <div className="min-w-0 flex-grow-1 overflow-hidden">
                            <div className="fw-bold text-white text-truncate" title={p.title} style={{ color: '#ffffff !important' }}>{p.title}</div>
                            <small className="text-slate-light d-block text-truncate" style={{ color: '#9ca3af !important' }}><i className="bi bi-geo-alt me-1 text-warning"></i>{p.location}</small>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2 flex-shrink-0 ms-2">
                          <span className="badge badge-glow-gold px-3 py-2 fs-6 rounded-pill text-nowrap">₹{p.price?.toLocaleString()}</span>
                          <button onClick={() => openEditPropertyModal(p)} className="btn btn-outline-warning btn-sm rounded-circle flex-shrink-0" title="Edit Property" style={{ width: '36px', height: '36px', minWidth: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="bi bi-pencil-square fs-6"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5 text-slate-light">No properties listed yet.</div>
                )}
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="glass-card rounded-4 p-4 h-100">
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom border-secondary border-opacity-40 pb-3">
                  <h5 className="fw-bold mb-0 text-info"><i className="bi bi-person-plus-fill me-2"></i>Newest System Users</h5>
                  <button onClick={() => setActiveTab('users')} className="btn btn-link text-info text-decoration-none p-0 small fw-semibold">Manage Users →</button>
                </div>
                {stats?.recentUsers?.length > 0 ? (
                  <div className="d-flex flex-column gap-3">
                    {stats.recentUsers.map(u => (
                      <div key={u._id} className="p-3 rounded-3 bg-dark bg-opacity-40 border border-secondary border-opacity-30 d-flex align-items-center justify-content-between gap-3">
                        <div className="d-flex align-items-center gap-3 min-w-0 flex-grow-1 overflow-hidden">
                          <div className="bg-info bg-opacity-10 p-2 rounded-circle text-info flex-shrink-0">
                            <i className="bi bi-person-circle fs-4"></i>
                          </div>
                          <div className="min-w-0 flex-grow-1 overflow-hidden">
                            <div className="fw-bold text-white text-truncate" title={u.name} style={{ color: '#ffffff !important' }}>{u.name}</div>
                            <small className="text-slate-light d-block text-truncate" style={{ color: '#9ca3af !important' }}>{u.email}</small>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2 flex-shrink-0 ms-2">
                          <span className={`badge ${u.role === 'Admin' ? 'badge-glow-admin' : u.role === 'Seller' ? 'badge-glow-seller' : 'badge-glow-buyer'} px-3 py-2 rounded-pill text-nowrap`}>
                            {u.role}
                          </span>
                          {u.role === 'Seller' && (
                            u.isVerified ? (
                              <button 
                                onClick={() => handleSetVerifyUser(u._id, false)}
                                className="btn btn-outline-danger btn-sm rounded-pill px-2 py-1 small text-nowrap"
                                title="Cancel Verification"
                              >
                                ✕ Cancel
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleSetVerifyUser(u._id, true)}
                                className="btn btn-success btn-sm rounded-pill px-2 py-1 fw-bold small text-nowrap"
                                title="Verify User"
                              >
                                ✓ Verify
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5 text-slate-light">No user accounts found.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PROPERTIES TAB */}
        {activeTab === 'properties' && (
          <div className="glass-card rounded-4 overflow-hidden border border-secondary border-opacity-50">
            <div className="p-3 bg-dark bg-opacity-50 border-bottom border-secondary d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold text-gold-gradient"><i className="bi bi-buildings me-2"></i>Property Listings Directory</h5>
              <button onClick={openAddPropertyModal} className="btn btn-warning btn-sm rounded-pill px-3 fw-bold">
                <i className="bi bi-plus-lg me-1"></i> Add Property
              </button>
            </div>
            <div className="table-responsive">
              <table className="table custom-table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Listing Info</th>
                    <th>Price</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Owner / Seller</th>
                    <th>Contact Info</th>
                    <th>Approval Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProperties.length > 0 ? (
                    filteredProperties.map(p => (
                      <tr key={p._id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            {p.image ? (
                              <img src={getImageUrl(p.image)} alt={p.title} className="rounded-3 shadow-sm" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                            ) : (
                              <div className="bg-dark bg-opacity-60 border border-secondary rounded-3 d-flex align-items-center justify-content-center text-warning" style={{ width: '50px', height: '50px' }}>
                                <i className="bi bi-house fs-4"></i>
                              </div>
                            )}
                            <div>
                              <div className="fw-bold text-light">{p.title}</div>
                              <small className="text-slate-light text-truncate d-block" style={{ maxWidth: '200px' }}>{p.description}</small>
                            </div>
                          </div>
                        </td>
                         <td className="fw-bold text-warning fs-6">₹{p.price?.toLocaleString()}</td>
                        <td><span className="badge badge-glow-gold px-3 py-1 rounded-pill">{p.type}</span></td>
                        <td><small className="text-slate-light"><i className="bi bi-geo-alt text-warning me-1"></i>{p.location}</small></td>
                        <td>
                          <div className="fw-semibold text-light">{p.user_id?.name || 'Unknown User'}</div>
                          <small className="text-slate-light">{p.user_id?.email}</small>
                        </td>
                        <td><small className="text-slate-light">{p.contactInfo}</small></td>
                        <td>
                          <span className={`badge ${p.isApproved ? 'bg-success bg-opacity-20 text-success border border-success' : 'bg-warning bg-opacity-20 text-warning border border-warning'} px-3 py-1 rounded-pill`}>
                            {p.isApproved ? '✓ Approved' : '⚠ Pending'}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="d-flex gap-2 justify-content-end">
                            <button 
                              onClick={() => handleToggleApproveProperty(p._id, !p.isApproved, p.title)}
                              className={`btn ${p.isApproved ? 'btn-outline-warning' : 'btn-success'} btn-sm rounded-circle p-2`}
                              title={p.isApproved ? 'Revoke Approval / Mark Pending' : 'Approve & List Property'}
                              style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <i className={`bi ${p.isApproved ? 'bi-x-circle-fill' : 'bi-check-circle-fill'} fs-6`}></i>
                            </button>
                            <button 
                              onClick={() => openEditPropertyModal(p)}
                              className="btn btn-outline-warning btn-sm rounded-circle p-2"
                              title="Edit Property Details"
                              style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <i className="bi bi-pencil-square fs-6"></i>
                            </button>
                            <button 
                              onClick={() => handleDeleteProperty(p._id, p.title)}
                              className="btn btn-outline-danger btn-sm rounded-circle p-2"
                              title="Delete Property"
                              style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <i className="bi bi-trash fs-6"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-slate-light">No properties found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="glass-card rounded-4 overflow-hidden border border-secondary border-opacity-50">
            <div className="table-responsive">
              <table className="table custom-table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Role</th>
                    <th>Seller Verification Status</th>
                    <th>Verification Actions</th>
                    <th>Modify Role</th>
                    <th>Joined Date</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(u => (
                      <tr key={u._id}>
                        <td className="fw-bold text-light">
                          <i className="bi bi-person-circle text-warning me-2 fs-5"></i>
                          {u.name}
                        </td>
                        <td className="text-slate-light">{u.email}</td>
                        <td>
                          <span className={`badge ${u.role === 'Admin' ? 'badge-glow-admin' : u.role === 'Seller' ? 'badge-glow-seller' : 'badge-glow-buyer'} px-3 py-1 rounded-pill`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          {u.role === 'Seller' ? (
                            <span className={`badge ${u.isVerified ? 'bg-success bg-opacity-20 text-success border border-success' : 'bg-warning bg-opacity-20 text-warning border border-warning'} px-3 py-1 rounded-pill`}>
                              {u.isVerified ? '✓ Verified Seller' : '⚠ Pending Verification'}
                            </span>
                          ) : (
                            <span className="text-slate-light small">N/A (Non-Seller)</span>
                          )}
                        </td>
                        <td>
                          {u.role === 'Seller' ? (
                            <div className="d-flex align-items-center gap-2">
                              {!u.isVerified ? (
                                <button 
                                  onClick={() => handleSetVerifyUser(u._id, true)}
                                  className="btn btn-success btn-sm rounded-pill px-3 py-1 fw-bold shadow-sm d-inline-flex align-items-center gap-1"
                                  title="Verify and Approve Seller Email"
                                >
                                  <i className="bi bi-check-circle-fill"></i> Verify User
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleSetVerifyUser(u._id, false)}
                                  className="btn btn-outline-danger btn-sm rounded-pill px-3 py-1 fw-semibold d-inline-flex align-items-center gap-1"
                                  title="Cancel / Revoke Verification Request"
                                >
                                  <i className="bi bi-x-circle-fill"></i> Cancel Request
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-light small">-</span>
                          )}
                        </td>
                        <td>
                          <select 
                            className="form-select form-select-sm bg-dark text-light border-secondary py-1 rounded-3"
                            style={{ width: '130px' }}
                            value={u.role}
                            onChange={(e) => handleChangeRole(u._id, e.target.value)}
                          >
                            <option value="Buyer">Buyer</option>
                            <option value="Seller">Seller</option>
                            <option value="Admin">Admin</option>
                          </select>
                        </td>
                        <td><small className="text-slate-light">{new Date(u.createdAt).toLocaleDateString()}</small></td>
                        <td className="text-end">
                          <button 
                            onClick={() => handleDeleteUser(u._id, u.name)}
                            className="btn btn-outline-danger btn-sm rounded-circle p-2"
                            title="Delete User"
                          >
                            <i className="bi bi-trash fs-6"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-5 text-slate-light">No user accounts found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INQUIRIES TAB */}
        {activeTab === 'inquiries' && (
          <div className="glass-card rounded-4 overflow-hidden border border-secondary border-opacity-50">
            <div className="table-responsive">
              <table className="table custom-table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Buyer Name</th>
                    <th>Phone</th>
                    <th>Property Interested In</th>
                    <th>Inquiry Message</th>
                    <th>Seller Info</th>
                    <th>Date</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInquiries.length > 0 ? (
                    filteredInquiries.map(i => (
                      <tr key={i._id}>
                        <td className="fw-bold text-light">{i.name}</td>
                        <td><small className="text-slate-light"><i className="bi bi-telephone text-warning me-1"></i>{i.phone}</small></td>
                        <td>
                          <div className="fw-semibold text-warning">{i.property_id?.title || 'Property Unlisted'}</div>
                          {i.property_id?.location && (
                            <small className="text-slate-light">{i.property_id.location}</small>
                          )}
                        </td>
                        <td><small className="text-light">{i.message}</small></td>
                        <td>
                          <div className="fw-medium text-light">{i.seller_id?.name || 'N/A'}</div>
                          <small className="text-slate-light">{i.seller_id?.email}</small>
                        </td>
                        <td><small className="text-slate-light">{new Date(i.createdAt).toLocaleDateString()}</small></td>
                        <td className="text-end">
                          <button 
                            onClick={() => handleDeleteInquiry(i._id)}
                            className="btn btn-outline-danger btn-sm rounded-circle p-2"
                            title="Delete Inquiry"
                          >
                            <i className="bi bi-trash fs-6"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-slate-light">No buyer lead inquiries recorded yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CONTACT MESSAGES TAB */}
        {activeTab === 'contacts' && (
          <div className="glass-card rounded-4 overflow-hidden border border-secondary border-opacity-50">
            <div className="table-responsive">
              <table className="table custom-table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Sender Name</th>
                    <th>Email Address</th>
                    <th>Message Content</th>
                    <th>Date Received</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.length > 0 ? (
                    filteredContacts.map(c => (
                      <tr key={c._id}>
                        <td className="fw-bold text-light">{c.name}</td>
                        <td><a href={`mailto:${c.email}`} className="text-info text-decoration-none">{c.email}</a></td>
                        <td><small className="text-light">{c.message}</small></td>
                        <td><small className="text-slate-light">{new Date(c.createdAt).toLocaleDateString()}</small></td>
                        <td className="text-end">
                          <button 
                            onClick={() => handleDeleteContact(c._id)}
                            className="btn btn-outline-danger btn-sm rounded-circle p-2"
                            title="Delete Message"
                          >
                            <i className="bi bi-trash fs-6"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-5 text-slate-light">No contact messages received.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TRANSACTIONS TAB */}
        {activeTab === 'transactions' && (
          <div className="glass-card rounded-4 overflow-hidden border border-secondary border-opacity-50">
            <div className="table-responsive">
              <table className="table custom-table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>User</th>
                    <th>Property</th>
                    <th>Amount</th>
                    <th>Payment Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map(t => (
                      <tr key={t._id}>
                        <td><code className="text-warning small">{t._id}</code></td>
                        <td>
                          <div className="fw-semibold text-light">{t.user_id?.name || 'N/A'}</div>
                          <small className="text-slate-light">{t.user_id?.email}</small>
                        </td>
                        <td className="text-light">{t.property_id?.title || 'N/A'}</td>
                         <td className="fw-bold" style={{ color: '#34D399' }}>₹{t.amount?.toLocaleString()}</td>
                        <td>
                          <span className={`badge ${t.status === 'Success' ? 'bg-success bg-opacity-20 text-success border border-success' : t.status === 'Pending' ? 'bg-warning bg-opacity-20 text-warning border border-warning' : 'bg-danger bg-opacity-20 text-danger border border-danger'} px-3 py-1 rounded-pill`}>
                            {t.status}
                          </span>
                        </td>
                        <td><small className="text-slate-light">{new Date(t.createdAt).toLocaleDateString()}</small></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-slate-light">No financial transactions recorded yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === 'verification' && (
          <motion.div variants={staggerContainer} initial="initial" animate="animate" exit="exit" className="card card-luxury border-0 shadow-lg">
            <div className="card-header bg-gradient-dark text-white p-4 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold fs-4 d-flex align-items-center">
                <i className="bi bi-shield-check me-3 text-warning"></i>Document Verification Desk
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 custom-admin-table">
                  <thead className="table-light text-uppercase small text-muted">
                    <tr>
                      <th className="px-4 py-3">Property</th>
                      <th className="py-3">Seller</th>
                      <th className="py-3 text-center">Document</th>
                      <th className="py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.filter(p => p.ownershipDocument).length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-5 text-muted"><i className="bi bi-folder2-open display-4 d-block mb-3 opacity-50"></i>No properties with uploaded documents found.</td></tr>
                    ) : (
                      properties.filter(p => p.ownershipDocument).map(p => (
                        <motion.tr variants={fadeInUp} key={p._id}>
                          <td className="px-4 py-3">
                            <div className="d-flex align-items-center gap-3">
                              <img src={p.image ? `http://13.51.201.78:5000${p.image}` : "https://via.placeholder.com/50"} alt="Property" className="rounded-3 object-fit-cover shadow-sm border" style={{ width: '50px', height: '50px' }} />
                              <div>
                                <div className="fw-bold text-dark">{p.title}</div>
                                <div className="small text-muted"><i className="bi bi-geo-alt-fill me-1 text-warning"></i>{p.location}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="fw-semibold text-dark">{p.user_id?.name || 'Unknown'}</div>
                            <div className="small text-muted">{p.user_id?.email || 'No email'}</div>
                          </td>
                          <td className="py-3 text-center">
                            <a href={`http://13.51.201.78:5000${p.ownershipDocument}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-info rounded-pill px-3">
                              <i className="bi bi-eye-fill me-1"></i> View Document
                            </a>
                          </td>
                          <td className="py-3 text-center">
                            {p.isVerified ? (
                              <span className="badge bg-success rounded-pill px-3 py-1 fw-semibold"><i className="bi bi-check-circle-fill me-1"></i>Verified</span>
                            ) : (
                              <span className="badge bg-warning text-dark rounded-pill px-3 py-1 fw-semibold"><i className="bi bi-hourglass-split me-1"></i>Pending</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-end">
                            <button 
                              onClick={() => handleToggleVerification(p._id, p.isVerified)} 
                              className={`btn btn-sm rounded-pill px-3 ${p.isVerified ? 'btn-danger' : 'btn-success'}`}
                            >
                              {p.isVerified ? <><i className="bi bi-x-circle me-1"></i>Revoke</> : <><i className="bi bi-check2-all me-1"></i>Approve</>}
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'bookings' && (
          <div className="glass-card rounded-4 p-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h5 className="fw-bold mb-0 text-gold-gradient">
                <i className="bi bi-calendar2-check me-2 text-warning"></i>Visit Bookings
              </h5>
              <span className="badge rounded-pill px-3 py-2" style={{ background: 'rgba(251,146,60,0.15)', color: '#FB923C', border: '1px solid rgba(251,146,60,0.3)' }}>
                {bookings.filter(b => b.status === 'Pending Verification').length} Pending
              </span>
            </div>
            {filteredBookings.length === 0 ? (
              <div className="text-center py-5 text-slate-light">
                <i className="bi bi-calendar-x" style={{ fontSize: '2.5rem', opacity: 0.4 }}></i>
                <p className="mt-3">No visit bookings found.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <thead>
                    <tr style={{ borderColor: 'rgba(212,175,55,0.2)' }}>
                      <th className="text-warning fw-bold small text-uppercase">Buyer</th>
                      <th className="text-warning fw-bold small text-uppercase">Phone</th>
                      <th className="text-warning fw-bold small text-uppercase">Property</th>
                      <th className="text-warning fw-bold small text-uppercase">Date</th>
                      <th className="text-warning fw-bold small text-uppercase">Slot</th>
                      <th className="text-warning fw-bold small text-uppercase">Status</th>
                      <th className="text-warning fw-bold small text-uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((b) => (
                      <tr key={b._id} style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                        <td className="fw-semibold text-white">{b.buyerName}</td>
                        <td className="text-slate-light">{b.phone}</td>
                        <td className="text-slate-light" style={{ maxWidth: '160px' }}>
                          <div className="text-truncate" title={b.propertyTitle || b.propertyId?.title}>
                            {b.propertyTitle || b.propertyId?.title || '—'}
                          </div>
                          {b.propertyId?.location && (
                            <small className="text-warning opacity-75"><i className="bi bi-geo-alt me-1"></i>{b.propertyId.location}</small>
                          )}
                        </td>
                        <td className="text-slate-light text-nowrap">
                          <i className="bi bi-calendar3 me-1 text-warning"></i>
                          {new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td>
                          <span className="badge rounded-pill px-3 py-1" style={{
                            background: b.slot === 'Morning' ? 'rgba(251,191,36,0.15)' : 'rgba(99,102,241,0.15)',
                            color: b.slot === 'Morning' ? '#FCD34D' : '#A5B4FC',
                            border: `1px solid ${b.slot === 'Morning' ? 'rgba(251,191,36,0.3)' : 'rgba(99,102,241,0.3)'}`
                          }}>
                            <i className={`bi ${b.slot === 'Morning' ? 'bi-sunrise' : 'bi-sunset'} me-1`}></i>
                            {b.slot}
                          </span>
                        </td>
                        <td>
                          {b.status === 'Pending Verification' && (
                            <span className="badge rounded-pill px-3 py-1 fw-semibold" style={{ background: 'rgba(251,146,60,0.15)', color: '#FB923C', border: '1px solid rgba(251,146,60,0.35)', animation: 'pulseGlow 2s infinite' }}>
                              ⏳ Pending
                            </span>
                          )}
                          {b.status === 'Confirmed' && (
                            <span className="badge rounded-pill px-3 py-1 fw-semibold" style={{ background: 'rgba(34,197,94,0.12)', color: '#4ADE80', border: '1px solid rgba(34,197,94,0.3)' }}>
                              ✅ Confirmed
                            </span>
                          )}
                          {b.status === 'Cancelled' && (
                            <span className="badge rounded-pill px-3 py-1 fw-semibold" style={{ background: 'rgba(239,68,68,0.1)', color: '#F87171', border: '1px solid rgba(239,68,68,0.3)' }}>
                              ❌ Cancelled
                            </span>
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-1 flex-wrap">
                            {b.status !== 'Confirmed' && (
                              <button
                                className="btn btn-sm btn-outline-success rounded-pill px-2 py-1"
                                style={{ fontSize: '0.72rem' }}
                                onClick={() => handleUpdateBookingStatus(b._id, 'Confirmed')}
                                title="Confirm booking"
                              >
                                <i className="bi bi-check-lg me-1"></i>Confirm
                              </button>
                            )}
                            {b.status !== 'Cancelled' && (
                              <button
                                className="btn btn-sm btn-outline-warning rounded-pill px-2 py-1"
                                style={{ fontSize: '0.72rem' }}
                                onClick={() => handleUpdateBookingStatus(b._id, 'Cancelled')}
                                title="Cancel booking"
                              >
                                <i className="bi bi-x-lg me-1"></i>Cancel
                              </button>
                            )}
                            <button
                              className="btn btn-sm btn-outline-danger rounded-pill px-2 py-1"
                              style={{ fontSize: '0.72rem' }}
                              onClick={() => handleDeleteBooking(b._id)}
                              title="Delete booking"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Property Add/Edit Modal */}
      <AnimatePresence>
        {showPropertyModal && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="modal-content glass-card bg-dark text-light border border-warning rounded-4 shadow-lg overflow-hidden"
              >
                <div className="modal-header border-secondary p-4 bg-dark bg-opacity-60">
                  <h5 className="modal-title fw-bold text-gold-gradient">
                    <i className={`bi bi-${editingProperty ? 'pencil-square' : 'plus-circle-fill'} me-2`}></i>
                    {editingProperty ? 'Edit Property Details' : 'Add New Property Listing'}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white shadow-none" 
                    onClick={() => setShowPropertyModal(false)}
                  ></button>
                </div>

                <form onSubmit={handlePropertySubmit}>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      <div className="col-md-8">
                        <label className="form-label text-slate-light fw-semibold">Property Title</label>
                        <input 
                          type="text" 
                          className="form-control bg-dark text-light border-secondary"
                          placeholder="e.g. Modern Villa in Jaipur"
                          value={propertyForm.title}
                          onChange={(e) => setPropertyForm({ ...propertyForm, title: e.target.value })}
                          required 
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label text-slate-light fw-semibold">Property Type</label>
                        <select 
                          className="form-select bg-dark text-light border-secondary"
                          value={propertyForm.type}
                          onChange={(e) => setPropertyForm({ ...propertyForm, type: e.target.value })}
                        >
                          <option value="Apartment">Apartment</option>
                          <option value="Villa">Villa</option>
                          <option value="Plot">Plot</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                         <label className="form-label text-slate-light fw-semibold">Price (₹ INR)</label>
                        <input 
                          type="number" 
                          className="form-control bg-dark text-light border-secondary"
                          placeholder="e.g. 500000"
                          value={propertyForm.price}
                          onChange={(e) => setPropertyForm({ ...propertyForm, price: e.target.value })}
                          required 
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-slate-light fw-semibold">Location / City</label>
                        <input 
                          type="text" 
                          className="form-control bg-dark text-light border-secondary"
                          placeholder="e.g. Jaipur, Rajasthan"
                          value={propertyForm.location}
                          onChange={(e) => setPropertyForm({ ...propertyForm, location: e.target.value })}
                          required 
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label text-slate-light fw-semibold">Seller Email (Assign & Auto-Verify)</label>
                        <input 
                          type="email" 
                          className="form-control bg-dark text-light border-secondary"
                          placeholder="e.g. seller@estate.com (Optional)"
                          value={propertyForm.sellerEmail}
                          onChange={(e) => setPropertyForm({ ...propertyForm, sellerEmail: e.target.value })}
                        />
                        <small className="text-muted d-block mt-1">If specified, verifies this seller's email and lists under their account.</small>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label text-slate-light fw-semibold">Contact Info / Phone</label>
                        <input 
                          type="text" 
                          className="form-control bg-dark text-light border-secondary"
                          placeholder="e.g. +91 9876543210 or email"
                          value={propertyForm.contactInfo}
                          onChange={(e) => setPropertyForm({ ...propertyForm, contactInfo: e.target.value })}
                          required 
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label text-slate-light fw-semibold">Description</label>
                        <textarea 
                          className="form-control bg-dark text-light border-secondary"
                          rows="3"
                          placeholder="Detailed property feature notes..."
                          value={propertyForm.description}
                          onChange={(e) => setPropertyForm({ ...propertyForm, description: e.target.value })}
                          required
                        ></textarea>
                      </div>

                      <div className="col-12">
                        <label className="form-label text-slate-light fw-semibold">Property Image</label>
                        <input 
                          type="file" 
                          className="form-control bg-dark text-light border-secondary"
                          accept="image/*"
                          onChange={(e) => setImageFile(e.target.files[0])}
                        />
                        {editingProperty?.image && !imageFile && (
                          <div className="mt-2 d-flex align-items-center gap-2">
                            <small className="text-slate-light">Current Image:</small>
                            <img src={editingProperty.image} alt="Current" className="rounded-2" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                          </div>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-slate-light fw-semibold">Latitude</label>
                        <input 
                          type="number" 
                          step="any"
                          className="form-control bg-dark text-light border-secondary"
                          placeholder="e.g. 26.9124"
                          value={propertyForm.latitude}
                          onChange={(e) => setPropertyForm({ ...propertyForm, latitude: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-slate-light fw-semibold">Longitude</label>
                        <input 
                          type="number" 
                          step="any"
                          className="form-control bg-dark text-light border-secondary"
                          placeholder="e.g. 75.7873"
                          value={propertyForm.longitude}
                          onChange={(e) => setPropertyForm({ ...propertyForm, longitude: e.target.value })}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label text-slate-light fw-semibold">360° Panorama Image</label>
                        <input 
                          type="file" 
                          className="form-control bg-dark text-light border-secondary"
                          accept="image/*"
                          onChange={(e) => setPanoramaFile(e.target.files[0])}
                        />
                        {editingProperty?.panoramaImage && !panoramaFile && (
                          <div className="mt-2 d-flex align-items-center gap-2">
                            <small className="text-slate-light">Current Panorama:</small>
                            <img src={editingProperty.panoramaImage} alt="Current" className="rounded-2" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer border-secondary p-3 bg-dark bg-opacity-60">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary rounded-pill px-4" 
                      onClick={() => setShowPropertyModal(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-warning rounded-pill px-4 fw-bold text-dark shadow"
                      disabled={submittingProperty}
                    >
                      {submittingProperty ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-lg me-1"></i>
                          {editingProperty ? 'Save Changes' : 'Create Listing'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
