import SideBar from "../components/SideBar";
import JoinedRoomInfo from "../components/JoinedRoomInfo";
import RoomChat from "../components/RoomChat";
import JoinedMP from "../components/JoinedMP";
import MobileDrawer from "../components/Drawer";
import MobileJoinedMP from "../components/MobileJoinedMP"

function RoomJoined() {

    const width = window.innerWidth;

    return (
        <>
            {   width > 450 ?
                <div className="grid">
                    <SideBar />
                    <div className="main">
                        <div id="joined_room" className="main__room-grid" style={{
                            background: 'linear-gradient(to bottom, hsl(0, 0%, 10%), hsl(295, 100%, 76%), hsl(0, 0%, 10%))',
                        }}>
                            <JoinedRoomInfo />
                            <JoinedMP />
                            <RoomChat JoinedOrCreated={'join'} />
                        </div>
                    </div>
                </div>
                :
                <div className="mobile-flex">
                    <div className="mobile-flex-header">
                        <MobileDrawer />
                        <h1 className="title" style={{margin: '0 auto'}}>JamsHub</h1>
                    </div>
                    <MobileJoinedMP />
                </div>
            }
        </>
    );
}

export default RoomJoined;