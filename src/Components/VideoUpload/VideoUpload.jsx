import { useContext, useRef, useState } from "react";
import { editData } from "../../utils/api";
import { MyContext } from "../../App";

const VideoUpload = ({setRefresh}) => {
  const fileRef = useRef(null);

  const [title, setTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const context = useContext(MyContext);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      context.alertBox("error","Please select a video file");
      return;
    }

    setVideoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      context.alertBox("error","Video title is required");
      return;
    }

    if (!videoFile) {
      context.alertBox("error","Video file is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("video", videoFile);
    formData.append("role", "ADMIN");

    setLoading(true);
    setProgress(0);

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("video", videoFile);
      formData.append("user_id", context?.userData._id);
     
      
      

      await editData(
        "/api/product/uploadVideo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: (event) => {
            if (event.total) {
              setProgress(Math.round((event.loaded * 100) / event.total));
            }
          }
        }
      );

      context.alertBox("success","Video uploaded successfully");
      setTitle("");
      setVideoFile(null);
      setPreviewUrl("");
      setProgress(0);
      setRefresh(state=>state+1)
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
<form
  onSubmit={handleSubmit}
  className="max-w-4xl bg-white p-6 rounded-2xl shadow-lg"
>
  <h2 className="text-xs text-gray-200 font-semibold mb-4">Fizzy Fuzz Video Upload</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* LEFT – FORM */}
    <div className="space-y-4">
      {/* Video Title */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Video Name
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter video title"
        />
      </div>

      {/* Video Upload */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Video File
        </label>

        <div
          className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
          onClick={() => fileRef.current.click()}
        >
          {videoFile ? (
            <p className="text-sm font-medium text-gray-700">
              {videoFile.name}
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              Click to select video
            </p>
          )}
        </div>

        <input
          type="file"
          ref={fileRef}
          accept="video/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Progress */}
      {loading && (
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-600 h-2 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Uploading..." : "Upload Video"}
      </button>
    </div>

    {/* RIGHT – PREVIEW */}
    <div className="flex items-center justify-center">
      <div className="w-full h-64 border rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden shadow-inner">
        {previewUrl ? (
          <video
            src={previewUrl}
            controls
            className="w-full h-full object-cover rounded-2xl"
          />
        ) : (
          <div className="text-center text-gray-400">
            <div className="text-4xl mb-2">🎥</div>
            <p className="text-sm">Preview will appear here</p>
          </div>
        )}
      </div>
    </div>
  </div>
</form>
  );
};

export default VideoUpload;
