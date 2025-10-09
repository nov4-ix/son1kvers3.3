import { useState } from 'react';

// Sistema de redirección a subdominios mejorado
export const redirectToSubdomain = (subdomain: string, path: string = '') => {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  
  // En desarrollo, usar localhost con puertos diferentes
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    const portMap: Record<string, string> = {
      'ghost.son1kvers3.com': '3002',
      'clone.son1kvers3.com': '3003', 
      'nova.son1kvers3.com': '3004',
      'sanctuary.son1kvers3.com': '3005',
      'nexus.son1kvers3.com': '3006'
    };
    
    const port = portMap[subdomain] || '3001';
    const newUrl = `${protocol}//${hostname}:${port}${path}`;
    
    // Mostrar mensaje de redirección
    console.log(`🚀 Redirigiendo a ${subdomain}...`);
    console.log(`📍 URL: ${newUrl}`);
    
    // Redirección inmediata
    window.location.href = newUrl;
  } else {
    // En producción, usar subdominios reales
    const newUrl = `${protocol}//${subdomain}${path}`;
    console.log(`🚀 Redirigiendo a ${subdomain}...`);
    console.log(`📍 URL: ${newUrl}`);
    window.location.href = newUrl;
  }
};

// Hook para manejar la selección de herramientas mejorado
export const useToolNavigation = () => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectingTo, setRedirectingTo] = useState<string | null>(null);

  const handleToolSelect = (toolId: string, subdomain: string) => {
    console.log(`🎯 Seleccionando herramienta: ${toolId}`);
    console.log(`🌐 Subdominio: ${subdomain}`);
    
    // Mostrar estado de carga
    setIsRedirecting(true);
    setRedirectingTo(toolId);
    
    // Pequeño delay para mostrar feedback visual
    setTimeout(() => {
      redirectToSubdomain(subdomain);
    }, 500);
  };

  return { 
    handleToolSelect, 
    isRedirecting, 
    redirectingTo 
  };
};

// Función para obtener información de la herramienta
export const getToolInfo = (toolId: string) => {
  const tools: Record<string, { name: string; description: string; status: string }> = {
    'ghost-studio': {
      name: 'Ghost Studio',
      description: 'Generación musical con IA',
      status: 'online'
    },
    'clone-station': {
      name: 'Clone Station', 
      description: 'Clonación de voz avanzada',
      status: 'online'
    },
    'nova-post-pilot': {
      name: 'Nova Post Pilot',
      description: 'Automatización de redes sociales',
      status: 'maintenance'
    },
    'sanctuary-social': {
      name: 'Sanctuary Social',
      description: 'Red social para creadores',
      status: 'online'
    },
    'nexus-visual': {
      name: 'Nexus Visual',
      description: 'Experiencia inmersiva',
      status: 'restricted'
    }
  };
  
  return tools[toolId] || { name: 'Unknown', description: 'Unknown', status: 'offline' };
};

export default redirectToSubdomain;
