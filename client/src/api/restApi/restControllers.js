import http from '../interceptor';

// User
export const registerRequest = (data) => http.post('user/registration', data);
export const loginRequest = (data) => http.post('user/login', data);
export const getUserRequest = () => http.get('user/getUser');
export const updateUserRequest = (data) => http.put('user/updateUser', data);

// Info
export const createInfoRequest = (data) => http.post('info', data);
export const getInfoRequest = (params) => http.get('info', { params });
export const getInfoByIdRequest = (id) => http.get(`info/${id}`);
export const updateInfoRequest = ({ id, data }) => http.put(`info/${id}`, data);
export const deleteInfoRequest = (id) => http.delete(`info/${id}`);

// Tasks
export const createReviewTaskRequest = (data) => http.post('tasks', data);
export const getAllTasksRequest = (params) => http.get('tasks', { params });
export const getTaskByIdRequest = (taskId) => http.get(`tasks/${taskId}`);
export const updateTaskRequest = ({ taskId, data }) =>
  http.put(`tasks/${taskId}`, data);
export const deleteTaskRequest = (taskId) => http.delete(`tasks/${taskId}`);

// Submissions
export const createSubmissionRequest = (data) => http.post('submissions', data);
export const getMyGradesRequest = () => http.get('submissions/my-grades');
export const getPendingSubmissionsRequest = (params) =>
  http.get('submissions/pending', { params });
export const gradeSubmissionRequest = ({ submissionId, data }) =>
  http.patch(`submissions/${submissionId}/grade`, data);

// Vacancies
export const createVacancyRequest = (data) => http.post('vacancy', data);
export const getVacanciesRequest = (params) => http.get('vacancy', { params });
export const getVacancyByIdRequest = (vacancyId) =>
  http.get(`vacancy/${vacancyId}`);
export const updateVacancyRequest = ({ vacancyId, data }) =>
  http.patch(`vacancy/${vacancyId}`, data);
export const deleteVacancyRequest = (vacancyId) =>
  http.delete(`vacancy/${vacancyId}`);

// Solutions
export const createSolutionRequest = (data) => http.post('solution', data);
export const updateSolutionRequest = ({ solutionId, data }) =>
  http.patch(`solution/${solutionId}`, data);
export const acceptSolutionRequest = (solutionId) =>
  http.post(`solution/${solutionId}/accept`);
export const rejectSolutionRequest = (solutionId) =>
  http.post(`solution/${solutionId}/reject`);

// Payouts
export const topUpBalanceRequest = (data) =>
  http.post('payout/upBalance', data);
export const withdrawFundsRequest = (data) =>
  http.post('payout/withdraw', data);
