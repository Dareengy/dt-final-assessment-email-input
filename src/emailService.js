import emails from './emails';

export const fetchEmailSuggestions = () => {
    return new Promise((resolve) => {
    setTimeout(() => {
        resolve(emails);
    }, 200); 
    });
};
