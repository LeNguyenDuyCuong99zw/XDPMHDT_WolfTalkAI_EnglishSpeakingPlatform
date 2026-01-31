import React, { useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  DollarSign,
  Calendar,
  Award,
  AlertCircle,
  PackagePlus,
  ToggleLeft,
  ToggleRight,
  Search,
  Package,
  Loader2,
} from "lucide-react";
import { Button } from "../../../components/atoms/Button/Button";
import { Modal } from "../../../components/organisms/Modal/Modal";
import { Input } from "../../../components/atoms/Input/Input";
import { usePlans } from "../../../hooks/usePlans";
import "./PlansPage.css";

interface PlanFeature {
  name: string;
  included: boolean;
}

export const PlansPage: React.FC = () => {
  const {
    plans,
    loading,
    error,
    createPlan,
    updatePlan,
    deletePlan,
    togglePlanStatus,
  } = usePlans();

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanDTO | null>(null);
  const [formData, setFormData] = useState<
    CreatePlanDTO & { isActive?: boolean }
  >({
    name: "",
    description: "",
    price: 0,
    currency: "VND",
    durationDays: 30,
    features: [],
    hasMentor: false,
    isActive: true,
  });
  const [features, setFeatures] = useState<PlanFeature[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  const openCreateModal = () => {
    setSelectedPlan(null);
    setFormData({
      name: "",
      description: "",
      price: 0,
      currency: "VND",
      durationDays: 30,
      features: [],
      hasMentor: false,
      isActive: true,
    });
    setFeatures([]);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (plan: PlanDTO) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      currency: plan.currency,
      durationDays: plan.durationDays,
      features: plan.features,
      hasMentor: plan.hasMentor,
      isActive: plan.isActive,
    });
    setFeatures(
      plan.features.map((f) => ({ name: f.name, included: f.included })),
    );
    setIsCreateModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPlan(null);
    setIsCreateModalOpen(false);
  };

  const handleAddFeature = () => {
    setFeatures([...features, { name: "", included: true }]);
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleFeatureChange = (
    index: number,
    field: keyof PlanFeature,
    value: string | boolean,
  ) => {
    const updated = [...features];
    updated[index][field] = value as never;
    setFeatures(updated);
  };

  const handleSubmit = async () => {
    try {
      setActionLoading(true);
      const submitData = {
        ...formData,
        features: features.map((f) => ({
          name: f.name,
          included: f.included,
        })),
      };

      if (selectedPlan) {
        await updatePlan(selectedPlan.id, submitData);
      } else {
        await createPlan(submitData);
      }
      closeModal();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    try {
      await deletePlan(id);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      await togglePlanStatus(id, !isActive);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredPlans = plans.filter(
    (plan) =>
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading && plans.length === 0) {
    return (
      <div className="plans-page plans-page--loading">
        <Loader2 className="plans-page__spinner" size={48} strokeWidth={2} />
        <p className="plans-page__loading-text">Loading plans...</p>
      </div>
    );
  }

  return (
    <div className="plans-page">
      {/* Header */}
      <div className="plans-page__header">
        <div className="plans-page__header-main">
          <div className="plans-page__header-icon">
            <Package size={28} strokeWidth={2} />
          </div>
          <div className="plans-page__header-content">
            <h1 className="plans-page__title">Subscription Plans</h1>
            <p className="plans-page__subtitle">
              Manage your pricing tiers and features
            </p>
          </div>
        </div>
        <button className="plans-page__create-btn" onClick={openCreateModal}>
          <Plus size={20} strokeWidth={2} />
          <span>Create Plan</span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="plans-page__error">
          <AlertCircle size={20} strokeWidth={2} />
          <span>{error}</span>
        </div>
      )}

      {/* Search */}
      <div className="plans-page__controls">
        <div className="plans-page__search">
          <Search
            className="plans-page__search-icon"
            size={20}
            strokeWidth={2}
          />
          <input
            type="text"
            className="plans-page__search-input"
            placeholder="Search by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {filteredPlans.length > 0 ? (
        <div className="plans-page__grid">
          {filteredPlans.map((plan, index) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              index={index}
              onEdit={() => openEditModal(plan)}
              onDelete={() => handleDelete(plan.id)}
              onToggleStatus={() => handleToggleStatus(plan.id, plan.isActive)}
            />
          ))}
        </div>
      ) : (
        <div className="plans-page__empty">
          <Package
            className="plans-page__empty-icon"
            size={64}
            strokeWidth={1.5}
          />
          <h3 className="plans-page__empty-title">No plans found</h3>
          <p className="plans-page__empty-text">
            {searchQuery
              ? "Try adjusting your search criteria"
              : "Create your first subscription plan to get started"}
          </p>
          {!searchQuery && (
            <button
              className="plans-page__create-btn"
              onClick={openCreateModal}
            >
              <Plus size={20} strokeWidth={2} />
              <span>Create Your First Plan</span>
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={closeModal}
        title={selectedPlan ? "Edit Plan" : "Create New Plan"}
        size="large"
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
              onClick={handleSubmit}
              loading={actionLoading}
            >
              {selectedPlan ? "Update Plan" : "Create Plan"}
            </Button>
          </>
        }
      >
        <form
          className="plans-page__form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* Name */}
          <Input
            label="Plan Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Premium Plan"
            required
            fullWidth
          />

          {/* Description */}
          <div className="plans-page__form-group">
            <label className="plans-page__form-label">Description</label>
            <textarea
              className="plans-page__form-textarea"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe what this plan offers..."
              rows={3}
            />
          </div>

          {/* Price & Duration Row */}
          <div className="plans-page__form-row">
            <Input
              label="Price (VND)"
              type="number"
              value={formData.price.toString()}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
              placeholder="0"
              required
              fullWidth
            />
            <Input
              label="Duration (days)"
              type="number"
              value={formData.durationDays.toString()}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  durationDays: Number(e.target.value),
                })
              }
              placeholder="30"
              required
              fullWidth
            />
          </div>

          {/* Status Toggle */}
          <div className="plans-page__form-toggle">
            <div className="plans-page__form-toggle-content">
              <span className="plans-page__form-toggle-label">Plan Status</span>
              <span className="plans-page__form-toggle-desc">
                {formData.isActive
                  ? "Active - Visible to users"
                  : "Inactive - Hidden from users"}
              </span>
            </div>
            <button
              type="button"
              className={`plans-page__toggle-btn ${
                formData.isActive ? "plans-page__toggle-btn--active" : ""
              }`}
              onClick={() =>
                setFormData({ ...formData, isActive: !formData.isActive })
              }
            >
              {formData.isActive ? (
                <ToggleRight size={24} strokeWidth={2} />
              ) : (
                <ToggleLeft size={24} strokeWidth={2} />
              )}
            </button>
          </div>

          {/* Mentor Checkbox */}
          <div className="plans-page__form-checkbox">
            <input
              type="checkbox"
              id="hasMentor"
              checked={formData.hasMentor}
              onChange={(e) =>
                setFormData({ ...formData, hasMentor: e.target.checked })
              }
            />
            <label htmlFor="hasMentor">
              <Award size={18} strokeWidth={2} />
              <span>Include Personal Mentor Support</span>
            </label>
          </div>

          {/* Features Editor */}
          <div className="plans-page__features-editor">
            <div className="plans-page__features-editor-header">
              <Award size={20} strokeWidth={2} />
              <span>Plan Features</span>
            </div>

            <div className="plans-page__features-list">
              {features.map((feature, index) => (
                <div key={index} className="plans-page__feature-item">
                  <Input
                    type="text"
                    value={feature.name}
                    onChange={(e) =>
                      handleFeatureChange(index, "name", e.target.value)
                    }
                    placeholder="e.g., 50 practice sessions"
                    fullWidth
                  />
                  <div className="plans-page__feature-toggle">
                    <input
                      type="checkbox"
                      id={`feature-${index}`}
                      checked={feature.included}
                      onChange={(e) =>
                        handleFeatureChange(index, "included", e.target.checked)
                      }
                    />
                    <label htmlFor={`feature-${index}`}>
                      {feature.included ? (
                        <>
                          <Check size={14} strokeWidth={2.5} />
                          <span>Yes</span>
                        </>
                      ) : (
                        <>
                          <X size={14} strokeWidth={2.5} />
                          <span>No</span>
                        </>
                      )}
                    </label>
                  </div>
                  <button
                    className="plans-page__feature-remove-btn"
                    onClick={() => handleRemoveFeature(index)}
                    type="button"
                  >
                    <Trash2 size={16} strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="plans-page__feature-add-btn"
              onClick={handleAddFeature}
            >
              <Plus size={18} strokeWidth={2} />
              <span>Add Feature</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// Plan Card Component
interface PlanCardProps {
  plan: PlanDTO;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  index,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <div
      className={`plans-page__card ${!plan.isActive ? "plans-page__card--inactive" : ""}`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Badge */}
      <div
        className={`plans-page__status-badge ${
          plan.isActive
            ? "plans-page__status-badge--active"
            : "plans-page__status-badge--inactive"
        }`}
      >
        {plan.isActive ? (
          <>
            <Check size={12} strokeWidth={3} />
            <span>Active</span>
          </>
        ) : (
          <>
            <X size={12} strokeWidth={3} />
            <span>Inactive</span>
          </>
        )}
      </div>

      {/* Header */}
      <div className="plans-page__card-header">
        <h3 className="plans-page__card-name">{plan.name}</h3>
        <p className="plans-page__card-description">{plan.description}</p>
      </div>

      {/* Pricing */}
      <div className="plans-page__pricing">
        <div className="plans-page__price-wrapper">
          <DollarSign size={24} strokeWidth={2.5} />
          <span className="plans-page__price">
            {formatCurrency(plan.price, plan.currency)}
          </span>
        </div>
        <div className="plans-page__duration">
          <Calendar size={14} strokeWidth={2} />
          <span>{plan.durationDays} days access</span>
        </div>
      </div>

      {/* Features */}
      <div className="plans-page__features">
        <h4 className="plans-page__features-title">What's Included</h4>
        <ul className="plans-page__features-list">
          {plan.features.map((feature, idx) => (
            <li
              key={idx}
              className={`plans-page__feature-item ${
                feature.included
                  ? "plans-page__feature-item--included"
                  : "plans-page__feature-item--excluded"
              }`}
            >
              {feature.included ? (
                <Check
                  size={16}
                  strokeWidth={2.5}
                  className="plans-page__feature-icon plans-page__feature-icon--check"
                />
              ) : (
                <X
                  size={16}
                  strokeWidth={2.5}
                  className="plans-page__feature-icon plans-page__feature-icon--x"
                />
              )}
              <span>{feature.name}</span>
            </li>
          ))}
          {plan.hasMentor && (
            <li className="plans-page__feature-item plans-page__feature-item--mentor">
              <Award
                size={16}
                strokeWidth={2.5}
                className="plans-page__feature-icon plans-page__feature-icon--award"
              />
              <span>Personal Mentor Support</span>
            </li>
          )}
        </ul>
      </div>

      {/* Actions */}
      <div className="plans-page__actions">
        <button
          className="plans-page__action-btn plans-page__action-btn--primary"
          onClick={onEdit}
        >
          <Edit3 size={16} strokeWidth={2} />
          <span>Edit</span>
        </button>
        <button
          className={`plans-page__action-btn ${
            plan.isActive
              ? "plans-page__action-btn--secondary"
              : "plans-page__action-btn--success"
          }`}
          onClick={onToggleStatus}
        >
          {plan.isActive ? (
            <>
              <ToggleLeft size={16} strokeWidth={2} />
              <span>Deactivate</span>
            </>
          ) : (
            <>
              <ToggleRight size={16} strokeWidth={2} />
              <span>Activate</span>
            </>
          )}
        </button>
        <button
          className="plans-page__action-btn plans-page__action-btn--danger"
          onClick={onDelete}
        >
          <Trash2 size={16} strokeWidth={2} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};
