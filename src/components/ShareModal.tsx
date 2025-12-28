import React, { useState } from 'react';
import { 
  X, 
  Link2, 
  Copy, 
  Check, 
  Share2, 
  QrCode,
  Mail,
  Twitter,
  Facebook,
  Linkedin,
  Download,
  ExternalLink
} from 'lucide-react';

interface ShareModalProps {
  isDarkMode: boolean;
  isVisible: boolean;
  onClose: () => void;
  htmlCode: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isDarkMode,
  isVisible,
  onClose,
  htmlCode,
}) => {
  const [copied, setCopied] = useState(false);
  const [shareType, setShareType] = useState<'link' | 'embed' | 'social'>('link');

  if (!isVisible) return null;

  // Encode code to base64 for URL sharing
  const encodeCodeToUrl = () => {
    try {
      const encoded = btoa(encodeURIComponent(htmlCode));
      const baseUrl = window.location.origin + window.location.pathname;
      return `${baseUrl}?code=${encoded}`;
    } catch (error) {
      console.error('Error encoding code:', error);
      return '';
    }
  };

  // Generate a short ID for the share
  const generateShareId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const shareUrl = encodeCodeToUrl();
  const shareId = generateShareId();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const embedCode = `<iframe src="${shareUrl}" width="100%" height="500" frameborder="0"></iframe>`;

  const socialLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-blue-400',
      url: `https://twitter.com/intent/tweet?text=Check%20out%20my%20HTML%20code!&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-gray-600',
      url: `mailto:?subject=Check%20out%20my%20HTML%20code&body=${encodeURIComponent(shareUrl)}`
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl ${
        isDarkMode ? 'bg-card border border-border' : 'bg-card border border-border'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDarkMode ? 'border-border' : 'border-border'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Share2 size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Share Your Code</h3>
              <p className="text-xs text-muted-foreground">Share via link or social media</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-secondary' : 'hover:bg-secondary'
            }`}
          >
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex border-b ${isDarkMode ? 'border-border' : 'border-border'}`}>
          {[
            { id: 'link', label: 'Link', icon: Link2 },
            { id: 'embed', label: 'Embed', icon: ExternalLink },
            { id: 'social', label: 'Social', icon: Share2 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setShareType(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                shareType === tab.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {shareType === 'link' && (
            <>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Share Link
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className={`flex-1 px-3 py-2 rounded-lg border text-sm truncate ${
                      isDarkMode 
                        ? 'bg-secondary border-border text-foreground' 
                        : 'bg-secondary border-border text-foreground'
                    }`}
                  />
                  <button
                    onClick={() => copyToClipboard(shareUrl)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                      copied
                        ? 'bg-success text-success-foreground'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-secondary/50' : 'bg-secondary/50'
              }`}>
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-info/10">
                    <Link2 size={16} className="text-info" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">How it works</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your code is encoded in the URL. Anyone with the link can view and edit the code in their browser.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Quick Actions
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => window.open(shareUrl, '_blank')}
                    className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg border transition-colors ${
                      isDarkMode 
                        ? 'border-border hover:bg-secondary text-foreground' 
                        : 'border-border hover:bg-secondary text-foreground'
                    }`}
                  >
                    <ExternalLink size={16} />
                    <span className="text-sm font-medium">Open in New Tab</span>
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([htmlCode], { type: 'text/html' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'shared-code.html';
                      a.click();
                    }}
                    className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg border transition-colors ${
                      isDarkMode 
                        ? 'border-border hover:bg-secondary text-foreground' 
                        : 'border-border hover:bg-secondary text-foreground'
                    }`}
                  >
                    <Download size={16} />
                    <span className="text-sm font-medium">Download HTML</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {shareType === 'embed' && (
            <>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Embed Code
                </label>
                <textarea
                  readOnly
                  value={embedCode}
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border text-sm font-mono resize-none ${
                    isDarkMode 
                      ? 'bg-secondary border-border text-foreground' 
                      : 'bg-secondary border-border text-foreground'
                  }`}
                />
                <button
                  onClick={() => copyToClipboard(embedCode)}
                  className={`w-full mt-2 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                    copied
                      ? 'bg-success text-success-foreground'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Copied!' : 'Copy Embed Code'}</span>
                </button>
              </div>

              <div className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-secondary/50' : 'bg-secondary/50'
              }`}>
                <p className="text-sm text-muted-foreground">
                  Add this code to your website to embed the HTML preview. The iframe will display your code in real-time.
                </p>
              </div>
            </>
          )}

          {shareType === 'social' && (
            <>
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Share on Social Media
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all hover:scale-[1.02] ${social.color} text-white`}
                    >
                      <social.icon size={20} />
                      <span className="font-medium">{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${isDarkMode ? 'border-border' : 'border-border'}`}>
          <p className="text-xs text-center text-muted-foreground">
            Share ID: <span className="font-mono text-primary">{shareId}</span> • 
            Code size: {(htmlCode.length / 1024).toFixed(2)} KB
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
