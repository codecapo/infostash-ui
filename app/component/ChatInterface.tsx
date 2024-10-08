'use client'

import React, { useState, useRef } from 'react';
import { User, MessagesSquare, Plus, Minus, File, Image, Music, Video, PanelRightOpen, PanelRightClose, FilePlus, FilePenLine, FileArchive, FileSliders } from 'lucide-react';
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

    const handleHomeDrawerToggle = () => {
        setIsHomeDrawerOpen(!isHomeDrawerOpen);
        if (isContentDrawerOpen) {
            setIsContentDrawerOpen(false);
        }
    };

    const handleContentDrawerOpen = () => {
        setIsHomeDrawerOpen(false);
        setIsContentDrawerOpen(true);
    };

    const handleContentDrawerClose = () => {
        setIsContentDrawerOpen(false);
        setIsHomeDrawerOpen(true);
    };

    return (
        <div className="flex h-screen">
            <div className="flex-grow flex flex-col">
                <div className="flex-grow overflow-hidden">
                    <ScrollArea className="h-full p-4">
                        <div className="max-w-2xl mx-auto">
                            <MessageList messages={messages} />
                        </div>
                    </ScrollArea>
                </div>
                <div className="p-4 bg-background flex justify-center">
                    <div className="w-full max-w-2xl">
                        <InputArea onSendMessage={(content) => addMessage(content, true)} />
                    </div>
                </div>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 right-4 z-50"
                onClick={handleHomeDrawerToggle}
            >
                {isHomeDrawerOpen || isContentDrawerOpen ? <PanelRightClose className="h-6 w-6" /> : <PanelRightOpen className="h-6 w-6" />}
            </Button>
            <HomeDrawerComponent
                isOpen={isHomeDrawerOpen}
                onClose={() => setIsHomeDrawerOpen(false)}
                onOpenContentDrawer={handleContentDrawerOpen}
            />
            <ContentDrawerComponent
                isOpen={isContentDrawerOpen}
                onClose={handleContentDrawerClose}
            />
        </div>
    );
};

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
        <div className={`w-full rounded-lg p-3 ${
            isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
        }`}>
            <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                    {isUser ? (
                        <AvatarFallback>
                            <User className="h-5 w-5" />
                        </AvatarFallback>
                    ) : (
                        <>
                            <AvatarImage src="/bot-avatar.png" alt="AI" />
                            <AvatarFallback>AI</AvatarFallback>
                        </>
                    )}
                </Avatar>
                <div className="flex-grow">
                    <div className="break-words">{content}</div>
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
        <form onSubmit={handleSubmit} className="flex items-end">
            <div className="relative flex-grow">
                <div className="flex w-full rounded-md border border-input bg-background ring-offset-background">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-grow border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[45px]"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="h-full rounded border-0 bg-transparent hover:bg-accent hover:text-accent-foreground px-1 m-1"
                    >
                        <MessagesSquare className="h-12 w-12" />

                    </Button>
                </div>
            </div>
        </form>
    );
};

const HomeDrawerComponent = ({ isOpen, onClose, onOpenContentDrawer }) => {
    const iconButtons = [
        { icon: FilePlus, label: "Add", onClick: onOpenContentDrawer },
        { icon: FilePenLine, label: "Amend", onClick: onOpenContentDrawer },
        { icon: FileArchive, label: "Archive", onClick: () => console.log("Archive clicked") },
        { icon: FileSliders, label: "Share", onClick: () => console.log("Share clicked") },
    ];

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="bg-background/80 backdrop-blur-sm border-l border-border">
                <SheetHeader>
                    <SheetTitle>Home Drawer</SheetTitle>
                    <SheetDescription>
                        Quick access to file operations
                    </SheetDescription>
                </SheetHeader>
                <div className="py-4 grid grid-cols-2 gap-3">
                    {iconButtons.map((button, index) => (
                        <Button
                            key={index}
                            onClick={button.onClick}
                            className="flex items-center justify-start h-12 px-3"
                            variant="outline"
                        >
                            <button.icon className="h-5 w-5 mr-2" />
                            <span className="text-sm">{button.label}</span>
                        </Button>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
};

const ContentDrawerComponent = ({ isOpen, onClose }) => {
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