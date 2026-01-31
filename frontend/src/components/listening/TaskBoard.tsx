import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TaskBoard.css";

interface Task {
  id: number;
  title: string;
  description: string;
  targetPoints: number;
  rewardPoints: number;
  rewardDescription: string;
  completed: boolean;
  dueDate: string;
  taskType: string;
}

interface Progress {
  completedChallenges: number;
  totalPoints: number;
  currentStreak: number;
}

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [progress, setProgress] = useState<Progress>({
    completedChallenges: 0,
    totalPoints: 0,
    currentStreak: 0,
  });
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState<number | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await api.get("/api/listening/tasks/daily", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);

      // Calculate progress
      const completed = response.data.filter((t: Task) => t.completed).length;
      const totalReward = response.data.reduce(
        (sum: number, t: Task) => (t.completed ? sum + t.rewardPoints : sum),
        0,
      );

      setProgress({
        completedChallenges: completed,
        totalPoints: totalReward,
        currentStreak: 0,
      });
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId: number) => {
    setCompletingId(taskId);
    try {
      const token = localStorage.getItem("accessToken");
      await api.put(
        `/api/listening/tasks/${taskId}/complete`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      loadTasks();
    } catch (error) {
      console.error("Error completing task:", error);
    } finally {
      setCompletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="task-board loading">
        <div className="spinner"></div>
        <p>Đang tải nhiệm vụ...</p>
      </div>
    );
  }

  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const progressPercent =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="task-board">
      <div className="task-board-header">
        <h2>📋 Nhiệm vụ Hôm Nay</h2>
        <div className="progress-summary">
          <div className="summary-item">
            <span className="label">Hoàn thành:</span>
            <span className="value">
              {completedTasks}/{totalTasks}
            </span>
          </div>
          <div className="summary-item">
            <span className="label">Phần thưởng:</span>
            <span className="value points">+{progress.totalPoints}</span>
          </div>
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <span className="progress-text">{Math.round(progressPercent)}%</span>
      </div>

      <div className="tasks-list">
        {tasks.length === 0 ? (
          <div className="empty-tasks">
            <p>Không có nhiệm vụ cho hôm nay</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`task-item ${task.completed ? "completed" : ""}`}
            >
              <div className="task-checkbox">
                {task.completed ? (
                  <span className="check-icon">✓</span>
                ) : (
                  <span className="empty-box"></span>
                )}
              </div>

              <div className="task-content">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <div className="task-meta">
                  <span className="target-badge">🎯 {task.targetPoints}</span>
                  <span className="reward-badge">🎁 +{task.rewardPoints}</span>
                </div>
              </div>

              {!task.completed && (
                <button
                  className="task-action-btn"
                  onClick={() => handleCompleteTask(task.id)}
                  disabled={completingId === task.id}
                >
                  {completingId === task.id ? "..." : "Đạt được"}
                </button>
              )}

              {task.completed && (
                <div className="task-completed-badge">
                  <span className="badge-text">Đã hoàn thành</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="daily-tips">
        <h3>💡 Mẹo hôm nay</h3>
        <ul>
          <li>Nghe nhiều câu khác nhau để cải thiện kỹ năng tiếng Anh</li>
          <li>Ghi lại những từ mới bạn học được</li>
          <li>Thực hành đều đặn mỗi ngày để duy trì chuỗi học</li>
          <li>Đừng vội, hãy lắng nghe cẩn thận trước khi trả lời</li>
        </ul>
      </div>
    </div>
  );
};

export default TaskBoard;
