import axios from "axios";
import { apiPOST, API_URL } from ".";

const apiAuth = (email, password, code) => {
  return new Promise((resolve, reject) => {
    apiPOST("/login/", { email, password, code })
      .then((res) => {
        let data = {
          user: res.data.user,
          token: res.data.token,
          userId: res.data.user_id,
          groups: res.data.groups,
          firstName: res.data.user.first_name,
          lastName: res.data.user.last_name,
          has_otp: res.data.has_otp || false,
        };
        if (res.data.patient_id != null) {
          data.patientId = res.data.patient_id;
        }
        if (res.data.doctor_id != null) {
          data.doctorId = res.data.doctor_id;
        }
        if (res.data.gp_id != null) {
          data.gpId = res.data.gp_id;
        }
        resolve(data);
      })
      .catch((err) =>
        reject({
          status: err.response.status,
          data: err.response.data,
        }),
      );
  });
};

export const checkPassword = async (password) => {
        
  return apiPOST(`/check-password/`, {
          password
  })
    .then((res) => res.data)
    .catch((err) =>
      Promise.reject({ status: err.response.status, data: err.response.data }),
    );
}

export const login = (email, password, code = null) => {
  // should return a token on success or error code and message
  return apiAuth(email, password, code);
};

export const authenticate = (token) => {
  return new Promise((resolve, reject) => {
    apiPOST("/auth/")
      .then((res) => {
        let data = {
          user: res.data.user,
          userId: res.data.user_id,
          groups: res.data.groups,
          firstName: res.data.first_name,
          lastName: res.data.last_name,
          has_otp: res.data.has_otp,
        };
        if (res.data.patient_id != null) {
          data.patientId = res.data.patient_id;
        }
        if (res.data.doctor_id != null) {
          data.doctorId = res.data.doctor_id;
        }
        if (res.data.gp_id != null) {
          data.gpId = res.data.gp_id;
        }
        resolve(data);
      })
      .catch((err) =>
        reject({
          status: err.response.status,
          data: err.response.data,
        }),
      );
  });
};

export const createOTP = async () => {
  return apiPOST(`/create-otp/`)
    .then((res) => res.data)
    .catch((err) =>
      Promise.reject({ status: err.response.status, data: err.response.data }),
    );
};

export const checkAndSaveOTP = async (secret, code) => {
  return apiPOST(`/check-save-otp/`, {
    secret,
    code,
  })
    .then((res) => res.data)
    .catch((err) =>
      Promise.reject({ status: err.response.status, data: err.response.data }),
    );
};

export const checkAndRemoveOTP = async (code) => {
  return apiPOST(`/check-remove-otp/`, {
    code,
  })
    .then((res) => res.data)
    .catch((err) =>
      Promise.reject({ status: err.response.status, data: err.response.data }),
    );
}
