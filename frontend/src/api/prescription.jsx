import { apiGET, apiPATCH, apiPOST } from ".";

export const getPrescriptions = async (status = null) => {
    const statusStr = status ? `?status=${status}` : ''
    const url = `/prescriptions/${statusStr}`
  return apiGET(url)
    .then((res) => res.data)
    .catch((err) =>
      Promise.reject({ status: err.response.status, data: err.response.data }),
    );
};

export const getCollectedPrescriptions = async () => {
  return apiGET(`/prescriptions/`, {
    params: {
      status: "collected",
    },
  })
    .then((res) => res.data)
    .catch((err) =>
      Promise.reject({ status: err.response.status, data: err.response.data }),
    );
};

export const setRequestStatus = async (requestId, status) => {
  return apiPATCH(`/requests/${requestId}/`, {
          status
  })
    .then((res) => res.data)
    .catch((err) =>
      Promise.reject({ status: err.response.status, data: err.response.data }),
    );
}

export const setPrescriptionStatus = async (prescriptionId, status) => {
  return apiPATCH(`/prescriptions/${prescriptionId}/`, {
          status
  })
    .then((res) => res.data)
    .catch((err) =>
      Promise.reject({ status: err.response.status, data: err.response.data }),
    );
}
