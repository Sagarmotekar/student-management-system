import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    course: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to fetch students. Is the backend running?');
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${formData.id}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      setShowModal(false);
      resetForm();
      fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Failed to save student. Check console for details.');
    }
  };

  const handleEdit = (student) => {
    setFormData(student);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Failed to delete student.');
      }
    }
  };

  const resetForm = () => {
    setFormData({ id: '', firstName: '', lastName: '', email: '', course: '' });
    setIsEditing(false);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-primary">Student Management System</h2>
      
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <button className="btn btn-success mb-3" onClick={() => { resetForm(); setShowModal(true); }}>
        + Add New Student
      </button>

      <table className="table table-striped table-bordered table-hover shadow-sm bg-white">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Course</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center text-muted">No students found. Add one!</td>
            </tr>
          ) : (
            students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.firstName}</td>
                <td>{student.lastName}</td>
                <td>{student.email}</td>
                <td>{student.course}</td>
                <td className="text-center">
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(student)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(student.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pure CSS/HTML Bootstrap Modal */}
      {showModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{isEditing ? 'Edit Student' : 'Add New Student'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSave}>
                    <div className="mb-3">
                      <label className="form-label">First Name</label>
                      <input type="text" className="form-control" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Last Name</label>
                      <input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" name="email" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Course</label>
                      <input type="text" className="form-control" name="course" value={formData.course} onChange={handleInputChange} required />
                    </div>
                    <div className="d-grid">
                      <button className="btn btn-primary" type="submit">
                        {isEditing ? 'Update Student' : 'Save Student'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}

export default App;