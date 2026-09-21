import { createContext, useContext } from 'react';

// toast(text, type) و confirm({ title, message, confirmLabel }) => Promise<boolean>
export const FeedbackContext = createContext(null);

export const useFeedback = () => useContext(FeedbackContext);
