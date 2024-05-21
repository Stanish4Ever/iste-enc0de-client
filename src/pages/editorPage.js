import React, { useEffect, useRef, useState } from 'react';
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import ACTIONS from '../Actions';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditorPage = () => {
    const socketRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const [clients, setClients] = useState([]);
    const reactNavigator = useNavigate();

    const handleErrors = (e) => {
        // console.log('Socket Error', e);
        toast.error('Socket connection failed, try again later');
        reactNavigator('/');
    };

    useEffect(() => {
        const init = async () => {
            try {
                socketRef.current = await initSocket();
                socketRef.current.on('connect_error', handleErrors);
                socketRef.current.on('connect_failed', handleErrors);

                // console.log(`${roomId} is working`);
                socketRef.current.emit(ACTIONS.JOIN, {
                    roomId,
                    username: location.state?.username,
                });

                const handleJoined = ({ clients, username }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                        // console.log(`${username} joined`);
                    }
                    setClients(clients);
                };

                const handleDisconnected = ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setClients((prev) => prev.filter(client => client.socketId !== socketId));
                };

                socketRef.current.on(ACTIONS.JOINED, handleJoined);
                socketRef.current.on(ACTIONS.DISCONNECTED, handleDisconnected);

                return () => {
                    if (socketRef.current) {
                        socketRef.current.off(ACTIONS.JOINED, handleJoined);
                        socketRef.current.off(ACTIONS.DISCONNECTED, handleDisconnected);
                        socketRef.current.disconnect();
                    }
                };
            } catch (e) {
                handleErrors(e);
            }
        };

        if (roomId && location.state?.username) {
            init();
        }

    }, [roomId, location.state?.username, reactNavigator]);

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success("Room ID has been copied");
        } catch (e) {
            toast.error("Could not copy the room id");
            // console.log(e);
        }
    };

    const leaveRoom = () => {
        reactNavigator("/");
    };

    if (!location.state?.username) {
        return <Navigate to="/" />;
    }

    return (
        <div className='mainWrap'>
            <div className='aside'>
                <div className='asideInner'>
                    <div className='logo'>
                        <img src='/logoencodewhite.png' className="logoImage" alt='ISTE En-C0DE'></img>
                    </div>
                    <h3>Connected</h3>
                    <div className='clientsList'>
                        {clients.map((client) => (
                            <Client key={client.socketId} username={client.username} />
                        ))}
                    </div>
                </div>
                <button className='btn copyBtn' onClick={copyRoomId}>Copy ROOM ID</button>
                <button className='btn leaveBtn' onClick={leaveRoom}>Leave ROOM</button>
            </div>
            <div className='editorWrap'>
                <Editor socketRef={socketRef} roomId={roomId} />
            </div>
        </div>
    );
};

export default EditorPage;
