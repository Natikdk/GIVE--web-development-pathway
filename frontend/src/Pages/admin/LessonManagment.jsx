import { useEffect, useState } from 'react';
import { 
  getAdminLessons, 
  createLesson, 
  updateLesson, 
  deleteLesson 
} from '../../api/admin';
import AdminLayout from '../../component/AdminLayout';
import '../../styles/admin/Lessons.css';

function LessonManagement() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [formData, setFormData] = useState({
    topic: '',
    slug: '',
    sections: [{
      title: '',
      anchor: '',
      content: ''
    }]
  });

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const response = await getAdminLessons();
      setLessons(response.lessons || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicChange = (e) => {
    const topic = e.target.value;
    const slug = topic.toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    
    setFormData(prev => ({
      ...prev,
      topic,
      slug
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...formData.sections];
    updatedSections[index][field] = value;
    
    // Auto-generate anchor from title if anchor is empty
    if (field === 'title' && !updatedSections[index].anchor) {
      updatedSections[index].anchor = value.toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
    }
    
    setFormData(prev => ({
      ...prev,
      sections: updatedSections
    }));
  };

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, {
        title: '',
        anchor: '',
        content: ''
      }]
    }));
  };

  const removeSection = (index) => {
    if (formData.sections.length <= 1) {
      alert('At least one section is required');
      return;
    }
    
    if (window.confirm('Are you sure you want to remove this section?')) {
      const updatedSections = formData.sections.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        sections: updatedSections
      }));
    }
  };

  const moveSection = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === formData.sections.length - 1) return;
    
    const updatedSections = [...formData.sections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [updatedSections[index], updatedSections[newIndex]] = 
    [updatedSections[newIndex], updatedSections[index]];
    
    setFormData(prev => ({
      ...prev,
      sections: updatedSections
    }));
  };

  const validateForm = () => {
    setError('');

    if (!formData.topic.trim()) {
      setError('Topic is required');
      return false;
    }

    if (!formData.slug.trim()) {
      setError('Slug is required');
      return false;
    }

    // Validate sections
    for (let i = 0; i < formData.sections.length; i++) {
      const section = formData.sections[i];
      
      if (!section.title.trim()) {
        setError(`Section ${i + 1}: Title is required`);
        return false;
      }
      
      if (!section.anchor.trim()) {
        setError(`Section ${i + 1}: Anchor is required`);
        return false;
      }
      
      // Check for duplicate anchors
      const duplicateAnchor = formData.sections.find((s, idx) => 
        idx !== i && s.anchor === section.anchor
      );
      
      if (duplicateAnchor) {
        setError(`Section ${i + 1}: Anchor must be unique. "${section.anchor}" is already used.`);
        return false;
      }
      
      if (!section.content.trim()) {
        setError(`Section ${i + 1}: Content is required`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (editingLesson) {
        // Update existing lesson
        await updateLesson(editingLesson._id, {
          topic: formData.topic,
          slug: formData.slug,
          sections: formData.sections
        });
        alert('Lesson updated successfully!');
      } else {
        // Create new lesson
        await createLesson({
          topic: formData.topic,
          slug: formData.slug,
          sections: formData.sections
        });
        alert('Lesson created successfully!');
      }
      
      // Reset form and refresh list
      setShowModal(false);
      setEditingLesson(null);
      resetForm();
      loadLessons();
      
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  const resetForm = () => {
    setFormData({
      topic: '',
      slug: '',
      sections: [{
        title: '',
        anchor: '',
        content: ''
      }]
    });
  };

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    setFormData({
      topic: lesson.topic,
      slug: lesson.slug,
      sections: lesson.sections || [{
        title: '',
        anchor: '',
        content: ''
      }]
    });
    setShowModal(true);
  };

  const handleDelete = async (id, topic) => {
    if (window.confirm(`Are you sure you want to delete "${topic}"? This action cannot be undone.`)) {
      try {
        await deleteLesson(id);
        alert('Lesson deleted successfully!');
        loadLessons();
      } catch (err) {
        alert('Error deleting lesson: ' + err.message);
      }
    }
  };

  const handleCreateNew = () => {
    setEditingLesson(null);
    resetForm();
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const generateAnchorFromTitle = (title) => {
    return title.toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };

  return (
    <AdminLayout>
      <div className="lessons-management">
        <div className="page-header">
          <h1>Lessons Management</h1>
          <button 
            onClick={handleCreateNew}
            className="btn btn-primary"
          >
            <span className="icon">+</span> Create New Lesson
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading lessons...</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Slug</th>
                  <th>Sections</th>
                  <th>Created</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson) => (
                  <tr key={lesson._id}>
                    <td>
                      <strong className="lesson-topic">{lesson.topic}</strong>
                      <div className="lesson-description">
                        {lesson.description && <small>{lesson.description}</small>}
                      </div>
                    </td>
                    <td>
                      <code className="lesson-slug">{lesson.slug}</code>
                      <div className="lesson-url">
                        <small>
                          <a 
                            href={`/lessons/${lesson.slug}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            /lessons/{lesson.slug}
                          </a>
                        </small>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-sections">
                        {lesson.sections?.length || 0} sections
                      </span>
                    </td>
                    <td>
                      <div className="date-cell">
                        <span className="date">{formatDate(lesson.createdAt)}</span>
                      </div>
                    </td>
                    <td>
                      <div className="date-cell">
                        <span className="date">{formatDate(lesson.updatedAt)}</span>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEdit(lesson)}
                          className="btn btn-sm btn-secondary"
                          title="Edit lesson"
                        >
                          <span className="icon">✏️</span> Edit
                        </button>
                        <button
                          onClick={() => window.open(`/lessons/${lesson.slug}`, '_blank')}
                          className="btn btn-sm btn-info"
                          title="Preview lesson"
                        >
                          <span className="icon">👁️</span> View
                        </button>
                        <button
                          onClick={() => handleDelete(lesson._id, lesson.topic)}
                          className="btn btn-sm btn-danger"
                          title="Delete lesson"
                        >
                          <span className="icon">🗑️</span> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {lessons.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">📚</div>
                <h3>No lessons yet</h3>
                <p>Create your first lesson to get started!</p>
                <button 
                  onClick={handleCreateNew}
                  className="btn btn-primary"
                >
                  Create First Lesson
                </button>
              </div>
            )}
          </div>
        )}

        {/* Create/Edit Lesson Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal modal-wide">
              <div className="modal-header">
                <h2>{editingLesson ? 'Edit Lesson' : 'Create New Lesson'}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="close-button"
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-section">
                  <h3 className="form-section-title">Lesson Information</h3>
                  
                  <div className="form-group">
                    <label htmlFor="topic">
                      Lesson Topic *
                      <span className="label-help">The main title of your lesson</span>
                    </label>
                    <input
                      type="text"
                      id="topic"
                      name="topic"
                      value={formData.topic}
                      onChange={handleTopicChange}
                      placeholder="e.g., JavaScript Fundamentals"
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="slug">
                      URL Slug *
                      <span className="label-help">Used in the lesson URL</span>
                    </label>
                    <div className="slug-input-group">
                      <span className="slug-prefix">/lessons/</span>
                      <input
                        type="text"
                        id="slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        placeholder="javascript-fundamentals"
                        className="form-control slug-input"
                        required
                      />
                    </div>
                    <div className="url-preview">
                      Full URL: <code>https://your-site.com/lessons/{formData.slug || 'your-slug'}</code>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <div className="section-header">
                    <h3 className="form-section-title">Lesson Sections</h3>
                    <button
                      type="button"
                      onClick={addSection}
                      className="btn btn-sm btn-success"
                    >
                      <span className="icon">+</span> Add Section
                    </button>
                  </div>
                  
                  <div className="sections-container">
                    {formData.sections.map((section, index) => (
                      <div key={index} className="section-card">
                        <div className="section-header">
                          <h4 className="section-title">
                            Section {index + 1}
                            {index === 0 && <span className="section-badge">Main</span>}
                          </h4>
                          <div className="section-actions">
                            <button
                              type="button"
                              onClick={() => moveSection(index, 'up')}
                              className="btn-icon"
                              disabled={index === 0}
                              title="Move up"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={() => moveSection(index, 'down')}
                              className="btn-icon"
                              disabled={index === formData.sections.length - 1}
                              title="Move down"
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              onClick={() => removeSection(index)}
                              className="btn-icon btn-icon-danger"
                              disabled={formData.sections.length <= 1}
                              title="Remove section"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                        
                        <div className="section-form">
                          <div className="form-group">
                            <label htmlFor={`section-title-${index}`}>
                              Section Title *
                              <span className="label-help">e.g., Introduction to JavaScript</span>
                            </label>
                            <input
                              type="text"
                              id={`section-title-${index}`}
                              value={section.title}
                              onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                              placeholder="Enter section title"
                              className="form-control"
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label htmlFor={`section-anchor-${index}`}>
                              Anchor ID *
                              <span className="label-help">Used for section links (URL-friendly)</span>
                            </label>
                            <input
                              type="text"
                              id={`section-anchor-${index}`}
                              value={section.anchor}
                              onChange={(e) => handleSectionChange(index, 'anchor', e.target.value)}
                              onBlur={(e) => {
                                if (!e.target.value.trim()) {
                                  handleSectionChange(index, 'anchor', generateAnchorFromTitle(section.title));
                                }
                              }}
                              placeholder="introduction"
                              className="form-control"
                              required
                            />
                            <div className="anchor-preview">
                              Link: <code>#{section.anchor || 'your-anchor'}</code>
                            </div>
                          </div>

                          <div className="form-group">
                            <label htmlFor={`section-content-${index}`}>
                              Content *
                              <span className="label-help">HTML content for this section</span>
                            </label>
                            <textarea
                              id={`section-content-${index}`}
                              value={section.content}
                              onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                              placeholder="Enter your lesson content here... (HTML supported)"
                              className="form-control textarea-content"
                              rows="6"
                              required
                            />
                            <div className="content-tips">
                              <small>Tip: You can use HTML tags like &lt;p&gt;, &lt;code&gt;, &lt;pre&gt; for formatting.</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-actions">
                  <div className="form-stats">
                    <span className="stats-item">
                      Sections: <strong>{formData.sections.length}</strong>
                    </span>
                    <span className="stats-item">
                      Characters: <strong>{formData.sections.reduce((acc, section) => acc + section.content.length, 0)}</strong>
                    </span>
                  </div>
                  <div className="form-action-buttons">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      <span className="icon">💾</span>
                      {editingLesson ? 'Update Lesson' : 'Create Lesson'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default LessonManagement;