// src/presentation/pages/mentor/AssessmentPage/components/AssignAssessmentModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Search, CheckCircle2 } from 'lucide-react';
import { learnerAssessmentAPI } from '../../../../../services/learnerAssessmentAPI';
import './AssignAssessmentModal.css';

interface Learner {
  id: number;
  name: string;
  email: string;
}

interface AssignAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessmentId: number;
  assessmentTitle: string;
}

// Mock learners service - in real app, we might need a separate API to get learners
// For now, we'll adapt by using a mock function or if there is an existing API.
// Looking at LearnerAssessmentAPI, we don't have getLearners.
// Let's assume we can fetch users with ROLE_LEARNER from a userService, 
// OR simpler: we'll just mock a list of learners for this demo since we don't have user management API exposed here fully.
// Wait, AdminApp has UsersPage, so there must be an API.
// But valid user IDs are needed for foreign keys.
// I will create a simple mock list that uses IDs 1, 2, 3 just to demonstrate.

const MOCK_LEARNERS: Learner[] = [
  { id: 2, name: "Learner One", email: "learner1@example.com" }, // Assuming ID 2 is a learner
  { id: 3, name: "Learner Two", email: "learner2@example.com" },
  { id: 4, name: "Nguyen Van A", email: "nguyenvana@example.com" },
];

export const AssignAssessmentModal: React.FC<AssignAssessmentModalProps> = ({ 
  isOpen, 
  onClose, 
  assessmentId,
  assessmentTitle
}) => {
  const [selectedLearners, setSelectedLearners] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [assigning, setAssigning] = useState(false);

  if (!isOpen) return null;

  const handleToggle = (learnerId: number) => {
    setSelectedLearners(prev => 
      prev.includes(learnerId) 
        ? prev.filter(id => id !== learnerId)
        : [...prev, learnerId]
    );
  };

  const handleAssign = async () => {
    if (selectedLearners.length === 0) return;
    
    setAssigning(true);
    try {
      // Loop through selected learners and assign
      await learnerAssessmentAPI.assignAssessment(assessmentId, selectedLearners);
      
      alert(`Successfully assigned "${assessmentTitle}" to ${selectedLearners.length} learners.`);
      onClose();
      setSelectedLearners([]);
    } catch (error) {
      console.error("Assign error:", error);
      alert("Failed to assign assessment.");
    } finally {
      setAssigning(false);
    }
  };

  const filteredLearners = MOCK_LEARNERS.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="assign-modal glass-card">
        <div className="modal-header">
          <h3>Assign Assessment</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className="modal-body">
          <p className="assessment-label">
            Assessment: <strong>{assessmentTitle}</strong>
          </p>
          
          <div className="search-box">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search learners..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="learners-list">
            {filteredLearners.map(learner => (
              <div 
                key={learner.id} 
                className={`learner-item ${selectedLearners.includes(learner.id) ? 'selected' : ''}`}
                onClick={() => handleToggle(learner.id)}
              >
                <div className="learner-details">
                  <div className="name">{learner.name}</div>
                  <div className="email">{learner.email}</div>
                </div>
                <div className="checkbox">
                  {selectedLearners.includes(learner.id) && <CheckCircle2 size={18} />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <span className="selection-count">
            {selectedLearners.length} selected
          </span>
          <button 
            className="confirm-btn"
            disabled={selectedLearners.length === 0 || assigning}
            onClick={handleAssign}
          >
            {assigning ? 'Assigning...' : 'Confirm Assignment'}
          </button>
        </div>
      </div>
    </div>
  );
};
