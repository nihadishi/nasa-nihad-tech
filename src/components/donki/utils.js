export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit',
    timeZoneName: 'short'
  });
};

export const apiTypes = [
  { value: 'CME', label: 'Coronal Mass Ejection (CME)' },
  { value: 'CMEAnalysis', label: 'CME Analysis' },
  { value: 'GST', label: 'Geomagnetic Storm (GST)' },
  { value: 'IPS', label: 'Interplanetary Shock (IPS)' },
  { value: 'FLR', label: 'Solar Flare (FLR)' },
  { value: 'SEP', label: 'Solar Energetic Particle (SEP)' },
  { value: 'MPC', label: 'Magnetopause Crossing (MPC)' },
  { value: 'RBE', label: 'Radiation Belt Enhancement (RBE)' },
  { value: 'HSS', label: 'High Speed Stream (HSS)' },
  { value: 'WSAEnlilSimulations', label: 'WSA+Enlil Simulation' },
  { value: 'notifications', label: 'Notifications' }
];

