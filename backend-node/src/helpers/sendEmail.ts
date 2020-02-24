import sgMail from '@sendgrid/mail';
import fs from 'fs';
import ejs from 'ejs';

import { SENDGRID_API_KEY } from '../constants/constants';

sgMail.setApiKey(SENDGRID_API_KEY);

let tenantVerificationTemplate = fs
  .readFileSync('src/emailTemplates/tenantVerification.html')
  .toString();

async function sendTenantVerificationEmail(
  receiver: { email: string; name: string },
  link: string,
) {
  let htmlContent = ejs.render(tenantVerificationTemplate, {
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

export { sendTenantVerificationEmail };
