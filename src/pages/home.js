import React, {useState} from 'react'
import { v4 as idv4} from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const CreateNewRoom = (e) => {
        e.preventDefault();
        const id = idv4();
        setRoomId(id);
        // console.log(id);
        toast.success("Successfully Created a Room ID");

    };
    const joinRoom = () =>{
        if(!roomId && !username  ){
            toast.error("Required: Room ID, Username");
            return;
        }else if(!username){
            toast.error("Required: Username");
            return;      
        }else if(!roomId){
            toast.error("Required: Room ID");
            return;            
        }
        // Redirect
        navigate(`/api/editor/${roomId}`, {
            state: { // Username is in homepage, how can we transfer data from home page to Editor page? In react router we can do this.
                // We can pass data from one route to another route
                username, 
            },
        })
    };
    const handleEnter = (e) => {
        console.log('Event:', e.code); // All keys are tracked
        if(e.code === 'Enter'){
            joinRoom();
        }
    }
  return (
    <div className='homePageWrapper'>
        <div className='formWrapper'>
            <img src='/logoencodewhite.png' className='homePageLogo' alt='enc0de-logo'></img>
            <h4 className='mainLabel'>Join a Room</h4>
            <div className='inputGroup'>
                <input type='text' className='inputBox' placeholder='Room ID' onChange={(e)=>setRoomId(e.target.value)} value={roomId} onKeyUp={handleEnter}/>
                <input type='text' className='inputBox' placeholder='USERNAME' onChange={(e)=>setUsername(e.target.value)} value={username} onKeyUp={handleEnter}/>
                <button className='btn joinBtn' onClick={joinRoom}>JOIN</button>
                <span className='createInfo'>If you don't have an invite code then create a&nbsp; 
                <a href='' className='createNewBtn' onClick={CreateNewRoom}>NEW ROOM</a>
                </span>
            </div>
        </div>
        <footer>Built with ❤️ by <a href="https://github.com/Stanish4Ever">Stanish4Ever</a></footer>
    </div>
  )
}

export default Home