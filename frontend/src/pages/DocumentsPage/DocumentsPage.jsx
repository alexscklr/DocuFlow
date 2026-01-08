import { useState, useEffect, useRef } from 'react';
import { useAllDocuments } from '@/shared/hooks/useAllDocuments';
import { useDocumentVersions } from '@/shared/hooks/useDocumentVersions';
import { InfoFieldButton } from '@/shared/components';
import { Modal, EntityFormDialog, ActionButton } from '@/shared/components';
import { uploadDocumentFileToStorage, downloadDocumentFile } from '@/shared/lib/documentUploadDownloadQueries';
import { createDocumentVersion } from '@/shared/lib/documentVersionsQueries';


export function DocumentsPage() {
  const {
    addDocument,
    loadDocuments,
    documents,
  } = useAllDocuments();

  const [open, setOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const fileInputRef = useRef(null);

  // Get versions for selected document
  const { versions, loadVersions } = useDocumentVersions(selectedDocument?.id);

  // Load documents on component mount
  useEffect(() => {
    handleLoadDocuments();
  }, []);

  // Load versions when document is selected for download
  useEffect(() => {
    if (selectedDocument && downloadOpen) {
      loadVersions();
    }
  }, [selectedDocument, downloadOpen, loadVersions]);

  const handleLoadDocuments = async () => {
    setIsLoadingDocuments(true);
    try {
      await loadDocuments();
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  const handleUploadClick = () => {
    setUploadOpen(true);
  };

  const handleDownloadClick = () => {
    setDownloadOpen(true);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedDocument({ ...selectedDocument, file });
    }
  };

  const handleUpload = async () => {
    if (!selectedDocument || !selectedDocument.file) {
      alert('Please select a document and a file to upload');
      return;
    }

    const document = documents.find(d => d.id === selectedDocument.id);
    if (!document || !document.project) {
      alert('Document must be associated with a project');
      return;
    }

    const organizationId = document.project.organization_id || document.project.organization?.id;
    const projectId = document.project.id;

    if (!organizationId || !projectId) {
      alert('Document must be associated with an organization and project');
      return;
    }

    setUploading(true);
    try {
      // Upload file to storage
      const filePath = await uploadDocumentFileToStorage({
        organizationId,
        projectId,
        documentId: document.id,
        file: selectedDocument.file
      });

      // Create document version
      await createDocumentVersion({
        documentId: document.id,
        filePath,
        changeNote: 'Uploaded via Documents page'
      });

      alert('File uploaded successfully!');
      setUploadOpen(false);
      setSelectedDocument(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await handleLoadDocuments();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(`Error uploading file: ${error.message || error}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async () => {
    if (!selectedDocument) {
      alert('Please select a document to download');
      return;
    }

    const document = documents.find(d => d.id === selectedDocument.id);
    if (!document) {
      alert('Document not found');
      return;
    }

    // Get the latest version
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
      const { data: blob, error } = await downloadDocumentFile(latestVersion.file_url);
      
      if (error) throw error;

      if (blob) {
        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const fileName = latestVersion.file_url.split('/').pop() || `document-${document.id}`;
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        alert('File downloaded successfully!');
      }
      
      setDownloadOpen(false);
      setSelectedDocument(null);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert(`Error downloading file: ${error.message || error}`);
    } finally {
      setDownloading(false);
    }
  };

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
          <h1 className="text-4xl text-left font-semibold distance-bottom-sm">Documents</h1>
          <div className="flex gap-4">
            <ActionButton
              variant="upload"
              onClick={handleUploadClick}
            />
            <ActionButton
              variant="download"
              onClick={handleDownloadClick}
            />
            <ActionButton
              variant="add"
              onClick={() => setOpen(true)}
            />
          </div>
        </div>

        <hr className="border-white/20 distance-bottom-md" />

        <section className="grid gap-8 grid-cols-2">
          {documents.map((document) => (
            <InfoFieldButton
              key={document.id}
              id={document.id}
              title={document.title || 'Untitled Document'}
              description={document.project?.name || 'No project'}
              date={document.created_at}
              to={`/organizations/${document.project?.organization_id || document.project?.organization?.id}/projects/${document.project_id}`}
            />
          ))}
        </section>

        <Modal isOpen={open} onClose={() => setOpen(false)}>
          <EntityFormDialog
            title="Create Document"
            field1Label="Title"
            field2Label="Project ID"
            onCancel={() => setOpen(false)}
            onCreate={async (data) => {
              await addDocument({
                project_id: data.field2,
                title: data.field1,
              });

              await handleLoadDocuments();
              setOpen(false);
            }}
          />
        </Modal>

        <Modal isOpen={uploadOpen} onClose={() => setUploadOpen(false)}>
          <div className="glass p-6 rounded-lg space-y-4 min-w-[400px]">
            <h2 className="text-2xl font-semibold">Upload Document</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Document</label>
                <select
                  className="w-full p-2 border rounded glass"
                  value={selectedDocument?.id || ''}
                  onChange={(e) => {
                    const doc = documents.find(d => d.id === e.target.value);
                    setSelectedDocument(doc ? { id: doc.id } : null);
                  }}
                >
                  <option value="">Choose a document...</option>
                  {documents.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.title || 'Untitled'} - {doc.project?.name || 'No project'}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Select File</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="w-full p-2 border rounded glass"
                />
              </div>
            </div>
            <div className="flex gap-4 justify-end mt-6">
              <button
                onClick={() => {
                  setUploadOpen(false);
                  setSelectedDocument(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="px-4 py-2 border rounded glass hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !selectedDocument?.id || !selectedDocument?.file}
                className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={downloadOpen} onClose={() => setDownloadOpen(false)}>
          <div className="glass p-6 rounded-lg space-y-4 min-w-[400px]">
            <h2 className="text-2xl font-semibold">Download Document</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Document</label>
                <select
                  className="w-full p-2 border rounded glass"
                  value={selectedDocument?.id || ''}
                  onChange={(e) => {
                    const doc = documents.find(d => d.id === e.target.value);
                    setSelectedDocument(doc ? { id: doc.id } : null);
                  }}
                >
                  <option value="">Choose a document...</option>
                  {documents.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.title || 'Untitled'} - {doc.project?.name || 'No project'}
                    </option>
                  ))}
                </select>
              </div>
              {selectedDocument && versions && versions.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Available Versions</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {versions.map((version) => (
                      <div key={version.id} className="p-2 border rounded glass text-sm">
                        Version {version.version_number} - {version.change_note || 'No note'} ({new Date(version.created_at).toLocaleDateString()})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-4 justify-end mt-6">
              <button
                onClick={() => {
                  setDownloadOpen(false);
                  setSelectedDocument(null);
                }}
                className="px-4 py-2 border rounded glass hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading || !selectedDocument?.id || !versions || versions.length === 0}
                className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloading ? 'Downloading...' : 'Download Latest'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
