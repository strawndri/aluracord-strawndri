import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

import BtnSendSticker from '../components/BtnSendSticker/BtnSendSticker';
import Button from '../components/Button/Button';
import Box from '../styles/Chat';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMxNDM5MiwiZXhwIjoxOTU4ODkwMzkyfQ.Jri-ykLhzA5jByMYR20YuVsFtTfQKLvwo3JoUqfNBnQ';
const SUPABASE_URL = 'https://xtzudbuzbysbikfxynvn.supabase.co';
const supaBaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function listenMessagesOnTime(addMessage) {
    return supaBaseClient
        .from('messages')
        .on('INSERT', (response) => {
            addMessage(response.new)

        })
        .subscribe()
}

const ChatPage = () => {

    const routing = useRouter();
    const currentUser = routing.query.username;
    const [message, setMessage] = useState('');
    const [messagesList, setmessagesList] = useState([]);

    useEffect(() => {
        supaBaseClient
            .from('messages')
            .select('*')
            .order('id', { ascending: false })
            .then(({ data }) => {
                setmessagesList(data)
            });

        listenMessagesOnTime((newMessage) => {
            setmessagesList((currentMessagesList) => {
                return [
                    newMessage,
                    ...currentMessagesList,
                ]
            })
        })
    }, []);

    const handleNewMessage = (newMessage) => {

        const message = {
            // id: messagesList.length + 1,
            from: currentUser,
            txtMessage: newMessage
        }

        supaBaseClient
            .from('messages')
            .insert([
                message
            ])
            .then(({ data }) => {

            })

        setMessage("")
    }

    return (
        <>
            <Box>
                <section className="header">
                    <h3>Logado com </h3>
                    <a href="/">Sair</a>
                </section>
                <section className="chat">
                    <MessageList messages={messagesList} />

                    <form className="text-field">

                        <Button
                            disabled={false}
                            type='button'
                        >img</Button>

                        <textarea
                            className=""
                            value={message}
                            onChange={(event) => {
                                const currentValue = event.target.value;
                                setMessage(currentValue);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                    handleNewMessage(message);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                        />


                        {/* <BtnSendSticker
                            onStickerClick={(sticker) => {
                                handleNewMessage(`:sticker:${sticker}`)
                            }}
                        /> */}

                        <Button
                             disabled={false}
                             type='button'
                        >Enviar</Button>
                        </form>
                </section>
            </Box>
        </>
    )
}

function MessageList(props) {
    return (
        <ul className="messages__list">
            {props.messages.map((message) => {
                return (
                    <li className='messages__item'
                        key={message.id}>

                        <div className="messages_user">
                            <img className="user-image" src={`https://github.com/${message.from}.png`}/>
                            <h4 className="user-from">{message.from}</h4>
                                <span className="date">
                                    {(new Date().toLocaleDateString('pt-BR'))}
                                </span>

                            {/* Declarativo */}
                            {/* {message.txtMessage.startsWith(':sticker:').toString()} */}
                            {message.txtMessage.startsWith(':sticker:')
                                ? (
                                    <p className="message">
                                        <img className="sticker" src={message.txtMessage.replace(':sticker:', '')} />
                                    </p>
                                )
                                : (
                                    <p className="message">{message.txtMessage}</p>
                                )}
                        </div>
                    </li>
                );
            })}


        </ul>
    )
}

export default ChatPage;