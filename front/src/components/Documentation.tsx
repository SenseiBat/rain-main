/**
 * Documentation - Page de documentation avec onglets utilisateur/développeur
 * 
 * Affiche deux types de documentation :
 * 1. **Utilisateur** : Guide d'utilisation du site pour les utilisateurs finaux
 * 2. **Développeur** : Guide technique pour les développeurs (architecture, API, etc.)
 * 
 * Fonctionnalités :
 * - Toggle entre les deux documentations
 * - Parsing automatique du contenu structuré (titres, paragraphes, listes)
 * - Affichage avec numérotation des sections (1., 2., 3., etc.)
 * - Support des listes à puces dans les sections
 * - Introduction sans numérotation en haut de page
 * 
 * Format des fichiers JSON :
 * - documentation_utilisateur.json
 * - documentation_developpeur.json
 * Structure : { title: string, content: string }
 * Le content est parsé automatiquement pour extraire les sections
 * 
 * Architecture :
 * - État local : docType ('user' | 'developer')
 * - useMemo pour parsing une seule fois par type de doc
 * - GhostButton pour le toggle entre les docs
 */
import { ReactNode, useMemo, useState } from 'react'
import GhostButton from './GhostButton'
import developerDocumentation from '../data/documentation_developpeur.json'
import userDocumentation from '../data/documentation_utilisateur.json'

/** Type de documentation disponible */
type DocType = 'user' | 'developer'

/** Structure d'un fichier de documentation JSON */
interface DocumentationFile {
  title: string
  content: string
}

/** Section parsée avec titre et paragraphes */
interface ParsedSection {
  title: string
  paragraphs: string[]
}

/** Documentation complète parsée */
interface ParsedDocumentation {
  intro: string[]
  sections: ParsedSection[]
}

/** Mapping des types de doc vers les fichiers JSON */
const DOC_MAP: Record<DocType, DocumentationFile> = {
  user: userDocumentation,
  developer: developerDocumentation,
}

/**
 * Parse le contenu texte d'une documentation pour extraire intro et sections
 * Gère la numérotation automatique et les listes à puces
 */
function parseDocumentationContent(doc: DocumentationFile): ParsedDocumentation {
  const sanitized = doc.content.replace(/\r/g, '').trim()
  if (!sanitized) {
    return { intro: [], sections: [] }
  }

  const lines = sanitized.split('\n')
  let body = sanitized
  if (lines[0] && lines[0].trim().toLowerCase() === doc.title.trim().toLowerCase()) {
    body = lines.slice(1).join('\n').trim()
  }

  const sections: ParsedSection[] = []
  const regex = /(\d+\.\s+[^\n]+)\n([\s\S]*?)(?=(?:\n\d+\.\s+[^\n]+\n)|$)/g
  let match: RegExpExecArray | null
  let firstMatchIndex: number | null = null

  while ((match = regex.exec(body)) !== null) {
    if (firstMatchIndex === null) {
      firstMatchIndex = match.index
    }
    const sectionTitle = match[1].trim()
    const sectionBody = match[2].trim()
    const paragraphs = sectionBody
      .split('\n')
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)

    sections.push({
      title: sectionTitle,
      paragraphs,
    })
  }

  let introText = ''
  if (firstMatchIndex !== null) {
    introText = body.slice(0, firstMatchIndex).trim()
  } else {
    introText = body
  }

  const intro = introText
    ? introText
        .split('\n')
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
    : []

  return { intro, sections }
}

// Rend les paragraphes/listes en identifiant automatiquement les sous-sections numérotées.
function renderParagraphBlocks(paragraphs: string[], keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let currentList: string[] = []
  let listCount = 0

  const flushList = () => {
    if (currentList.length === 0) return
    nodes.push(
      <ul key={`${keyPrefix}-list-${listCount}`} className="documentation-modal__list">
        {currentList.map((item, index) => (
          <li key={`${keyPrefix}-list-${listCount}-${index}`}>{item}</li>
        ))}
      </ul>,
    )
    currentList = []
    listCount += 1
  }

  paragraphs.forEach((text, index) => {
    if (text.startsWith('- ')) {
      currentList.push(text.slice(2).trim())
      return
    }

    flushList()

    if (/^\d+(?:\.\d+)+\s+/.test(text)) {
      nodes.push(
        <p key={`${keyPrefix}-subheading-${index}`} className="documentation-modal__subheading">
          <strong>{text}</strong>
        </p>,
      )
      return
    }

    nodes.push(
      <p key={`${keyPrefix}-paragraph-${index}`} className="documentation-modal__paragraph">
        {text}
      </p>,
    )
  })

  flushList()

  return nodes
}

// Page Documentation : propose deux boutons ouvrant chacun la modale correspondante.
function Documentation() {
  const [openDoc, setOpenDoc] = useState<DocType | null>(null)
  const activeDoc = openDoc ? DOC_MAP[openDoc] : null
  const parsedDoc = useMemo(() => (activeDoc ? parseDocumentationContent(activeDoc) : null), [activeDoc])

  return (
    <>
      <section className="documentation-intro">
        <div>
          <p className="documentation-intro__eyebrow">Centre de ressources</p>
          <h2>Documentation utilisateur & développeur</h2>
          <p>
            Choisissez le guide adapté à votre profil : les utilisateurs y trouvent les parcours
            essentiels tandis que les développeurs accèdent à la vision technique et aux bonnes
            pratiques du projet.
          </p>
        </div>
        <div className="documentation-buttons">
          <GhostButton
            label="Documentation utilisateur"
            ariaLabel="Consulter la documentation utilisateur"
            icon="🧭"
            variant="primary"
            onClick={() => setOpenDoc('user')}
          />
          <GhostButton
            label="Documentation développeur"
            ariaLabel="Consulter la documentation développeur"
            icon="💻"
            variant="outline"
            onClick={() => setOpenDoc('developer')}
          />
        </div>
      </section>
      {activeDoc && parsedDoc && (
        <div
          className="documentation-modal__overlay"
          role="dialog"
          aria-modal="true"
          aria-label={activeDoc.title}
          onClick={() => setOpenDoc(null)}
        >
          <div className="documentation-modal" onClick={(event) => event.stopPropagation()}>
            <div className="documentation-modal__header">
              <div>
                <p className="documentation-modal__eyebrow">Vue détaillée</p>
                <h3>{activeDoc.title}</h3>
                <p>Contenu issu du référentiel JSON sélectionné.</p>
              </div>
              <button
                type="button"
                className="documentation-modal__close"
                aria-label="Fermer"
                onClick={() => setOpenDoc(null)}
              >
                ×
              </button>
            </div>
            <div className="documentation-modal__body">
              <article className="documentation-modal__content">
                {parsedDoc.intro.length > 0 && (
                  <div className="documentation-modal__intro">
                    {renderParagraphBlocks(parsedDoc.intro, `${activeDoc.title}-intro`)}
                  </div>
                )}
                {parsedDoc.sections.map((section) => (
                  <section className="documentation-modal__section" key={section.title}>
                    <h4>
                      <strong>{section.title}</strong>
                    </h4>
                    {renderParagraphBlocks(section.paragraphs, section.title)}
                  </section>
                ))}
              </article>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Documentation
