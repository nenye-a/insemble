import sgMail from '@sendgrid/mail';
import fs from 'fs';
import ejs from 'ejs';

import { SENDGRID_API_KEY } from '../constants/constants';

sgMail.setApiKey(SENDGRID_API_KEY);

let emailVerificationTemplate = fs
  .readFileSync('src/emailTemplates/emailVerification.html')
  .toString();

async function sendVerificationEmail(
  receiver: { email: string; name: string },
  link: string,
) {
  let htmlContent = ejs.render(emailVerificationTemplate, {
    name: receiver.name,
    url: link,
  });
  let msg = {
    to: receiver.email,
    from: 'Insemble <DELETED_EMAIL>',
    subject: 'Verify your email with Insemble',
    text: `Please verify your email by clicking this link ${link}`,
    html: htmlContent,
  };
  await sgMail.send(msg);
}

async function sendForgotPasswordEmail(
  receiver: { email: string; name: string },
  link: string,
) {
  let htmlContent = ejs.render(emailVerificationTemplate, {
    name: receiver.name,
    url: link,
  });
  let msg = {
    to: receiver.email,
    from: 'Insemble <DELETED_EMAIL>',
    subject: 'Forgot password user Insemble',
    text: `We received a request to reset the password directed to this e-mail address. Please proceed by clicking this link : ${link}`,
    html: htmlContent,
  };
  await sgMail.send(msg);
}

async function sendTenantMessageEmail(
  receiver: { email: string; name: string },
  link: string,
  sender: { email: string; name: string },
) {
  let htmlContent = ejs.render(emailVerificationTemplate, {
    name: receiver.name,
    url: link,
  });
  let msg = {
    to: receiver.email,
    from: 'Insemble <DELETED_EMAIL>',
    subject: 'Someone want to connected with you in Insemble',
    text: `Hi! ${sender.name} (${sender.email}) want to offer you his/her property. Join insemble or create your brand now: ${link}`, // TODO: Wording
    html: htmlContent,
  };
  await sgMail.send(msg);
}

async function sendLandlordMessageEmail(
  receiver: { email: string; name: string },
  link: string,
  sender: { email: string; name: string },
) {
  let htmlContent = ejs.render(emailVerificationTemplate, {
    name: receiver.name,
    url: link,
  });
  let msg = {
    to: receiver.email,
    from: 'Insemble <DELETED_EMAIL>',
    subject: 'Someone want to connected with you in Insemble',
    text: `Hi! ${sender.name} (${sender.email}) is interested with your property. Join insemble or create your property now: ${link}`, // TODO: Wording
    html: htmlContent,
  };
  await sgMail.send(msg);
}

export {
  sendVerificationEmail,
  sendForgotPasswordEmail,
  sendLandlordMessageEmail,
  sendTenantMessageEmail,
};
