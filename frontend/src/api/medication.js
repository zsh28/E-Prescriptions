import { apiGET } from ".";

export const listMedication = () => {
  return new Promise((resolve, reject) => {
    apiGET("/medication/")
      .then((res) => resolve(res.data))
      .catch((err) =>
        reject({ status: err.response.status, data: err.response.data })
      )
  });
};
