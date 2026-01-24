// src/presentation/pages/admin/UsersPage/UsersPage.tsx
import React, { useState } from "react";
import {
  Search,
  UserCheck,
  UserX,
  Shield,
  GraduationCap,
  User,
  Mail,
  Calendar,
  AlertCircle,
  Filter,
  UserPlus,
  Edit3,
  Trash2,
} from "lucide-react";
import { Button } from "../../../components/atoms/Button/Button";
import { Modal } from "../../../components/organisms/Modal/Modal";
import { useUsers } from "../../../hooks/useUsers";
import "./UsersPage.css";

// Type definition for User DTO
interface UserDTO {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  avatar?: string;
  createdAt: string;
}

// Format date utility function
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return dateString;
  }
};

export const UsersPage: React.FC = () => {
  const {
    users,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    activateUser,
    deactivateUser,
    createUser,
    updateUser,
    deleteUser,
  } = useUsers();

  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);
  const [modalType, setModalType] = useState<
    "activate" | "deactivate" | "edit" | "delete" | "create" | null
  >(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [filterRole, setFilterRole] = useState<string>("all");

  // Form state for create/edit
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    roles: "ROLE_USER",
    isEnabled: true,
  });

  const handleStatusChange = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      if (modalType === "activate") {
        await activateUser(selectedUser.id);
      } else if (modalType === "deactivate") {
        await deactivateUser(selectedUser.id);
      }
      closeModal();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateOrUpdate = async () => {
    try {
      setActionLoading(true);
      if (modalType === "create") {
        await createUser(formData);
      } else if (modalType === "edit" && selectedUser) {
        await updateUser(selectedUser.id, formData);
      }
      closeModal();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      setActionLoading(true);
      await deleteUser(selectedUser.id);
      closeModal();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const openModal = (user: UserDTO, type: typeof modalType) => {
    setSelectedUser(user);
    setModalType(type);

    // Pre-fill form if editing
    if (type === "edit") {
      setFormData({
        email: user.email,
        password: "",
        firstName: user.fullName.split(" ")[0] || "",
        lastName: user.fullName.split(" ")[1] || "",
        roles: "ROLE_USER",
        isEnabled: user.status === "active",
      });
    } else if (type === "create") {
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        roles: "ROLE_USER",
        isEnabled: true,
      });
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalType(null);
    setFormData({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      roles: "ROLE_USER",
      isEnabled: true,
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin":
        return <Shield size={16} />;
      case "Mentor":
        return <GraduationCap size={16} />;
      default:
        return <User size={16} />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "red";
      case "Mentor":
        return "blue";
      default:
        return "gray";
    }
  };

  // Filter users by role
  const filteredUsers =
    filterRole === "all"
      ? users
      : users.filter((u) => u.role.toLowerCase() === filterRole.toLowerCase());

  return (
    <div className="users-page">
      {/* Header */}
      <header className="users-page__header glass-card">
        <div className="users-page__header-main">
          <div className="users-page__header-icon">
            <User size={24} />
          </div>
          <div>
            <h1 className="users-page__title">User Management</h1>
            <p className="users-page__subtitle">
              Manage all users, mentors, and learners
            </p>
          </div>
        </div>

        <div className="users-page__header-actions">
          <button
            className="users-page__add-btn"
            type="button"
            title="Add new user"
            aria-label="Add new user"
            onClick={() => openModal({} as UserDTO, "create")}
          >
            <UserPlus size={18} />
            <span>ADD</span>
          </button>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="users-page__error glass-card">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="users-page__controls glass-card">
        <div className="users-page__search">
          <Search className="users-page__search-icon" size={20} />
          <input
            type="text"
            className="users-page__search-input"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="users-page__filter">
          <Filter size={18} />
          <select
            className="users-page__filter-select"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            title="Filter users by role"
            aria-label="Filter users by role"
            disabled
          >
            <option value="all">All Learners</option>
          </select>
        </div>
      </div>

      {/* Users Table Card */}
      {loading ? (
        <div className="users-page__loading glass-card">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      ) : (
        <div className="users-page__table-card glass-card">
          <div className="users-page__table-wrapper">
            <table className="users-page__table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`users-page__table-row users-page__table-row--delay-${Math.min(index, 19)}`}
                  >
                    {/* User Info */}
                    <td>
                      <div className="users-page__user-cell">
                        <div className="users-page__user-avatar">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.fullName} />
                          ) : (
                            <span>{user.fullName.charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="users-page__user-info">
                          <div className="users-page__user-name">
                            {user.fullName}
                          </div>
                          <div className="users-page__user-email">
                            <Mail size={12} />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td>
                      <span
                        className={`users-page__role-badge users-page__role-badge--${getRoleColor(user.role)}`}
                      >
                        {getRoleIcon(user.role)}
                        {user.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td>
                      <span
                        className={`users-page__status-badge ${
                          user.status === "active"
                            ? "users-page__status-badge--active"
                            : "users-page__status-badge--inactive"
                        }`}
                      >
                        {user.status === "active" ? (
                          <UserCheck size={14} />
                        ) : (
                          <UserX size={14} />
                        )}
                        {user.status}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td>
                      <div className="users-page__date-cell">
                        <Calendar size={14} />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="users-page__actions-cell">
                        <button
                          className="users-page__action-btn users-page__action-btn--edit"
                          onClick={() => openModal(user, "edit")}
                          type="button"
                          title="Edit user"
                        >
                          <Edit3 size={16} />
                          <span>Sửa</span>
                        </button>

                        {user.status === "active" ? (
                          <button
                            className="users-page__action-btn users-page__action-btn--danger"
                            onClick={() => openModal(user, "deactivate")}
                            type="button"
                            title="Deactivate user"
                          >
                            <UserX size={16} />
                            <span>Tắt</span>
                          </button>
                        ) : (
                          <button
                            className="users-page__action-btn users-page__action-btn--success"
                            onClick={() => openModal(user, "activate")}
                            type="button"
                            title="Activate user"
                          >
                            <UserCheck size={16} />
                            <span>Bật</span>
                          </button>
                        )}

                        <button
                          className="users-page__action-btn users-page__action-btn--delete"
                          onClick={() => openModal(user, "delete")}
                          type="button"
                          title="Delete user"
                        >
                          <Trash2 size={16} />
                          <span>Xóa</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="users-page__empty">
              <div className="users-page__empty-icon">
                <User size={64} />
              </div>
              <h3 className="users-page__empty-title">No users found</h3>
              <p className="users-page__empty-text">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      )}

      {/* Create User Modal */}
      <Modal
        isOpen={modalType === "create"}
        onClose={closeModal}
        title="Create New User"
        size="medium"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={closeModal}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateOrUpdate}
              loading={actionLoading}
            >
              Create User
            </Button>
          </>
        }
      >
        <div className="users-page__modal-content">
          <div className="users-page__form-group">
            <label className="users-page__form-label">Email Address</label>
            <input
              type="email"
              placeholder="user@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="users-page__form-input"
            />
          </div>
          <div className="users-page__form-group">
            <label className="users-page__form-label">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="users-page__form-input"
            />
          </div>
          <div className="users-page__form-row">
            <div className="users-page__form-group">
              <label className="users-page__form-label">First Name</label>
              <input
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="users-page__form-input"
              />
            </div>
            <div className="users-page__form-group">
              <label className="users-page__form-label">Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="users-page__form-input"
              />
            </div>
          </div>
          <label className="users-page__form-checkbox">
            <input
              type="checkbox"
              checked={formData.isEnabled}
              onChange={(e) =>
                setFormData({ ...formData, isEnabled: e.target.checked })
              }
            />
            <span>Enable Account</span>
          </label>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={modalType === "edit"}
        onClose={closeModal}
        title="Edit User"
        size="medium"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={closeModal}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateOrUpdate}
              loading={actionLoading}
            >
              Update User
            </Button>
          </>
        }
      >
        <div className="users-page__modal-content">
          <div className="users-page__info-box">
            <span className="users-page__info-label">Email Address</span>
            <span className="users-page__info-value">{formData.email}</span>
          </div>
          <div className="users-page__form-row">
            <div className="users-page__form-group">
              <label className="users-page__form-label">First Name</label>
              <input
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="users-page__form-input"
              />
            </div>
            <div className="users-page__form-group">
              <label className="users-page__form-label">Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="users-page__form-input"
              />
            </div>
          </div>
          <label className="users-page__form-checkbox">
            <input
              type="checkbox"
              checked={formData.isEnabled}
              onChange={(e) =>
                setFormData({ ...formData, isEnabled: e.target.checked })
              }
            />
            <span>Enable Account</span>
          </label>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={modalType === "activate" || modalType === "deactivate"}
        onClose={closeModal}
        title={modalType === "activate" ? "Activate User" : "Deactivate User"}
        size="small"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={closeModal}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant={modalType === "activate" ? "success" : "danger"}
              onClick={handleStatusChange}
              loading={actionLoading}
            >
              Confirm
            </Button>
          </>
        }
      >
        <div className="users-page__modal-content">
          {modalType === "activate" ? (
            <UserCheck
              size={48}
              className="users-page__modal-icon users-page__modal-icon--success"
            />
          ) : (
            <UserX
              size={48}
              className="users-page__modal-icon users-page__modal-icon--danger"
            />
          )}
          <p className="users-page__modal-text">
            Are you sure you want to {modalType} user{" "}
            <strong>{selectedUser?.fullName}</strong>?
          </p>
        </div>
      </Modal>

      {/* Edit User Modal - TODO: Implement form */}
      <Modal
        isOpen={modalType === "delete"}
        onClose={closeModal}
        title="Delete User"
        size="small"
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={actionLoading}
            >
              Delete
            </Button>
          </>
        }
      >
        <div className="users-page__modal-content">
          <Trash2
            size={48}
            className="users-page__modal-icon users-page__modal-icon--danger"
          />
          <p className="users-page__modal-text">
            Are you sure you want to permanently delete{" "}
            <strong>{selectedUser?.fullName}</strong>? This action cannot be
            undone.
          </p>
        </div>
      </Modal>
    </div>
  );
};
