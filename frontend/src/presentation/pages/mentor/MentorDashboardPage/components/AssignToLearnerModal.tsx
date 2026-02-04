// src/presentation/pages/mentor/MentorDashboardPage/components/AssignToLearnerModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Search, FileText } from 'lucide-react';
import { learnerAssessmentAPI, Assessment } from '../../../../../services/learnerAssessmentAPI';
import './AssignToLearnerModal.css';

interface AssignToLearnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  learnerId: number;
  learnerName: string;
}

export const AssignToLearnerModal: React.FC<AssignToLearnerModalProps> = ({ 
  isOpen, 
  onClose, 
  learnerId,
  learnerName
}) => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAssessments();
    }
  }, [isOpen]);

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const data = await learnerAssessmentAPI.getAllAssessments();
      setAssessments(data);
    } catch (error) {
      console.error("Error fetching assessments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedAssessmentId) return;
    
    setAssigning(true);
    try {
      await learnerAssessmentAPI.assignAssessment(selectedAssessmentId, [learnerId]);
      alert(`Successfully assigned assessment to ${learnerName}.`);
      onClose();
      setSelectedAssessmentId(null);
    } catch (error) {
      console.error("Assign error:", error);
      alert("Failed to assign assessment.");
    } finally {
      setAssigning(false);
    }
  };

  if (!isOpen) return null;

  const filteredAssessments = assessments.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="assign-modal glass-card">
        <div className="modal-header">
          <h3>Assign to {learnerName}</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className="modal-body">
          <p className="description-label">Select an assessment to assign:</p>
          
          <div className="search-box">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search assessments..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="assessments-list-modal">
            {loading ? (
              <div className="loading-text">Loading assessments...</div>
            ) : filteredAssessments.length === 0 ? (
              <div className="empty-text">No assessments found.</div>
            ) : (
              filteredAssessments.map(assessment => (
                <div 
                  key={assessment.id} 
                  className={`assessment-item-c ${selectedAssessmentId === assessment.id ? 'selected' : ''}`}
                  onClick={() => setSelectedAssessmentId(assessment.id)}
                >
                  <div className="assessment-icon">
                    <FileText size={18} />
                  </div>
                  <div className="assessment-details">
                    <div className="title">{assessment.title}</div>
                    <div className="info">{assessment.level} • {assessment.durationMinutes} min</div>
                  </div>
                  <div className="radio-circle">
                    {selectedAssessmentId === assessment.id && <div className="radio-dot" />}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="confirm-btn"
            disabled={!selectedAssessmentId || assigning}
            onClick={handleAssign}
          >
            {assigning ? 'Assigning...' : 'Confirm Assignment'}
          </button>
        </div>
      </div>
    </div>
  );
};
