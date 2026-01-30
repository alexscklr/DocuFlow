import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocuments } from '@/shared/hooks/useDocuments';
import { useDocumentVersions } from '@/shared/hooks/useDocumentVersions';
import { useProjects } from '@/shared/hooks/useProjects';
import { Modal, ActionButton, DocumentsUploadDialog, VersionCommentDialog } from '@/shared/components';
import { uploadDocumentFile, createDocumentVersion, downloadVersionFile, getVersionComments } from '@/shared/lib/documentVersionsQueries';


export function DocumentsPage() {
  const { orgId, projectId, documentId } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] = useState(null);
  const [project, setProject] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [hoveredVersion, setHoveredVersion] = useState(null);
  const [hoverComments, setHoverComments] = useState({});
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const { documents, loadDocuments } = useDocuments(projectId);
  const { getProjectById } = useProjects(null);
  
  // Get versions for the document
  const { versions, loadVersions } = useDocumentVersions(documentId);

  // Load document and project on component mount
  useEffect(() => {
    const loadData = async () => {
      if (projectId) {
        // Load project
        const { data: projectData, error: projectError } = await getProjectById(projectId);
        if (!projectError && projectData) {
          setProject(projectData);
        }

        // Load documents to find the specific one
        await loadDocuments();
      }
    };
    loadData();
  }, [projectId, getProjectById, loadDocuments]);

  // Set document when documents are loaded
  useEffect(() => {
    if (documents && documentId) {
      const foundDocument = documents.find(d => d.id === documentId);
      if (foundDocument) {
        setDocument(foundDocument);
      }
    }
  }, [documents, documentId]);

  // Load versions when document is available
  useEffect(() => {
    if (documentId) {
      loadVersions();
    }
  }, [documentId, loadVersions]);

  // Load comments when hovering over a version
  useEffect(() => {
    if (hoveredVersion) {
      const loadHoverComments = async () => {
        try {
          const { data } = await getVersionComments(hoveredVersion.id);
          setHoverComments(prev => ({
            ...prev,
            [hoveredVersion.id]: data || []
          }));
        } catch (error) {
          console.error('Error loading hover comments:', error);
        }
      };
      loadHoverComments();
    }
  }, [hoveredVersion]);

  const handleUpload = async ({ documentId: docId, file, changeNote }) => {
    if (!project || !project.organization_id || !file) {
      alert('Missing required information for upload');
      return;
    }

    setUploading(true);
    try {
      // Upload file to storage
      const filePath = await uploadDocumentFile({
        organizationId: project.organization_id,
        projectId: project.id,
        documentId: docId || documentId,
        file
      });

      // Create document version
      await createDocumentVersion({
        documentId: docId || documentId,
        filePath,
        changeNote: changeNote || 'Uploaded via Documents page'
      });

      alert('File uploaded successfully!');
      setUploadOpen(false);
      await loadVersions(); // Reload versions to show new upload
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(`Error uploading file: ${error.message || error}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async ({ documentId: docId }) => {
    if (!versions || versions.length === 0) {
      alert('No versions available for this document');
      return;
    }

    const latestVersion = versions[0]; // Versions are ordered by version_number descending
    if (!latestVersion.file_url) {
      alert('No file available for this document version');
      return;
    }

    setDownloading(true);
    try {
      const { data: blob, error } = await downloadVersionFile(latestVersion.file_url);
      
      if (error) throw error;

      if (blob) {
        // Create download link
        const url = URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        const fileName = latestVersion.file_url.split('/').pop() || `document-${docId || documentId}`;
        a.href = url;
        a.download = fileName;
        window.document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        alert('File downloaded successfully!');
      }
      
      setDownloadOpen(false);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert(`Error downloading file: ${error.message || error}`);
    } finally {
      setDownloading(false);
    }
  };

  if (!document) {
    return (
      <div className="px-8 py-20">
        <p>Document not found</p>
        <button onClick={() => navigate(-1)}>← Back</button>
      </div>
    );
  }

  return (
    <div className="h-screen text-[var(--color-text)]">
      <div
        className="
          px-4            /* mobile */
          md:px-8         /* tablet */
          xl:px-[250px]   /* desktop / FHD */
          py-[120px]
          space-y-10
        "
      >
        <div className="flex items-center justify-between gap-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl text-left font-semibold distance-bottom-sm">
              {document.title || 'Untitled Document'}
            </h1>
            <p className="text-2xs font-semibold text-left truncate max-w-[60ch]">
              {project?.name || 'No project'} • Created: {document.created_at ? new Date(document.created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div className="flex gap-4">
            <ActionButton
              variant="upload"
              onClick={() => setUploadOpen(true)}
            />
            <ActionButton
              variant="download"
              onClick={() => setDownloadOpen(true)}
            />
          </div>
        </div>

        <hr className="border-white/20 distance-bottom-md" />

        <section>
          <div className="glass rounded-xl overflow-hidden distance-bottom-md">
            {/* Table Header */}
            <div className="grid grid-cols-2 gap-4 bg-white/5 px-6 py-4 border-b border-white/10">
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-300">Title</p>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-300">Created</p>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-white/10">
              <div className="grid grid-cols-2 gap-4 px-6 py-4 hover:bg-white/5 transition-colors duration-150">
                <div className="text-left">
                  <p className="text-sm text-gray-200">{document.title || 'Untitled Document'}</p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-400">
                    {document.created_at ? new Date(document.created_at).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="glass rounded-xl overflow-hidden">
              {versions && versions.length > 0 ? (
                <>
                  {/* Table Header */}
                  <div className="grid grid-cols-3 gap-4 bg-white/5 px-6 py-4 border-b border-white/10">
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-300">Version</p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-300">Change Note</p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-300">Date</p>
                    </div>
                  </div>

                  {/* Table Body */}
                  <div className="divide-y divide-white/10">
                    {versions.map((version) => {
                      return (
                        <div 
                          key={version.id}
                          onMouseEnter={() => setHoveredVersion(version)}
                          onMouseLeave={() => setHoveredVersion(null)}
                        >
                          <div 
                            className="grid grid-cols-3 gap-4 px-6 py-4 hover:bg-white/5 transition-colors duration-150 cursor-pointer"
                            onClick={() => {
                              setSelectedVersion(version);
                              setCommentOpen(true);
                            }}
                          >
                            <div className="text-left">
                              <p className="text-sm text-gray-200">v{version.version_number}</p>
                            </div>
                            <div className="text-left">
                              <p className="text-sm text-gray-400">{version.change_note || 'No change note'}</p>
                            </div>
                            <div className="text-left">
                              <p className="text-sm text-gray-400">
                                {new Date(version.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-400 text-sm">No versions available yet. Upload a file to create the first version.</p>
                </div>
              )}
            </div>
            
            {/* Hover Tooltip - Positioned below the table */}
            {hoveredVersion && hoverComments[hoveredVersion.id] && hoverComments[hoveredVersion.id].length > 0 && (
              <div className="absolute left-0 top-full mt-2 z-50 w-full glass border rounded-lg p-4 shadow-xl">
                <p className="text-xs font-semibold text-gray-300 mb-3">
                  Comments ({hoverComments[hoveredVersion.id].length}):
                </p>
                <div className="space-y-3">
                  {hoverComments[hoveredVersion.id].map((comment) => (
                    <div key={comment.id} className="border-b border-white/10 pb-3 last:border-0">
                      <p className="text-xs text-gray-400 mb-1">
                        {new Date(comment.created_at).toLocaleString()}
                      </p>
                      <p className="text-sm text-white break-words">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <Modal isOpen={uploadOpen} onClose={() => setUploadOpen(false)}>
          <DocumentsUploadDialog
            title="Upload Document File"
            mode="upload"
            selectedDocumentId={documentId}
            onSubmit={handleUpload}
            onCancel={() => setUploadOpen(false)}
            submitLabel="Upload"
            loading={uploading}
          />
        </Modal>

        <Modal isOpen={downloadOpen} onClose={() => setDownloadOpen(false)}>
          <DocumentsUploadDialog
            title="Download Document"
            mode="download"
            selectedDocumentId={documentId}
            onSubmit={handleDownload}
            onCancel={() => setDownloadOpen(false)}
            submitLabel="Download"
            loading={downloading}
          />
        </Modal>

        <Modal isOpen={commentOpen} onClose={() => {
          setCommentOpen(false);
          setSelectedVersion(null);
        }}>
          {selectedVersion && (
            <VersionCommentDialog
              title={`Comments for Version ${selectedVersion.version_number}`}
              versionId={selectedVersion.id}
              versionNumber={selectedVersion.version_number}
              onCancel={() => {
                setCommentOpen(false);
                setSelectedVersion(null);
              }}
              onCommentAdded={() => {
                // Reload comments for hover tooltip
                if (selectedVersion) {
                  getVersionComments(selectedVersion.id).then(({ data }) => {
                    setHoverComments(prev => ({
                      ...prev,
                      [selectedVersion.id]: data || []
                    }));
                  });
                }
              }}
            />
          )}
        </Modal>
      </div>
    </div>
  );
}
