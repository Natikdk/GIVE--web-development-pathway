import { useEffect, useState } from 'react';
import { 
  getAdminLessons, 
  createLesson, 
  updateLesson, 
  deleteLesson 
} from '../../api/admin';
import AdminLayout from '../../component/AdminLayout';
import '../../styles/admin/Lessons.css';

//arona quiz functionality ahun sertual
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
      content: '',
      hasPlayground: false,
      playground: {
        html: '',
        css: '',
        js: '',
        instructions: ''
      },
      quiz: {
        enabled: false,
        questions: []
      },
      hasVideo: false,  // youtube video masgebiyaw field new yihe
      video: {         
      youtubeId: '',
      title: '',
      description: '',
      startTime: '',
      endTime: ''
    }

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
    
    // Check if it's a playground field
    if (field.startsWith('playground.')) {
      const playgroundField = field.split('.')[1];
      if (!updatedSections[index].playground) {
        updatedSections[index].playground = {
          html: '',
          css: '',
          js: '',
          instructions: ''
        };
      }
      updatedSections[index].playground[playgroundField] = value;
    }else if (field.startsWith('video.')) {  //yhen video field handle lemareg new yechemerkut
    const videoField = field.split('.')[1];
    if (!updatedSections[index].video) {
      updatedSections[index].video = {
        youtubeId: '',
        title: '',
        description: '',
        startTime: '',
        endTime: ''
      };
    }
    updatedSections[index].video[videoField] = value;
  } else {
      // Regular field
      updatedSections[index][field] = value;
      
      // Auto-generate anchor from title if anchor is empty
      if (field === 'title' && !updatedSections[index].anchor) {
        updatedSections[index].anchor = value.toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .replace(/\s+/g, '-');
      }
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
        content: '',
        hasPlayground: false,
        playground: {
          html: '',
          css: '',
          js: '',
          instructions: ''
        },
        quiz: {
          enabled: false,
          questions: []
        },
        hasVideo: false,  
      video: {          
        youtubeId: '',
        title: '',
        description: '',
        startTime: '',
        endTime: ''
      }
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
      
      // Validate quiz questions if quiz is enabled
      if (section.quiz?.enabled) {
        const questions = section.quiz.questions || [];
        
        if (questions.length === 0) {
          setError(`Section ${i + 1}: Quiz enabled but no questions added`);
          return false;
        }
        
        for (let q = 0; q < questions.length; q++) {
          const question = questions[q];
          
          if (!question.question?.trim()) {
            setError(`Section ${i + 1}, Question ${q + 1}: Question text is required`);
            return false;
          }
          
          if (!question.options || question.options.length < 2) {
            setError(`Section ${i + 1}, Question ${q + 1}: At least 2 options required`);
            return false;
          }
          
          // Check if any option is marked correct
          const hasCorrectAnswer = question.options.some(opt => opt.correct);
          if (!hasCorrectAnswer) {
            setError(`Section ${i + 1}, Question ${q + 1}: One option must be marked as correct`);
            return false;
          }
          
          // Check for empty option text
          const emptyOption = question.options.find(opt => !opt.text?.trim());
          if (emptyOption) {
            setError(`Section ${i + 1}, Question ${q + 1}: All options must have text`);
            return false;
          }
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const lessonData = {
        topic: formData.topic,
        slug: formData.slug,
        sections: formData.sections.map(section => ({
          title: section.title,
          anchor: section.anchor,
          content: section.content,
          hasPlayground: section.hasPlayground,
          playground: section.playground || {
            html: '',
            css: '',
            js: '',
            instructions: ''
          },
          quiz: section.quiz || {
            enabled: false,
            questions: []
          },
          hasVideo: section.hasVideo,
          video: section.video || {
            youtubeId: '',
            title: '',
            description: '',
            startTime: '',
            endTime: ''
          }
        }))
      };

      if (editingLesson) {
        await updateLesson(editingLesson._id, lessonData);
        alert('Lesson updated successfully!');
      } else {
        await createLesson(lessonData);
        alert('Lesson created successfully!');
      }
      
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
        content: '',
        hasPlayground: false,
        playground: {
          html: '',
          css: '',
          js: '',
          instructions: ''
        },
        quiz: {
          enabled: false,
          questions: []
        },
        hasVideo: false, 
        video: {          
        youtubeId: '',
        title: '',
        description: '',
        startTime: '',
        endTime: ''
      }
      }]
    });
  };

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    
    // Map existing sections with defaults
    const sectionsWithDefaults = (lesson.sections || []).map(section => ({
      title: section.title || '',
      anchor: section.anchor || '',
      content: section.content || '',
      hasPlayground: section.hasPlayground || false,
      playground: section.playground || {
        html: '',
        css: '',
        js: '',
        instructions: ''
      },
      quiz: section.quiz || {
        enabled: false,
        questions: []
      },
      hasVideo: section.hasVideo || false,
      video: section.video || {
        youtubeId: '',
        title: '',
        description: '',
        startTime: '',
        endTime: ''
      }
    }));
    
    // Ensure at least one section exists
    if (sectionsWithDefaults.length === 0) {
      sectionsWithDefaults.push({
        title: '',
        anchor: '',
        content: '',
        hasPlayground: false,
        playground: {
          html: '',
          css: '',
          js: '',
          instructions: ''
        },
        quiz: {
          enabled: false,
          questions: []
        },
        hasVideo: false,
        video: {
          youtubeId: '',
          title: '',
          description: '',
          startTime: '',
          endTime: ''
        }
      });
    }
    
    setFormData({
      topic: lesson.topic || '',
      slug: lesson.slug || '',
      sections: sectionsWithDefaults
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

  // Quiz Functions
  const handleQuizToggle = (sectionIndex, enabled) => {
    const updatedSections = [...formData.sections];
    
    if (!updatedSections[sectionIndex].quiz) {
      updatedSections[sectionIndex].quiz = {
        enabled: false,
        questions: []
      };
    }
    
    updatedSections[sectionIndex].quiz.enabled = enabled;
    
    setFormData(prev => ({
      ...prev,
      sections: updatedSections
    }));
  };

  const addQuestion = (sectionIndex) => {
    const updatedSections = [...formData.sections];
    const section = updatedSections[sectionIndex];
    
    if (!section.quiz) {
      section.quiz = { enabled: true, questions: [] };
    }
    
    const newQuestion = {
      id: `q${Date.now()}`,
      question: '',
      type: 'multiple-choice',
      options: [
        { id: 'a', text: '', correct: true },
        { id: 'b', text: '', correct: false },
        { id: 'c', text: '', correct: false },
        { id: 'd', text: '', correct: false }
      ],
      explanation: '',
      difficulty: 'medium'
    };
    
    section.quiz.questions.push(newQuestion);
    
    setFormData(prev => ({
      ...prev,
      sections: updatedSections
    }));
  };

  const removeQuestion = (sectionIndex, questionIndex) => {
    if (window.confirm('Delete this question?')) {
      const updatedSections = [...formData.sections];
      updatedSections[sectionIndex].quiz.questions.splice(questionIndex, 1);
      
      setFormData(prev => ({
        ...prev,
        sections: updatedSections
      }));
    }
  };

  const updateQuestion = (sectionIndex, questionIndex, field, value) => {
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].quiz.questions[questionIndex][field] = value;
    
    setFormData(prev => ({
      ...prev,
      sections: updatedSections
    }));
  };

  const updateOption = (sectionIndex, questionIndex, optionIndex, value) => {
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].quiz.questions[questionIndex].options[optionIndex].text = value;
    
    setFormData(prev => ({
      ...prev,
      sections: updatedSections
    }));
  };

  const setCorrectAnswer = (sectionIndex, questionIndex, optionIndex) => {
    const updatedSections = [...formData.sections];
    const question = updatedSections[sectionIndex].quiz.questions[questionIndex];
    
    // Set all options to false
    question.options.forEach(option => {
      option.correct = false;
    });
    
    // Set selected option to true
    question.options[optionIndex].correct = true;
    
    setFormData(prev => ({
      ...prev,
      sections: updatedSections
    }));
  };

  const addOption = (sectionIndex, questionIndex) => {
    const updatedSections = [...formData.sections];
    const question = updatedSections[sectionIndex].quiz.questions[questionIndex];
    
    const newOptionId = String.fromCharCode(97 + question.options.length);
    question.options.push({
      id: newOptionId,
      text: '',
      correct: false
    });
    
    setFormData(prev => ({
      ...prev,
      sections: updatedSections
    }));
  };

  const removeOption = (sectionIndex, questionIndex, optionIndex) => {
    const updatedSections = [...formData.sections];
    const question = updatedSections[sectionIndex].quiz.questions[questionIndex];
    
    if (question.options.length <= 2) {
      alert('A question must have at least 2 options');
      return;
    }
    
    question.options.splice(optionIndex, 1);
    
    setFormData(prev => ({
      ...prev,
      sections: updatedSections
    }));
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
                      {lesson.sections?.some(s => s.hasPlayground) && (
                        <span className="badge badge-playground" title="Has playgrounds">
                          🎮
                        </span>
                      )}
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

                          {/* Playground Section */}
                          <div className="form-group playground-section">
                            <div className="playground-header">
                              <label className="playground-toggle">
                                <input
                                  type="checkbox"
                                  checked={section.hasPlayground || false}
                                  onChange={(e) => handleSectionChange(index, 'hasPlayground', e.target.checked)}
                                />
                                <span>Add Code Playground to this section</span>
                              </label>
                              <small className="playground-help">
                                Allows users to edit and run code directly
                              </small>
                            </div>

                            {section.hasPlayground && (
                              <div className="playground-fields">
                                <div className="playground-field">
                                  <label>Instructions</label>
                                  <input
                                    type="text"
                                    value={section.playground?.instructions || ''}
                                    onChange={(e) => handleSectionChange(index, 'playground.instructions', e.target.value)}
                                    placeholder="e.g., 'Try changing the button color'"
                                    className="form-control"
                                  />
                                </div>

                                <div className="playground-field">
                                  <label>HTML</label>
                                  <textarea
                                    value={section.playground?.html || ''}
                                    onChange={(e) => handleSectionChange(index, 'playground.html', e.target.value)}
                                    placeholder="<button class='my-button'>Click me</button>"
                                    className="form-control code-textarea"
                                    rows="3"
                                  />
                                </div>

                                <div className="playground-field">
                                  <label>CSS</label>
                                  <textarea
                                    value={section.playground?.css || ''}
                                    onChange={(e) => handleSectionChange(index, 'playground.css', e.target.value)}
                                    placeholder=".my-button { background: #3498db; color: white; padding: 10px 20px; }"
                                    className="form-control code-textarea"
                                    rows="3"
                                  />
                                </div>

                                <div className="playground-field">
                                  <label>JavaScript</label>
                                  <textarea
                                    value={section.playground?.js || ''}
                                    onChange={(e) => handleSectionChange(index, 'playground.js', e.target.value)}
                                    placeholder="document.querySelector('.my-button').onclick = () => alert('Hello!');"
                                    className="form-control code-textarea"
                                    rows="3"
                                  />
                                </div>

                                <div className="playground-preview">
                                  <small>
                                    <strong>Preview:</strong> Users will see an interactive code editor with these defaults
                                  </small>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Quiz Section */}
                          <div className="form-group quiz-section">
                            <div className="quiz-header">
                              <label className="quiz-toggle">
                                <input
                                  type="checkbox"
                                  checked={section.quiz?.enabled || false}
                                  onChange={(e) => handleQuizToggle(index, e.target.checked)}
                                />
                                <span>Add Quiz to this section</span>
                              </label>
                              <small className="quiz-help">
                                Test user's understanding of this section
                              </small>
                            </div>

                            {section.quiz?.enabled && (
                              <div className="quiz-fields">
                                <div className="quiz-questions">
                                  <h5>Questions ({section.quiz.questions?.length || 0})</h5>
                                  
                                  {(section.quiz.questions || []).map((question, qIndex) => (
                                    <div key={question.id || qIndex} className="question-card">
                                      <div className="question-header">
                                        <strong>Question {qIndex + 1}</strong>
                                        <button
                                          type="button"
                                          className="btn-icon btn-icon-danger"
                                          title="Remove question"
                                          onClick={() => removeQuestion(index, qIndex)}
                                        >
                                          ×
                                        </button>
                                      </div>
                                      
                                      <div className="form-group">
                                        <label>
                                          Question Text *
                                          <input
                                            type="text"
                                            className="form-control"
                                            value={question.question || ''}
                                            onChange={e => updateQuestion(index, qIndex, 'question', e.target.value)}
                                            placeholder="Enter the question"
                                            required
                                          />
                                        </label>
                                      </div>
                                      
                                      <div className="form-group">
                                        <label>Options *</label>
                                        <div className="options-list">
                                          {question.options?.map((option, oIndex) => (
                                            <div key={option.id} className="option-item">
                                              <input
                                                type="radio"
                                                name={`correct-${index}-${qIndex}`}
                                                checked={option.correct || false}
                                                onChange={() => setCorrectAnswer(index, qIndex, oIndex)}
                                                title="Mark as correct"
                                              />
                                              <input
                                                type="text"
                                                className="form-control option-input"
                                                value={option.text || ''}
                                                onChange={e => updateOption(index, qIndex, oIndex, e.target.value)}
                                                placeholder={`Option ${option.id.toUpperCase()}`}
                                                required
                                              />
                                              <button
                                                type="button"
                                                className="btn-icon btn-icon-danger"
                                                title="Remove option"
                                                onClick={() => removeOption(index, qIndex, oIndex)}
                                                disabled={question.options.length <= 2}
                                              >
                                                ×
                                              </button>
                                            </div>
                                          ))}
                                          <button
                                            type="button"
                                            className="btn btn-xs btn-success"
                                            onClick={() => addOption(index, qIndex)}
                                          >
                                            + Add Option
                                          </button>
                                        </div>
                                      </div>
                                      
                                      <div className="form-group">
                                        <label>
                                          Explanation (optional)
                                          <input
                                            type="text"
                                            className="form-control"
                                            value={question.explanation || ''}
                                            onChange={e => updateQuestion(index, qIndex, 'explanation', e.target.value)}
                                            placeholder="Explanation for the answer"
                                          />
                                        </label>
                                      </div>
                                      
                                      <div className="form-group">
                                        <label>
                                          Difficulty
                                          <select
                                            className="form-control"
                                            value={question.difficulty || 'medium'}
                                            onChange={e => updateQuestion(index, qIndex, 'difficulty', e.target.value)}
                                          >
                                            <option value="easy">Easy</option>
                                            <option value="medium">Medium</option>
                                            <option value="hard">Hard</option>
                                          </select>
                                        </label>
                                      </div>
                                    </div>
                                  ))}
                                  
                                  <button
                                    type="button"
                                    onClick={() => addQuestion(index)}
                                    className="btn btn-sm btn-success"
                                  >
                                    + Add Question
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                      {/* Video Section */}
                      <div className="form-group video-section">
                        <div className="video-header">
                          <label className="video-toggle">
                            <input
                              type="checkbox"
                              checked={section.hasVideo || false}
                              onChange={(e) => handleSectionChange(index, 'hasVideo', e.target.checked)}
                            />
                            <span>Add YouTube Video to this section</span>
                          </label>
                          <small className="video-help">
                            Embed a tutorial or demonstration video
                          </small>
                        </div>

                        {section.hasVideo && (
                          <div className="video-fields">
                            <div className="video-field">
                              <label>
                                YouTube Video ID or URL *
                                <span className="label-help">
                                  Enter YouTube URL or just the video ID
                                  <br/>
                                  Example URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
                                  <br/>
                                  Example ID: dQw4w9WgXcQ
                                </span>
                              </label>
                              <input
                                type="text"
                                value={section.video?.youtubeId || ''}
                                onChange={(e) => handleSectionChange(index, 'video.youtubeId', e.target.value)}
                                placeholder="dQw4w9WgXcQ"
                                className="form-control"
                                required={section.hasVideo}
                              />
                              
                              {/* Preview button */}
                              {section.video?.youtubeId && (
                                <div className="video-preview-button">
                                  <a 
                                    href={`https://www.youtube.com/watch?v=${section.video.youtubeId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-info"
                                  >
                                    🔗 Preview on YouTube
                                  </a>
                                </div>
                              )}
                            </div>

                            <div className="video-field">
                              <label>
                                Custom Title (optional)
                                <span className="label-help">
                                  Override the video's original title
                                </span>
                              </label>
                              <input
                                type="text"
                                value={section.video?.title || ''}
                                onChange={(e) => handleSectionChange(index, 'video.title', e.target.value)}
                                placeholder="e.g., CSS Flexbox Explained"
                                className="form-control"
                              />
                            </div>

                            <div className="video-field">
                              <label>
                                Description (optional)
                                <span className="label-help">
                                  Add context or notes about this video
                                </span>
                              </label>
                              <textarea
                                value={section.video?.description || ''}
                                onChange={(e) => handleSectionChange(index, 'video.description', e.target.value)}
                                placeholder="e.g., This video shows how to use CSS Flexbox in practice..."
                                className="form-control"
                                rows="3"
                              />
                            </div>

                            <div className="video-timing">
                              <div className="timing-field">
                                <label>
                                  Start Time (seconds, optional)
                                  <input
                                    type="number"
                                    value={section.video?.startTime || ''}
                                    onChange={(e) => handleSectionChange(index, 'video.startTime', e.target.value)}
                                    placeholder="e.g., 120 (starts at 2:00)"
                                    className="form-control"
                                    min="0"
                                  />
                                </label>
                              </div>
                              
                              <div className="timing-field">
                                <label>
                                  End Time (seconds, optional)
                                  <input
                                    type="number"
                                    value={section.video?.endTime || ''}
                                    onChange={(e) => handleSectionChange(index, 'video.endTime', e.target.value)}
                                    placeholder="e.g., 300 (ends at 5:00)"
                                    className="form-control"
                                    min="0"
                                  />
                                </label>
                              </div>
                            </div>

                            {/* Live Preview */}
                            {section.video?.youtubeId && (
                              <div className="video-live-preview">
                                <h6>Preview:</h6>
                                <div className="preview-iframe">
                                  <iframe
                                    width="100%"
                                    height="200"
                                    src={`https://www.youtube.com/embed/${section.video.youtubeId}${section.video?.startTime ? `?start=${section.video.startTime}` : ''}`}
                                    title="YouTube video player"
                                    style={{ border: 0 }}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  ></iframe>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
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
                      Playgrounds: <strong>{formData.sections.filter(s => s.hasPlayground).length}</strong>
                    </span>
                    <span className="stats-item">
                      Quizzes: <strong>{formData.sections.filter(s => s.quiz?.enabled).length}</strong>
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