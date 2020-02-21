const VALID_EMAIL_REG = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const NUMBER_REG = /^[1-9][0-9]*$/;

const USA_PHONE_NUMBER_REG = /^(1\s?)?((\([0-9]{3}\))|[0-9]{3})[\s\-]?[\0-9]{3}[\s\-]?[0-9]{4}$/;

export function validateEmail(email: string) {
  return VALID_EMAIL_REG.test(email);
}

export function validateNumber(field: string) {
  return NUMBER_REG.test(field);
}

export function validateUSPhoneNumber(field: string) {
  return USA_PHONE_NUMBER_REG.test(field);
}
