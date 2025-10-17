import React, { useState } from 'react';
import { Save, Upload, X } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useImageUpload } from '../hooks/useImageUpload';

const SiteSettingsManager: React.FC = () => {
  const { siteSettings, loading, updateSiteSettings } = useSiteSettings();
  const { uploadImage, uploading } = useImageUpload();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    site_name: '',
    site_description: '',
    currency: '',
    currency_code: '',
    footer_address: '',
    footer_phone: '',
    footer_email: '',
    footer_business_hours: '',
    promo_pickup_title: '',
    promo_pickup_subtitle: '',
    promo_pickup_code: '',
    promo_pickup_dates: '',
    promo_pickup_min_purchase: '',
    promo_delivery_title: '',
    promo_delivery_subtitle: '',
    promo_payday_title: '',
    promo_payday_subtitle: '',
    promo_payday_code: '',
    promo_payday_dates: '',
    promo_payday_min_purchase: ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  React.useEffect(() => {
    if (siteSettings) {
      setFormData({
        site_name: siteSettings.site_name,
        site_description: siteSettings.site_description,
        currency: siteSettings.currency,
        currency_code: siteSettings.currency_code,
        footer_address: siteSettings.footer_address,
        footer_phone: siteSettings.footer_phone,
        footer_email: siteSettings.footer_email,
        footer_business_hours: siteSettings.footer_business_hours,
        promo_pickup_title: siteSettings.promo_pickup_title,
        promo_pickup_subtitle: siteSettings.promo_pickup_subtitle,
        promo_pickup_code: siteSettings.promo_pickup_code,
        promo_pickup_dates: siteSettings.promo_pickup_dates,
        promo_pickup_min_purchase: siteSettings.promo_pickup_min_purchase,
        promo_delivery_title: siteSettings.promo_delivery_title,
        promo_delivery_subtitle: siteSettings.promo_delivery_subtitle,
        promo_payday_title: siteSettings.promo_payday_title,
        promo_payday_subtitle: siteSettings.promo_payday_subtitle,
        promo_payday_code: siteSettings.promo_payday_code,
        promo_payday_dates: siteSettings.promo_payday_dates,
        promo_payday_min_purchase: siteSettings.promo_payday_min_purchase
      });
      setLogoPreview(siteSettings.site_logo);
    }
  }, [siteSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      let logoUrl = logoPreview;
      
      // Upload new logo if selected
      if (logoFile) {
        const uploadedUrl = await uploadImage(logoFile, 'site-logo');
        logoUrl = uploadedUrl;
      }

      // Update all settings
      await updateSiteSettings({
        site_name: formData.site_name,
        site_description: formData.site_description,
        currency: formData.currency,
        currency_code: formData.currency_code,
        site_logo: logoUrl,
        footer_address: formData.footer_address,
        footer_phone: formData.footer_phone,
        footer_email: formData.footer_email,
        footer_business_hours: formData.footer_business_hours,
        promo_pickup_title: formData.promo_pickup_title,
        promo_pickup_subtitle: formData.promo_pickup_subtitle,
        promo_pickup_code: formData.promo_pickup_code,
        promo_pickup_dates: formData.promo_pickup_dates,
        promo_pickup_min_purchase: formData.promo_pickup_min_purchase,
        promo_delivery_title: formData.promo_delivery_title,
        promo_delivery_subtitle: formData.promo_delivery_subtitle,
        promo_payday_title: formData.promo_payday_title,
        promo_payday_subtitle: formData.promo_payday_subtitle,
        promo_payday_code: formData.promo_payday_code,
        promo_payday_dates: formData.promo_payday_dates,
        promo_payday_min_purchase: formData.promo_payday_min_purchase
      });

      setIsEditing(false);
      setLogoFile(null);
    } catch (error) {
      console.error('Error saving site settings:', error);
    }
  };

  const handleCancel = () => {
    if (siteSettings) {
      setFormData({
        site_name: siteSettings.site_name,
        site_description: siteSettings.site_description,
        currency: siteSettings.currency,
        currency_code: siteSettings.currency_code,
        footer_address: siteSettings.footer_address,
        footer_phone: siteSettings.footer_phone,
        footer_email: siteSettings.footer_email,
        footer_business_hours: siteSettings.footer_business_hours,
        promo_pickup_title: siteSettings.promo_pickup_title,
        promo_pickup_subtitle: siteSettings.promo_pickup_subtitle,
        promo_pickup_code: siteSettings.promo_pickup_code,
        promo_pickup_dates: siteSettings.promo_pickup_dates,
        promo_pickup_min_purchase: siteSettings.promo_pickup_min_purchase,
        promo_delivery_title: siteSettings.promo_delivery_title,
        promo_delivery_subtitle: siteSettings.promo_delivery_subtitle,
        promo_payday_title: siteSettings.promo_payday_title,
        promo_payday_subtitle: siteSettings.promo_payday_subtitle,
        promo_payday_code: siteSettings.promo_payday_code,
        promo_payday_dates: siteSettings.promo_payday_dates,
        promo_payday_min_purchase: siteSettings.promo_payday_min_purchase
      });
      setLogoPreview(siteSettings.site_logo);
    }
    setIsEditing(false);
    setLogoFile(null);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-noto font-semibold text-black">Site Settings</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Edit Settings</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              disabled={uploading}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{uploading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Site Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Logo
          </label>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Site Logo"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-2xl text-gray-400">☕</div>
              )}
            </div>
            {isEditing && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2 cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Logo</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Site Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Name
          </label>
          {isEditing ? (
            <input
              type="text"
              name="site_name"
              value={formData.site_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter site name"
            />
          ) : (
            <p className="text-lg font-medium text-black">{siteSettings?.site_name}</p>
          )}
        </div>

        {/* Site Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Description
          </label>
          {isEditing ? (
            <textarea
              name="site_description"
              value={formData.site_description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter site description"
            />
          ) : (
            <p className="text-gray-600">{siteSettings?.site_description}</p>
          )}
        </div>

        {/* Currency Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency Symbol
            </label>
            {isEditing ? (
              <input
                type="text"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="e.g., ₱, $, €"
              />
            ) : (
              <p className="text-lg font-medium text-black">{siteSettings?.currency}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency Code
            </label>
            {isEditing ? (
              <input
                type="text"
                name="currency_code"
                value={formData.currency_code}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="e.g., PHP, USD, EUR"
              />
            ) : (
              <p className="text-lg font-medium text-black">{siteSettings?.currency_code}</p>
            )}
          </div>
        </div>

        {/* Footer Contact Information */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Footer Contact Information</h3>
          
          {/* Address */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            {isEditing ? (
              <textarea
                name="footer_address"
                value={formData.footer_address}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter full address (use line breaks for formatting)"
              />
            ) : (
              <div className="text-gray-600 whitespace-pre-line">{siteSettings?.footer_address}</div>
            )}
          </div>

          {/* Phone and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="footer_phone"
                  value={formData.footer_phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="e.g., +63 912 345 6789"
                />
              ) : (
                <p className="text-gray-600">{siteSettings?.footer_phone}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="footer_email"
                  value={formData.footer_email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="e.g., info@yongconvenience.com"
                />
              ) : (
                <p className="text-gray-600">{siteSettings?.footer_email}</p>
              )}
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Hours
            </label>
            {isEditing ? (
              <textarea
                name="footer_business_hours"
                value={formData.footer_business_hours}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter business hours (use line breaks for formatting)"
              />
            ) : (
              <div className="text-gray-600 whitespace-pre-line">{siteSettings?.footer_business_hours}</div>
            )}
          </div>
        </div>

        {/* Promotional Banners */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Promotional Banners</h3>
          
          {/* Pickup Promo Banner */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-800 mb-3">Pickup Promotional Banner</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="promo_pickup_title"
                    value={formData.promo_pickup_title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g., PICK-UP HIGHLIGHT"
                  />
                ) : (
                  <p className="text-gray-600">{siteSettings?.promo_pickup_title}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="promo_pickup_subtitle"
                    value={formData.promo_pickup_subtitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g., GET P200 OFF WHEN YOU PICK UP YOUR ORDER!"
                  />
                ) : (
                  <p className="text-gray-600">{siteSettings?.promo_pickup_subtitle}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="promo_pickup_code"
                    value={formData.promo_pickup_code}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g., PICKUPSEPTEMBER"
                  />
                ) : (
                  <p className="text-gray-600">{siteSettings?.promo_pickup_code}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Dates
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="promo_pickup_dates"
                    value={formData.promo_pickup_dates}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g., September 15 & 30"
                  />
                ) : (
                  <p className="text-gray-600">{siteSettings?.promo_pickup_dates}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Purchase
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="promo_pickup_min_purchase"
                    value={formData.promo_pickup_min_purchase}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g., P1,500"
                  />
                ) : (
                  <p className="text-gray-600">{siteSettings?.promo_pickup_min_purchase}</p>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Schedule Banner */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-800 mb-3">Delivery Schedule Banner</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="promo_delivery_title"
                    value={formData.promo_delivery_title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g., Delivery Schedule"
                  />
                ) : (
                  <p className="text-gray-600">{siteSettings?.promo_delivery_title}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="promo_delivery_subtitle"
                    value={formData.promo_delivery_subtitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g., Orders received before 11am Same Day Delivery"
                  />
                ) : (
                  <p className="text-gray-600">{siteSettings?.promo_delivery_subtitle}</p>
                )}
              </div>
            </div>
          </div>

          {/* Payday Specials Banner */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-800 mb-3">Payday Specials Banner</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="promo_payday_title"
                    value={formData.promo_payday_title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g., PAYDAY SPECIALS"
                  />
                ) : (
                  <p className="text-gray-600">{siteSettings?.promo_payday_title}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="promo_payday_subtitle"
                    value={formData.promo_payday_subtitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g., FREE DELIVERY"
                  />
                ) : (
                  <p className="text-gray-600">{siteSettings?.promo_payday_subtitle}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="promo_payday_code"
                    value={formData.promo_payday_code}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g., SAHODNASEP"
                  />
                ) : (
                  <p className="text-gray-600">{siteSettings?.promo_payday_code}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Details
                </label>
                {isEditing ? (
                  <textarea
                    name="promo_payday_dates"
                    value={formData.promo_payday_dates}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g., on September 15 and 30, 2025 with a min. spend of P3,000"
                  />
                ) : (
                  <p className="text-gray-600">{siteSettings?.promo_payday_dates}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Purchase
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="promo_payday_min_purchase"
                    value={formData.promo_payday_min_purchase}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g., P3,000"
                  />
                ) : (
                  <p className="text-gray-600">{siteSettings?.promo_payday_min_purchase}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteSettingsManager;
