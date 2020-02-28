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
    from: 'Insemble <no-reply@insemble.co>',
    subject: 'Verify your email with Insemble',
    text: `Please verify your email by clicking this link ${link}`,
    html: htmlContent,
  };
  await sgMail.send(msg);
}

export { sendVerificationEmail };
