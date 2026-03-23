import api from "./api";

// ─── Dashboard ──────────────────────────────────────
export const getAdminDashboard = () =>
    api.get("/api/admin/dashboard");

// ─── Flats ──────────────────────────────────────────
export const getFlats = (page: number, limit = 5) =>
    api.get("/api/admin/flats", { params: { page, limit } });

export const createFlat = (data: {
    flat_number: string;
    owner_name: string;
    flat_type: string;
    address: string;
}) => api.post("/api/admin/flats", data);

export const updateFlat = (id: string, data: {
    flat_number: string;
    owner_name: string;
    flat_type: string;
    address: string;
}) => api.put(`/api/admin/flats/${id}`, data);

export const deleteFlat = (id: string) =>
    api.delete(`/api/admin/flats/${id}`);

export const restoreFlat = (id: string) =>
    api.put(`/api/admin/flats/${id}/restore`, {});

export const getAvailableResidents = () =>
    api.get("/api/admin/flats/available-residents");

export const assignResident = (flatId: string, residentId: string) =>
    api.put(`/api/admin/flats/${flatId}/assign-resident`, { resident_id: residentId });

export const registerResidentToFlat = (flatId: string, data: {
    full_name: string;
    email: string;
    phone_number: string;
}) => api.post(`/api/admin/flats/${flatId}/register-resident`, data);

// ─── Subscriptions ──────────────────────────────────
export const getSubscriptions = () =>
    api.get("/api/admin/subscriptions");

export const createSubscription = (data: { flat_type: string; monthly_rate: string }) =>
    api.post("/api/admin/subscriptions", data);

export const updateSubscription = (id: string, data: { monthly_rate: string }) =>
    api.put(`/api/admin/subscriptions/${id}`, data);

export const deleteSubscription = (id: string) =>
    api.delete(`/api/admin/subscriptions/${id}`);

// ─── Payment Entry ──────────────────────────────────
export const getPaymentEntryRecords = (month: string) =>
    api.get("/api/admin/payment-entry", { params: { month } });

export const submitPaymentEntry = (data: {
    record_id: string;
    payment_mode: string;
    payment_source: string;
    transaction_id: string;
}) => api.post("/api/admin/payment-entry", data);

// ─── Monthly Records ────────────────────────────────
export const getMonthlyRecords = (month: Date) =>
    api.get("/api/admin/monthly-records", { params: { month } });

export const markRecordPaid = (recordId: string) =>
    api.put(`/api/admin/monthly-records/${recordId}/mark-paid`, {});

// ─── Reports ────────────────────────────────────────
export const getMonthlyReport = (month: string) =>
    api.get("/api/admin/reports/monthly", { params: { month } });

// ─── Notifications ──────────────────────────────────
export const getAdminNotifications = () =>
    api.get("/api/admin/notifications");

export const sendNotification = (data: {
    title: string;
    message: string;
    recipient_ids: string[];
    send_to_all: boolean;
}) => api.post("/api/admin/notifications", data);

export const getResidents = () =>
    api.get("/api/admin/residents");

// ─── Profile ────────────────────────────────────────
export const getAdminProfile = () =>
    api.get("/api/admin/profile");

export const updateAdminProfile = (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
}) => api.put("/api/admin/profile", data);
