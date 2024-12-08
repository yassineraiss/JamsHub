import SideBar from "../components/SideBar";
import RoomInfo from "../components/RoomInfo";
import RoomChat from "../components/RoomChat";
import MP from "../components/MP";
import MobileDrawer from "../components/Drawer";
import MobileMP from "../components/MobileMP";

function RoomCreated() {

    const width = window.innerWidth;
    
    return (
        <>
            {   width > 450 ? 
                <div className="grid">
                    <SideBar />
                    <div className="main">
                        <div className="main__room-grid" style={{
                            background: 'linear-gradient(to bottom, hsl(0, 0%, 10%), hsl(199, 33%, 52%), hsl(0, 0%, 10%))',
                        }}>
                            <RoomInfo />
                            <MP />
                            <RoomChat JoinedOrCreated={'create'} />
                        </div>
                    </div>
                </div>
                :
                <div className="mobile-flex">
                    <div className="mobile-flex-header">
                        <MobileDrawer />
                        <h1 className="title" style={{margin: '0 auto'}}>JamsHub</h1>
                    </div>
                    <MobileMP />
                </div>
            }
        </>
    );
}

export default RoomCreated;