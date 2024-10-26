import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Pusher from "pusher-js";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import QuakerMessage from "@/lib/QuakerMessage";

const Page = () => {
    const router = useRouter();
    const MAX_CHAT_LENGTH = 150;
    const dummyRoomID = "lauder-college-house"; //TODO
    const bottomRef = useRef(null);
    const messageContainerRef = useRef(null);
    const [autoScroll, setAutoScroll] = useState(true);
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            message: "hey",
            hour: 14,
            minute: 25
        },
        {
            message: "Dude what did he just say",
            hour: 14,
            minute: 26
        },
        {
            message: "omg bro",
            hour: 14,
            minute: 30
        },
        {
            message: "hey",
            hour: 14,
            minute: 25
        },
        {
            message: "Dude what did he just say",
            hour: 14,
            minute: 26
        },
        {
            message: "omg bro",
            hour: 14,
            minute: 30
        },
        {
            message: "hey",
            hour: 14,
            minute: 25
        },
        {
            message: "Dude what did he just say",
            hour: 14,
            minute: 26
        },
        {
            message: "omg bro",
            hour: 14,
            minute: 30
        },
        {
            message: "hey",
            hour: 14,
            minute: 25
        },
        {
            message: "Dude what did he just say",
            hour: 14,
            minute: 26
        },
        {
            message: "omg bro",
            hour: 14,
            minute: 30
        },
        {
            message: "hey",
            hour: 14,
            minute: 25
        },
        {
            message: "Dude what did he just say",
            hour: 14,
            minute: 26
        },
        {
            message: "omg bro",
            hour: 14,
            minute: 30
        },
        {
            message: "hey",
            hour: 14,
            minute: 25
        },
        {
            message: "Dude what did he just say",
            hour: 14,
            minute: 26
        },
        {
            message: "omg bro",
            hour: 14,
            minute: 30
        }
    ]);

    useEffect(() => {
        if (router.query.id !== dummyRoomID) {
            router.push("/connect");
        }

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, { cluster: "us2"});
        const channel = pusher.subscribe(router.query.id);

        channel.bind("new-message", (messageData) => {
            setMessages((prev) => [...prev, messageData]);
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            pusher.unsubscribe(router.query.id);
        };
    }, []);

    const isAtBottom = () => {
        const divRef = messageContainerRef.current;
        if (!divRef) return false;

        const allowedDistance = 150; // Measured in Pixels

        return divRef.scrollHeight - divRef.scrollTop - divRef.clientHeight <= allowedDistance
    };

    const updateAutoScroll = () => {
        setAutoScroll(isAtBottom());
    };

    useEffect(() => {
        if (autoScroll) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = async () => { // move this to another file?
        const d = new Date;

        const message = newMessage.trim();

        const data = {
            channelName: dummyRoomID,
            message: message,
            minute: d.getMinutes(),
            hour: d.getHours()
        }

        if (message !== "") {
            try {
                await axios.post("http://127.0.0.1:8080", data);
            } catch (err) {
                console.log(err);
            }
            setNewMessage("");
        }
    };

    return (
        <div className="mx-auto flex flex-col mx-auto w-80 sm:w-96 h-90">
            <div ref={messageContainerRef} onScroll={updateAutoScroll} className="overflow-y-auto">
                {messages.map((message) => (
                    <QuakerMessage 
                        key={crypto.randomUUID()}
                        message={message.message}
                        hour={message.hour}
                        minute={message.minute}
                    />
                ))}
                <div ref={bottomRef} />
            </div>
            <div className="ml-auto text-gray-400 text-sm">
                {newMessage.length}/{MAX_CHAT_LENGTH}
            </div>
            <TextField 
                variant="outlined" 
                label="Message" 
                value={newMessage} 
                autoComplete="off"
                multiline
                inputProps={{maxLength: MAX_CHAT_LENGTH}}
                onChange={(e) => setNewMessage(e.target.value)} 
            />
            <Button className="mx-auto my-4 w-24 sm:w-32" variant="outlined" onClick={() => {sendMessage()}}>Send</Button>
        </div>
    );
};

export default Page;
