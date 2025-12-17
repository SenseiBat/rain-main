import { useState, useRef } from 'react'
import { parseVTOMXML, validateVTOMXML } from '../utils/xmlParser'
import { PlanDataPayload } from '../types'

interface XMLImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (data: Partial<PlanDataPayload>) => void
}

export default function XMLImportModal({ isOpen, onClose, onImport }: XMLImportModalProps): React.JSX.Element | null {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelection(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelection(files[0])
    }
  }

  const handleFileSelection = (selectedFile: File) => {
    setError(null)
    setPreview(null)

    // Vérifier l'extension
    if (!selectedFile.name.toLowerCase().endsWith('.xml')) {
      setError('Le fichier doit être au format XML (.xml)')
      return
    }

    // Vérifier la taille (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Le fichier est trop volumineux (max 10MB)')
      return
    }

    setFile(selectedFile)

    // Lire et prévisualiser le fichier
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      
      // Valider le XML
      const validation = validateVTOMXML(content)
      if (!validation.valid) {
        setError(validation.error || 'Fichier XML invalide')
        setFile(null)
        return
      }

      // Extraire les premières lignes pour la prévisualisation
      const lines = content.split('\n').slice(0, 10).join('\n')
      setPreview(lines + '\n...')
    }

    reader.onerror = () => {
      setError('Erreur lors de la lecture du fichier')
      setFile(null)
    }

    reader.readAsText(selectedFile)
  }

  const handleImportClick = async () => {
    if (!file) return

    setIsProcessing(true)
    setError(null)

    try {
      const reader = new FileReader()
      
      reader.onload = async (e) => {
        try {
          const xmlContent = e.target?.result as string
          const parsedData = await parseVTOMXML(xmlContent)
          
          // Vérifier qu'on a bien des données
          if (!parsedData.planColumns || parsedData.planColumns.length === 0) {
            throw new Error('Aucune application trouvée dans le fichier XML')
          }

          onImport(parsedData)
          onClose()
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Erreur lors du parsing XML')
        } finally {
          setIsProcessing(false)
        }
      }

      reader.onerror = () => {
        setError('Erreur lors de la lecture du fichier')
        setIsProcessing(false)
      }

      reader.readAsText(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    if (isProcessing) return
    setFile(null)
    setError(null)
    setPreview(null)
    setIsDragging(false)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content modal-content--large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Importer un fichier VTOM XML</h2>
          <button
            className="modal-close"
            onClick={handleClose}
            disabled={isProcessing}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="xml-import">
            {/* Zone de drop */}
            <div
              className={`xml-import__dropzone ${isDragging ? 'xml-import__dropzone--dragging' : ''} ${file ? 'xml-import__dropzone--has-file' : ''}`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xml"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />

              {!file ? (
                <>
                  <div className="xml-import__icon">📁</div>
                  <p className="xml-import__text">
                    Glissez-déposez votre fichier XML ici
                  </p>
                  <p className="xml-import__subtext">ou cliquez pour parcourir</p>
                  <p className="xml-import__format">Format accepté : .xml (max 10MB)</p>
                </>
              ) : (
                <>
                  <div className="xml-import__icon">✓</div>
                  <p className="xml-import__text">{file.name}</p>
                  <p className="xml-import__subtext">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </>
              )}
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="xml-import__error">
                <span className="xml-import__error-icon">⚠️</span>
                {error}
              </div>
            )}

            {/* Prévisualisation */}
            {preview && !error && (
              <div className="xml-import__preview">
                <h3 className="xml-import__preview-title">Aperçu du fichier :</h3>
                <pre className="xml-import__preview-content">{preview}</pre>
              </div>
            )}

            {/* Instructions */}
            <div className="xml-import__instructions">
              <h3 className="xml-import__instructions-title">📋 Instructions</h3>
              <ul className="xml-import__instructions-list">
                <li>Exportez votre paysage VTOM au format XML depuis Visual TOM</li>
                <li>Le fichier doit contenir les balises <code>&lt;Domain&gt;</code>, <code>&lt;Applications&gt;</code>, etc.</li>
                <li>Les applications seront automatiquement regroupées par famille</li>
                <li>Les traitements et jobs seront extraits et associés aux applications</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn--secondary"
            onClick={handleClose}
            disabled={isProcessing}
          >
            Annuler
          </button>
          <button
            className="btn btn--primary"
            onClick={handleImportClick}
            disabled={!file || !!error || isProcessing}
          >
            {isProcessing ? 'Import en cours...' : 'Importer'}
          </button>
        </div>
      </div>
    </div>
  )
}
