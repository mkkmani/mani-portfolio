import { assistantMessages } from "@/components/pages/contact/constants";

export const getRandomWelcomeMessage = () =>
  assistantMessages.greeting[
    Math.floor(Math.random() * assistantMessages.greeting.length)
  ];

export const getRandomVerificationMessage = () => {
  const num = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 6;
  const problem = `${num} + ${num2}`;
  const answer = num + num2;
  return {
    problem,
    answer,
  };
};

export const getRandomVerificationSuccessMessage = () => {
  return assistantMessages.verificationSuccess[
    Math.floor(Math.random() * assistantMessages.verificationSuccess.length)
  ];
};

export const getRandomVerificationFailMessage = () => {
  return assistantMessages.verificationFail[
    Math.floor(Math.random() * assistantMessages.verificationFail.length)
  ];
};

export const getRandomNameMessage = () => {
  return assistantMessages.name[
    Math.floor(Math.random() * assistantMessages.name.length)
  ];
};

export const getRandomEmailMessage = () => {
  return assistantMessages.email[
    Math.floor(Math.random() * assistantMessages.email.length)
  ];
};

export const getRandomInvalidEmailMessage = () => {
  return assistantMessages.invalidEmail[
    Math.floor(Math.random() * assistantMessages.invalidEmail.length)
  ];
};

export const getRandomMessageMessage = () => {
  return assistantMessages.message[
    Math.floor(Math.random() * assistantMessages.message.length)
  ];
};

export const getRandomConfirmationMessage = () => {
  return assistantMessages.confirmation[
    Math.floor(Math.random() * assistantMessages.confirmation.length)
  ];
};

export const getRandomGoodbyeMessage = () => {
  return assistantMessages.goodbye[
    Math.floor(Math.random() * assistantMessages.goodbye.length)
  ];
};