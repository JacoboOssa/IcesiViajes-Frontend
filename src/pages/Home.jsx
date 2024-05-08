import React from "react";
import Sidebar from "../components/SideBar";



export default function Home({roleName,username}) {
    return(
        <Sidebar roleName={roleName} username={username}/>

    )
}

//export default HomeAdmin;