/**
 * VtomPlanFromJson - Plan VTOM généré depuis tours.json
 * 
 * Affiche un plan visuel avec les applications VTOM positionnées selon leurs coordonnées réelles
 * extraites du fichier tours.json. Chaque application est représentée par une carte cliquable
 * avec sa couleur d'origine.
 * 
 * Structure :
 * - Canvas SVG avec système de coordonnées basé sur les données JSON
 * - Applications positionnées selon Node/@x et Node/@y
 * - Zoom et pan pour naviguer dans le plan
 * - Clic sur application → affiche détails dans modale
 * 
 * Données sources : tours.json
 */
import { useEffect, useRef, useState } from 'react'
import GhostButton from './GhostButton'
import toursData from '../data/tours.json'
import '../styles/VtomPlanFromJson.css'

interface Job {
  name: string
  status?: string
  script?: string
  parameters?: string[]
  frequency?: string
  mode?: string
  minStart?: string
  maxStart?: string
  retcode?: string
  background?: string
  x?: number
  y?: number
  width?: number
  height?: number
  parentApp?: string
}

interface ApplicationNode {
  name: string
  x: number
  y: number
  width: number
  background: string
  family?: string
  status?: string
  comment?: string
  cycleEnabled?: string
  cycle?: string
  jobsCount?: number
  jobs?: Job[]
}

interface ApplicationLink {
  from: string
  to: string
  type: string
}

interface JobLink {
  from: string
  to: string
  type: string
}

interface TrafficLight {
  x: number
  y: number
  width: number
  height: number
  label: string
}

interface Comment {
  x: number
  y: number
  width: number
  height: number
  label: string
  foreground: string
  font: string
}

interface Column {
  name: string
  x: number
  width: number
  color: string
}

interface SelectedApp {
  app: ApplicationNode
  mouseX: number
  mouseY: number
}

interface SelectedJob {
  job: Job
  appName: string
}

/**
 * VtomPlanFromJson - Composant principal du plan depuis JSON
 */
function VtomPlanFromJson() {
  const [applications, setApplications] = useState<ApplicationNode[]>([])
  const [links, setLinks] = useState<ApplicationLink[]>([])
  const [allJobs, setAllJobs] = useState<Job[]>([])
  const [trafficLights, setTrafficLights] = useState<TrafficLight[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [columns, setColumns] = useState<Column[]>([])
  const [selectedApp, setSelectedApp] = useState<SelectedApp | null>(null)
  const [selectedJob, setSelectedJob] = useState<SelectedJob | null>(null)
  // Vue initiale optimisée pour afficher les trois colonnes principales
  const [viewBox, setViewBox] = useState({ x: 0, y: 50, width: 3000, height: 1000 })
  const [scale, setScale] = useState(1)
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [isMinimapDragging, setIsMinimapDragging] = useState(false)
  const [isMinimapResizing, setIsMinimapResizing] = useState(false)
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [resizeCorner, setResizeCorner] = useState<string>('')
  const svgRef = useRef<SVGSVGElement>(null)
  const minimapRef = useRef<SVGSVGElement>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Empêcher le scroll de la page quand on scroll dans le plan
  useEffect(() => {
    const svgElement = svgRef.current
    if (!svgElement) return

    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault()
      
      const scrollSpeed = 0.5
      const deltaX = e.deltaX * scrollSpeed
      const deltaY = e.deltaY * scrollSpeed
      
      const viewBoxDeltaX = deltaX * (viewBox.width / (svgElement.clientWidth || 1000))
      const viewBoxDeltaY = deltaY * (viewBox.height / (svgElement.clientHeight || 1000))
      
      setViewBox(prev => ({
        ...prev,
        x: prev.x + viewBoxDeltaX,
        y: prev.y + viewBoxDeltaY
      }))
    }

    svgElement.addEventListener('wheel', handleWheelEvent, { passive: false })
    
    return () => {
      svgElement.removeEventListener('wheel', handleWheelEvent)
    }
  }, [viewBox.width, viewBox.height])

  useEffect(() => {
    // Extraction des applications depuis tours.json
    const extractApplications = () => {
      const apps: ApplicationNode[] = []
      
      try {
        const domain = toursData?.Domain
        const environment = domain?.Environments?.Environment
        const applicationsArray = environment?.Applications?.Application

        if (Array.isArray(applicationsArray)) {
          applicationsArray.forEach((app: any) => {
            const node = app?.Node
            if (node && node['@x'] && node['@y']) {
              const properties = node?.Properties?.Property
              let background = '#4b68ff' // Couleur par défaut
              let width = 220 // Largeur par défaut

              // Extraction des propriétés de style
              if (Array.isArray(properties)) {
                properties.forEach((prop: any) => {
                  if (prop['@key'] === 'background') {
                    background = prop['@value']
                  } else if (prop['@key'] === 'width') {
                    width = parseInt(prop['@value']) || 220
                  }
                })
              } else if (properties) {
                if (properties['@key'] === 'background') {
                  background = properties['@value']
                } else if (properties['@key'] === 'width') {
                  width = parseInt(properties['@value']) || 220
                }
              }

              // Comptage et extraction des jobs
              let jobsCount = 0
              const jobs: Job[] = []
              
              if (app.Jobs?.Job) {
                const jobsData = Array.isArray(app.Jobs.Job) ? app.Jobs.Job : [app.Jobs.Job]
                jobsCount = jobsData.length
                
                jobsData.forEach((job: any) => {
                  // Extraction de la couleur du job
                  let jobBackground = '#9932cc' // Couleur par défaut
                  const jobProperties = job?.Node?.Properties?.Property
                  
                  if (Array.isArray(jobProperties)) {
                    jobProperties.forEach((prop: any) => {
                      if (prop['@key'] === 'background') {
                        jobBackground = prop['@value']
                      }
                    })
                  } else if (jobProperties && jobProperties['@key'] === 'background') {
                    jobBackground = jobProperties['@value']
                  }
                  
                  // Extraction des paramètres
                  let parameters: string[] = []
                  if (job.Parameters?.Parameter) {
                    parameters = Array.isArray(job.Parameters.Parameter) 
                      ? job.Parameters.Parameter 
                      : [job.Parameters.Parameter]
                  }
                  
                  jobs.push({
                    name: job['@name'] || 'Sans nom',
                    status: job['@status'],
                    script: job.Script,
                    parameters: parameters,
                    frequency: job['@frequency'],
                    mode: job['@mode'],
                    minStart: job['@minStart'],
                    maxStart: job['@maxStart'],
                    retcode: job['@retcode'],
                    background: jobBackground
                  })
                })
              }

              apps.push({
                name: app['@name'] || 'Sans nom',
                x: parseInt(node['@x']),
                y: parseInt(node['@y']),
                width: width,
                background: background,
                family: app['@family'],
                status: app['@status'],
                comment: app['@comment'],
                cycleEnabled: app['@cycleEnabled'],
                cycle: app['@cycle'],
                jobsCount: jobsCount,
                jobs: jobs
              })
            }
          })
        }
      } catch (error) {
        console.error('Erreur lors de l\'extraction des applications:', error)
      }

      return apps
    }

    const extractLinks = () => {
      const extractedLinks: ApplicationLink[] = []
      
      try {
        const domain = toursData?.Domain
        const linksData = domain?.Links?.Link

        if (Array.isArray(linksData)) {
          linksData.forEach((link: any) => {
            const parent = link['@parent']
            const child = link['@child']
            
            if (parent && child) {
              // Extraire le nom de l'application depuis le chemin complet
              // Format: PAY_TOURS/APPLICATION/JOB -> APPLICATION
              const parentApp = parent.split('/')[1]
              const childApp = child.split('/')[1]
              
              if (parentApp && childApp && parentApp !== childApp) {
                extractedLinks.push({
                  from: parentApp,
                  to: childApp,
                  type: link['@type'] || 'M'
                })
              }
            }
          })
        }
      } catch (error) {
        console.error('Erreur lors de l\'extraction des liens:', error)
      }

      return extractedLinks
    }

    const extractAllJobs = (apps: ApplicationNode[]) => {
      const jobsList: Job[] = []
      const jobWidth = 180
      const jobHeight = 60
      const jobSpacing = 10
      
      apps.forEach(app => {
        if (app.jobs && app.jobs.length > 0) {
          // Calculer la position de départ des jobs sous l'application
          const startY = app.y + 100 // 20px sous l'application (hauteur app = 80px)
          
          app.jobs.forEach((job, index) => {
            // Positionner les jobs en colonne sous leur application
            const jobY = startY + (index * (jobHeight + jobSpacing))
            
            jobsList.push({
              ...job,
              x: app.x + (app.width - jobWidth) / 2, // Centrer sous l'application
              y: jobY,
              width: jobWidth,
              height: jobHeight,
              parentApp: app.name
            })
          })
        }
      })
      
      return jobsList
    }

    const extractTrafficLights = () => {
      const lights: TrafficLight[] = []
      
      try {
        const domain = toursData?.Domain
        const environment = domain?.Environments?.Environment
        const graph = environment?.Graph
        const nodes = graph?.Node

        if (Array.isArray(nodes)) {
          nodes.forEach((node: any) => {
            if (node['@objectType'] === 'com') {
              const properties = node?.Properties?.Property
              let hasTrafficLight = false
              let width = 90
              let height = 40
              
              if (Array.isArray(properties)) {
                properties.forEach((prop: any) => {
                  if (prop['@key'] === 'icon' && prop['@value'] === 'trafficlight_on') {
                    hasTrafficLight = true
                  } else if (prop['@key'] === 'width') {
                    width = parseInt(prop['@value']) || 90
                  } else if (prop['@key'] === 'height') {
                    height = parseInt(prop['@value']) || 40
                  }
                })
              }
              
              if (hasTrafficLight && node['@x'] && node['@y']) {
                lights.push({
                  x: parseInt(node['@x']),
                  y: parseInt(node['@y']),
                  width: width,
                  height: height,
                  label: node['@label'] || ''
                })
              }
            }
          })
        }
      } catch (error) {
        console.error('Erreur lors de l\'extraction des feux rouges:', error)
      }

      return lights
    }

    const extractComments = () => {
      const extractedComments: Comment[] = []
      
      try {
        const domain = toursData?.Domain
        const environment = domain?.Environments?.Environment
        const graph = environment?.Graph
        const nodes = graph?.Node

        if (Array.isArray(nodes)) {
          nodes.forEach((node: any) => {
            if (node['@objectType'] === 'com') {
              const properties = node?.Properties?.Property
              let hasTrafficLight = false
              let width = 200
              let height = 40
              let foreground = '#000000'
              let font = 'SansSerif#12#false#false'
              
              if (Array.isArray(properties)) {
                properties.forEach((prop: any) => {
                  if (prop['@key'] === 'icon' && prop['@value'] === 'trafficlight_on') {
                    hasTrafficLight = true
                  } else if (prop['@key'] === 'width') {
                    width = parseInt(prop['@value']) || 200
                  } else if (prop['@key'] === 'height') {
                    height = parseInt(prop['@value']) || 40
                  } else if (prop['@key'] === 'foreground') {
                    foreground = prop['@value'] || '#000000'
                  } else if (prop['@key'] === 'font') {
                    font = prop['@value'] || 'SansSerif#12#false#false'
                  }
                })
              }
              
              // Seulement les commentaires textuels (pas les feux tricolores)
              if (!hasTrafficLight && node['@x'] && node['@y'] && node['@label']) {
                extractedComments.push({
                  x: parseInt(node['@x']),
                  y: parseInt(node['@y']),
                  width: width,
                  height: height,
                  label: node['@label'],
                  foreground: foreground,
                  font: font
                })
              }
            }
          })
        }
      } catch (error) {
        console.error('Erreur lors de l\'extraction des commentaires:', error)
      }

      return extractedComments
    }

    const extractColumns = (apps: ApplicationNode[]) => {
      // Analyser les positions X pour déterminer les colonnes naturelles
      const xPositions = apps.map(app => app.x).sort((a, b) => a - b)
      const columnPositions: number[] = []
      
      // Grouper les positions proches (tolérance de 150px)
      xPositions.forEach(x => {
        const existingColumn = columnPositions.find(col => Math.abs(col - x) < 150)
        if (!existingColumn) {
          columnPositions.push(x)
        }
      })
      
      // Si on a moins de 3 colonnes détectées, on les ajoute manuellement
      // en se basant sur les positions standards du plan VTOM
      const manualColumns = [
        { name: 'MDE', x: 50, width: 470, color: '#37b57a' },
        { name: 'PAY / Interfaces', x: 570, width: 370, color: '#f59e0b' },
        { name: 'Paysages', x: 990, width: 1900, color: '#b35de8' }
      ]
      
      // Si des colonnes sont détectées automatiquement, les utiliser
      if (columnPositions.length >= 3) {
        const columnNames = ['MDE', 'PAY / Interfaces', 'Paysages']
        const columnColors = ['#37b57a', '#f59e0b', '#b35de8']
        const columnWidths = [470, 370, 1900]
        
        return columnPositions.slice(0, 3).map((x, index) => ({
          name: columnNames[index] || `Colonne ${index + 1}`,
          x: x,
          width: columnWidths[index] || 400,
          color: columnColors[index] || '#6b7280'
        }))
      }
      
      // Sinon, utiliser les colonnes manuelles
      return manualColumns
    }

    const extractedApps = extractApplications()
    setApplications(extractedApps)
    setLinks(extractLinks())
    setAllJobs(extractAllJobs(extractedApps))
    setTrafficLights(extractTrafficLights())
    setComments(extractComments())
    setColumns(extractColumns(extractedApps))
  }, [])

  // Gestion du zoom
  const handleZoom = (delta: number) => {
    const newScale = Math.max(0.3, Math.min(5, scale + delta))
    setScale(newScale)
    setViewBox({
      ...viewBox,
      width: 3000 / newScale,
      height: 7000 / newScale
    })
  }

  // Gestion du pan (déplacement)
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    const target = e.target as HTMLElement
    if (e.button === 0 && !target.closest('.app-node')) {
      setIsPanning(true)
      setPanStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isPanning) {
      const dx = (e.clientX - panStart.x) * (3000 / (svgRef.current?.clientWidth || 1000))
      const dy = (e.clientY - panStart.y) * (7000 / (svgRef.current?.clientHeight || 1000))
      
      setViewBox({
        ...viewBox,
        x: viewBox.x - dx / scale,
        y: viewBox.y - dy / scale
      })
      setPanStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  // Gestion de la sélection d'application
  const handleAppClick = (app: ApplicationNode, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedApp({
      app,
      mouseX: e.clientX,
      mouseY: e.clientY
    })
  }

  const closeModal = () => {
    setSelectedApp(null)
  }

  // Gestion de la sélection d'un job
  const handleJobClick = (job: Job, appName: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedJob({
      job,
      appName
    })
  }

  const closeJobModal = () => {
    setSelectedJob(null)
  }

  // Fonction pour extraire les liens entre jobs d'une application
  const getJobLinksForApp = (appName: string, jobs: Job[]): JobLink[] => {
    const jobLinks: JobLink[] = []
    
    try {
      const domain = toursData?.Domain
      const linksData = domain?.Links?.Link

      if (Array.isArray(linksData)) {
        linksData.forEach((link: any) => {
          const parent = link['@parent']
          const child = link['@child']
          
          if (parent && child) {
            // Format: PAY_TOURS/APPLICATION/JOB
            const parentParts = parent.split('/')
            const childParts = child.split('/')
            
            if (parentParts.length === 3 && childParts.length === 3) {
              const parentApp = parentParts[1]
              const parentJob = parentParts[2]
              const childApp = childParts[1]
              const childJob = childParts[2]
              
              // Seulement les liens au sein de la même application
              if (parentApp === appName && childApp === appName) {
                // Vérifier que les deux jobs existent dans la liste
                const fromJobExists = jobs.some(j => j.name === parentJob)
                const toJobExists = jobs.some(j => j.name === childJob)
                
                if (fromJobExists && toJobExists) {
                  jobLinks.push({
                    from: parentJob,
                    to: childJob,
                    type: link['@type'] || 'M'
                  })
                }
              }
            }
          }
        })
      }
    } catch (error) {
      console.error('Erreur lors de l\'extraction des liens entre jobs:', error)
    }

    return jobLinks
  }

  // Gestion du drag du viewport dans la minimap
  const handleMinimapViewportMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMinimapDragging(true)
  }

  const handleMinimapMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isMinimapDragging && minimapRef.current) {
      const svg = minimapRef.current
      const rect = svg.getBoundingClientRect()
      
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const planX = (x / rect.width) * 3000
      const planY = (y / rect.height) * 7000
      
      setViewBox({
        x: planX - viewBox.width / 2,
        y: planY - viewBox.height / 2,
        width: viewBox.width,
        height: viewBox.height
      })
    }
  }

  const handleMinimapMouseUp = () => {
    setIsMinimapDragging(false)
    setIsMinimapResizing(false)
  }

  // Gestion du clic sur la minimap pour navigation rapide
  const handleMinimapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isMinimapDragging || isMinimapResizing) return
    
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const planX = (x / rect.width) * 3000
    const planY = (y / rect.height) * 7000
    
    setViewBox({
      x: planX - viewBox.width / 2,
      y: planY - viewBox.height / 2,
      width: viewBox.width,
      height: viewBox.height
    })
  }

  // Gestion du redimensionnement via les coins
  const handleResizeCornerMouseDown = (e: React.MouseEvent, corner: string) => {
    e.stopPropagation()
    setIsMinimapResizing(true)
    setResizeCorner(corner)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: viewBox.width,
      height: viewBox.height
    })
  }

  const handleMinimapResizeMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isMinimapResizing && minimapRef.current) {
      const svg = minimapRef.current
      const rect = svg.getBoundingClientRect()
      
      const deltaX = e.clientX - resizeStart.x
      const deltaY = e.clientY - resizeStart.y
      
      // Convertir le delta en coordonnées du plan
      const planDeltaX = (deltaX / rect.width) * 3000
      const planDeltaY = (deltaY / rect.height) * 7000
      
      let newX = viewBox.x
      let newY = viewBox.y
      let newWidth = resizeStart.width
      let newHeight = resizeStart.height
      
      // Appliquer le redimensionnement selon le coin
      switch (resizeCorner) {
        case 'top-left':
          newX = viewBox.x + planDeltaX
          newY = viewBox.y + planDeltaY
          newWidth = resizeStart.width - planDeltaX
          newHeight = resizeStart.height - planDeltaY
          break
        case 'top-right':
          newY = viewBox.y + planDeltaY
          newWidth = resizeStart.width + planDeltaX
          newHeight = resizeStart.height - planDeltaY
          break
        case 'bottom-left':
          newX = viewBox.x + planDeltaX
          newWidth = resizeStart.width - planDeltaX
          newHeight = resizeStart.height + planDeltaY
          break
        case 'bottom-right':
          newWidth = resizeStart.width + planDeltaX
          newHeight = resizeStart.height + planDeltaY
          break
      }
      
      // Appliquer les limites (minimum 300x700, maximum 3000x7000)
      newWidth = Math.max(300, Math.min(3000, newWidth))
      newHeight = Math.max(700, Math.min(7000, newHeight))
      
      // Calculer le nouveau scale basé sur la largeur
      const newScale = 3000 / newWidth
      
      setScale(newScale)
      setViewBox({
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      })
    }
  }

  // Filtrage des applications
  const filteredApps = applications.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Icônes de statut
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'E': return '✅' // Ended
      case 'W': return '⏳' // Waiting
      case 'R': return '▶️' // Running
      case 'U': return '🔄' // Unknown
      default: return '❓'
    }
  }

  // Améliorer les couleurs pour les rendre plus vibrantes mais agréables
  const softenColor = (hexColor: string): string => {
    // Palette de remplacement pour les couleurs vives avec plus de saturation
    const colorMap: { [key: string]: string } = {
      // Bleus vifs → bleus saturés mais équilibrés
      '#0000FF': '#5B7FFF',
      '#0000CD': '#6B8FFF',
      '#00008B': '#4A6FEE',
      '#000080': '#3B5FDD',
      '#0000AA': '#5A7FEE',
      '#4B68FF': '#5B7FFF',
      
      // Violets/Magentas vifs → violets saturés
      '#FF00FF': '#B85FFF',
      '#8B008B': '#9B58EA',
      '#800080': '#8B4FDD',
      '#9400D3': '#A45FEE',
      '#FF00AA': '#D068DD',
      
      // Rouges vifs → rouges corail saturés
      '#FF0000': '#FF5555',
      '#DC143C': '#FF6666',
      '#8B0000': '#CC4444',
      '#CD5C5C': '#FF7777',
      
      // Verts vifs → verts émeraude saturés
      '#00FF00': '#55DD77',
      '#00AA00': '#44CC66',
      '#008000': '#33BB55',
      '#32CD32': '#55DD77',
      '#00FF7F': '#55EE88',
      
      // Jaunes/Oranges vifs → jaunes/oranges chauds
      '#FFFF00': '#FFE555',
      '#FFD700': '#FFCC44',
      '#FFA500': '#FF9933',
      '#FF8C00': '#FF8822',
      
      // Cyans vifs → cyans turquoise saturés
      '#00FFFF': '#33DDEE',
      '#00CED1': '#22CCDD',
      '#00AAAA': '#22BBCC',
      
      // Roses vifs → roses saturés
      '#FF1493': '#FF5599',
      '#FF69B4': '#FF88BB',
      '#FFB6C1': '#FFAACC',
    }
    
    // Normaliser le format hex
    const normalizedColor = hexColor.toUpperCase()
    
    // Si la couleur est dans la map, la remplacer
    if (colorMap[normalizedColor]) {
      return colorMap[normalizedColor]
    }
    
    // Sinon, ajuster algorithmiquement pour plus de vivacité
    try {
      // Extraire RGB
      const hex = normalizedColor.replace('#', '')
      if (hex.length !== 6) return hexColor
      
      let r = parseInt(hex.substr(0, 2), 16)
      let g = parseInt(hex.substr(2, 2), 16)
      let b = parseInt(hex.substr(4, 2), 16)
      
      // Calculer la luminosité
      const brightness = (r * 299 + g * 587 + b * 114) / 1000
      
      // Calculer la saturation
      const maxComponent = Math.max(r, g, b)
      const minComponent = Math.min(r, g, b)
      const saturation = maxComponent === 0 ? 0 : (maxComponent - minComponent) / maxComponent
      
      // Ajuster les couleurs trop saturées ou trop sombres/claires
      if (saturation > 0.8 || brightness < 80 || brightness > 220) {
        // Réduire modérément la saturation (garder plus de couleur qu'avant)
        const targetBrightness = 140
        
        // Mélange léger pour adoucir sans dénaturer
        r = Math.round(r * 0.75 + targetBrightness * 0.25)
        g = Math.round(g * 0.75 + targetBrightness * 0.25)
        b = Math.round(b * 0.75 + targetBrightness * 0.25)
        
        // Ajuster la luminosité vers une plage confortable mais plus large (100-200)
        const newBrightness = (r * 299 + g * 587 + b * 114) / 1000
        if (newBrightness < 100) {
          const boost = 100 - newBrightness
          r = Math.min(255, r + boost)
          g = Math.min(255, g + boost)
          b = Math.min(255, b + boost)
        } else if (newBrightness > 200) {
          const reduce = newBrightness - 200
          r = Math.max(60, r - reduce)
          g = Math.max(60, g - reduce)
          b = Math.max(60, b - reduce)
        }
      }
      
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
    } catch {
      return hexColor
    }
  }

  return (
    <div className="vtom-plan-wrapper">
      <div className="vtom-plan-container">
      {/* Header avec contrôles */}
      <header className="vtom-plan-header">
        <div>
          <p className="vtom-plan__eyebrow">Plan cartographique</p>
          <h2>Plan vTom XML</h2>
          <p>
            {applications.length} applications • {allJobs.length} traitements • {links.length} liens entre applications • {trafficLights.length} feux rouges • {comments.length} commentaires • {columns.length} colonnes
            {columns.length > 0 && ` (${columns.map(c => c.name).join(', ')})`} • 
            Cliquez sur une application pour voir ses traitements.
          </p>
        </div>
        
        <div className="vtom-plan-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔎 Rechercher une application..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="zoom-controls">
            <GhostButton
              label="++"
              ariaLabel="Zoom rapide avant"
              variant="primary"
              onClick={() => handleZoom(0.5)}
            />
            <GhostButton
              label="+"
              ariaLabel="Zoom avant"
              variant="primary"
              onClick={() => handleZoom(0.2)}
            />
            <span className="zoom-level">{Math.round(scale * 100)}%</span>
            <GhostButton
              label="−"
              ariaLabel="Zoom arrière"
              variant="primary"
              onClick={() => handleZoom(-0.2)}
            />
            <GhostButton
              label="−−"
              ariaLabel="Zoom rapide arrière"
              variant="primary"
              onClick={() => handleZoom(-0.5)}
            />
            <GhostButton
              label="Reset"
              ariaLabel="Réinitialiser la vue"
              variant="outline"
              onClick={() => {
                setScale(1)
                setViewBox({ x: 0, y: 50, width: 3000, height: 1000 })
              }}
            />
          </div>
        </div>
      </header>

      {/* Section principale avec plan et légende */}
      <div className="vtom-plan-content">
        {/* Canvas SVG du plan */}
        <div className="vtom-plan-canvas">
          <svg
            ref={svgRef}
            className={`vtom-plan-svg ${isPanning ? 'panning' : ''}`}
            viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
          {/* Grille de fond */}
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="#fafbfc" />
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Colonnes de fond */}
          {columns.map((column, index) => (
            <g key={`column-${index}`} className="column-group">
              {/* Rectangle de fond de la colonne */}
              <rect
                x={column.x - 20}
                y={0}
                width={column.width}
                height={7000}
                fill={column.color}
                fillOpacity="0.03"
                stroke={column.color}
                strokeWidth="1"
                strokeOpacity="0.15"
                strokeDasharray="10,5"
              />
            </g>
          ))}

          {/* Liens entre applications */}
          {links.map((link, index) => {
            const fromApp = applications.find(app => app.name === link.from)
            const toApp = applications.find(app => app.name === link.to)
            
            if (fromApp && toApp) {
              // Calculer les centres des applications
              const fromX = fromApp.x + fromApp.width / 2
              const fromY = fromApp.y + 40
              const toX = toApp.x + toApp.width / 2
              const toY = toApp.y + 40
              
              return (
                <g key={`link-${index}`} className="app-link">
                  {/* Ligne principale */}
                  <line
                    x1={fromX}
                    y1={fromY}
                    x2={toX}
                    y2={toY}
                    stroke={link.type === 'E' ? '#2d7a4f' : '#3b4f9a'}
                    strokeWidth="4"
                    strokeOpacity="0.6"
                    strokeDasharray={link.type === 'M' ? '10,5' : '0'}
                  />
                  
                  {/* Flèche à la fin */}
                  <defs>
                    <marker
                      id={`arrow-${index}`}
                      markerWidth="15"
                      markerHeight="15"
                      refX="12"
                      refY="5"
                      orient="auto"
                      markerUnits="strokeWidth"
                    >
                      <path
                        d="M0,0 L0,10 L12,5 z"
                        fill={link.type === 'E' ? '#2d7a4f' : '#3b4f9a'}
                        opacity="0.8"
                      />
                    </marker>
                  </defs>
                  <line
                    x1={fromX}
                    y1={fromY}
                    x2={toX}
                    y2={toY}
                    stroke={link.type === 'E' ? '#2d7a4f' : '#3b4f9a'}
                    strokeWidth="4"
                    strokeOpacity="0.6"
                    strokeDasharray={link.type === 'M' ? '10,5' : '0'}
                    markerEnd={`url(#arrow-${index})`}
                  />
                </g>
              )
            }
            return null
          })}

          {/* Applications */}
          {filteredApps.map((app, index) => (
            <g
              key={index}
              className="app-node"
              onClick={(e) => handleAppClick(app, e)}
              style={{ cursor: 'pointer' }}
            >
              {/* Rectangle de l'application */}
              <rect
                x={app.x}
                y={app.y}
                width={app.width}
                height={80}
                fill={softenColor(app.background)}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
                rx="8"
                className="app-rect"
              />
              
              {/* Nom de l'application */}
              <text
                x={app.x + app.width / 2}
                y={app.y + 30}
                textAnchor="middle"
                fill="white"
                fontSize="14"
                fontWeight="600"
                className="app-name"
              >
                {app.name.length > 20 ? app.name.substring(0, 18) + '...' : app.name}
              </text>
              
              {/* Statut et jobs */}
              <text
                x={app.x + app.width / 2}
                y={app.y + 55}
                textAnchor="middle"
                fill="rgba(255,255,255,0.8)"
                fontSize="12"
              >
                {getStatusIcon(app.status)} {app.jobsCount ? `${app.jobsCount} job(s)` : ''}
              </text>
            </g>
          ))}

          {/* Feux rouges */}
          {trafficLights.map((light, index) => (
            <g key={`traffic-light-${index}`} className="traffic-light">
              {/* Fond léger pour visibilité */}
              <rect
                x={light.x}
                y={light.y}
                width={light.width}
                height={light.height}
                fill="#ffffff"
                fillOpacity="0.8"
                stroke="#ff0000"
                strokeWidth="2"
                rx="8"
              />
              
              {/* Émoji feu tricolore */}
              <text
                x={light.x + light.width / 2}
                y={light.y + light.height / 2 + 10}
                textAnchor="middle"
                fontSize={Math.min(light.width, light.height) * 0.8}
                style={{ userSelect: 'none' }}
              >
                🚦
              </text>
              
              {/* Label si présent */}
              {light.label && light.label.trim() !== '' && (
                <title>{light.label}</title>
              )}
            </g>
          ))}

          {/* Commentaires textuels */}
          {comments.map((comment, index) => {
            // Parser le font pour extraire la taille (format: "SansSerif#14#true#false")
            const fontParts = comment.font.split('#')
            const fontSize = fontParts.length > 1 ? parseInt(fontParts[1]) || 12 : 12
            const isBold = fontParts.length > 2 && fontParts[2] === 'true'
            const isItalic = fontParts.length > 3 && fontParts[3] === 'true'
            
            // Nettoyer le label HTML
            const cleanLabel = comment.label
              .replace(/<[^>]*>/g, ' ')
              .replace(/&nbsp;/g, ' ')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&amp;/g, '&')
              .replace(/\s+/g, ' ')
              .trim()
            
            return (
              <g key={`comment-${index}`} className="plan-comment">
                {/* Fond semi-transparent pour lisibilité */}
                <rect
                  x={comment.x}
                  y={comment.y}
                  width={comment.width}
                  height={comment.height}
                  fill="#ffffff"
                  fillOpacity="0.85"
                  stroke={comment.foreground}
                  strokeWidth="1"
                  strokeOpacity="0.3"
                  rx="4"
                />
                
                {/* Texte du commentaire */}
                <text
                  x={comment.x + 5}
                  y={comment.y + fontSize + 5}
                  fill={comment.foreground}
                  fontSize={fontSize}
                  fontWeight={isBold ? 'bold' : 'normal'}
                  fontStyle={isItalic ? 'italic' : 'normal'}
                  style={{ userSelect: 'none' }}
                >
                  {cleanLabel.length > 80 ? cleanLabel.substring(0, 77) + '...' : cleanLabel}
                </text>
                
                {/* Tooltip avec texte complet */}
                {cleanLabel.length > 0 && (
                  <title>{cleanLabel}</title>
                )}
              </g>
            )
          })}
        </svg>

        {/* Minimap */}
        <div className="vtom-plan-minimap">
          <svg 
            ref={minimapRef}
            viewBox="0 0 3000 7000" 
            className="minimap-svg"
            onClick={handleMinimapClick}
            onMouseMove={(e) => {
              handleMinimapMouseMove(e)
              handleMinimapResizeMove(e)
            }}
            onMouseUp={handleMinimapMouseUp}
            onMouseLeave={handleMinimapMouseUp}
            style={{ cursor: isMinimapDragging ? 'grabbing' : isMinimapResizing ? 'nwse-resize' : 'pointer' }}
          >
            <rect width="3000" height="7000" fill="#f3f4f6" />
            {applications.map((app, index) => (
              <rect
                key={index}
                x={app.x}
                y={app.y}
                width={app.width}
                height={80}
                fill={softenColor(app.background)}
                opacity="0.8"
              />
            ))}
            {trafficLights.map((light, index) => (
              <g key={`minimap-light-${index}`}>
                <rect
                  x={light.x}
                  y={light.y}
                  width={light.width}
                  height={light.height}
                  fill="#2c2c2c"
                  opacity="0.9"
                  stroke="#ff0000"
                  strokeWidth="3"
                  rx="4"
                />
              </g>
            ))}
            {/* Viewport indicator */}
            <g>
              <rect
                x={viewBox.x}
                y={viewBox.y}
                width={viewBox.width}
                height={viewBox.height}
                fill="rgba(239, 68, 68, 0.1)"
                stroke="#ef4444"
                strokeWidth="20"
                onMouseDown={handleMinimapViewportMouseDown}
                style={{ cursor: 'grab' }}
              />
              
              {/* Coin de redimensionnement en haut à gauche */}
              <g onMouseDown={(e) => handleResizeCornerMouseDown(e, 'top-left')}>
                <rect
                  x={viewBox.x}
                  y={viewBox.y}
                  width="100"
                  height="100"
                  fill="#ef4444"
                  opacity="0.5"
                  style={{ cursor: 'nwse-resize' }}
                />
                <circle
                  cx={viewBox.x + 50}
                  cy={viewBox.y + 50}
                  r="30"
                  fill="white"
                  opacity="0.8"
                />
                <text
                  x={viewBox.x + 50}
                  y={viewBox.y + 60}
                  textAnchor="middle"
                  fill="#ef4444"
                  fontSize="40"
                  fontWeight="bold"
                >
                  ⇱
                </text>
              </g>
              
              {/* Coin de redimensionnement en haut à droite */}
              <g onMouseDown={(e) => handleResizeCornerMouseDown(e, 'top-right')}>
                <rect
                  x={viewBox.x + viewBox.width - 100}
                  y={viewBox.y}
                  width="100"
                  height="100"
                  fill="#ef4444"
                  opacity="0.5"
                  style={{ cursor: 'nesw-resize' }}
                />
                <circle
                  cx={viewBox.x + viewBox.width - 50}
                  cy={viewBox.y + 50}
                  r="30"
                  fill="white"
                  opacity="0.8"
                />
                <text
                  x={viewBox.x + viewBox.width - 50}
                  y={viewBox.y + 60}
                  textAnchor="middle"
                  fill="#ef4444"
                  fontSize="40"
                  fontWeight="bold"
                >
                  ⇲
                </text>
              </g>
              
              {/* Coin de redimensionnement en bas à gauche */}
              <g onMouseDown={(e) => handleResizeCornerMouseDown(e, 'bottom-left')}>
                <rect
                  x={viewBox.x}
                  y={viewBox.y + viewBox.height - 100}
                  width="100"
                  height="100"
                  fill="#ef4444"
                  opacity="0.5"
                  style={{ cursor: 'nesw-resize' }}
                />
                <circle
                  cx={viewBox.x + 50}
                  cy={viewBox.y + viewBox.height - 50}
                  r="30"
                  fill="white"
                  opacity="0.8"
                />
                <text
                  x={viewBox.x + 50}
                  y={viewBox.y + viewBox.height - 40}
                  textAnchor="middle"
                  fill="#ef4444"
                  fontSize="40"
                  fontWeight="bold"
                >
                  ⇱
                </text>
              </g>
              
              {/* Coin de redimensionnement en bas à droite */}
              <g onMouseDown={(e) => handleResizeCornerMouseDown(e, 'bottom-right')}>
                <rect
                  x={viewBox.x + viewBox.width - 100}
                  y={viewBox.y + viewBox.height - 100}
                  width="100"
                  height="100"
                  fill="#ef4444"
                  opacity="0.5"
                  style={{ cursor: 'nwse-resize' }}
                />
                <circle
                  cx={viewBox.x + viewBox.width - 50}
                  cy={viewBox.y + viewBox.height - 50}
                  r="30"
                  fill="white"
                  opacity="0.8"
                />
                <text
                  x={viewBox.x + viewBox.width - 50}
                  y={viewBox.y + viewBox.height - 40}
                  textAnchor="middle"
                  fill="#ef4444"
                  fontSize="40"
                  fontWeight="bold"
                >
                  ⇲
                </text>
              </g>
            </g>
          </svg>
        </div>
      </div>

      {/* Légende séparée */}
      <div className="vtom-plan-legend-external">
        <h4>Légende</h4>
        <div className="legend-sections-grid">
          <div className="legend-section">
            <p className="legend-section-title">Éléments</p>
            <div className="legend-item">
              <span style={{ fontSize: '20px', marginRight: '8px' }}>📦</span>
              Applications
            </div>
            <div className="legend-item">
              <span style={{ fontSize: '24px', marginRight: '8px' }}>🚦</span>
              Points de contrôle
            </div>
            <div className="legend-item">
              <span style={{ fontSize: '18px', marginRight: '8px' }}>💬</span>
              Commentaires
            </div>
          </div>
          <div className="legend-section">
            <p className="legend-section-title">Statuts</p>
            <div className="legend-item">
              <span>✅</span> Terminé
            </div>
            <div className="legend-item">
              <span>⏳</span> En attente
            </div>
            <div className="legend-item">
              <span>▶️</span> En cours
            </div>
            <div className="legend-item">
              <span>🔄</span> Inconnu
            </div>
          </div>
          <div className="legend-section">
            <p className="legend-section-title">Liens entre applications</p>
            <div className="legend-item">
              <svg width="30" height="2" style={{ marginRight: '8px' }}>
                <line x1="0" y1="1" x2="30" y2="1" stroke="#2d7a4f" strokeWidth="2" strokeOpacity="0.7" />
              </svg>
              Continu (E)
            </div>
            <div className="legend-item">
              <svg width="30" height="2" style={{ marginRight: '8px' }}>
                <line x1="0" y1="1" x2="30" y2="1" stroke="#3b4f9a" strokeWidth="2" strokeOpacity="0.7" strokeDasharray="5,5" />
              </svg>
              Pointillé (M)
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Modale de détails */}
      {selectedApp && (
        <div className="vtom-modal-overlay" onClick={closeModal}>
          <div className="vtom-modal" onClick={(e) => e.stopPropagation()}>
            <button className="vtom-modal__close" onClick={closeModal}>
              ✕
            </button>
            
            <div className="vtom-modal__header">
              <h3>{selectedApp.app.name}</h3>
              <span className="status-badge">
                {getStatusIcon(selectedApp.app.status)} {selectedApp.app.status || 'N/A'}
              </span>
            </div>
            
            <div className="vtom-modal__body">
              <div className="detail-row">
                <span className="label">Famille:</span>
                <span className="value">{selectedApp.app.family || 'N/A'}</span>
              </div>
              
              <div className="detail-row">
                <span className="label">Position:</span>
                <span className="value">X: {selectedApp.app.x}, Y: {selectedApp.app.y}</span>
              </div>
              
              <div className="detail-row">
                <span className="label">Couleur:</span>
                <span className="value">
                  <span
                    style={{
                      display: 'inline-block',
                      width: '20px',
                      height: '20px',
                      backgroundColor: selectedApp.app.background,
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      verticalAlign: 'middle',
                      marginRight: '8px'
                    }}
                  />
                  {selectedApp.app.background}
                </span>
              </div>
              
              {selectedApp.app.cycleEnabled === '1' && (
                <div className="detail-row">
                  <span className="label">Cycle:</span>
                  <span className="value">{selectedApp.app.cycle || 'N/A'}</span>
                </div>
              )}
              
              <div className="detail-row">
                <span className="label">Nombre de jobs:</span>
                <span className="value">{selectedApp.app.jobsCount || 0}</span>
              </div>
              
              {selectedApp.app.comment && (
                <div className="detail-row">
                  <span className="label">Commentaire:</span>
                  <span className="value">{selectedApp.app.comment}</span>
                </div>
              )}

              {/* Section des traitements */}
              {selectedApp.app.jobs && selectedApp.app.jobs.length > 0 && (() => {
                const jobLinks = getJobLinksForApp(selectedApp.app.name, selectedApp.app.jobs)
                const jobWidth = 250
                const jobHeight = 120
                const jobSpacing = 40
                const canvasWidth = 800
                const canvasHeight = Math.max(400, selectedApp.app.jobs.length * (jobHeight + jobSpacing))
                
                // Positionner les jobs en colonne
                const jobsWithPositions = selectedApp.app.jobs.map((job, index) => ({
                  ...job,
                  x: (canvasWidth - jobWidth) / 2,
                  y: 20 + index * (jobHeight + jobSpacing)
                }))
                
                return (
                  <div className="jobs-section">
                    <h4 style={{ marginTop: '24px', marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
                      Traitements ({selectedApp.app.jobs.length})
                      {jobLinks.length > 0 && ` • ${jobLinks.length} lien(s)`}
                    </h4>
                    
                    {/* Canvas SVG avec les jobs et leurs liens */}
                    <div style={{ 
                      width: '100%', 
                      maxHeight: '600px', 
                      overflowY: 'auto', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      backgroundColor: '#fafbfc'
                    }}>
                      <svg 
                        width={canvasWidth} 
                        height={canvasHeight}
                        style={{ display: 'block' }}
                      >
                        {/* Grille de fond légère */}
                        <defs>
                          <pattern id="job-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="1"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#job-grid)" />
                        
                        {/* Liens entre jobs */}
                        {jobLinks.map((link, linkIndex) => {
                          const fromJob = jobsWithPositions.find(j => j.name === link.from)
                          const toJob = jobsWithPositions.find(j => j.name === link.to)
                          
                          if (fromJob && toJob) {
                            const fromX = fromJob.x + jobWidth / 2
                            const fromY = fromJob.y + jobHeight
                            const toX = toJob.x + jobWidth / 2
                            const toY = toJob.y
                            
                            return (
                              <g key={`job-link-${linkIndex}`}>
                                <defs>
                                  <marker
                                    id={`job-arrow-modal-${linkIndex}`}
                                    markerWidth="10"
                                    markerHeight="10"
                                    refX="9"
                                    refY="5"
                                    orient="auto"
                                  >
                                    <path
                                      d="M0,0 L0,10 L10,5 z"
                                      fill={link.type === 'E' ? '#10b981' : '#8b5cf6'}
                                    />
                                  </marker>
                                </defs>
                                <line
                                  x1={fromX}
                                  y1={fromY}
                                  x2={toX}
                                  y2={toY}
                                  stroke={link.type === 'E' ? '#10b981' : '#8b5cf6'}
                                  strokeWidth="3"
                                  strokeOpacity="0.7"
                                  strokeDasharray={link.type === 'M' ? '8,4' : '0'}
                                  markerEnd={`url(#job-arrow-modal-${linkIndex})`}
                                />
                              </g>
                            )
                          }
                          return null
                        })}
                        
                        {/* Jobs */}
                        {jobsWithPositions.map((job, index) => (
                          <g 
                            key={`job-${index}`}
                            onClick={(e) => handleJobClick(job, selectedApp.app.name, e)}
                            style={{ cursor: 'pointer' }}
                            className="job-node"
                          >
                            {/* Rectangle du job */}
                            <rect
                              x={job.x}
                              y={job.y}
                              width={jobWidth}
                              height={jobHeight}
                              fill={softenColor(job.background || '#9932cc')}
                              stroke="rgba(255,255,255,0.5)"
                              strokeWidth="2"
                              rx="8"
                              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                            />
                            
                            {/* Nom du job */}
                            <text
                              x={job.x + jobWidth / 2}
                              y={job.y + 25}
                              textAnchor="middle"
                              fill="white"
                              fontSize="14"
                              fontWeight="600"
                            >
                              {job.name.length > 25 ? job.name.substring(0, 23) + '...' : job.name}
                            </text>
                            
                            {/* Statut */}
                            {job.status && (
                              <text
                                x={job.x + jobWidth / 2}
                                y={job.y + 48}
                                textAnchor="middle"
                                fill="rgba(255,255,255,0.85)"
                                fontSize="12"
                              >
                                {getStatusIcon(job.status)} {job.status}
                              </text>
                            )}
                            
                            {/* Script */}
                            {job.script && (
                              <text
                                x={job.x + jobWidth / 2}
                                y={job.y + 70}
                                textAnchor="middle"
                                fill="rgba(255,255,255,0.75)"
                                fontSize="10"
                                fontFamily="monospace"
                              >
                                {job.script.length > 35 ? job.script.substring(0, 33) + '...' : job.script}
                              </text>
                            )}
                            
                            {/* Fréquence et mode */}
                            <text
                              x={job.x + jobWidth / 2}
                              y={job.y + 90}
                              textAnchor="middle"
                              fill="rgba(255,255,255,0.7)"
                              fontSize="10"
                            >
                              {job.frequency && `Freq: ${job.frequency}`}
                              {job.frequency && job.mode && ' • '}
                              {job.mode && `Mode: ${job.mode}`}
                            </text>
                            
                            {/* Horaires */}
                            {(job.minStart || job.maxStart) && (
                              <text
                                x={job.x + jobWidth / 2}
                                y={job.y + 108}
                                textAnchor="middle"
                                fill="rgba(255,255,255,0.7)"
                                fontSize="9"
                              >
                                {job.minStart && `${job.minStart}`}
                                {job.minStart && job.maxStart && ' → '}
                                {job.maxStart && `${job.maxStart}`}
                              </text>
                            )}
                          </g>
                        ))}
                      </svg>
                    </div>
                    
                    {/* Liste détaillée des jobs (optionnelle) */}
                    <details style={{ marginTop: '16px' }}>
                      <summary style={{ cursor: 'pointer', fontWeight: '600', color: '#374151', padding: '8px 0' }}>
                        📋 Voir les détails complets
                      </summary>
                      <div className="jobs-list" style={{ marginTop: '12px' }}>
                        {selectedApp.app.jobs.map((job, index) => (
                      <div 
                        key={index} 
                        className="job-card"
                        style={{
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          padding: '16px',
                          marginBottom: '12px',
                          backgroundColor: '#f9fafb',
                          borderLeft: `4px solid ${softenColor(job.background || '#9932cc')}`
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                          <h5 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                            {job.name}
                          </h5>
                          {job.status && (
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '500',
                              backgroundColor: '#e0e7ff',
                              color: '#3730a3'
                            }}>
                              {getStatusIcon(job.status)} {job.status}
                            </span>
                          )}
                        </div>
                        
                        <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
                          {job.script && (
                            <div style={{ display: 'flex' }}>
                              <span style={{ fontWeight: '500', color: '#6b7280', minWidth: '120px' }}>Script:</span>
                              <span style={{ color: '#374151', fontFamily: 'monospace', fontSize: '13px' }}>{job.script}</span>
                            </div>
                          )}
                          
                          {job.parameters && job.parameters.length > 0 && (
                            <div style={{ display: 'flex' }}>
                              <span style={{ fontWeight: '500', color: '#6b7280', minWidth: '120px' }}>Paramètres:</span>
                              <div style={{ flex: 1 }}>
                                {job.parameters.map((param, idx) => (
                                  <div 
                                    key={idx} 
                                    style={{ 
                                      color: '#374151', 
                                      fontFamily: 'monospace', 
                                      fontSize: '13px',
                                      backgroundColor: '#fff',
                                      padding: '4px 8px',
                                      borderRadius: '4px',
                                      marginBottom: '4px',
                                      border: '1px solid #e5e7eb'
                                    }}
                                  >
                                    {param}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
                            {job.frequency && (
                              <div style={{ display: 'flex' }}>
                                <span style={{ fontWeight: '500', color: '#6b7280' }}>Fréquence:</span>
                                <span style={{ color: '#374151', marginLeft: '8px' }}>{job.frequency}</span>
                              </div>
                            )}
                            
                            {job.mode && (
                              <div style={{ display: 'flex' }}>
                                <span style={{ fontWeight: '500', color: '#6b7280' }}>Mode:</span>
                                <span style={{ color: '#374151', marginLeft: '8px' }}>{job.mode}</span>
                              </div>
                            )}
                            
                            {job.minStart && (
                              <div style={{ display: 'flex' }}>
                                <span style={{ fontWeight: '500', color: '#6b7280' }}>Début min:</span>
                                <span style={{ color: '#374151', marginLeft: '8px' }}>{job.minStart}</span>
                              </div>
                            )}
                            
                            {job.maxStart && (
                              <div style={{ display: 'flex' }}>
                                <span style={{ fontWeight: '500', color: '#6b7280' }}>Début max:</span>
                                <span style={{ color: '#374151', marginLeft: '8px' }}>{job.maxStart}</span>
                              </div>
                            )}
                            
                            {job.retcode && (
                              <div style={{ display: 'flex' }}>
                                <span style={{ fontWeight: '500', color: '#6b7280' }}>Code retour:</span>
                                <span style={{ color: '#374151', marginLeft: '8px' }}>{job.retcode}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                      </div>
                    </details>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Modale de détails d'un job */}
      {selectedJob && (
        <div className="vtom-modal-overlay" onClick={closeJobModal} style={{ zIndex: 1001 }}>
          <div className="vtom-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <button className="vtom-modal__close" onClick={closeJobModal}>
              ✕
            </button>
            
            <div className="vtom-modal__header">
              <h3>{selectedJob.job.name}</h3>
              <span className="status-badge">
                {getStatusIcon(selectedJob.job.status)} {selectedJob.job.status || 'N/A'}
              </span>
            </div>
            
            <div className="vtom-modal__body">
              <div className="detail-row">
                <span className="label">Application:</span>
                <span className="value">{selectedJob.appName}</span>
              </div>
              
              {selectedJob.job.script && (
                <div className="detail-row" style={{ alignItems: 'flex-start' }}>
                  <span className="label">Chemin du script:</span>
                  <span 
                    className="value" 
                    style={{ 
                      fontFamily: 'monospace', 
                      fontSize: '13px',
                      backgroundColor: '#f3f4f6',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      wordBreak: 'break-all',
                      flex: 1
                    }}
                  >
                    {selectedJob.job.script}
                  </span>
                </div>
              )}
              
              {selectedJob.job.parameters && selectedJob.job.parameters.length > 0 && (
                <div className="detail-row" style={{ alignItems: 'flex-start' }}>
                  <span className="label">Paramètres:</span>
                  <div style={{ flex: 1 }}>
                    {selectedJob.job.parameters.map((param, idx) => (
                      <div 
                        key={idx} 
                        style={{ 
                          fontFamily: 'monospace', 
                          fontSize: '13px',
                          backgroundColor: '#f3f4f6',
                          padding: '6px 10px',
                          borderRadius: '4px',
                          marginBottom: '6px',
                          wordBreak: 'break-all'
                        }}
                      >
                        {param}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '16px', 
                marginTop: '16px',
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px'
              }}>
                {selectedJob.job.frequency && (
                  <div className="detail-row">
                    <span className="label">Fréquence:</span>
                    <span className="value">{selectedJob.job.frequency}</span>
                  </div>
                )}
                
                {selectedJob.job.mode && (
                  <div className="detail-row">
                    <span className="label">Mode:</span>
                    <span className="value">{selectedJob.job.mode}</span>
                  </div>
                )}
                
                {selectedJob.job.minStart && (
                  <div className="detail-row">
                    <span className="label">Heure min:</span>
                    <span className="value">{selectedJob.job.minStart}</span>
                  </div>
                )}
                
                {selectedJob.job.maxStart && (
                  <div className="detail-row">
                    <span className="label">Heure max:</span>
                    <span className="value">{selectedJob.job.maxStart}</span>
                  </div>
                )}
                
                {selectedJob.job.retcode && (
                  <div className="detail-row">
                    <span className="label">Code retour:</span>
                    <span className="value">{selectedJob.job.retcode}</span>
                  </div>
                )}
              </div>
              
              {selectedJob.job.background && (
                <div className="detail-row" style={{ marginTop: '16px' }}>
                  <span className="label">Couleur:</span>
                  <span className="value">
                    <span
                      style={{
                        display: 'inline-block',
                        width: '24px',
                        height: '24px',
                        backgroundColor: selectedJob.job.background,
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        verticalAlign: 'middle',
                        marginRight: '8px'
                      }}
                    />
                    {selectedJob.job.background}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default VtomPlanFromJson
