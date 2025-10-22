import { writable, derived } from 'svelte/store';
import type { Approval, ApprovalStatus, ApprovalType, DeploymentEnvironment } from '$lib/types';
import { mockApprovals } from '$lib/data/mockApprovals';
import { getCurrentUser } from '$lib/data/mockUsers';

interface ApprovalsState {
  approvals: Approval[];
  loading: boolean;
  error: string | null;
  selectedApproval: Approval | null;
  filters: {
    status: ApprovalStatus | 'all';
    type: ApprovalType | 'all';
    priority: 'all' | 'low' | 'medium' | 'high' | 'urgent';
    environment: DeploymentEnvironment | 'all';
  };
}

const initialState: ApprovalsState = {
  approvals: mockApprovals,
  loading: false,
  error: null,
  selectedApproval: null,
  filters: {
    status: 'all',
    type: 'all',
    priority: 'all',
    environment: 'all',
  },
};

function createApprovalsStore() {
  const { subscribe, set, update } = writable<ApprovalsState>(initialState);

  return {
    subscribe,

    // Load approvals
    loadApprovals: async () => {
      update((state) => ({ ...state, loading: true }));

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 400));

      update((state) => ({
        ...state,
        approvals: mockApprovals,
        loading: false,
      }));
    },

    // Select an approval
    selectApproval: (approvalId: string | null) => {
      update((state) => ({
        ...state,
        selectedApproval: approvalId
          ? state.approvals.find((a) => a.id === approvalId) || null
          : null,
      }));
    },

    // Approve an item
    approve: async (approvalId: string, comment?: string) => {
      update((state) => ({
        ...state,
        approvals: state.approvals.map((a) =>
          a.id === approvalId
            ? {
                ...a,
                status: 'approved' as ApprovalStatus,
                approver: getCurrentUser(),
                approvedAt: new Date(),
                comments: comment
                  ? [
                      ...(a.comments || []),
                      {
                        id: Math.random().toString(36).substr(2, 9),
                        author: getCurrentUser(),
                        content: comment,
                        createdAt: new Date(),
                      },
                    ]
                  : a.comments,
              }
            : a
        ),
      }));
    },

    // Reject an item
    reject: async (approvalId: string, reason: string) => {
      update((state) => ({
        ...state,
        approvals: state.approvals.map((a) =>
          a.id === approvalId
            ? {
                ...a,
                status: 'rejected' as ApprovalStatus,
                approver: getCurrentUser(),
                approvedAt: new Date(),
                comments: [
                  ...(a.comments || []),
                  {
                    id: Math.random().toString(36).substr(2, 9),
                    author: getCurrentUser(),
                    content: `Rejected: ${reason}`,
                    createdAt: new Date(),
                  },
                ],
              }
            : a
        ),
      }));
    },

    // Put on hold
    hold: async (approvalId: string, reason: string) => {
      update((state) => ({
        ...state,
        approvals: state.approvals.map((a) =>
          a.id === approvalId
            ? {
                ...a,
                status: 'on-hold' as ApprovalStatus,
                approver: getCurrentUser(),
                approvedAt: new Date(),
                comments: [
                  ...(a.comments || []),
                  {
                    id: Math.random().toString(36).substr(2, 9),
                    author: getCurrentUser(),
                    content: `On hold: ${reason}`,
                    createdAt: new Date(),
                  },
                ],
              }
            : a
        ),
      }));
    },

    // Add comment
    addComment: (approvalId: string, comment: string) => {
      update((state) => ({
        ...state,
        approvals: state.approvals.map((a) =>
          a.id === approvalId
            ? {
                ...a,
                comments: [
                  ...(a.comments || []),
                  {
                    id: Math.random().toString(36).substr(2, 9),
                    author: getCurrentUser(),
                    content: comment,
                    createdAt: new Date(),
                  },
                ],
              }
            : a
        ),
      }));
    },

    // Set filters
    setStatusFilter: (status: ApprovalStatus | 'all') => {
      update((state) => ({
        ...state,
        filters: { ...state.filters, status },
      }));
    },

    setTypeFilter: (type: ApprovalType | 'all') => {
      update((state) => ({
        ...state,
        filters: { ...state.filters, type },
      }));
    },

    setPriorityFilter: (priority: 'all' | 'low' | 'medium' | 'high' | 'urgent') => {
      update((state) => ({
        ...state,
        filters: { ...state.filters, priority },
      }));
    },

    setEnvironmentFilter: (environment: DeploymentEnvironment | 'all') => {
      update((state) => ({
        ...state,
        filters: { ...state.filters, environment },
      }));
    },

    // Clear all filters
    clearFilters: () => {
      update((state) => ({
        ...state,
        filters: initialState.filters,
      }));
    },
  };
}

export const approvalsStore = createApprovalsStore();

// Derived stores
export const filteredApprovals = derived(approvalsStore, ($store) => {
  let filtered = $store.approvals;

  if ($store.filters.status !== 'all') {
    filtered = filtered.filter((a) => a.status === $store.filters.status);
  }

  if ($store.filters.type !== 'all') {
    filtered = filtered.filter((a) => a.type === $store.filters.type);
  }

  if ($store.filters.priority !== 'all') {
    filtered = filtered.filter((a) => a.priority === $store.filters.priority);
  }

  if ($store.filters.environment !== 'all') {
    filtered = filtered.filter((a) => a.environment === $store.filters.environment);
  }

  return filtered;
});

export const pendingApprovals = derived(approvalsStore, ($store) =>
  $store.approvals.filter((a) => a.status === 'pending')
);

export const urgentApprovals = derived(pendingApprovals, ($pending) =>
  $pending.filter((a) => a.priority === 'urgent')
);

export const approvalMetrics = derived(approvalsStore, ($store) => {
  const pending = $store.approvals.filter((a) => a.status === 'pending');
  const approved = $store.approvals.filter((a) => a.status === 'approved');
  const rejected = $store.approvals.filter((a) => a.status === 'rejected');
  const onHold = $store.approvals.filter((a) => a.status === 'on-hold');

  return {
    total: $store.approvals.length,
    pending: pending.length,
    approved: approved.length,
    rejected: rejected.length,
    onHold: onHold.length,
    urgent: pending.filter((a) => a.priority === 'urgent').length,
  };
});
