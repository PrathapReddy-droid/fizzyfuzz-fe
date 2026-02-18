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
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Upload Video</h2>
        <VideoUpload setRefresh={setRefresh} />
      </div>

      {/* Video List Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Video List</h2>
        <VideoTable refresh={refresh}/>
      </div>
    </div>
  );
};

export default VideoPage;
