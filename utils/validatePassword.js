// utils/passwordValidation.js
export const validatePassword = (password) => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (password.length > 16) {
    return "Password cannot be longer than 16 characters";
  }
  // if (!/[A-Z]/.test(password)) {
  //     return "Password must contain at least one uppercase letter";
  // }
  // if (!/[a-z]/.test(password)) {
  //     return "Password must contain at least one lowercase letter";
  // }
  // if (!/\d/.test(password)) {
  //     return "Password must contain at least one number";
  // }
  // if (!/[@$!%*?&]/.test(password)) {
  //     return "Password must contain at least one special character";
  // }
  return true;
};
