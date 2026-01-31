import React, { useState } from "react";
import {
  Search,
  Star,
  Award,
  Calendar,
  CheckCircle,
  XCircle,
  Edit3,
  Plus,
  Trash2,
  Mail,
  User,
  Users,
} from "lucide-react";
import { Button } from "../../../components/atoms/Button/Button";
import { Modal } from "../../../components/organisms/Modal/Modal";
import { Input } from "../../../components/atoms/Input/Input";
import { useMentors } from "../../../hooks/useMentors";
import "./MentorsPage.css";

// Types
interface MentorDTO {
  id: string;
  name: string;
  email: string;
  skills: { name: string; level: string }[];
  status: string;
  rating: number;
  studentsCount: number;
  joinedAt: string;
  avatar?: string;
}

export const MentorsPage: React.FC = () => {
  const {
    mentors,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    approveMentor,
    rejectMentor,
    updateSkills,
  } = useMentors();

  const [selectedMentor, setSelectedMentor] = useState<MentorDTO | null>(null);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [skills, setSkills] = useState<{ name: string; level: string }[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  const openSkillsModal = (mentor: MentorDTO) => {
    setSelectedMentor(mentor);
    setSkills(mentor.skills.map((s) => ({ name: s.name, level: s.level })));
    setIsSkillsModalOpen(true);
  };

  const closeSkillsModal = () => {
    setSelectedMentor(null);
    setSkills([]);
    setIsSkillsModalOpen(false);
  };

  const handleAddSkill = () => {
    setSkills([...skills, { name: "", level: "Beginner" }]);
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSkillChange = (
    index: number,
    field: "name" | "level",
    value: string,
  ) => {
    const updated = [...skills];
    updated[index][field] = value;
    setSkills(updated);
  };

  const handleSaveSkills = async () => {
    if (!selectedMentor) return;

    try {
      setActionLoading(true);
      await updateSkills(selectedMentor.id, skills);
      closeSkillsModal();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async (mentorId: string) => {
    try {
      await approveMentor(mentorId);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleReject = async (mentorId: string) => {
    try {
      await rejectMentor(mentorId);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="mentors-page">
      {/* Header with Icon - FIXED */}
      <div className="mentors-page__header">
        <div className="mentors-page__header-main">
          <div className="mentors-page__header-icon">
            <Users size={28} strokeWidth={2} />
          </div>
          <div className="mentors-page__header-content">
            <h1 className="mentors-page__title">Mentor Management</h1>
            <p className="mentors-page__subtitle">
              Manage mentors, approve applications, and update skills
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mentors-page__error">
          <XCircle size={20} strokeWidth={2} />
          <span>{error}</span>
        </div>
      )}

      {/* Search Bar - FIXED */}
      <div className="mentors-page__controls">
        <div className="mentors-page__search">
          <Search
            className="mentors-page__search-icon"
            size={20}
            strokeWidth={2}
          />
          <input
            type="text"
            className="mentors-page__search-input"
            placeholder="Search mentors by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Mentors Grid - FIXED */}
      {loading ? (
        <div className="mentors-page__loading">
          <div className="spinner"></div>
          <p>Loading mentors...</p>
        </div>
      ) : (
        <div className="mentors-page__grid">
          {mentors.map((mentor, index) => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              index={index}
              onEditSkills={() => openSkillsModal(mentor)}
              onApprove={() => handleApprove(mentor.id)}
              onReject={() => handleReject(mentor.id)}
            />
          ))}
        </div>
      )}

      {mentors.length === 0 && !loading && (
        <div className="mentors-page__empty">
          <User
            className="mentors-page__empty-icon"
            size={64}
            strokeWidth={1.5}
          />
          <h3 className="mentors-page__empty-title">No mentors found</h3>
          <p className="mentors-page__empty-text">
            Try adjusting your search criteria
          </p>
        </div>
      )}

      {/* Skills Modal - FIXED */}
      <Modal
        isOpen={isSkillsModalOpen}
        onClose={closeSkillsModal}
        title={`Manage Skills - ${selectedMentor?.user.fullName || ""}`}
        size="medium"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={closeSkillsModal}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveSkills}
              loading={actionLoading}
            >
              Save Skills
            </Button>
          </>
        }
      >
        <div className="mentors-page__skills-editor-header">
          <Award
            className="mentors-page__skills-editor-icon"
            size={24}
            strokeWidth={2}
          />
          <span className="mentors-page__skills-editor-title">
            Edit mentor skills and expertise levels
          </span>
        </div>

        <div className="mentors-page__skills-editor">
          {skills.map((skill, index) => (
            <div key={index} className="mentors-page__skill-item">
              <Input
                type="text"
                value={skill.name}
                onChange={(e) =>
                  handleSkillChange(index, "name", e.target.value)
                }
                placeholder="Skill name (e.g., IELTS Speaking)"
                fullWidth
              />
              <select
                className="mentors-page__skill-level-select"
                value={skill.level}
                onChange={(e) =>
                  handleSkillChange(index, "level", e.target.value)
                }
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              <button
                className="mentors-page__skill-remove-btn"
                onClick={() => handleRemoveSkill(index)}
                type="button"
              >
                <Trash2 size={16} strokeWidth={2} />
              </button>
            </div>
          ))}
          <button
            className="mentors-page__skill-add-btn"
            onClick={handleAddSkill}
          >
            <Plus size={20} strokeWidth={2} />
            <span>Add Skill</span>
          </button>
        </div>
      </Modal>
    </div>
  );
};

// ====================================
// Mentor Card Component - FIXED
// ====================================

interface MentorCardProps {
  mentor: MentorDTO;
  index: number;
  onEditSkills: () => void;
  onApprove: () => void;
  onReject: () => void;
}

const MentorCard: React.FC<MentorCardProps> = ({
  mentor,
  index,
  onEditSkills,
  onApprove,
  onReject,
}) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case "approved":
        return "approved";
      case "pending":
        return "pending";
      case "rejected":
        return "rejected";
      default:
        return "pending";
    }
  };

  const statusClass = getStatusClass(mentor.status);

  return (
    <div
      className="mentors-page__card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Status Badge - FIXED */}
      <div
        className={`mentors-page__status-badge mentors-page__status-badge--${statusClass}`}
      >
        {mentor.status === "approved" && (
          <CheckCircle size={14} strokeWidth={2} />
        )}
        {mentor.status === "pending" && <Calendar size={14} strokeWidth={2} />}
        {mentor.status === "rejected" && <XCircle size={14} strokeWidth={2} />}
        <span>{mentor.status}</span>
      </div>

      {/* Header - FIXED */}
      <div className="mentors-page__card-header">
        <div className="mentors-page__avatar">
          {mentor.user.avatar ? (
            <img src={mentor.user.avatar} alt={mentor.user.fullName} />
          ) : (
            <span>{mentor.user.fullName.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className="mentors-page__card-info">
          <h3 className="mentors-page__name">{mentor.user.fullName}</h3>
          <p className="mentors-page__email">
            <Mail size={14} strokeWidth={2} />
            {mentor.user.email}
          </p>
        </div>
      </div>

      {/* Bio - FIXED */}
      {mentor.bio && <p className="mentors-page__bio">{mentor.bio}</p>}

      {/* Stats - FIXED */}
      <div className="mentors-page__stats">
        <div className="mentors-page__stat">
          <Award
            className="mentors-page__stat-icon"
            size={18}
            strokeWidth={2}
          />
          <span className="mentors-page__stat-label">Experience</span>
          <span className="mentors-page__stat-value">
            {mentor.experience} years
          </span>
        </div>
        <div className="mentors-page__stat">
          <Star className="mentors-page__stat-icon" size={18} strokeWidth={2} />
          <span className="mentors-page__stat-label">Rating</span>
          <span className="mentors-page__stat-value">
            {mentor.rating.toFixed(1)}
          </span>
        </div>
        <div className="mentors-page__stat">
          <Calendar
            className="mentors-page__stat-icon"
            size={18}
            strokeWidth={2}
          />
          <span className="mentors-page__stat-label">Sessions</span>
          <span className="mentors-page__stat-value">
            {mentor.totalSessions}
          </span>
        </div>
      </div>

      {/* Skills - FIXED */}
      <div className="mentors-page__skills">
        {mentor.skills.slice(0, 3).map((skill) => (
          <span key={skill.id} className="mentors-page__skill">
            {skill.name}
          </span>
        ))}
        {mentor.skills.length > 3 && (
          <span className="mentors-page__skill mentors-page__skill--more">
            +{mentor.skills.length - 3} more
          </span>
        )}
      </div>

      {/* Actions - FIXED */}
      <div className="mentors-page__actions">
        <button
          className="mentors-page__action-btn mentors-page__action-btn--primary"
          onClick={onEditSkills}
        >
          <Edit3 size={16} strokeWidth={2} />
          <span>Edit Skills</span>
        </button>
        {mentor.status === "pending" && (
          <>
            <button
              className="mentors-page__action-btn mentors-page__action-btn--success"
              onClick={onApprove}
            >
              <CheckCircle size={16} strokeWidth={2} />
              <span>Approve</span>
            </button>
            <button
              className="mentors-page__action-btn mentors-page__action-btn--danger"
              onClick={onReject}
            >
              <XCircle size={16} strokeWidth={2} />
              <span>Reject</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
