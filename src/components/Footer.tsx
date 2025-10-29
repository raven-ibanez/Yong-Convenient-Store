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
                    className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 object-contain"
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
            
            {/* Social Media Links */}
            {siteSettings?.facebook_enabled && siteSettings?.facebook_url && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-xs sm:text-sm">Follow us:</span>
                <a
                  href={siteSettings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 hover:bg-gray-800 rounded-full transition-colors duration-200"
                  title="Visit our Facebook page"
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 hover:text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
