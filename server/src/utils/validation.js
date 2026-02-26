export const validateMessage = (message) => {
  if (typeof message !== 'string') {
    return 'message må være en tekststreng';
  }

  const trimmed = message.trim();

  if (trimmed.length < 2) {
    return 'message må ha minst 2 tegn';
  }

  if (trimmed.length > 2000) {
    return 'message kan ikke være lengre enn 2000 tegn';
  }

  return null;
};
