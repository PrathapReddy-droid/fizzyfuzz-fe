import React, { useState } from "react";
import VideoUpload from "../../Components/VideoUpload/VideoUpload";
import VideoTable from "../../Components/VideoTable";

const VideoPage = () => {
    const [refresh,setRefresh] = useState(0)
    
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">🎥 Video Management</h1>
        <p className="text-gray-500 mt-1">
          Upload videos and manage existing video content
        </p>
      </div>

      {/* Upload Section */}
        <VideoUpload setRefresh={setRefresh} />

      {/* Video List Section */}
        <VideoTable refresh={refresh}/>
    </div>
  );
};

export default VideoPage;
