import React, { memo } from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/hooks/use-analytics';

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  variant?: 'fixed' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const WhatsAppButton = memo(({
  phoneNumber,
  message = 'Olá! Gostaria de saber mais sobre o NIVELA®',
  variant = 'fixed',
  size = 'md',
  text,
  className = ''
}: WhatsAppButtonProps) => {
  const { trackConversion } = useAnalytics();

  const handleWhatsAppClick = () => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    
    // Track conversion
    trackConversion({
      type: 'cta_click',
      section: 'whatsapp_button',
      value: variant,
      metadata: {
        phone: cleanPhone,
        variant,
        position: variant === 'fixed' ? 'floating' : 'inline'
      }
    });

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return variant === 'fixed' ? 'h-12 w-12' : 'h-8 px-3 text-sm';
      case 'lg':
        return variant === 'fixed' ? 'h-16 w-16' : 'h-12 px-6 text-lg';
      default:
        return variant === 'fixed' ? 'h-14 w-14' : 'h-10 px-4';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4';
      case 'lg': return 'w-6 h-6';
      default: return 'w-5 h-5';
    }
  };

  if (variant === 'fixed') {
    return (
      <Button
        onClick={handleWhatsAppClick}
        className={`
          fixed bottom-6 right-6 z-50 rounded-full
          bg-green-500 hover:bg-green-600 text-white
          shadow-lg hover:shadow-xl
          transition-all duration-300 ease-out
          hover:scale-110 active:scale-95
          animate-pulse hover:animate-none
          ${getSizeClasses()}
          ${className}
        `}
        aria-label="Abrir WhatsApp para contato"
      >
        <MessageCircle className={getIconSize()} />
      </Button>
    );
  }

  return (
    <Button
      onClick={handleWhatsAppClick}
      variant="outline"
      className={`
        bg-green-500 hover:bg-green-600 text-white border-green-500
        transition-all duration-200
        hover:scale-105 active:scale-95
        ${getSizeClasses()}
        ${className}
      `}
      aria-label="Abrir WhatsApp para contato"
    >
      <MessageCircle className={`${getIconSize()} ${text ? 'mr-2' : ''}`} />
      {text}
    </Button>
  );
});

WhatsAppButton.displayName = 'WhatsAppButton';

export { WhatsAppButton };