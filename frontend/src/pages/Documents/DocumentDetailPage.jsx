import { NavLink, Route, Routes, useParams } from "react-router-dom";
import { DocumentPreview } from "./DocumentPreview";
import { DocumentVersions } from "./DocumentVersions";
import { DocumentShares } from "./DocumentShares";
import { DocumentEdit } from "./DocumentEdit";
import { VersionComments } from "./VersionComments";

export function DocumentDetailPage() {
  const { documentId } = useParams();

  return (
    <div className="grid grid-cols-[2fr,3fr] gap-6 h-full">
      <div className="glass p-4 flex flex-col gap-4">
        <DocumentPreview documentId={documentId} />
      </div>

      <div className="glass p-4 flex flex-col h-full">
        <div className="flex gap-2 mb-4 text-sm">
          <Tab to="edit" label="Edit" />
          <Tab to="shares" label="Shares" />
          <Tab to="versions" label="Versions" />
        </div>

        <div className="flex-1 overflow-hidden">
          <Routes>
            <Route path="edit" element={<DocumentEdit />} />
            <Route path="shares" element={<DocumentShares />} />
            <Route path="versions" element={<DocumentVersions />} />
            <Route path="versions/:versionId/comments" element={<VersionComments />} />
            <Route path="*" element={<DocumentVersions />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function Tab({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `glass-btn !px-3 !py-1 ${isActive ? "bg-white/25" : "bg-white/5"}`
      }
    >
      {label}
    </NavLink>
  );
}
