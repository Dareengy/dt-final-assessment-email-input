import React, { useState, useEffect, useRef } from 'react';
import { fetchEmailSuggestions } from './emailService';
import './emailInput.css';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const EmailInput = () => {
    const [inputText, setInputText] = useState('');
    const [emails, setEmails] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [allOptions, setAllOptions] = useState([]);

    const inputRef = useRef(null);

    useEffect(() => {
        fetchEmailSuggestions().then(setAllOptions);
    }, []);

    useEffect(() => {
        if (!inputText.trim()) {
            setSuggestions([]);
            return;
        }

        const matches = allOptions.filter(email =>
            email.toLowerCase().startsWith(inputText.toLowerCase()) &&
            !emails.find(entry => entry.value === email)
        );

        setSuggestions(matches);
    }, [inputText, allOptions, emails]);

    const addEmail = (rawInput) => {
        const email = rawInput.trim();
        if (!email || emails.some(entry => entry.value === email)) return;

        const isValid = isValidEmail(email);
        setEmails(prev => [...prev, { value: email, valid: isValid }]);
        setInputText('');
        setSuggestions([]);
    };

    const removeEmail = (indexToRemove) => {
        setEmails(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleKey = (e) => {
        if (['Enter', 'Tab'].includes(e.key)) {
            e.preventDefault();
            addEmail(inputText);
        }
    };

    const handleSuggestionClick = (email) => {
        addEmail(email);
    };

    return (
        <div className="email-input-box">
            <label>
                <div className="tag-input">
                    {emails.map((item, index) => (
                        <span key={index} className={`tag ${item.valid ? 'valid' : 'invalid'}`}>
                            {item.value}
                            <button onClick={() => removeEmail(index)}>×</button>
                        </span>
                    ))}
                    <input
                        type="text"
                        ref={inputRef}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKey}
                        placeholder={emails.length === 0 ? 'Enter recipients...' : ''}
                    />
                </div>
            </label>

            {suggestions.length > 0 && (
                <ul className="suggestion-list">
                    {suggestions.map((email, idx) => (
                        <li key={idx} onClick={() => handleSuggestionClick(email)}>
                            {email}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default EmailInput;
