import React, { useState } from 'react';

const TextSummarizer = ({ inputText }) => {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSummarize = async () => {
        if (!inputText.trim()) {
            alert('Input text is required to generate a summary.');
            return;
        }

        setIsLoading(true);
        try {
            const { GoogleGenerativeAI } = require('@google/generative-ai');

            const genAI = new GoogleGenerativeAI("AIzaSyBc6UyYtH-TJwdraFTEGP73tjzL6N08Lvc");
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

            const prompt = `You are an AI assistant and you need to summarize this text: ${inputText}`;

            const result = await model.generateContent(prompt);
            setSummary(result.response.text);
        } catch (error) {
            console.error('Error summarizing text:', error);
            alert('An error occurred while summarizing the text.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <button className='summarize' onClick={handleSummarize} disabled={isLoading}>
                {isLoading ? 'Summarizing...' : 'Summary'}
            </button>
            <br /><br /><br />
            {summary && (
                <div className='summary_container'>
                    <h2>Summary</h2>
                    <p>{summary}</p>
                </div>
            )}
        </div>
    );
};

export default TextSummarizer;