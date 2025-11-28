// TechTransferDashboard.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Calendar,
  RefreshCw,
  ChevronRight,
  FileText,
  Settings,
  LogOut,
  Eye,
  Trash2,
  Edit,
} from "lucide-react";

/* ---------------------------------------------------------------------------
  CircularProgressCard (unchanged)
-----------------------------------------------------------------------------*/
const CircularProgressCard = ({ name, completed = 0, total = 0, color = "#2563eb", frontDuration = 3000, backDuration = 3000 }) => {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const [flipped, setFlipped] = useState(false);
  const timerRef = useRef(null);
  const runningRef = useRef(true);
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  const startLoop = useCallback(() => {
    clearTimer();
    setFlipped(false);
    timerRef.current = setTimeout(() => {
      if (!runningRef.current) return;
      setFlipped(true);
      timerRef.current = setTimeout(() => {
        if (!runningRef.current) return;
        startLoop();
      }, backDuration);
    }, frontDuration);
  }, [frontDuration, backDuration, clearTimer]);
  useEffect(() => {
    runningRef.current = true;
    startLoop();
    return () => {
      runningRef.current = false;
      clearTimer();
    };
  }, [startLoop, clearTimer, pct]);
  const onEnter = () => {
    runningRef.current = false;
    clearTimer();
  };
  const onLeave = () => {
    runningRef.current = true;
    startLoop();
  };

  const circleStyle = {
    background: `conic-gradient(${color} ${pct}%, #e5e7eb ${pct}%)`,
    width: "140px",
    height: "140px",
    borderRadius: "9999px",
    padding: "12px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const flipInnerStyle = {
    transition: "transform 600ms",
    transformStyle: "preserve-3d",
    width: 160,
    height: 160,
    position: "relative",
  };
  const flipInnerFlipped = { ...flipInnerStyle, transform: "rotateY(180deg)" };
  const faceStyle = { position: "absolute", inset: 0, backfaceVisibility: "hidden", display: "flex", alignItems: "center", justifyContent: "center" };
  const backFaceStyle = { ...faceStyle, transform: "rotateY(180deg)" };

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg cursor-pointer w-full max-w-sm" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500">Stream</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300" />
      </div>

      <div className="flex items-center justify-center">
        <div style={{ width: 160, height: 160 }}>
          <div style={{ position: "relative", width: 160, height: 160 }}>
            <div style={flipped ? flipInnerFlipped : flipInnerStyle}>
              {/* FRONT */}
              <div style={faceStyle}>
                <div style={circleStyle} className="circular">
                  <div className="bg-white rounded-full w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold" style={{ color: "#111827" }}>
                        {pct}%
                      </div>
                      <div className="text-sm text-gray-500">Completed</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BACK */}
              <div style={backFaceStyle}>
                <div
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: 9999,
                    background: "#f9fafb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    border: "6px solid #e5e7eb",
                  }}
                >
                  <div className="text-2xl font-bold">{completed}/{total}</div>
                  <div className="text-sm text-gray-500 mt-1">Documents</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <div className="card-sub text-sm">{pct}% — {completed}/{total}</div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------------------
  EnhancedCircularProgressCard (AR&D) - unchanged from before
-----------------------------------------------------------------------------*/
const EnhancedCircularProgressCard = ({ name, color = "#10b981", statusCounts = { approved: { count: 8, denom: 12 }, completed: { count: 3, denom: 4 }, yet: { count: 1, denom: 4 } }, overallCompleted = 9, overallTotal = 12, frontDuration = 3000, backDuration = 3000 }) => {
  const pct = overallTotal > 0 ? Math.round((overallCompleted / overallTotal) * 100) : 0;
  const [flipped, setFlipped] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null); // 'approved'|'completed'|'yet'|null
  const timerRef = useRef(null);
  const runningRef = useRef(true);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startLoop = useCallback(() => {
    clearTimer();
    setFlipped(false);
    timerRef.current = setTimeout(() => {
      if (!runningRef.current) return;
      setFlipped(true);
      timerRef.current = setTimeout(() => {
        if (!runningRef.current) return;
        startLoop();
      }, backDuration);
    }, frontDuration);
  }, [frontDuration, backDuration, clearTimer]);

  useEffect(() => {
    runningRef.current = true;
    startLoop();
    return () => {
      runningRef.current = false;
      clearTimer();
    };
  }, [startLoop, clearTimer, pct]);

  // tooltip on hover front only
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const onCircleMouseEnter = (e) => {
    setShowTooltip(true);
    setTooltipPos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  };
  const onCircleMouseMove = (e) => setTooltipPos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  const onCircleMouseLeave = () => setShowTooltip(false);

  const getCount = (status) => (statusCounts[status] ? statusCounts[status].count : 0);
  const getDenom = (status) => (statusCounts[status] ? statusCounts[status].denom : 1);

  const onStatusClick = (statusKey) => {
    if (selectedStatus === statusKey) {
      // toggle back to front
      setSelectedStatus(null);
      setFlipped(false);
      runningRef.current = true;
      startLoop();
      return;
    }
    clearTimer();
    runningRef.current = false;
    setSelectedStatus(statusKey);
    setFlipped(true);
  };

  const onEnterCard = () => {
    runningRef.current = false;
    clearTimer();
  };
  const onLeaveCard = () => {
    runningRef.current = true;
    startLoop();
  };

  const circleStyleFront = {
    background: `conic-gradient(${color} ${pct}%, #e5e7eb ${pct}%)`,
    width: "140px",
    height: "140px",
    borderRadius: "9999px",
    padding: "12px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const selectedCount = selectedStatus ? getCount(selectedStatus) : 0;
  const selectedDenom = selectedStatus ? getDenom(selectedStatus) : 1;
  const backPct = selectedDenom > 0 ? Math.round((selectedCount / selectedDenom) * 100) : 0;

  const circleStyleBackBase = {
    background: `conic-gradient(${color} ${backPct}%, #e5e7eb ${backPct}%)`,
    width: "140px",
    height: "140px",
    borderRadius: "9999px",
    padding: "12px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 300ms ease, box-shadow 300ms ease",
  };

  const highlightStyle = selectedStatus
    ? { transform: "scale(1.06)", boxShadow: `0 12px 30px ${hexToRgba(color, 0.18)}` }
    : { transform: "scale(1)", boxShadow: "none" };

  const circleStyleBack = { ...circleStyleBackBase, ...highlightStyle };

  const flipInnerStyle = {
    transition: "transform 600ms",
    transformStyle: "preserve-3d",
    width: 160,
    height: 160,
    position: "relative",
  };
  const flipInnerFlipped = { ...flipInnerStyle, transform: "rotateY(180deg)" };
  const faceStyle = { position: "absolute", inset: 0, backfaceVisibility: "hidden", display: "flex", alignItems: "center", justifyContent: "center" };
  const backFaceStyle = { ...faceStyle, transform: "rotateY(180deg)" };

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg cursor-pointer w-full max-w-sm" onMouseEnter={onEnterCard} onMouseLeave={onLeaveCard}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500">Stream (interactive)</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300" />
      </div>

      {/* single-line pills (labels only) */}
      <div className="flex justify-center gap-3 mb-4">
        <button className={`px-3 py-1 rounded-full text-sm font-medium border`} onClick={() => onStatusClick("approved")}>Approved</button>
        <button className={`px-3 py-1 rounded-full text-sm font-medium border`} onClick={() => onStatusClick("yet")}>Yet to initiate</button>
        <button className={`px-3 py-1 rounded-full text-sm font-medium border`} onClick={() => onStatusClick("completed")}>Completed</button>
      </div>

      <div className="flex items-center justify-center">
        <div className="relative" style={{ width: 160, height: 160 }} onMouseEnter={(e) => onCircleMouseEnter(e)} onMouseMove={(e) => onCircleMouseMove(e)} onMouseLeave={onCircleMouseLeave}>
          <div style={flipped ? flipInnerFlipped : flipInnerStyle}>
            {/* FRONT */}
            <div style={faceStyle}>
              <div style={circleStyleFront}>
                <div className="bg-white rounded-full w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: "#111827" }}>{pct}%</div>
                    <div className="text-sm text-gray-500">Completed</div>
                  </div>
                </div>
              </div>
            </div>

            {/* BACK */}
            <div style={backFaceStyle}>
              <div style={circleStyleBack}>
                <div className="bg-white rounded-full w-full h-full flex items-center justify-center" style={{ border: "6px solid #e5e7eb", flexDirection: "column" }}>
                  <div className="text-2xl font-bold">{selectedCount}/{selectedDenom}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {selectedStatus === "approved" ? "Approved" : selectedStatus === "completed" ? "Completed" : selectedStatus === "yet" ? "Yet to initiate" : ""}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* tooltip (front only) */}
          {showTooltip && !flipped && (
            <div style={{ position: "absolute", left: Math.max(0, tooltipPos.x - 30), top: Math.max(0, tooltipPos.y - 40), background: "rgba(17,24,39,0.95)", color: "white", padding: "6px 8px", borderRadius: 6, fontSize: 12, pointerEvents: "none", transform: "translate(-50%, -100%)", whiteSpace: "nowrap" }}>
              {pct}% completed
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <div className="card-sub text-sm">
          {flipped && selectedStatus ? `${statusCounts[selectedStatus]?.count ?? 0}/${statusCounts[selectedStatus]?.denom ?? 1}` : `${pct}% — ${overallCompleted}/${overallTotal}`}
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------------------
  PEStatusCard (REPLACED: improved click/touch/keyboard reliability)
  — NO auto-flip; flip only on explicit user interaction.
-----------------------------------------------------------------------------*/
 // Replace the existing PEStatusCard with this drop-in component
const PEStatusCard = ({
  name,
  counts = { approved: 8, completed: 2, yetToInitiate: 2, total: 12 },
  colors = null,
}) => {
  const statusColors = colors || {
    approved: "#10b981",
    completed: "#2563eb",
    yet: "#f97316",
  };

  // NO auto-flip timers — flip only on user click
  const [flipped, setFlipped] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  // counts and percentages
  const approved = counts.approved ?? 0;
  const completed = counts.completed ?? 0;
  const yet = counts.yetToInitiate ?? 0;
  const total = counts.total ?? Math.max(1, approved + completed + yet);

  // compute percentages (float math then round for display / avoid gaps)
  const approvedPct = total > 0 ? (approved / total) * 100 : 0;
  const completedPct = total > 0 ? (completed / total) * 100 : 0;
  const yetPct = Math.max(0, 100 - Math.round(approvedPct) - Math.round(completedPct));

  // SVG donut math
  const radius = 56;
  const stroke = 24;
  const circumference = 2 * Math.PI * radius;
  const percentToLength = (p) => (p / 100) * circumference;
  const approvedLen = percentToLength(approvedPct);
  const completedLen = percentToLength(completedPct);
  const yetLen = Math.max(0.0001, percentToLength(yetPct)); // avoid zero-length issues

  // offsets so each arc begins where previous ended (we draw yet -> completed -> approved)
  const approvedOffset = circumference - 0;
  const completedOffset = circumference - approvedLen;
  const yetOffset = circumference - (approvedLen + completedLen);

  // click / touch / keyboard handler helper
  const activateSegment = (status) => {
    // toggle: clicking same segment again flips back to front view
    if (selectedStatus === status) {
      setSelectedStatus(null);
      setFlipped(false);
      return;
    }
    setSelectedStatus(status);
    setFlipped(true);
  };

  const onArcKeyDown = (e, status) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      activateSegment(status);
    }
  };

  // back-face counts (adjust denom logic if you want different denominators)
  const selCount =
    selectedStatus === "approved"
      ? approved
      : selectedStatus === "completed"
      ? completed
      : selectedStatus === "yet"
      ? yet
      : 0;
  const selDenom = selectedStatus === "approved" ? total : selectedStatus ? Math.max(1, completed + yet) : 1;

  const flipInnerStyle = {
    transition: "transform 600ms",
    transformStyle: "preserve-3d",
    width: 160,
    height: 160,
    position: "relative",
  };
  const flipInnerFlipped = { ...flipInnerStyle, transform: "rotateY(180deg)" };
  const faceStyle = { position: "absolute", inset: 0, backfaceVisibility: "hidden", display: "flex", alignItems: "center", justifyContent: "center" };
  const backFaceStyle = { ...faceStyle, transform: "rotateY(180deg)" };

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg cursor-pointer w-full max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500">Stream</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300" />
      </div>

      <div className="flex items-center justify-center">
        <div style={{ width: 160, height: 160 }}>
          <div style={{ position: "relative", width: 160, height: 160 }}>
            <div style={flipped ? flipInnerFlipped : flipInnerStyle}>
              {/* FRONT: clickable SVG donut (no numbers inside) */}
              <div style={faceStyle}>
                <svg
                  width="160"
                  height="160"
                  viewBox="0 0 160 160"
                  style={{ overflow: "visible", transform: "rotate(-90deg)" }}
                  role="img"
                  aria-label={`${approved} approved, ${completed} completed, ${yet} yet to initiate`}
                >
                  <g transform="translate(80,80)">
                    {/* Yet arc (bottom layer) */}
                    <circle
                      r={radius}
                      fill="transparent"
                      stroke={statusColors.yet}
                      strokeWidth={stroke}
                      strokeDasharray={`${yetLen} ${Math.max(0, circumference - yetLen)}`}
                      strokeDashoffset={yetOffset}
                      strokeLinecap="butt"
                    />
                    {/* Completed arc */}
                    <circle
                      r={radius}
                      fill="transparent"
                      stroke={statusColors.completed}
                      strokeWidth={stroke}
                      strokeDasharray={`${completedLen} ${Math.max(0, circumference - completedLen)}`}
                      strokeDashoffset={completedOffset}
                      strokeLinecap="butt"
                    />
                    {/* Approved arc (top) */}
                    <circle
                      r={radius}
                      fill="transparent"
                      stroke={statusColors.approved}
                      strokeWidth={stroke}
                      strokeDasharray={`${approvedLen} ${Math.max(0, circumference - approvedLen)}`}
                      strokeDashoffset={approvedOffset}
                      strokeLinecap="butt"
                    />

                    {/* Invisible but wide stroke arcs for hit detection (stacked above visible arcs).
                        We use pointerEvents: 'stroke' so clicks hit the ring rather than the inner hole.
                        These have larger strokeWidth and are fully transparent. */}
                    {/* Yet hit area */}
                    <circle
                      r={radius}
                      fill="transparent"
                      stroke="rgba(0,0,0,0)"
                      strokeWidth={stroke + 16}
                      strokeDasharray={`${yetLen} ${Math.max(0, circumference - yetLen)}`}
                      strokeDashoffset={yetOffset}
                      strokeLinecap="round"
                      style={{ cursor: "pointer", pointerEvents: "stroke" }}
                      onClick={() => activateSegment("yet")}
                      onTouchStart={() => activateSegment("yet")}
                      tabIndex={0}
                      onKeyDown={(e) => onArcKeyDown(e, "yet")}
                      aria-label={`Yet to initiate: ${yet}`}
                      role="button"
                      data-segment="yet"
                    />
                    {/* Completed hit area */}
                    <circle
                      r={radius}
                      fill="transparent"
                      stroke="rgba(0,0,0,0)"
                      strokeWidth={stroke + 16}
                      strokeDasharray={`${completedLen} ${Math.max(0, circumference - completedLen)}`}
                      strokeDashoffset={completedOffset}
                      strokeLinecap="round"
                      style={{ cursor: "pointer", pointerEvents: "stroke" }}
                      onClick={() => activateSegment("completed")}
                      onTouchStart={() => activateSegment("completed")}
                      tabIndex={0}
                      onKeyDown={(e) => onArcKeyDown(e, "completed")}
                      aria-label={`Completed: ${completed}`}
                      role="button"
                      data-segment="completed"
                    />
                    {/* Approved hit area */}
                    <circle
                      r={radius}
                      fill="transparent"
                      stroke="rgba(0,0,0,0)"
                      strokeWidth={stroke + 16}
                      strokeDasharray={`${approvedLen} ${Math.max(0, circumference - approvedLen)}`}
                      strokeDashoffset={approvedOffset}
                      strokeLinecap="round"
                      style={{ cursor: "pointer", pointerEvents: "stroke" }}
                      onClick={() => activateSegment("approved")}
                      onTouchStart={() => activateSegment("approved")}
                      tabIndex={0}
                      onKeyDown={(e) => onArcKeyDown(e, "approved")}
                      aria-label={`Approved: ${approved}`}
                      role="button"
                      data-segment="approved"
                    />

                    {/* inner white circle (donut hole) */}
                    <circle r={radius - stroke / 2} fill="#ffffff" stroke="transparent" />
                  </g>
                </svg>
              </div>

              {/* BACK: show selected status counts (if any) */}
              <div style={backFaceStyle}>
                <div
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: 9999,
                    background: "#f9fafb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    border: "6px solid #e5e7eb",
                  }}
                >
                  <div className="text-2xl font-bold">{selectedStatus ? `${selCount}/${selDenom}` : ""}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {selectedStatus === "approved"
                      ? "Approved"
                      : selectedStatus === "completed"
                      ? "Completed"
                      : selectedStatus === "yet"
                      ? "Yet to initiate"
                      : ""}
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <button
                      onClick={() => {
                        setSelectedStatus(null);
                        setFlipped(false);
                      }}
                      className="px-3 py-1 rounded bg-gray-100 text-sm"
                      aria-label="Back to donut"
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* compact legend - colored square then "count label" (no standalone numbers above) */}
      <div className="mt-4 flex flex-col items-center">
        <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 6 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: statusColors.approved }} />
            <span style={{ fontSize: 13, color: "#374151" }}>{approved} approved</span>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: statusColors.completed }} />
            <span style={{ fontSize: 13, color: "#374151" }}>{completed} completed</span>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: statusColors.yet }} />
            <span style={{ fontSize: 13, color: "#374151" }}>{yet} yet to initiate</span>
          </div>
        </div>
      </div>
    </div>
  );
};


// helper: hex to rgba
function hexToRgba(hex, alpha = 1) {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map((ch) => ch + ch).join("");
  const bigint = parseInt(c, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* ---------------------------------------------------------------------------
  TechTransferDashboard (unchanged wiring except PE uses PEStatusCard)
-----------------------------------------------------------------------------*/
const TechTransferDashboard = () => {
  const [selectedDate, setSelectedDate] = useState("2025-11-25");
  const location = useLocation();

  // streams meta
  const streams = [
    { key: "prd", name: "PR&D", completed: 3, total: 12, color: "#2563eb" },
    { key: "ard", name: "AR&D", completed: 9, total: 12, color: "#10b981" },
    { key: "pe", name: "PE", completed: 2, total: 12, color: "#f97316" }, // example completed 2/12
  ];

  // statusData is the source of truth for counts in the table
  const statusData = [
    { stream: "PR&D", totalRequired: 12, yetToInitiate: 1, completed: 3, approved: 2 },
    { stream: "AR&D", totalRequired: 12, yetToInitiate: 4, completed: 9, approved: 5 },
    { stream: "PE", totalRequired: 12, yetToInitiate: 2, completed: 2, approved: 8 },
  ];

  const getCountsForKey = (key) => {
    const s = streams.find((st) => st.key === key);
    if (!s) return { approved: 0, completed: 0, yetToInitiate: 0, total: 0 };
    const sd = statusData.find((d) => d.stream === s.name);
    if (!sd) return { approved: 0, completed: s.completed || 0, yetToInitiate: 0, total: s.total || 0 };
    return {
      approved: sd.approved ?? 0,
      completed: sd.completed ?? 0,
      yetToInitiate: sd.yetToInitiate ?? 0,
      total: sd.totalRequired ?? s.total ?? 0,
    };
  };

  const navLinkClass = (path) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
      location.pathname === path ? "text-blue-600 bg-blue-50 font-medium" : "text-gray-600 hover:bg-gray-50"
    }`;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">TT</div>
            <span className="font-semibold text-lg">TechTransfer</span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <Link to="/overview" className={navLinkClass("/overview")}>
            <div className="w-5 h-5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </div>
            <span>Overview</span>
          </Link>

          <Link to="/document-tracker" className={navLinkClass("/document-tracker")}>
            <FileText className="w-5 h-5" />
            <span className="font-medium">Document Tracker</span>
          </Link>

          <Link to="/settings" className={navLinkClass("/settings")}>
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg w-full">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* main */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Document Progress Tracker</h1>
              <p className="text-gray-600">Overview across PR&D, AR&D, and PE Streams</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white">
                <Calendar className="w-4 h-4 text-gray-600" />
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="border-none outline-none text-sm" />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg"><RefreshCw className="w-5 h-5 text-gray-600" /></button>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">JS</div>
            </div>
          </div>

          {/* circular stream cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {streams.map((s) => {
              const counts = getCountsForKey(s.key);

              if (s.key === "ard") {
                const statusCountsForArd = {
                  approved: { count: 8, denom: 12 },
                  yet: { count: 1, denom: 4 },
                  completed: { count: 3, denom: 4 },
                };
                const overallCompleted = counts.completed;
                const overallTotal = counts.total;
                return (
                  <EnhancedCircularProgressCard
                    key={s.key}
                    name={s.name}
                    color={s.color}
                    statusCounts={statusCountsForArd}
                    overallCompleted={overallCompleted}
                    overallTotal={overallTotal}
                    frontDuration={3000}
                    backDuration={3000}
                  />
                );
              }

              if (s.key === "pe") {
                const peCountsForCard = {
                  approved: counts.approved,
                  completed: counts.completed,
                  yetToInitiate: counts.yetToInitiate,
                  total: counts.total,
                };
                return <PEStatusCard key={s.key} name={s.name} counts={peCountsForCard} />;
              }

              // PR&D & others: simple flipping card
              return <CircularProgressCard key={s.key} name={s.name} completed={counts.completed} total={counts.total} color={s.color} />;
            })}
          </div>

          {/* Status Breakdown table */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Status Breakdown</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Download Report</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stream</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total Required</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Yet to Initiate</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Completed</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Approved</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {statusData.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.stream}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{row.totalRequired}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{row.yetToInitiate}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{row.completed}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">{row.approved}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-gray-100 rounded"><Eye className="w-4 h-4 text-gray-600" /></button>
                          <button className="p-1 hover:bg-gray-100 rounded"><Trash2 className="w-4 h-4 text-gray-600" /></button>
                          <button className="p-1 hover:bg-gray-100 rounded"><Edit className="w-4 h-4 text-gray-600" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TechTransferDashboard;
