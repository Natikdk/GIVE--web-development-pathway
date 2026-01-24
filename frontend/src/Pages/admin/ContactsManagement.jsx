// frontend/src/admin/pages/ContactsManagement.jsx
import { useEffect, useState } from 'react';
import { getContacts, updateContact } from '../../api/admin';
import AdminLayout from '../../component/AdminLayout';
import '../../styles/admin/Contact.css';



function ContactsManagement() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  });

  useEffect(() => {
    loadContacts();
  }, [statusFilter, pagination.page, searchQuery]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const params = {
        status: statusFilter,
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery
      };
      
      const response = await getContacts(params);
      setContacts(response.contacts);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateContact(id, { status: newStatus });
      // Refresh contacts
      loadContacts();
      if (selectedContact?.id === id) {
        setSelectedContact(null);
      }
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleReply = (contact) => {
    const emailBody = `Dear ${contact.name},\n\nThank you for contacting us.\n\nBest regards,\nLearning Center Team`;
    const mailtoLink = `mailto:${contact.email}?subject=Re: ${contact.subject || 'Your Message'}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoLink, '_blank');
    
    // Mark as replied
    handleStatusUpdate(contact._id, 'replied');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'new': 'badge-new',
      'read': 'badge-read',
      'replied': 'badge-replied',
      'archived': 'badge-archived'
    };
    
    return (
      <span className={`badge ${statusClasses[status] || ''}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="contacts-management">
        <div className="page-header">
          <h1>Contact Messages</h1>
          <div className="header-actions">
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading contacts...</p>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact._id}>
                      <td>{getStatusBadge(contact.status)}</td>
                      <td>
                        <strong>{contact.name}</strong>
                      </td>
                      <td>
                        <a href={`mailto:${contact.email}`}>
                          {contact.email}
                        </a>
                      </td>
                      <td>{contact.subject || 'No subject'}</td>
                      <td>{formatDate(contact.createdAt)}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => setSelectedContact(contact)}
                            className="btn btn-sm btn-secondary"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleReply(contact)}
                            className="btn btn-sm btn-primary"
                          >
                            Reply
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {contacts.length === 0 && (
              <div className="empty-state">
                <p>No contact messages found.</p>
              </div>
            )}
          </>
        )}

        {/* Contact Detail Modal */}
        {selectedContact && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Message Details</h2>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="close-button"
                >
                  &times;
                </button>
              </div>
              <div className="modal-content">
                <div className="contact-details">
                  <p><strong>Name:</strong> {selectedContact.name}</p>
                  <p><strong>Email:</strong> 
                    <a href={`mailto:${selectedContact.email}`}>
                      {selectedContact.email}
                    </a>
                  </p>
                  <p><strong>Subject:</strong> {selectedContact.subject || 'No subject'}</p>
                  <p><strong>Date:</strong> {formatDate(selectedContact.createdAt)}</p>
                  <p><strong>Status:</strong> {getStatusBadge(selectedContact.status)}</p>
                  
                  <div className="message-content">
                    <h4>Message:</h4>
                    <p>{selectedContact.message}</p>
                  </div>
                  
                  {selectedContact.adminNotes && (
                    <div className="admin-notes">
                      <h4>Admin Notes:</h4>
                      <p>{selectedContact.adminNotes}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => handleReply(selectedContact)}
                  className="btn btn-primary"
                >
                  Reply via Email
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedContact._id, 'read')}
                  className="btn btn-secondary"
                >
                  Mark as Read
                </button>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="btn btn-outline"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default ContactsManagement;