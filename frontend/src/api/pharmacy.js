import { apiGET, apiPATCH } from ".";

export const listPharmacies = async () => {
  return apiGET(`/pharmacies/`)
    .then((res) => res.data)
    .catch((err) =>
      Promise.reject({ status: err.response.status, data: err.response.data }),
    );
};

export const changePharmacy = async (patientId, pharmacyId) => {
  return apiPATCH(`/patient/${patientId}/`, {
    pharmacy: pharmacyId,
  })
    .then((res) => res.data)
    .catch((err) =>
      Promise.reject({ status: err.response.status, data: err.response.data }),
    );
};
