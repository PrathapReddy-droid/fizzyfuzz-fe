import React, { useContext, useEffect, useState } from "react";
import { fetchDataFromApi } from "../../utils/api";
import { MyContext } from "../../App";

const VideoTable = ({refresh}) => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const context = useContext(MyContext);
  const fetchVideos = async (pageNo = 1) => {
  try {
    let id = context?.userData._id
    let response = ""
    if(context?.userData?.role === "SELLER"){
      response = await fetchDataFromApi(
        `/api/product/videos?page=${pageNo}&limit=5&id=${id}`
      );
    }else{
      response = await fetchDataFromApi(
        `/api/product/videos?page=${pageNo}&limit=5`
      );
    }

    setVideos(response.data);
    setPage(response.page);
    setTotalPages(response.totalPages);
  } catch (error) {
    console.error("Failed to fetch videos", error);
  }
};

  useEffect(() => {
    fetchVideos();
  }, [refresh]);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Preview</th>
              <th className="p-3 text-left">Uploaded At</th>
            </tr>
          </thead>

          <tbody>
            {videos.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-6 text-center text-gray-400">
                  No videos found
                </td>
              </tr>
            ) : (
              videos.map((video) => (
                <tr key={video._id} className="border-t">
                  <td className="p-3">{video.title}</td>
                  <td className="p-3">
                    <video
                      src={video.live_link}
                      controls
                      className="w-32 rounded-lg"
                    />
                  </td>
                  <td className="p-3">
                    {new Date(video.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => fetchVideos(page - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => fetchVideos(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </>
  );
};

export default VideoTable;
