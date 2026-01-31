import React from "react";
import FindFriendsSection from "../FindFriendsSection";
import "./FindFriendsModal.css";

interface FindFriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FindFriendsModal: React.FC<FindFriendsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="find-friends-modal-overlay" onClick={onClose}>
      <div
        className="find-friends-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="find-friends-modal-close" onClick={onClose}>
          ✕
        </button>
        <FindFriendsSection />
      </div>
    </div>
  );
};

export default FindFriendsModal;
