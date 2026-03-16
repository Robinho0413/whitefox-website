import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  senderEmail: string;
  subject: string;
  message: string;
}

export function EmailTemplate({ firstName, senderEmail, subject, message }: EmailTemplateProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: 1.5 }}>
      <h1>Nouveau message de contact</h1>
      <p>
        <strong>Nom:</strong> {firstName}
      </p>
      <p>
        <strong>Email:</strong> {senderEmail}
      </p>
      <p>
        <strong>Sujet:</strong> {subject}
      </p>
      <p>
        <strong>Message:</strong>
      </p>
      <p>{message}</p>
    </div>
  );
}