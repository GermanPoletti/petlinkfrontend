import React, { useState, useEffect } from "react";
import * as classes from "./UserChatList.module.css";
import { useChat } from "@/context/ChatContext";

export const Frame = ({ postTitle }) => {
    const [users, setUsers] = useState([]);
    const { openChatForPublication } = useChat();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/users?_limit=5');
                const data = await response.json();
                const mappedUsers = data.map(user => ({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    // Simulamos datos de chat ya que JSONPlaceholder no los proporciona
                    lastMessage: `Hola, me interesa tu publicación ${postTitle || ''}!`,
                    lastInteractionHours: Math.floor(Math.random() * 24) + 1, // Horas aleatorias
                }));
                setUsers(mappedUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, [postTitle]);

    return (
        <div className={classes.frame}>
            <p className={classes.title}>
                Viendo los chats para la publicacion: {postTitle}
            </p>

            <div className={classes.chatContainer} data-m3-mode="green-LT">
                {users.map((chat) => (
                    <div className={classes.chatItem} key={chat.id} onClick={() => openChatForPublication({
                        publicationId: chat.id,
                        postTitle: postTitle,
                        counterpartUsername: chat.username || chat.email,
                    })}>
                        <div className={classes.chatContent}>
                            <div className={classes.chatDetails}>

                                <div className={classes.textContent}>
                                    <div className={classes.username}>{chat.username || chat.email}</div>

                                    <p className={classes.supportingText}>
                                        {chat.lastMessage}
                                    </p>
                                </div>
                            </div>
                            <div className={classes.messageTime}>{chat.lastInteractionHours}h</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};