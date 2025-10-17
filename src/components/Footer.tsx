import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

const Footer: React.FC = () => {
  const { siteSettings } = useSiteSettings();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 lg:gap-6">
          {/* Company Info */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center space-x-2 sm:space-x-3">
              {siteSettings?.site_logo ? (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <img 
                    src={siteSettings.site_logo} 
                    alt={siteSettings?.site_name || "Yong Convenience Store"} 
                    className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 object-contain"
                  />
                  <div className="bg-blue-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded font-bold text-sm sm:text-base md:text-lg">
                    {siteSettings?.site_name || "Yong Convenience Store"}
                  </div>
                </div>
              ) : (
                <div className="bg-blue-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded font-bold text-sm sm:text-base md:text-lg inline-block">
                  {siteSettings?.site_name || "Yong Convenience Store"}
                </div>
              )}
            </div>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Your one-stop convenience store for all your daily needs. Quality products, 
              great prices, and excellent service.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-2 sm:space-y-3 sm:text-right">
            <h3 className="text-sm sm:text-base font-semibold">Contact Info</h3>
            <div className="space-y-2 sm:space-y-3 sm:flex sm:flex-col sm:items-end">
              <div className="flex items-start space-x-2 sm:space-x-3 sm:flex-row-reverse sm:space-x-reverse">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="sm:text-right">
                  <p className="text-gray-300 text-xs sm:text-sm whitespace-pre-line">
                    {siteSettings?.footer_address || '123 Main Street\nCity, Province 1234\nPhilippines'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-3 sm:flex-row-reverse sm:space-x-reverse">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 flex-shrink-0" />
                <a 
                  href={`tel:${siteSettings?.footer_phone?.replace(/\s/g, '') || '+639123456789'}`} 
                  className="text-gray-300 hover:text-white transition-colors text-xs sm:text-sm"
                >
                  {siteSettings?.footer_phone || '+63 912 345 6789'}
                </a>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-3 sm:flex-row-reverse sm:space-x-reverse">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 flex-shrink-0" />
                <a 
                  href={`mailto:${siteSettings?.footer_email || 'info@yongconvenience.com'}`} 
                  className="text-gray-300 hover:text-white transition-colors text-xs sm:text-sm break-all sm:break-normal"
                >
                  {siteSettings?.footer_email || 'info@yongconvenience.com'}
                </a>
              </div>
              
              <div className="flex items-start space-x-2 sm:space-x-3 sm:flex-row-reverse sm:space-x-reverse">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="sm:text-right">
                  <p className="text-gray-300 text-xs sm:text-sm whitespace-pre-line">
                    {siteSettings?.footer_business_hours || 'Mon - Sun: 6:00 AM - 10:00 PM\nOpen 7 days a week'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-3 pt-3 sm:mt-4 sm:pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-1 sm:space-y-0">
            <div className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              © {new Date().getFullYear()} {siteSettings?.site_name || "Yong Convenience Store"}. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
