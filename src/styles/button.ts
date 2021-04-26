export const Button = {
  baseStyle: {
    fontWeight: 'bold',
    borderRadius: 'xl',
  },
  sizes: {
    sm: {
      fontSize: '12px',
      paddingX: '16px',
      paddingY: '12px',
    },
    md: {
      fontSize: '18px',
      paddingX: '16px',
      paddingY: '20px',
    },
    lg: {
      fontSize: '20px',
      paddingx: '16px',
      paddingY: '24px',
    },
  },
  variants: {
    solid: {
      bg: 'cyan.300',
      color: 'purple.800',
      _hover: {
        bg: 'cyan.500',
        _disabled: {
          bg: 'cyan.200',
        },
      },
      _active: {
        bg: 'cyan.200',
      },
    },
  },
  defaultProps: {
    size: 'md',
    variant: 'solid',
  },
};
