import React, { useEffect, useRef, useState } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/clike/clike';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Editor = ({ socketRef, roomId }) => {
  const editorRef = useRef(null);
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function init() {
      if (!editorRef.current) {
        const textCode = Codemirror.fromTextArea(document.getElementById('realtime-editor'), {
          mode: { name: 'text/x-java', json: true },
          theme: 'dracula',
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
          scrollbarStyle: 'native',
        });
        editorRef.current = textCode;

        editorRef.current.on('change', (instance, changes) => {
          const { origin } = changes;
          const code = instance.getValue();
          if (origin !== 'setValue') {
            socketRef.current.emit(ACTIONS.CODE_CHANGE, {
              roomId,
              code,
            });
          }
        });
      }
    }
    init();

    const handleJoined = ({ clients, username, socketId }) => {
      if (username !== null) {
        toast.success(`${username} joined the room.`);
        // console.log(`${username} joined`);
      }
      setClients(clients);
    };

    const handleDisconnected = ({ socketId, username }) => {
      toast.success(`${username} left the room.`);
      setClients((prev) => prev.filter(client => client.socketId !== socketId));
    };

    if (socketRef.current) {
      socketRef.current.on(ACTIONS.JOINED, handleJoined);
      socketRef.current.on(ACTIONS.DISCONNECTED, handleDisconnected);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.JOINED, handleJoined);
        socketRef.current.off(ACTIONS.DISCONNECTED, handleDisconnected);
        socketRef.current.disconnect();
      }
    };
  }, [roomId, socketRef]);

  useEffect(() => {
    if (socketRef.current) {
      const handleCodeChange = ({ code }) => {
        if (code !== null && code !== editorRef.current.getValue()) {
          editorRef.current.setValue(code);
        }
      };

      socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);

      return () => {
        socketRef.current.off(ACTIONS.CODE_CHANGE, handleCodeChange);
      };
    }
  }, [socketRef.current]);

  return (
    <div className="editor-container">
      <textarea id="realtime-editor"></textarea>
      <div className="clients-list">
        {clients.map(client => (
          <div key={client.socketId}>{client.username}</div>
        ))}
      </div>
    </div>
  );
};

export default Editor;
