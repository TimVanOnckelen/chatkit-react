import React, { TextareaHTMLAttributes } from 'react';
import { useTheme } from '../../theme/ThemeProvider';

export interface ChatInputProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onSubmit'> {
  /** Callback when message is submitted */
  onSubmit: (message: string) => void;
  /** Optional extra content to show before the input */
  beforeInput?: React.ReactNode;
  /** Optional extra content to show after the input */
  afterInput?: React.ReactNode;
  /** Whether to clear the input after submit */
  clearOnSubmit?: boolean;
  sendContent?: React.ReactNode;
  progressIndicator?: React.ReactNode;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSubmit,
  className = '',
  beforeInput,
  afterInput,
  disabled,
  clearOnSubmit = true,
  progressIndicator,
  sendContent = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  ...textareaProps
}) => {
  const theme = useTheme();
  const [message, setMessage] = React.useState(textareaProps.value?.toString() || textareaProps.defaultValue?.toString() || '');
  const [isFocused, setIsFocused] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.theme.spacing.sm,
    padding: theme.theme.spacing.md,
    backgroundColor: isFocused 
      ? `${theme.theme.colors.primary}05`
      : theme.theme.colors.background,
    borderRadius: theme.theme.borderRadius.md,
    border: `1px solid ${theme.theme.colors.text}20`,
    maxWidth: '100%',
    position: 'relative',
    transition: 'all 0.2s ease-in-out',
    transform: isFocused ? 'translateY(-2px)' : 'none',
  };

  const textareaStyles: React.CSSProperties = {
    border: 'none',
    outline: 'none',
    resize: 'none',
    minHeight: '44px',
    maxHeight: '200px',
    padding: theme.theme.spacing.sm,
    backgroundColor: 'transparent',
    borderRadius: theme.theme.borderRadius.sm,
    fontFamily: theme.theme.typography.fontFamily,
    fontSize: theme.theme.typography.fontSize.medium,
    lineHeight: '1.5',
    color: theme.theme.colors.text,
  };

  const bottomRowStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.theme.spacing.sm,
    justifyContent: 'space-between',
  };

  const leftSectionStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.theme.spacing.sm,
    flex: 1,
  };

  const sendButtonStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.theme.spacing.sm,
    backgroundColor: 'transparent',
    color: theme.theme.colors.primary,
    border: 'none',
    borderRadius: theme.theme.borderRadius.sm,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled || !message.trim() ? 0.4 : 1,
    transition: 'all 0.2s ease',
    minWidth: '32px',
    height: '32px',
    marginLeft: theme.theme.spacing.sm,
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    textareaProps.onKeyDown?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    textareaProps.onChange?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    textareaProps.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    textareaProps.onBlur?.(e);
  };

  const handleSubmit = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSubmit(trimmedMessage);
      if (clearOnSubmit) {
        setMessage('');
      }
      // Remove focus from textarea after sending
      textareaRef.current?.blur();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  React.useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return (
    <div className={`chat-input ${className}`} style={containerStyles}>
      <textarea
        ref={textareaRef}
        {...textareaProps}
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        style={{ ...textareaStyles, ...textareaProps.style }}
      />
      <div style={bottomRowStyles}>
        <div style={leftSectionStyles}>
          {beforeInput}
          {afterInput}
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          style={sendButtonStyles}
          disabled={disabled || !message.trim()}
          onMouseEnter={(e) => {
            if (!disabled && message.trim()) {
              e.currentTarget.style.backgroundColor = `${theme.theme.colors.primary}10`;
              e.currentTarget.style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {sendContent}
        </button>
      </div>
      {progressIndicator}
    </div>
  );
};