'use client'

// components/MessageItem.js

import React from 'react';
import { User } from 'lucide-react';

const MessageItem = ({ message }) => {
    const { content, isUser } = message;
    return (
        <div className="flex justify-center items-start space-x-2">
            {isUser && (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center">
                    <User size={20} color="white" />
                </div>
            )}
            <div className="w-64 sm:w-80 md:w-96 lg:w-[30rem] xl:w-[36rem]">
                <div
                    className={`rounded-lg p-3 break-words ${
                        isUser ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
                    }`}
                >
                    {content}
                </div>
            </div>
            {!isUser && <div className="w-8 h-8 flex-shrink-0" />} {/* Spacer for AI messages */}
        </div>
    );
};

export default MessageItem;
