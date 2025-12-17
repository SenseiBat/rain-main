import { PlanDataPayload, AppDetail, LandscapeSection, PlanColumn } from '../types'

// Types pour la structure XML VTOM
interface VTOMApplication {
  name: string
  family: string
  comment?: string
  frequency: string
  status: string
  mode: string
  jobs?: VTOMJob[]
}

interface VTOMJob {
  name: string
  comment?: string
  script?: string
  hostsGroup?: string
  user?: string
  status: string
}

interface VTOMHost {
  name: string
  comment?: string
  hostname: string
  os?: string
}

/**
 * Parse un fichier XML VTOM et le convertit en structure PlanDataPayload
 */
export async function parseVTOMXML(xmlContent: string): Promise<Partial<PlanDataPayload>> {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlContent, 'text/xml')

  // Vérifier les erreurs de parsing
  const parserError = xmlDoc.querySelector('parsererror')
  if (parserError) {
    throw new Error('Erreur de parsing XML : ' + parserError.textContent)
  }

  // Extraire les données
  const applications = parseApplications(xmlDoc)
  const hosts = parseHosts(xmlDoc)
  const appDetails = buildAppDetails(applications)
  const planColumns = buildPlanColumns(applications)
  const landscape = buildLandscape(applications, hosts)

  return {
    planColumns,
    planDetails: appDetails,
    landscape,
  }
}

/**
 * Parse les applications depuis le XML
 */
function parseApplications(xmlDoc: Document): VTOMApplication[] {
  const applications: VTOMApplication[] = []
  const appNodes = xmlDoc.querySelectorAll('Application')

  appNodes.forEach((appNode) => {
    const name = appNode.getAttribute('name') || ''
    const family = appNode.getAttribute('family') || 'AUTRES'
    const comment = appNode.getAttribute('comment') || ''
    const frequency = appNode.getAttribute('frequency') || 'D'
    const status = appNode.getAttribute('status') || 'U'
    const mode = appNode.getAttribute('mode') || 'J'

    // Parser les jobs
    const jobs = parseJobs(appNode)

    applications.push({
      name,
      family,
      comment,
      frequency,
      status,
      mode,
      jobs,
    })
  })

  return applications
}

/**
 * Parse les jobs d'une application
 */
function parseJobs(appNode: Element): VTOMJob[] {
  const jobs: VTOMJob[] = []
  const jobNodes = appNode.querySelectorAll('Job')

  jobNodes.forEach((jobNode) => {
    const name = jobNode.getAttribute('name') || ''
    const comment = jobNode.getAttribute('comment') || ''
    const hostsGroup = jobNode.getAttribute('hostsGroup') || ''
    const user = jobNode.getAttribute('user') || ''
    const status = jobNode.getAttribute('status') || 'U'

    // Extraire le script depuis Script/Command
    const scriptNode = jobNode.querySelector('Script Command')
    const script = scriptNode?.textContent?.trim() || ''

    jobs.push({
      name,
      comment,
      script,
      hostsGroup,
      user,
      status,
    })
  })

  return jobs
}

/**
 * Parse les hosts depuis le XML
 */
function parseHosts(xmlDoc: Document): VTOMHost[] {
  const hosts: VTOMHost[] = []
  const hostNodes = xmlDoc.querySelectorAll('Host')

  hostNodes.forEach((hostNode) => {
    const name = hostNode.getAttribute('name') || ''
    const comment = hostNode.getAttribute('comment') || ''
    const hostname = hostNode.getAttribute('hostname') || ''
    const os = hostNode.getAttribute('os') || ''

    hosts.push({
      name,
      comment,
      hostname,
      os,
    })
  })

  return hosts
}

/**
 * Construit les détails des applications pour planDetails
 */
function buildAppDetails(applications: VTOMApplication[]): Record<string, AppDetail> {
  const appDetails: Record<string, AppDetail> = {}

  applications.forEach((app) => {
    const treatments = app.jobs?.map((job) => ({
      name: job.name,
      script: job.script || 'N/A',
      jobs: [{ label: job.name }],
    })) || []

    appDetails[app.name] = {
      name: app.name,
      summary: app.comment || `Application ${app.family} - Mode ${app.mode}`,
      treatments,
    }
  })

  return appDetails
}

/**
 * Construit les colonnes du plan depuis les applications
 * Regroupe par famille (family)
 */
function buildPlanColumns(applications: VTOMApplication[]): PlanColumn[] {
  // Grouper par famille
  const familyGroups = new Map<string, VTOMApplication[]>()

  applications.forEach((app) => {
    const family = app.family || 'AUTRES'
    if (!familyGroups.has(family)) {
      familyGroups.set(family, [])
    }
    familyGroups.get(family)!.push(app)
  })

  // Convertir en colonnes
  const columns: PlanColumn[] = []
  let columnIndex = 0

  familyGroups.forEach((apps, family) => {
    columns.push({
      id: `col-${columnIndex++}`,
      title: family,
      placeholder: `Applications ${family}`,
      items: apps.map((app) => ({
        label: app.name,
        color: getStatusColor(app.status),
        muted: app.status === 'U', // Muted si status = U (Unknown/Unused)
      })),
    })
  })

  return columns
}

/**
 * Construit le paysage depuis les applications et hosts
 */
function buildLandscape(
  applications: VTOMApplication[],
  hosts: VTOMHost[]
): {
  title: string
  sections: LandscapeSection[]
} {
  const sections: LandscapeSection[] = []

  // Section 1 : Applications par statut
  const statusGroups = groupByStatus(applications)
  sections.push({
    title: 'Applications par Statut',
    rows: Object.entries(statusGroups).map(([status, apps]) => ({
      type: 'stack' as const,
      items: apps.map((app) => ({
        label: app.name,
        color: getStatusColor(status),
      })),
    })),
  })

  // Section 2 : Hosts
  if (hosts.length > 0) {
    sections.push({
      title: 'Serveurs',
      rows: [
        {
          type: 'grid' as const,
          items: hosts.map((host) => ({
            label: host.name,
            color: '#4A90E2',
          })),
        },
      ],
    })
  }

  // Section 3 : Applications par famille
  const familyGroups = groupByFamily(applications)
  Object.entries(familyGroups).forEach(([family, apps]) => {
    if (apps.length > 0) {
      sections.push({
        title: family,
        rows: [
          {
            type: 'grid' as const,
            items: apps.map((app) => ({
              label: app.name,
              color: getStatusColor(app.status),
            })),
          },
        ],
      })
    }
  })

  return {
    title: 'Paysage VTOM importé',
    sections,
  }
}

/**
 * Grouper les applications par statut
 */
function groupByStatus(applications: VTOMApplication[]): Record<string, VTOMApplication[]> {
  const groups: Record<string, VTOMApplication[]> = {}

  applications.forEach((app) => {
    const status = app.status || 'U'
    if (!groups[status]) {
      groups[status] = []
    }
    groups[status].push(app)
  })

  return groups
}

/**
 * Grouper les applications par famille
 */
function groupByFamily(applications: VTOMApplication[]): Record<string, VTOMApplication[]> {
  const groups: Record<string, VTOMApplication[]> = {}

  applications.forEach((app) => {
    const family = app.family || 'AUTRES'
    if (!groups[family]) {
      groups[family] = []
    }
    groups[family].push(app)
  })

  return groups
}

/**
 * Obtenir une couleur selon le statut VTOM
 */
function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    W: '#FFA500', // Waiting - Orange
    E: '#4CAF50', // Executed - Vert
    D: '#2196F3', // Done - Bleu
    U: '#9E9E9E', // Unknown/Unused - Gris
    O: '#FF9800', // On Hold - Orange foncé
    R: '#F44336', // Running - Rouge
    default: '#607D8B', // Gris bleu par défaut
  }

  return statusColors[status] || statusColors.default
}

/**
 * Valide la structure du fichier XML VTOM
 */
export function validateVTOMXML(xmlContent: string): { valid: boolean; error?: string } {
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlContent, 'text/xml')

    const parserError = xmlDoc.querySelector('parsererror')
    if (parserError) {
      return {
        valid: false,
        error: 'Format XML invalide : ' + parserError.textContent,
      }
    }

    // Vérifier la présence d'un noeud Domain
    const domain = xmlDoc.querySelector('Domain')
    if (!domain) {
      return {
        valid: false,
        error: 'Fichier XML VTOM invalide : balise <Domain> manquante',
      }
    }

    return { valid: true }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}
