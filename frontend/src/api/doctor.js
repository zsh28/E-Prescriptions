import { apiGET } from ".";

export const getGPDoctors = async () => {
  return apiGET(`/doctors/`)
    .then((res) => res.data)
    .catch((err) =>
      Promise.reject({ status: err.response.status, data: err.response.data }),
    );

}
