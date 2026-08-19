import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { Button, TextField, CircularProgress, Switch } from "@mui/material";
import { IoMdAdd } from "react-icons/io";
import { FiClock } from "react-icons/fi";
import { fetchDataFromApi, postData } from "../../utils/api";
const OfferTimings = () => {
        // --- Offer Expiration Time state ---
        const [currentExpiry, setCurrentExpiry] = useState(null);
        const [loadingExpiry, setLoadingExpiry] = useState(true);
        const [savingExpiry, setSavingExpiry] = useState(false);
        const [expiryDateInput, setExpiryDateInput] = useState("");
        const [expiryTimeInput, setExpiryTimeInput] = useState("");
        const [isEnabled, setIsEnabled] = useState(false);
        const [togglingEnabled, setTogglingEnabled] = useState(false);

        const context = useContext(MyContext);

            useEffect(() => {
                getOfferTiming();
            }, [context?.isOpenFullScreenPanel])

        // Fetch the currently configured offer expiry + enabled state from the API
            const getOfferTiming = () => {
                setLoadingExpiry(true);
                fetchDataFromApi(`/api/bannerV1/offertimings`).then((res) => {
                    const expiresAt = res?.data?.expiresAt || res?.data?.expiryTime || null;
                    setCurrentExpiry(expiresAt);
                    setIsEnabled(!!res?.data?.isEnabled);
                    setLoadingExpiry(false);
                }).catch(() => {
                    setLoadingExpiry(false);
                });
            }
        
            // Combine the date + time inputs and POST the new expiry to the API
            const handleUpdateExpiry = () => {
                if (!expiryDateInput || !expiryTimeInput) {
                    context.alertBox("error", "Please select both a date and a time");
                    return;
                }
        
                const combined = new Date(`${expiryDateInput}T${expiryTimeInput}`);
        
                if (isNaN(combined.getTime())) {
                    context.alertBox("error", "Invalid date or time");
                    return;
                }
        
                setSavingExpiry(true);
                postData(`/api/bannerV1/offertimings`, {
                    expiresAt: combined.toISOString(),
                    isEnabled: isEnabled,
                }).then((res) => {
                    context.alertBox("success", "Offer expiry updated");
                    setSavingExpiry(false);
                    setExpiryDateInput("");
                    setExpiryTimeInput("");
                    getOfferTiming();
                }).catch(() => {
                    context.alertBox("error", "Could not update offer expiry");
                    setSavingExpiry(false);
                });
            }
        
            // Toggle the offer on/off — posts isEnabled to the same offertimings API
            const handleToggleEnabled = (event) => {
                const nextValue = event.target.checked;
                setTogglingEnabled(true);
                setIsEnabled(nextValue);
        
                postData(`/api/bannerV1/offertimings`, { isEnabled: nextValue }).then((res) => {
                    context.alertBox("success", nextValue ? "Offer enabled" : "Offer disabled");
                    setTogglingEnabled(false);
                }).catch(() => {
                    context.alertBox("error", "Could not update offer status");
                    setIsEnabled(!nextValue);
                    setTogglingEnabled(false);
                });
            }
        
            const isExpired = currentExpiry ? new Date(currentExpiry) < new Date() : false;
        
            const formattedExpiry = currentExpiry
                ? new Date(currentExpiry).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                })
                : null;

const inputSx = {
    "& .MuiOutlinedInput-root": {
        color: "#f3e8ff",
        borderRadius: "12px",
        backgroundColor: "rgba(255,255,255,0.04)",
        "& fieldset": { borderColor: "rgba(196,132,252,0.25)" },
        "&:hover fieldset": { borderColor: "rgba(196,132,252,0.5)" },
        "&.Mui-focused fieldset": { borderColor: "#c084fc" },
    },
    "& .MuiInputLabel-root": { color: "rgba(243,232,255,0.5)" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#c084fc" },
    "& input::-webkit-calendar-picker-indicator": { filter: "invert(1)", opacity: 0.6 },
};
  return (
    <>
         <div className="relative mt-8 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] p-5 md:p-7">
                <div className="flex items-center justify-between flex-wrap gap-3 mb-1">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-fuchsia-500">
                            <FiClock className="text-white text-[18px]" />
                        </div>
                        <h2
                            className="text-[18px] font-[700] text-white tracking-tight"
                            style={{ fontFamily: "'Syne', sans-serif" }}
                        >
                            Offer Expiration Time
                        </h2>
                    </div>

                    {/* Enable / disable toggle — posts isEnabled to the offertimings API */}
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] pl-4 pr-1 py-1">
                        <span
                            className={`text-[12px] font-[600] ${isEnabled ? "text-emerald-300" : "text-[rgba(243,232,255,0.4)]"
                                }`}
                        >
                            {isEnabled ? "Offer Enabled" : "Offer Disabled"}
                        </span>
                        {togglingEnabled ? (
                            <CircularProgress size={16} sx={{ color: "#c084fc", mx: "10px" }} />
                        ) : (
                            <Switch
                                checked={isEnabled}
                                onChange={handleToggleEnabled}
                                disabled={loadingExpiry}
                                sx={{
                                    "& .MuiSwitch-switchBase.Mui-checked": { color: "#c084fc" },
                                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                        backgroundColor: "#9333ea",
                                        opacity: 0.8,
                                    },
                                    "& .MuiSwitch-track": { backgroundColor: "rgba(255,255,255,0.2)" },
                                }}
                            />
                        )}
                    </div>
                </div>
                <p className="text-[13px] text-[rgba(243,232,255,0.45)] ml-12 mb-5">
                    Set when the current site-wide offer stops being shown to customers.
                </p>

                <div className="ml-0 md:ml-12 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-start">
                    {/* Current status */}
                    <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 min-h-[64px]">
                        {loadingExpiry ? (
                            <CircularProgress size={18} sx={{ color: "#c084fc" }} />
                        ) : formattedExpiry ? (
                            <>
                                <span
                                    className={`text-[11px] font-[700] tracking-wide uppercase px-3 py-1 rounded-full ${isExpired
                                        ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                                        : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                                        }`}
                                >
                                    {isExpired ? "Expired" : "Live"}
                                </span>
                                <div>
                                    <p className="text-[11px] uppercase tracking-wide text-[rgba(243,232,255,0.4)]">
                                        {isExpired ? "Expired on" : "Expires on"}
                                    </p>
                                    <p className="text-white font-[600] text-[15px]">{formattedExpiry}</p>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2 text-[rgba(243,232,255,0.4)] text-sm">
                                <HiOutlineSparkles className="text-[16px]" />
                                No offer expiry has been set yet
                            </div>
                        )}
                    </div>

                    {/* Date + time input, posts to /api/offertimings */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                        <TextField
                            label="Date"
                            type="date"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            value={expiryDateInput}
                            onChange={(e) => setExpiryDateInput(e.target.value)}
                            sx={inputSx}
                        />
                        <TextField
                            label="Time"
                            type="time"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            value={expiryTimeInput}
                            onChange={(e) => setExpiryTimeInput(e.target.value)}
                            sx={inputSx}
                        />
                        <Button
                            disabled={savingExpiry}
                            onClick={handleUpdateExpiry}
                            className="!text-white !normal-case !font-[600] !px-5 !py-[8px] !rounded-full !whitespace-nowrap"
                            sx={{
                                background: "linear-gradient(135deg, #9333ea, #c026d3)",
                                boxShadow: "0 8px 20px -6px rgba(168,85,247,0.6)",
                                "&:hover": {
                                    background: "linear-gradient(135deg, #a855f7, #d946ef)",
                                },
                                "&.Mui-disabled": {
                                    background: "rgba(255,255,255,0.08)",
                                    color: "rgba(255,255,255,0.3)",
                                },
                            }}
                        >
                            {savingExpiry ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : "Update Expiry"}
                        </Button>
                    </div>
                </div>
            </div>
    </>
  );
};

export default OfferTimings;