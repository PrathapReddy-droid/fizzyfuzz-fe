import { useContext, useRef, useState } from "react";
import { editData } from "../../utils/api";
import { MyContext } from "../../App";

const VideoUpload = ({ setRefresh }) => {
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
      context.alertBox("error", "Please select a video file");
      return;
    }
    setVideoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { context.alertBox("error", "Video title is required"); return; }
    if (!videoFile) { context.alertBox("error", "Video file is required"); return; }

    setLoading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("video", videoFile);
      formData.append("user_id", context?.userData._id);

      await editData("/api/product/uploadVideo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (event.total) setProgress(Math.round((event.loaded * 100) / event.total));
        },
      });

      context.alertBox("success", "Video uploaded successfully");
      setTitle("");
      setVideoFile(null);
      setPreviewUrl("");
      setProgress(0);
      setRefresh((state) => state + 1);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

        .vu-wrap {
          font-family: 'Outfit', sans-serif;
          --bg:        #12052e;
          --surface:   #1a0a3d;
          --surface-2: #22104f;
          --surface-3: #2e1a63;
          --line:      rgba(139, 92, 246, 0.18);
          --accent:    #7c3aed;
          --accent-2:  #9b59f5;
          --accent-glow: rgba(124, 58, 237, 0.35);
          --accent-dim:  rgba(124, 58, 237, 0.15);
          --text:      #ede9fe;
          --text-dim:  #a78bca;
          --muted:     #6b4f8a;
          background: var(--surface);
          border-radius: 20px;
          border: 1px solid var(--line);
          overflow: hidden;
          box-shadow: 0 8px 40px rgba(10, 2, 30, 0.6);
        }

        .vu-header {
          padding: 26px 32px 22px;
          border-bottom: 1px solid var(--line);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, rgba(124,58,237,0.1) 0%, transparent 60%);
        }

        .vu-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--text);
          letter-spacing: -0.01em;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .vu-title-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: var(--accent-dim);
          border: 1px solid rgba(124,58,237,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .vu-badge {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--accent-2);
          background: var(--accent-dim);
          border: 1px solid rgba(124,58,237,0.3);
          border-radius: 20px;
          padding: 4px 12px;
        }

        .vu-body {
          display: grid;
          grid-template-columns: 1fr 1px 1fr;
          gap: 0;
          align-items: stretch;
        }

        @media (max-width: 640px) {
          .vu-body { grid-template-columns: 1fr; }
          .vu-divider { display: none; }
        }

        .vu-left {
          padding: 28px 32px;
        }

        .vu-divider {
          width: 1px;
          background: var(--line);
          margin: 20px 0;
        }

        .vu-right {
          padding: 28px 32px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .vu-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .vu-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-dim);
        }

        .vu-input {
          background: var(--bg);
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 11px 14px;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          color: var(--text);
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          width: 100%;
          box-sizing: border-box;
        }

        .vu-input::placeholder { color: var(--muted); }

        .vu-input:focus {
          border-color: rgba(124,58,237,0.6);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.12);
        }

        .vu-dropzone {
          background: var(--bg);
          border: 1.5px dashed rgba(124,58,237,0.3);
          border-radius: 12px;
          padding: 28px 16px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .vu-dropzone:hover {
          border-color: rgba(124,58,237,0.65);
          background: var(--accent-dim);
        }

        .vu-dropzone-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--surface-3);
          border: 1px solid rgba(124,58,237,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2px;
        }

        .vu-dropzone-label {
          font-size: 13px;
          font-weight: 500;
          color: var(--text);
        }

        .vu-dropzone-sub {
          font-size: 11px;
          color: var(--text-dim);
          font-weight: 300;
        }

        .vu-filename {
          font-size: 12px;
          font-weight: 500;
          color: var(--accent-2);
          background: var(--accent-dim);
          border: 1px solid rgba(124,58,237,0.25);
          border-radius: 6px;
          padding: 4px 10px;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .vu-progress-wrap {
          margin-top: 4px;
          margin-bottom: 4px;
        }

        .vu-progress-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .vu-progress-label {
          font-size: 11px;
          color: var(--text-dim);
          font-weight: 500;
          letter-spacing: 0.04em;
        }

        .vu-progress-pct {
          font-size: 12px;
          font-weight: 700;
          color: var(--accent-2);
        }

        .vu-progress-track {
          width: 100%;
          height: 4px;
          background: var(--surface-3);
          border-radius: 99px;
          overflow: hidden;
        }

        .vu-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--accent), var(--accent-2));
          border-radius: 99px;
          transition: width 0.3s ease;
          box-shadow: 0 0 10px var(--accent-glow);
        }

        .vu-submit {
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          width: 100%;
          padding: 13px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .vu-submit-idle {
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          color: #fff;
          box-shadow: 0 4px 16px var(--accent-glow);
        }

        .vu-submit-idle:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px var(--accent-glow);
          filter: brightness(1.1);
        }

        .vu-submit-loading {
          background: var(--surface-3);
          color: var(--text-dim);
          cursor: wait;
          border: 1px solid var(--line);
        }

        .vu-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }

        .vu-preview-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-dim);
        }

        .vu-preview-box {
          flex: 1;
          background: var(--bg);
          border: 1px solid var(--line);
          border-radius: 14px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
        }

        .vu-preview-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .vu-preview-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 32px;
          text-align: center;
        }

        .vu-preview-empty-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: var(--surface-3);
          border: 1px solid rgba(124,58,237,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .vu-preview-empty-text {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-dim);
        }

        .vu-preview-empty-sub {
          font-size: 12px;
          color: var(--muted);
          font-weight: 300;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .vu-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid currentColor;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          flex-shrink: 0;
        }
      `}</style>

      <form onSubmit={handleSubmit} className="vu-wrap">
        {/* Header */}
        <div className="vu-header">
          <span className="vu-title">
            <span className="vu-title-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9b59f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </span>
            Upload Video
          </span>
          <span className="vu-badge">New Upload</span>
        </div>

        {/* Body */}
        <div className="vu-body">
          {/* LEFT – Form */}
          <div className="vu-left">
            {/* Title */}
            <div className="vu-field">
              <label className="vu-label">Video Name</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="vu-input"
                placeholder="Enter video title"
              />
            </div>

            {/* Dropzone */}
            <div className="vu-field">
              <label className="vu-label">Video File</label>
              <div className="vu-dropzone" onClick={() => fileRef.current.click()}>
                <div className="vu-dropzone-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                {videoFile ? (
                  <span className="vu-filename">{videoFile.name}</span>
                ) : (
                  <>
                    <span className="vu-dropzone-label">Click to select video</span>
                    <span className="vu-dropzone-sub">MP4, MOV, WebM supported</span>
                  </>
                )}
              </div>
              <input
                type="file"
                ref={fileRef}
                accept="video/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>

            {/* Progress */}
            {loading && (
              <div className="vu-progress-wrap">
                <div className="vu-progress-top">
                  <span className="vu-progress-label">Uploading…</span>
                  <span className="vu-progress-pct">{progress}%</span>
                </div>
                <div className="vu-progress-track">
                  <div className="vu-progress-bar" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`vu-submit ${loading ? "vu-submit-loading" : "vu-submit-idle"}`}
            >
              {loading ? (
                <>
                  <span className="vu-spinner" />
                  Uploading…
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Upload Video
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="vu-divider" />

          {/* RIGHT – Preview */}
          <div className="vu-right">
            <span className="vu-preview-label">Preview</span>
            <div className="vu-preview-box">
              {previewUrl ? (
                <video src={previewUrl} controls className="vu-preview-video" />
              ) : (
                <div className="vu-preview-empty">
                  <div className="vu-preview-empty-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="23 7 16 12 23 17 23 7" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                  </div>
                  <span className="vu-preview-empty-text">No preview yet</span>
                  <span className="vu-preview-empty-sub">Select a video to preview it here</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default VideoUpload;
