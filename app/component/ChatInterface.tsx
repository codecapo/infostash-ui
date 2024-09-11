'use client'

import React, { useState, useRef } from 'react';
import { User, Send, Plus, Minus, File, Image, Music, Video, PanelRightOpen, PanelRightClose } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const ChatInterface = () => {
    const [messages, setMessages] = useState([]);
    const [isHomeDrawerOpen, setIsHomeDrawerOpen] = useState(false);
    const [isContentDrawerOpen, setIsContentDrawerOpen] = useState(false);

    const addMessage = (content, isUser) => {
        setMessages([...messages, { content, isUser }]);
    };

    return (
        <div className="flex h-screen">
            <div className="flex-grow flex flex-col">
                <div className="flex-grow overflow-hidden">
                    <ScrollArea className="h-full p-4">
                        <MessageList messages={messages} />
                    </ScrollArea>
                </div>
                <div className="p-4 bg-background flex justify-center">
                    <div className="w-1/3">
                        <InputArea onSendMessage={(content) => addMessage(content, true)} />
                    </div>
                </div>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 right-4 z-50"
                onClick={() => setIsHomeDrawerOpen(!isHomeDrawerOpen)}
            >
                {isHomeDrawerOpen ? <PanelRightClose className="h-6 w-6" /> : <PanelRightOpen className="h-6 w-6" />}
            </Button>
            <HomeDrawerComponent
                isOpen={isHomeDrawerOpen}
                onClose={() => setIsHomeDrawerOpen(false)}
                onOpenContentDrawer={() => {
                    setIsHomeDrawerOpen(false);
                    setIsContentDrawerOpen(true);
                }}
            />
            <DrawerComponent
                isOpen={isContentDrawerOpen}
                onClose={() => setIsContentDrawerOpen(false)}
            />
        </div>
    );
};;

const MessageList = ({ messages }) => {
    return (
        <div className="space-y-4">
            {messages.map((message, index) => (
                <MessageItem key={index} message={message} />
            ))}
        </div>
    );
};

const MessageItem = ({ message }) => {
    const { content, isUser } = message;
    return (
        <div className="flex items-start space-x-2">
            {isUser ? (
                <Avatar>
                    <AvatarFallback>
                        <User className="w-6 h-6" />
                    </AvatarFallback>
                </Avatar>
            ) : (
                <Avatar>
                    <AvatarImage src="/bot-avatar.png" alt="AI" />
                    <AvatarFallback>AI</AvatarFallback>
                </Avatar>
            )}
            <div className="flex-grow">
                <div
                    className={`rounded-lg p-3 break-words ${
                        isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    }`}
                >
                    {content}
                </div>
            </div>
        </div>
    );
};

const InputArea = ({ onSendMessage }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onSendMessage(input);
            setInput('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center">
            <div className="relative flex-grow">
                <Input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="pr-10"
                />
                <Button
                    type="submit"
                    size="icon"
                    className="absolute right-0 top-0 h-full rounded-l-none"
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </form>
    );
};

const HomeDrawerComponent = ({ isOpen, onClose, onOpenContentDrawer }) => {
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="bg-background/80 backdrop-blur-sm border-l border-border">
                <SheetHeader>
                    <SheetTitle>Home Drawer</SheetTitle>
                    <SheetDescription>
                        Quick access to add content
                    </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                    <Button onClick={onOpenContentDrawer} className="w-full">
                        <PanelRightOpen className="mr-2 h-4 w-4" />
                        Add Content
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
};

const DrawerComponent = ({ isOpen, onClose }) => {
    const [blocks, setBlocks] = useState([{ type: 'text', content: '' }]);

    const addBlock = (index, type = 'text') => {
        const newBlocks = [...blocks];
        newBlocks.splice(index + 1, 0, { type, content: '' });
        setBlocks(newBlocks);
    };

    const updateBlock = (index, content) => {
        const newBlocks = [...blocks];
        newBlocks[index].content = content;
        setBlocks(newBlocks);
    };

    const removeBlock = (index) => {
        if (blocks.length > 1 && index !== 0) {
            const newBlocks = blocks.filter((_, i) => i !== index);
            setBlocks(newBlocks);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="bg-background/80 backdrop-blur-sm border-l border-border">
                <SheetHeader>
                    <SheetTitle>Session Content</SheetTitle>
                    <SheetDescription>
                        Add various types of content to your chat session
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-6rem)] py-4">
                    {blocks.map((block, index) => (
                        <ContentBlock
                            key={index}
                            block={block}
                            index={index}
                            onUpdate={updateBlock}
                            onAddBlock={addBlock}
                            onRemoveBlock={removeBlock}
                            isFirstBlock={index === 0}
                        />
                    ))}
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};


const ContentBlock = ({ block, index, onUpdate, onAddBlock, onRemoveBlock, isFirstBlock }) => {
    const inputRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevInput = inputRef.current.parentElement.previousElementSibling?.querySelector('input');
            if (prevInput) {
                prevInput.focus();
                const length = prevInput.value.length;
                prevInput.setSelectionRange(length, length);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextInput = inputRef.current.parentElement.nextElementSibling?.querySelector('input');
            if (nextInput) {
                nextInput.focus();
                const length = nextInput.value.length;
                nextInput.setSelectionRange(length, length);
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            onAddBlock(index, 'text');
            // Focus on the new block after a short delay to allow for DOM update
            setTimeout(() => {
                const nextInput = inputRef.current.parentElement.nextElementSibling?.querySelector('input');
                if (nextInput) {
                    nextInput.focus();
                }
            }, 0);
        }
    };

    return (
        <div className="group relative mb-4 flex items-center">
            <input
                ref={inputRef}
                type="text"
                value={block.content}
                onChange={(e) => onUpdate(index, e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Type ${block.type} content...`}
                className="w-full pr-20 bg-transparent border-none focus:outline-none focus:ring-0 text-sm"
            />
            <div className="absolute right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!isFirstBlock && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveBlock(index)}
                        className="h-6 w-6"
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                )}
                <ContextMenu onSelect={(type) => onAddBlock(index, type)}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </ContextMenu>
            </div>
        </div>
    );
};

const ContextMenu = ({ children, onSelect }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onSelect('text')}>
                    <File className="mr-2 h-4 w-4" />
                    <span>Text snippet</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSelect('pdf')}>
                    <File className="mr-2 h-4 w-4" />
                    <span>PDF</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSelect('image')}>
                    <Image className="mr-2 h-4 w-4" />
                    <span>Image</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSelect('audio')}>
                    <Music className="mr-2 h-4 w-4" />
                    <span>Audio</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSelect('video')}>
                    <Video className="mr-2 h-4 w-4" />
                    <span>Video</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ChatInterface;