import { apiDELETE, apiGET, apiPATCH, apiPOST } from ".";

export const fetchPrescriptionRequests = () => {
  return new Promise((resolve, reject) => {
    apiGET("/requests/")
      .then((res) => resolve(res.data))
      .catch((err) =>
        reject({ status: err.response.status, data: err.response.data }),
      );
  });
};

export const cancelRequest = (requestId) => {
  return new Promise((resolve, reject) => {
    apiDELETE(`/requests/${requestId}/`)
      .then((res) => resolve(res.data))
      .catch((err) =>
        reject({ status: err.response.status, data: err.response.data }),
      );
  });
};

export const createPrescriptionRequest = async (medicationId, reason) => {
  return apiPOST(`/requests/`, {
    medication: medicationId,
    reason: reason,
  })
    .then((res) => res.data)
    .catch((err) =>
      Promise.reject({ status: err.response.status, data: err.response.data }),
    );
};

export const getPatients = async () => {
  return apiGET(`/patients/`)
    .then((res) => res.data)
    .catch((err) =>
      Promise.reject({ status: err.response.status, data: err.response.data }),
    );
};

export const invitePatient = async (patientId, gpId) => {
  return apiPOST(`/invites/`, {
    patient: patientId,
    gp: gpId,
  })
    .then((res) => res.data)
    .catch((err) =>
      Promise.reject({ status: err.response.status, data: err.response.data }),
    );
};

export const getInvites = async () => {
  return apiGET(`/invites`)
    .then((res) => res.data)
    .catch((err) =>
      Promise.reject({ status: err.response.status, data: err.response.data }),
    );
};

export const findPatient = async (email) => {
  return apiPOST(`/find/`, {
    email: email,
  })
    .then((res) => res.data)
    .catch((err) =>
      Promise.reject({ status: err.response.status, data: err.response.data }),
    );
};

export const deleteInvite = async (inviteId) => {
  return apiDELETE(`/invites/${inviteId}/`)
    .then((res) => res.data)
    .catch((err) =>
      Promise.reject({ status: err.response.status, data: err.response.data }),
    );
};

export const acceptInvite = async (inviteId) => {
  return apiPOST(`/accept-invite/${inviteId}/`)
    .then((res) => res.data)
    .catch((err) =>
      Promise.reject({ status: err.response.status, data: err.response.data }),
    );
};

export const getMessages = async () => {
  return apiGET(`/messages/`)
    .then((res) => res.data)
    .catch((err) =>
      Promise.reject({ status: err.response.status, data: err.response.data }),
    );
};

export const markMessageRead = async (messageId) => {
  return apiPATCH(`/messages/${messageId}/`, {
    read: true,
  })
    .then((res) => res.data)
    .catch((err) =>
      Promise.reject({ status: err.response.status, data: err.response.data }),
    );
};
