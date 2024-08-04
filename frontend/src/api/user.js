import { apiGET, apiPOST, apiPATCH, apiDELETE } from ".";

export const getModel = async () => {
  return apiGET(`/model/`)
    .then((res) => res.data)
    .catch((err) =>
      Promise.reject({ status: err.response.status, data: err.response.data }),
    );
};

export const getPatientInfo = (patientId) => {
  return new Promise((resolve, reject) => {
    apiGET(`/patient/${patientId}/`)
      .then((res) => resolve({ ...res.data }))
      .catch((err) =>
        reject({ status: err.response.status, data: err.response.data }),
      );
  });
};

export const register = (data) => {
  return new Promise((resolve, reject) => {
    apiPOST(`/register/`, data)
      .then((res) => resolve({ ...res.data }))
      .catch((err) =>
        reject({ status: err.response.status, data: err.response.data }),
      );
  });
};

const validateRegisterData = (data, handleError) => {
  return new Promise((resolve, reject) => {
    register(data)
      .then((res) => resolve(res))
      .catch((err) => {
        handleError(err, resolve, reject);
      });
  });
};

export const validateDateOfBirth = (year, month, day) => {
  // very cheeky, just try registering with just the date of birth and extract the error message
  return new Promise((resolve, reject) => {
    register({
      date_of_birth: `${year}-${month}-${day}`,
    })
      .then((res) => resolve(res))
      .catch((err) => {
        if (!err.data.date_of_birth) {
          resolve(err);
          return;
        }
        reject(err.data.date_of_birth.join("\n"));
      });
  });
};

export const validateCredentials = (creds) => {
  return validateRegisterData(
    { user: { ...creds } },
    (err, resolve, reject) => {
      const error = {
        email: err.data.user?.email,
        password: err.data.user?.password,
        phone: err.data.user?.phone
      };
      if (!error.email && !error.password && !error.phone) {
        resolve(err);
        return;
      }
      reject(err.data.user);
    },
  );
};


export const validatePersonalInfo = ({
  title,
  firstName,
  lastName,
  phone,
  postcode,
}) => {
  return validateRegisterData(
    {
      title,
      phone,
      postcode,
      user: {
        first_name: firstName,
        last_name: lastName,
      },
    },
    (err, resolve, reject) => {
      const error = {
        title: err.data.title,
        phone: err.data.phone,
        postcode: err.data.postcode,
        firstName: err.data.user?.first_name,
        lastName: err.data.user?.last_name,
      };

      const noError = Object.values(error).every((x) => x == null);
      if (noError) {
        resolve(err);
      } else {
        reject(error);
      }
    },
  );
};

export const updatePatient = (patientId, data) => {
  return new Promise((resolve, reject) => {
    apiPATCH(`/patient/${patientId}/`, data)
      .then((res) => resolve({ ...res.data }))
      .catch((err) =>
        reject({ status: err.response.status, data: err.response.data }),
      );
  });
};

export const changePassword = (currentPassword, newPassword) => {
  return new Promise((resolve, reject) => {
    apiPOST(`/changepassword/`, { currentPassword, newPassword })
      .then((res) => resolve(res.data))
      .catch((err) =>
        reject({ status: err.response.status, data: err.response.data.error }),
      );
  });
};

export const getLogins = async () => {
  return apiGET(`/logins/`, {
    read: true,
  })
    .then((res) => res.data)
    .catch((err) =>
      Promise.reject({ status: err.response.status, data: err.response.data }),
    );
}

export const updateGP = async (gpId, data) => {
  return apiPATCH(`/gp/${gpId}/`, data)
    .then((res) => res.data)
    .catch((err) =>
      Promise.reject({ status: err.response.status, data: err.response.data }),
    );
}
export const updateDoctor = async (doctorId, data) => {
  return apiPATCH(`/doctor/${doctorId}/`, data)
    .then((res) => res.data)
    .catch((err) =>
      Promise.reject({ status: err.response.status, data: err.response.data }),
    );
}

export const downloadData = async () => {
    return apiGET(`/download-data/`)
}

export const deleteUser = async (userId) => {
  return apiDELETE(`/user/${userId}`)
    .then((res) => res.data)
    .catch((err) =>
      Promise.reject({ status: err.response.status, data: err.response.data }),
    );
}
