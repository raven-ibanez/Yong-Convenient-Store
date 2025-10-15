import React from 'react';

interface PromoBannerProps {
  title: string;
  subtitle: string;
  code?: string;
  promoDates?: string;
  minPurchase?: string;
  bgColor: string;
  textColor?: string;
  image?: React.ReactNode;
  className?: string;
}

const PromoBanner: React.FC<PromoBannerProps> = ({
  title,
  subtitle,
  code,
  promoDates,
  minPurchase,
  bgColor,
  textColor = 'text-white',
  image,
  className = ''
}) => {
  return (
    <div 
      className={`${bgColor} ${textColor} rounded-lg p-4 lg:p-6 ${className} relative overflow-hidden`}
    >
      <div className="relative z-10">
        <h3 className="text-lg lg:text-2xl font-bold mb-2">{title}</h3>
        <p className="text-sm lg:text-lg mb-1">{subtitle}</p>
        {code && (
          <p className="text-xs lg:text-sm mb-2">USE CODE: <span className="font-bold">{code}</span></p>
        )}
        {promoDates && (
          <p className="text-xs lg:text-sm mb-1">Promo Dates: {promoDates}</p>
        )}
        {minPurchase && (
          <p className="text-xs lg:text-sm">Minimum Purchase: {minPurchase}</p>
        )}
      </div>
      {image && (
        <div className="absolute right-0 top-0 bottom-0 flex items-center opacity-10 lg:opacity-20">
          {image}
        </div>
      )}
    </div>
  );
};

export default PromoBanner;

