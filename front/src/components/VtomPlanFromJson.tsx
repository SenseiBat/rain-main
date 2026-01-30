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
}

interface ApplicationLink {
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

/**
 * VtomPlanFromJson - Composant principal du plan depuis JSON
 */
function VtomPlanFromJson() {
  const [applications, setApplications] = useState<ApplicationNode[]>([])
  const [links, setLinks] = useState<ApplicationLink[]>([])
  const [trafficLights, setTrafficLights] = useState<TrafficLight[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [columns, setColumns] = useState<Column[]>([])
  const [selectedApp, setSelectedApp] = useState<SelectedApp | null>(null)
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

              // Comptage des jobs
              let jobsCount = 0
              if (app.Jobs?.Job) {
                jobsCount = Array.isArray(app.Jobs.Job) ? app.Jobs.Job.length : 1
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
                jobsCount: jobsCount
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

  // Adoucir les couleurs trop vives
  const softenColor = (hexColor: string): string => {
    // Palette de remplacement pour les couleurs vives
    const colorMap: { [key: string]: string } = {
      // Bleus vifs → bleus doux pastel
      '#0000FF': '#7C9FFF',
      '#0000CD': '#93ADFF',
      '#00008B': '#6B8FEE',
      '#000080': '#5B7FDD',
      '#0000AA': '#7A8FEE',
      '#4B68FF': '#7C9FFF',
      
      // Violets/Magentas vifs → violets doux pastel
      '#FF00FF': '#C89FFF',
      '#8B008B': '#B388EA',
      '#800080': '#A77FDD',
      '#9400D3': '#B49FEE',
      '#FF00AA': '#E098DD',
      
      // Rouges vifs → rouges doux corail
      '#FF0000': '#FF8888',
      '#DC143C': '#FF9999',
      '#8B0000': '#DD7777',
      '#CD5C5C': '#FFAAAA',
      
      // Verts vifs → verts doux menthe
      '#00FF00': '#88DD99',
      '#00AA00': '#77CC88',
      '#008000': '#66BB77',
      '#32CD32': '#88DD99',
      '#00FF7F': '#88EEAA',
      
      // Jaunes/Oranges vifs → jaunes/oranges doux
      '#FFFF00': '#FFEE88',
      '#FFD700': '#FFDD77',
      '#FFA500': '#FFBB66',
      '#FF8C00': '#FFAA55',
      
      // Cyans vifs → cyans doux aqua
      '#00FFFF': '#77DDEE',
      '#00CED1': '#66CCDD',
      '#00AAAA': '#66BBCC',
      
      // Roses vifs → roses doux
      '#FF1493': '#FF88BB',
      '#FF69B4': '#FFAACC',
      '#FFB6C1': '#FFCCDD',
    }
    
    // Normaliser le format hex
    const normalizedColor = hexColor.toUpperCase()
    
    // Si la couleur est dans la map, la remplacer
    if (colorMap[normalizedColor]) {
      return colorMap[normalizedColor]
    }
    
    // Sinon, adoucir algorithmiquement avec une approche plus douce
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
      
      // Appliquer un adoucissement progressif pour toutes les couleurs
      if (saturation > 0.5 || brightness < 120 || brightness > 200) {
        // Mélanger avec une teinte pastel basée sur la couleur dominante
        const midTone = 180 // Point de convergence pour un look pastel
        
        // Réduire fortement la saturation pour un effet plus doux
        r = Math.round(r * 0.5 + midTone * 0.5)
        g = Math.round(g * 0.5 + midTone * 0.5)
        b = Math.round(b * 0.5 + midTone * 0.5)
        
        // Ajuster la luminosité vers une plage confortable (120-200)
        const newBrightness = (r * 299 + g * 587 + b * 114) / 1000
        if (newBrightness < 120) {
          const boost = 120 - newBrightness
          r = Math.min(255, r + boost)
          g = Math.min(255, g + boost)
          b = Math.min(255, b + boost)
        } else if (newBrightness > 200) {
          const reduce = newBrightness - 200
          r = Math.max(80, r - reduce)
          g = Math.max(80, g - reduce)
          b = Math.max(80, b - reduce)
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
            {applications.length} applications • {links.length} liens • {trafficLights.length} feux rouges • {comments.length} commentaires • {columns.length} colonnes
            {columns.length > 0 && ` (${columns.map(c => c.name).join(', ')})`} • 
            Utilisez le zoom et le déplacement pour naviguer.
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
            <p className="legend-section-title">Annotations</p>
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
            <p className="legend-section-title">Liens</p>
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
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default VtomPlanFromJson
