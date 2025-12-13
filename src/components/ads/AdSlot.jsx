export default function AdSlot({ size = 'medium', className = '' }) {
  // Placeholder para Google AdSense
  // En producción, aquí se integraría el código de AdSense
  
  const sizes = {
    small: 'min-h-[90px]',
    medium: 'min-h-[120px]',
    large: 'min-h-[250px]'
  };

  return (
    <div className={`ad-slot ${sizes[size]} ${className}`}>
      <span>Espacio Publicitario</span>
    </div>
  );
}
