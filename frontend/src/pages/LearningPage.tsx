import React from "react";
import LearningExercise from "../components/learning/LearningExercise";
import "./LearningPage.css";

const LearningPage: React.FC = () => {
  const handleXpEarned = (xp: number) => {
    console.log(`Earned ${xp} XP!`);
    // Có thể thêm notification hoặc cập nhật stats ở đây
  };

  return (
    <div className="learning-page">
      <div className="learning-container">
        <div className="learning-header">
          <h1>📚 Luyện tập</h1>
          <p>Chọn loại bài tập và bắt đầu học để kiếm XP!</p>
        </div>

        <LearningExercise onXpEarned={handleXpEarned} />
      </div>
    </div>
  );
};

export default LearningPage;
