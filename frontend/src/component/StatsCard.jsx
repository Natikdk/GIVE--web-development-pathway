
import '../styles/component/StatsCard.css';


function StatsCard({ title, value, icon, color, link, description }) {
  // Color variants
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      valueColor: 'text-blue-700'
    },
    green: {
      bg: 'bg-green-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      valueColor: 'text-green-700'
    },
    orange: {
      bg: 'bg-orange-50',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      valueColor: 'text-orange-700'
    },
    purple: {
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      valueColor: 'text-purple-700'
    },
    red: {
      bg: 'bg-red-50',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      valueColor: 'text-red-700'
    },
    indigo: {
      bg: 'bg-indigo-50',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      valueColor: 'text-indigo-700'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  const handleClick = () => {
    if (link) {
      window.location.href = link;
    }
  };

  return (
    <div 
      className={`stat-card ${colors.bg} cursor-pointer hover:shadow-lg transition-all duration-300`}
      onClick={handleClick}
      data-color={color}
    >
      <div className="stat-card-header">
        <h3 className="stat-card-title">{title}</h3>
        <div className={`stat-card-icon ${colors.iconBg}`}>
          <span className={colors.iconColor}>{icon}</span>
        </div>
      </div>
      
      <h2 className={`stat-card-value ${colors.valueColor}`}>
        {value}
      </h2>
      
      {description && (
        <p className="stat-card-description">{description}</p>
      )}
      
      {link && (
        <div className="stat-card-footer">
          <a href={link} className="stat-card-link">
            View Details
            <svg 
              className="stat-card-link-icon" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M14 5l7 7m0 0l-7 7m7-7H3" 
              />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}

export default StatsCard;
