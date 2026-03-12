import React, { useContext, useEffect, useState } from "react";
import { fetchDataFromApi, postData } from "../../utils/api";
import { MyContext } from "../../App";

const VideoTable = ({ refresh }) => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const context = useContext(MyContext);

  const fetchVideos = async (pageNo = 1) => {
    try {
      let id = context?.userData._id;
      let response = "";
      if (context?.userData?.role === "SELLER") {
        response = await fetchDataFromApi(
          `/api/product/videos?page=${pageNo}&limit=5&id=${id}`
        );
      } else {
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

  const enableVideo = async (payload) => {
    if (context?.userData?.role === "ADMIN") {
      setLoading(payload.id);
      console.log("payload.idpayload.idpayload.idpayload.id0",payload);
      
      await postData(`/api/product/approve-video`, payload);
      await fetchVideos();
      setLoading(false);
    }
    return null;
  };

  useEffect(() => {
    fetchVideos();
  }, [refresh]);

  const isAdmin = context?.userData?.role === "ADMIN";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

        .vt-wrap {
          font-family: 'Outfit', sans-serif;
          --bg:          #12052e;
          --surface:     #1a0a3d;
          --surface-2:   #22104f;
          --surface-3:   #2e1a63;
          --line:        rgba(139, 92, 246, 0.18);
          --accent:      #7c3aed;
          --accent-2:    #9b59f5;
          --accent-glow: rgba(124, 58, 237, 0.35);
          --accent-dim:  rgba(124, 58, 237, 0.15);
          --green:       #4ade80;
          --red:         #f87171;
          --text:        #ede9fe;
          --text-dim:    #a78bca;
          --muted:       #6b4f8a;
          background: var(--surface);
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid var(--line);
          box-shadow: 0 8px 40px rgba(10, 2, 30, 0.6);
        }

        .vt-header {
          padding: 26px 32px 22px;
          border-bottom: 1px solid var(--line);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, rgba(124,58,237,0.1) 0%, transparent 60%);
        }

        .vt-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--text);
          letter-spacing: -0.01em;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .vt-title-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: var(--accent-dim);
          border: 1px solid rgba(124,58,237,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .vt-count {
          font-size: 12px;
          color: var(--accent-2);
          background: var(--accent-dim);
          border: 1px solid rgba(124,58,237,0.3);
          border-radius: 20px;
          padding: 4px 12px;
          font-weight: 500;
        }

        .vt-table-wrap {
          overflow-x: auto;
        }

        .vt-table {
          width: 100%;
          border-collapse: collapse;
        }

        .vt-thead th {
          padding: 12px 20px;
          text-align: left;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-dim);
          background: var(--surface-2);
          border-bottom: 1px solid var(--line);
        }

        .vt-thead th:first-child { padding-left: 32px; }
        .vt-thead th:last-child  { padding-right: 32px; }

        .vt-row {
          border-bottom: 1px solid var(--line);
          transition: background 0.15s ease;
        }

        .vt-row:hover {
          background: rgba(124, 58, 237, 0.06);
        }

        .vt-row:last-child {
          border-bottom: none;
        }

        .vt-td {
          padding: 18px 20px;
          vertical-align: middle;
          color: var(--text);
        }

        .vt-td:first-child { padding-left: 32px; }
        .vt-td:last-child  { padding-right: 32px; }

        .vt-video-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
          letter-spacing: -0.01em;
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .vt-video-player {
          width: 120px;
          height: 72px;
          object-fit: cover;
          border-radius: 10px;
          border: 1px solid var(--line);
          background: var(--surface-3);
        }

        .vt-date {
          font-size: 13px;
          color: var(--text-dim);
          font-weight: 300;
        }

        .vt-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .vt-badge::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .vt-badge-active {
          background: rgba(74, 222, 128, 0.1);
          color: var(--green);
          border: 1px solid rgba(74, 222, 128, 0.2);
        }

        .vt-badge-active::before  { background: var(--green); }

        .vt-badge-inactive {
          background: rgba(248, 113, 113, 0.1);
          color: var(--red);
          border: 1px solid rgba(248, 113, 113, 0.2);
        }

        .vt-badge-inactive::before { background: var(--red); }

        .vt-btn {
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .vt-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .vt-btn-enable {
          background: rgba(74, 222, 128, 0.12);
          color: var(--green);
          border: 1px solid rgba(74, 222, 128, 0.25);
        }

        .vt-btn-enable:hover:not(:disabled) {
          background: rgba(74, 222, 128, 0.22);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(74,222,128,0.15);
        }

        .vt-btn-disable {
          background: rgba(248, 113, 113, 0.12);
          color: var(--red);
          border: 1px solid rgba(248, 113, 113, 0.25);
        }

        .vt-btn-disable:hover:not(:disabled) {
          background: rgba(248, 113, 113, 0.22);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(248,113,113,0.15);
        }

        .vt-btn-loading {
          background: var(--surface-3);
          color: var(--text-dim);
          border: 1px solid var(--line);
          cursor: wait;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .vt-empty {
          padding: 64px 32px;
          text-align: center;
        }

        .vt-empty-icon {
          width: 56px;
          height: 56px;
          margin: 0 auto 16px;
          border-radius: 16px;
          background: var(--surface-2);
          border: 1px solid rgba(124,58,237,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .vt-empty-text {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-dim);
        }

        .vt-empty-sub {
          font-size: 13px;
          color: var(--muted);
          margin-top: 4px;
          font-weight: 300;
        }

        .vt-pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 32px;
          border-top: 1px solid var(--line);
          background: var(--surface-2);
        }

        .vt-pag-btn {
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 9px 18px;
          border-radius: 10px;
          border: 1px solid var(--line);
          background: var(--surface);
          color: var(--text);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .vt-pag-btn:hover:not(:disabled) {
          border-color: rgba(124,58,237,0.6);
          color: var(--accent-2);
          background: var(--accent-dim);
          box-shadow: 0 0 12px var(--accent-glow);
        }

        .vt-pag-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .vt-pag-info {
          font-size: 13px;
          color: var(--text-dim);
          font-weight: 300;
        }

        .vt-pag-info strong {
          color: var(--text);
          font-weight: 600;
        }

        .vt-dot-sep {
          display: inline-block;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--muted);
          margin: 0 8px;
          vertical-align: middle;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .vt-spinner {
          width: 12px;
          height: 12px;
          border: 2px solid currentColor;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          display: inline-block;
          flex-shrink: 0;
        }
      `}</style>

      <div className="vt-wrap">
        {/* Header */}
        <div className="vt-header">
          <span className="vt-title">
            <span className="vt-title-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9b59f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </span>
            Video Library
          </span>
          <span className="vt-count">{videos.length} video{videos.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Table */}
        <div className="vt-table-wrap">
          <table className="vt-table">
            <thead className="vt-thead">
              <tr>
                <th>Title</th>
                <th>Preview</th>
                <th>Status</th>
                <th>Uploaded</th>
                {isAdmin && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {videos.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4}>
                    <div className="vt-empty">
                      <div className="vt-empty-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="23 7 16 12 23 17 23 7" />
                          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                        </svg>
                      </div>
                      <div className="vt-empty-text">No videos yet</div>
                      <div className="vt-empty-sub">Videos will appear here once uploaded</div>
                    </div>
                  </td>
                </tr>
              ) : (
                videos.map((video) => (
                  <tr key={video._id} className="vt-row">
                    <td className="vt-td">
                      <div className="vt-video-title">{video.title}</div>
                    </td>
                    <td className="vt-td">
                      <video src={video.live_link} controls className="vt-video-player" />
                    </td>
                    <td className="vt-td">
                      <span className={`vt-badge ${video.is_active ? "vt-badge-active" : "vt-badge-inactive"}`}>
                        {video.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="vt-td">
                      <span className="vt-date">
                        {new Date(video.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="vt-td">
                        {isLoading === video._id ? (
                          <button className="vt-btn vt-btn-loading" disabled>
                            <span className="vt-spinner" /> Processing
                          </button>
                        ) : (
                          <button
                            onClick={() => enableVideo({ id: video._id, isApporved: !video.is_active })}
                            className={`vt-btn ${video.is_active ? "vt-btn-disable" : "vt-btn-enable"}`}
                          >
                            {video.is_active ? "Disable" : "Enable"}
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="vt-pagination">
          <button
            disabled={page === 1}
            onClick={() => fetchVideos(page - 1)}
            className="vt-pag-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Prev
          </button>

          <span className="vt-pag-info">
            Page <strong>{page}</strong>
            <span className="vt-dot-sep" />
            of <strong>{totalPages}</strong>
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => fetchVideos(page + 1)}
            className="vt-pag-btn"
          >
            Next
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default VideoTable;
