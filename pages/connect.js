import { useRouter } from "next/router";
import Button from "@mui/material/Button";

const Connect = () => {
  const router = useRouter();

  const dummyRoomID = "lauder-college-house";

  const routeToRoom = () => {
    if (dummyRoomID) {
      router.push({pathname: `/room/${dummyRoomID}`, query: {id: dummyRoomID}});
    }
  };

  return (
    <div className="flex flex-col items-center text-center">
      <div className="info-container">
        <h1 className="penn-red title">Get Started</h1>
        <p className="penn-blue">Press 'connect' and allow location services to automatically join a room!</p>
      </div>
      <div>
        <Button variant="outlined" className="w-24 rounded-full" onClick={() => routeToRoom()}>Connect</Button>
      </div>
      <div className="flex flex-col sm:flex-row p-10">
        <div className="info-container">
          <h1 className="penn-red">What is QuakerChat?</h1>
          <p className="penn-blue">QuakerChat is an anonymous location-based chat service for Penn students. Simply press 'connect' to join a room based on your location. Room locations are grouped by major building.</p>
        </div>
        <div className="info-container">
          <h1 className="penn-red">Is my location shared or stored?</h1>
          <p className="penn-blue">No. Location services are only used to identify which major building a user is in. Location permissions can be changed at any time and your location is not shared with anyone else.</p>
        </div>
      </div>
    </div>
  );
}

export default Connect;
