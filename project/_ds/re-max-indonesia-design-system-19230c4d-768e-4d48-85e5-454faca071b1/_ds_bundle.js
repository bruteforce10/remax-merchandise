/* @ds-bundle: {"format":4,"namespace":"REMAXIndonesiaDesignSystem_19230c","components":[{"name":"BlogCard","sourcePath":"components/cards/ContentCards.jsx"},{"name":"TestimonialCard","sourcePath":"components/cards/ContentCards.jsx"},{"name":"ContentCards","sourcePath":"components/cards/ContentCards.jsx"},{"name":"StatisticCard","sourcePath":"components/cards/DataCards.jsx"},{"name":"InsightCard","sourcePath":"components/cards/DataCards.jsx"},{"name":"DataCards","sourcePath":"components/cards/DataCards.jsx"},{"name":"AgentCard","sourcePath":"components/cards/PeopleCards.jsx"},{"name":"OfficeCard","sourcePath":"components/cards/PeopleCards.jsx"},{"name":"PeopleCards","sourcePath":"components/cards/PeopleCards.jsx"},{"name":"PropertyCard","sourcePath":"components/cards/PropertyCard.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButtons.jsx"},{"name":"FAB","sourcePath":"components/forms/IconButtons.jsx"},{"name":"IconButtons","sourcePath":"components/forms/IconButtons.jsx"},{"name":"TextInput","sourcePath":"components/forms/Inputs.jsx"},{"name":"Textarea","sourcePath":"components/forms/Inputs.jsx"},{"name":"Select","sourcePath":"components/forms/Inputs.jsx"},{"name":"PriceInput","sourcePath":"components/forms/Inputs.jsx"},{"name":"OTPInput","sourcePath":"components/forms/Inputs.jsx"},{"name":"Inputs","sourcePath":"components/forms/Inputs.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Toggles.jsx"},{"name":"Radio","sourcePath":"components/forms/Toggles.jsx"},{"name":"Switch","sourcePath":"components/forms/Toggles.jsx"},{"name":"Toggles","sourcePath":"components/forms/Toggles.jsx"},{"name":"Navbar","sourcePath":"components/navigation/Navigation.jsx"},{"name":"Breadcrumb","sourcePath":"components/navigation/Navigation.jsx"},{"name":"BottomNav","sourcePath":"components/navigation/Navigation.jsx"},{"name":"DashboardSidebar","sourcePath":"components/navigation/Navigation.jsx"},{"name":"Navigation","sourcePath":"components/navigation/Navigation.jsx"},{"name":"MortgageCalculator","sourcePath":"components/property/MortgageCalculator.jsx"}],"sourceHashes":{"components/cards/ContentCards.jsx":"28ea7c024cc6","components/cards/DataCards.jsx":"6b68ded5c974","components/cards/PeopleCards.jsx":"bf72699b2f9b","components/cards/PropertyCard.jsx":"f61e0d510d92","components/core/Icon.jsx":"9904d4bdade1","components/feedback/Badge.jsx":"c4cd19ed3f61","components/forms/Button.jsx":"9b825102d408","components/forms/IconButtons.jsx":"91b6622d44c2","components/forms/Inputs.jsx":"e00ea0ef2e16","components/forms/Toggles.jsx":"e6f7c6778b7f","components/navigation/Navigation.jsx":"771bbc2a6e46","components/property/MortgageCalculator.jsx":"cf6ef2d7ef75","ui_kits/marketplace/AgentDashboard.jsx":"ac7451c9aa8c","ui_kits/marketplace/Homepage.jsx":"85402030c3b7","ui_kits/marketplace/ListingDetail.jsx":"ff1489c76dae"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.REMAXIndonesiaDesignSystem_19230c = window.REMAXIndonesiaDesignSystem_19230c || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/cards/ContentCards.jsx
try { (() => {
function BlogCard({
  image,
  category,
  title,
  date
}) {
  return React.createElement('div', {
    style: {
      width: 300,
      borderRadius: 'var(--radius-card)',
      overflow: 'hidden',
      background: '#fff',
      border: '1px solid var(--border-default)',
      boxShadow: 'var(--shadow-sm)',
      fontFamily: 'var(--font-sans)'
    }
  }, React.createElement('div', {
    style: {
      height: 160,
      background: image ? `url(${image}) center/cover` : 'var(--sky-blue)'
    }
  }), React.createElement('div', {
    style: {
      padding: 16
    }
  }, React.createElement('div', {
    style: {
      fontSize: 12,
      color: 'var(--accent)',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.03em'
    }
  }, category), React.createElement('div', {
    style: {
      fontSize: 16,
      fontWeight: 700,
      marginTop: 6
    }
  }, title), React.createElement('div', {
    style: {
      fontSize: 12,
      color: 'var(--fg-muted)',
      marginTop: 8
    }
  }, date)));
}
function TestimonialCard({
  quote,
  name,
  role,
  photo
}) {
  return React.createElement('div', {
    style: {
      width: 340,
      padding: 24,
      borderRadius: 'var(--radius-card)',
      background: 'var(--cream)',
      fontFamily: 'var(--font-sans)'
    }
  }, React.createElement('div', {
    style: {
      fontSize: 15,
      lineHeight: 1.6,
      color: 'var(--fg-primary)'
    }
  }, '"', quote, '"'), React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginTop: 16
    }
  }, React.createElement('div', {
    style: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      background: photo ? `url(${photo}) center/cover` : 'var(--gray-300)'
    }
  }), React.createElement('div', null, React.createElement('div', {
    style: {
      fontWeight: 700,
      fontSize: 14
    }
  }, name), React.createElement('div', {
    style: {
      fontSize: 12,
      color: 'var(--fg-secondary)'
    }
  }, role))));
}
const ContentCards = {
  BlogCard,
  TestimonialCard
};
Object.assign(__ds_scope, { BlogCard, TestimonialCard, ContentCards });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/ContentCards.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function Icon({
  name,
  size = 20,
  style
}) {
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, [name]);
  return React.createElement('i', {
    'data-lucide': name,
    style: {
      width: size,
      height: size,
      display: 'inline-block',
      ...style
    }
  });
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/cards/DataCards.jsx
try { (() => {
function StatisticCard({
  label,
  value,
  delta,
  icon = 'trending-up'
}) {
  const up = typeof delta === 'string' && delta.trim().startsWith('+');
  return React.createElement('div', {
    style: {
      width: 220,
      padding: 20,
      borderRadius: 'var(--radius-card)',
      background: '#fff',
      border: '1px solid var(--border-default)',
      boxShadow: 'var(--shadow-sm)',
      fontFamily: 'var(--font-sans)'
    }
  }, React.createElement('div', {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, React.createElement('span', {
    style: {
      fontSize: 13,
      color: 'var(--fg-secondary)'
    }
  }, label), React.createElement('span', {
    style: {
      color: 'var(--accent)'
    }
  }, React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  }))), React.createElement('div', {
    style: {
      fontSize: 28,
      fontWeight: 700,
      marginTop: 8,
      fontFamily: 'var(--font-mono)',
      color: 'var(--dark-blue)'
    }
  }, value), delta && React.createElement('div', {
    style: {
      fontSize: 12,
      marginTop: 4,
      color: up ? 'var(--success)' : 'var(--danger)'
    }
  }, delta));
}
function InsightCard({
  title,
  body,
  tag = 'AI Insight'
}) {
  return React.createElement('div', {
    style: {
      width: 320,
      padding: 18,
      borderRadius: 'var(--radius-card)',
      background: 'var(--accent-subtle)',
      fontFamily: 'var(--font-sans)'
    }
  }, React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12,
      fontWeight: 700,
      color: 'var(--accent-active)',
      textTransform: 'uppercase',
      letterSpacing: '0.03em'
    }
  }, React.createElement(__ds_scope.Icon, {
    name: 'sparkles',
    size: 14
  }), tag), React.createElement('div', {
    style: {
      fontSize: 15,
      fontWeight: 700,
      marginTop: 8
    }
  }, title), React.createElement('div', {
    style: {
      fontSize: 13,
      color: 'var(--fg-secondary)',
      marginTop: 6,
      lineHeight: 1.5
    }
  }, body));
}
const DataCards = {
  StatisticCard,
  InsightCard
};
Object.assign(__ds_scope, { StatisticCard, InsightCard, DataCards });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/DataCards.jsx", error: String((e && e.message) || e) }); }

// components/cards/PeopleCards.jsx
try { (() => {
function AgentCard({
  photo,
  name,
  title = 'RE/MAX Agent',
  office,
  phone,
  listings
}) {
  return React.createElement('div', {
    style: {
      width: 260,
      borderRadius: 'var(--radius-card)',
      background: '#fff',
      border: '1px solid var(--border-default)',
      boxShadow: 'var(--shadow-sm)',
      padding: 20,
      textAlign: 'center',
      fontFamily: 'var(--font-sans)'
    }
  }, React.createElement('div', {
    style: {
      width: 76,
      height: 76,
      borderRadius: '50%',
      margin: '0 auto 12px',
      background: photo ? `url(${photo}) center/cover` : 'var(--gray-200)'
    }
  }), React.createElement('div', {
    style: {
      fontWeight: 700,
      fontSize: 16
    }
  }, name), React.createElement('div', {
    style: {
      fontSize: 13,
      color: 'var(--fg-secondary)',
      marginTop: 2
    }
  }, title), React.createElement('div', {
    style: {
      fontSize: 12,
      color: 'var(--fg-muted)',
      marginTop: 2
    }
  }, office), React.createElement('div', {
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: 6,
      marginTop: 8,
      fontSize: 12,
      color: 'var(--accent)'
    }
  }, listings, ' active listings'), React.createElement('div', {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 16
    }
  }, React.createElement('button', {
    style: {
      flex: 1,
      height: 38,
      borderRadius: 'var(--radius-button)',
      border: 'none',
      background: 'var(--remax-blue)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: 13
    }
  }, React.createElement(__ds_scope.Icon, {
    name: 'phone',
    size: 14
  }), phone ? phone : 'Call'), React.createElement('button', {
    style: {
      width: 38,
      height: 38,
      borderRadius: 'var(--radius-button)',
      border: '1px solid var(--border-default)',
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    }
  }, React.createElement(__ds_scope.Icon, {
    name: 'mail',
    size: 15
  }))));
}
function OfficeCard({
  photo,
  name,
  address,
  agentCount
}) {
  return React.createElement('div', {
    style: {
      width: 300,
      borderRadius: 'var(--radius-card)',
      background: '#fff',
      border: '1px solid var(--border-default)',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden',
      fontFamily: 'var(--font-sans)'
    }
  }, React.createElement('div', {
    style: {
      height: 140,
      background: photo ? `url(${photo}) center/cover` : 'var(--dark-blue)'
    }
  }), React.createElement('div', {
    style: {
      padding: 16
    }
  }, React.createElement('div', {
    style: {
      fontWeight: 700,
      fontSize: 16
    }
  }, name), React.createElement('div', {
    style: {
      fontSize: 13,
      color: 'var(--fg-secondary)',
      marginTop: 4,
      display: 'flex',
      gap: 4,
      alignItems: 'center'
    }
  }, React.createElement(__ds_scope.Icon, {
    name: 'map-pin',
    size: 13
  }), address), React.createElement('div', {
    style: {
      fontSize: 13,
      color: 'var(--accent)',
      marginTop: 8
    }
  }, agentCount, ' agents')));
}
const PeopleCards = {
  AgentCard,
  OfficeCard
};
Object.assign(__ds_scope, { AgentCard, OfficeCard, PeopleCards });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/PeopleCards.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Badge.jsx
try { (() => {
function Badge({
  children,
  tone = 'accent'
}) {
  const map = {
    accent: {
      bg: 'var(--accent-subtle)',
      fg: 'var(--accent-active)'
    },
    success: {
      bg: 'var(--success-subtle)',
      fg: '#0F5E38'
    },
    warning: {
      bg: 'var(--warning-subtle)',
      fg: '#8A5C09'
    },
    danger: {
      bg: 'var(--danger-subtle)',
      fg: '#A02219'
    },
    neutral: {
      bg: 'var(--gray-100)',
      fg: 'var(--gray-700)'
    },
    dark: {
      bg: 'var(--dark-blue)',
      fg: '#fff'
    }
  }[tone] || {};
  return React.createElement('span', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 12px',
      borderRadius: 'var(--radius-badge)',
      fontSize: 12,
      fontWeight: 600,
      background: map.bg,
      color: map.fg,
      fontFamily: 'var(--font-sans)'
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/cards/PropertyCard.jsx
try { (() => {
function PropertyCard({
  image,
  price,
  title,
  address,
  beds,
  baths,
  area,
  status = 'For Sale',
  featured,
  saved,
  onToggleSave
}) {
  const [hover, setHover] = React.useState(false);
  return React.createElement('div', {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: 320,
      borderRadius: 'var(--radius-card)',
      overflow: 'hidden',
      background: '#fff',
      border: '1px solid var(--border-default)',
      boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      transition: 'box-shadow var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)',
      transform: hover ? 'translateY(-2px)' : 'none',
      fontFamily: 'var(--font-sans)'
    }
  }, React.createElement('div', {
    style: {
      position: 'relative',
      height: 200,
      background: image ? `url(${image}) center/cover` : 'var(--gray-200)'
    }
  }, React.createElement('div', {
    style: {
      position: 'absolute',
      top: 12,
      left: 12,
      display: 'flex',
      gap: 6
    }
  }, featured && React.createElement(__ds_scope.Badge, {
    tone: 'dark'
  }, 'Featured'), React.createElement(__ds_scope.Badge, {
    tone: status === 'For Sale' ? 'success' : 'accent'
  }, status)), React.createElement('button', {
    onClick: onToggleSave,
    style: {
      position: 'absolute',
      top: 10,
      right: 10,
      width: 34,
      height: 34,
      borderRadius: '50%',
      border: 'none',
      background: 'rgba(255,255,255,0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: saved ? 'var(--remax-red)' : 'var(--fg-secondary)'
    }
  }, React.createElement(__ds_scope.Icon, {
    name: 'heart',
    size: 16
  }))), React.createElement('div', {
    style: {
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, React.createElement('div', {
    style: {
      fontSize: 20,
      fontWeight: 700,
      color: 'var(--dark-blue)',
      fontFamily: 'var(--font-mono)'
    }
  }, price), React.createElement('div', {
    style: {
      fontSize: 15,
      fontWeight: 600
    }
  }, title), React.createElement('div', {
    style: {
      fontSize: 13,
      color: 'var(--fg-secondary)',
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, React.createElement(__ds_scope.Icon, {
    name: 'map-pin',
    size: 13
  }), address), React.createElement('div', {
    style: {
      display: 'flex',
      gap: 14,
      marginTop: 6,
      paddingTop: 10,
      borderTop: '1px solid var(--border-default)',
      fontSize: 13,
      color: 'var(--fg-secondary)'
    }
  }, React.createElement('span', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, React.createElement(__ds_scope.Icon, {
    name: 'bed-double',
    size: 14
  }), beds), React.createElement('span', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, React.createElement(__ds_scope.Icon, {
    name: 'bath',
    size: 14
  }), baths), React.createElement('span', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, React.createElement(__ds_scope.Icon, {
    name: 'maximize',
    size: 14
  }), area))));
}
Object.assign(__ds_scope, { PropertyCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/PropertyCard.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
const sizeMap = {
  sm: {
    padding: '8px 14px',
    fontSize: 13,
    gap: 6
  },
  md: {
    padding: '10px 18px',
    fontSize: 15,
    gap: 8
  },
  lg: {
    padding: '14px 24px',
    fontSize: 16,
    gap: 8
  }
};
const variantStyle = (variant, disabled) => {
  if (disabled) {
    return {
      background: 'var(--gray-100)',
      color: 'var(--fg-muted)',
      border: '1px solid transparent'
    };
  }
  switch (variant) {
    case 'secondary':
      return {
        background: 'var(--dark-blue)',
        color: '#fff',
        border: '1px solid transparent'
      };
    case 'outline':
      return {
        background: 'transparent',
        color: 'var(--fg-primary)',
        border: '1px solid var(--border-strong)'
      };
    case 'ghost':
      return {
        background: 'transparent',
        color: 'var(--fg-primary)',
        border: '1px solid transparent'
      };
    case 'destructive':
      return {
        background: 'var(--remax-red)',
        color: '#fff',
        border: '1px solid transparent'
      };
    default:
      return {
        background: 'var(--remax-blue)',
        color: '#fff',
        border: '1px solid transparent'
      };
  }
};
function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  icon,
  iconOnly,
  onClick,
  style,
  type = 'button'
}) {
  const s = sizeMap[size] || sizeMap.md;
  const vs = variantStyle(variant, disabled);
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  let bg = vs.background;
  if (!disabled && variant !== 'outline' && variant !== 'ghost') {
    if (active) bg = variant === 'destructive' ? '#C4271E' : variant === 'secondary' ? '#000A26' : 'var(--accent-active)';else if (hover) bg = variant === 'destructive' ? 'var(--danger-hover)' : variant === 'secondary' ? '#001C4D' : 'var(--accent-hover)';
  }
  let borderColor = vs.border;
  if ((variant === 'outline' || variant === 'ghost') && hover && !disabled) bg = 'var(--gray-50)';
  return React.createElement('button', {
    type,
    disabled: disabled || loading,
    onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      padding: iconOnly ? s.padding.split(' ')[0] : s.padding,
      fontSize: s.fontSize,
      fontFamily: 'var(--font-sans)',
      fontWeight: 600,
      borderRadius: 'var(--radius-button)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)',
      background: bg,
      color: vs.color,
      border: `1px solid ${borderColor === 'transparent' ? 'transparent' : borderColor}`,
      boxShadow: hover && !disabled && variant === 'primary' ? 'var(--shadow-sm)' : 'none',
      ...style
    }
  }, loading ? React.createElement('span', {
    style: {
      width: 14,
      height: 14,
      borderRadius: '50%',
      border: '2px solid currentColor',
      borderTopColor: 'transparent',
      animation: 'dsspin 0.7s linear infinite'
    }
  }) : icon, !iconOnly && children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButtons.jsx
try { (() => {
function IconButton({
  icon,
  size = 40,
  variant = 'ghost',
  onClick,
  ariaLabel
}) {
  const [hover, setHover] = React.useState(false);
  const bg = variant === 'solid' ? 'var(--remax-blue)' : hover ? 'var(--gray-100)' : 'transparent';
  const color = variant === 'solid' ? '#fff' : 'var(--fg-primary)';
  return React.createElement('button', {
    onClick,
    'aria-label': ariaLabel,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      border: 'none',
      background: bg,
      color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'background var(--duration-fast) var(--ease-standard)'
    }
  }, icon);
}
function FAB({
  icon,
  onClick,
  label
}) {
  const [hover, setHover] = React.useState(false);
  return React.createElement('button', {
    onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      height: 56,
      padding: label ? '0 22px 0 20px' : 0,
      width: label ? 'auto' : 56,
      borderRadius: 999,
      border: 'none',
      background: hover ? 'var(--accent-hover)' : 'var(--remax-blue)',
      color: '#fff',
      boxShadow: 'var(--shadow-lg)',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontWeight: 600,
      fontSize: 15,
      justifyContent: 'center'
    }
  }, icon, label);
}
const IconButtons = {
  IconButton,
  FAB
};
Object.assign(__ds_scope, { IconButton, FAB, IconButtons });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButtons.jsx", error: String((e && e.message) || e) }); }

// components/forms/Inputs.jsx
try { (() => {
function TextInput({
  label,
  placeholder,
  value,
  onChange,
  error,
  icon,
  disabled,
  type = 'text'
}) {
  const [focus, setFocus] = React.useState(false);
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-sans)'
    }
  }, label && React.createElement('label', {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: 'var(--fg-secondary)'
    }
  }, label), React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '0 14px',
      height: 46,
      borderRadius: 'var(--radius-input)',
      background: disabled ? 'var(--gray-50)' : '#fff',
      border: `1px solid ${error ? 'var(--danger)' : focus ? 'var(--remax-blue)' : 'var(--border-default)'}`,
      boxShadow: focus ? 'var(--shadow-focus)' : 'none',
      transition: 'border-color var(--duration-fast), box-shadow var(--duration-fast)'
    }
  }, icon, React.createElement('input', {
    type,
    placeholder,
    value,
    disabled,
    onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      border: 'none',
      outline: 'none',
      flex: 1,
      fontSize: 15,
      fontFamily: 'var(--font-sans)',
      background: 'transparent',
      color: 'var(--fg-primary)'
    }
  })), error && React.createElement('span', {
    style: {
      fontSize: 12,
      color: 'var(--danger)'
    }
  }, error));
}
function Textarea({
  label,
  placeholder,
  value,
  onChange,
  rows = 4
}) {
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-sans)'
    }
  }, label && React.createElement('label', {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: 'var(--fg-secondary)'
    }
  }, label), React.createElement('textarea', {
    placeholder,
    value,
    onChange,
    rows,
    style: {
      padding: 14,
      borderRadius: 'var(--radius-input)',
      border: '1px solid var(--border-default)',
      fontSize: 15,
      fontFamily: 'var(--font-sans)',
      resize: 'vertical'
    }
  }));
}
function Select({
  label,
  options = [],
  value,
  onChange
}) {
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-sans)'
    }
  }, label && React.createElement('label', {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: 'var(--fg-secondary)'
    }
  }, label), React.createElement('select', {
    value,
    onChange,
    style: {
      height: 46,
      borderRadius: 'var(--radius-input)',
      border: '1px solid var(--border-default)',
      padding: '0 14px',
      fontSize: 15,
      fontFamily: 'var(--font-sans)',
      background: '#fff',
      color: 'var(--fg-primary)'
    }
  }, options.map((o, i) => React.createElement('option', {
    key: i,
    value: o.value ?? o
  }, o.label ?? o))));
}
function PriceInput({
  label = 'Price (IDR)',
  value,
  onChange
}) {
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-sans)'
    }
  }, label && React.createElement('label', {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: 'var(--fg-secondary)'
    }
  }, label), React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '0 14px',
      height: 46,
      borderRadius: 'var(--radius-input)',
      border: '1px solid var(--border-default)',
      background: '#fff'
    }
  }, React.createElement('span', {
    style: {
      color: 'var(--fg-muted)',
      fontFamily: 'var(--font-mono)',
      fontSize: 15
    }
  }, 'Rp'), React.createElement('input', {
    value,
    onChange,
    placeholder: '0',
    style: {
      border: 'none',
      outline: 'none',
      flex: 1,
      fontSize: 15,
      fontFamily: 'var(--font-mono)'
    }
  })));
}
function OTPInput({
  length = 4
}) {
  return React.createElement('div', {
    style: {
      display: 'flex',
      gap: 10
    }
  }, Array.from({
    length
  }).map((_, i) => React.createElement('input', {
    key: i,
    maxLength: 1,
    style: {
      width: 44,
      height: 52,
      textAlign: 'center',
      fontSize: 20,
      fontFamily: 'var(--font-mono)',
      borderRadius: 'var(--radius-input)',
      border: '1px solid var(--border-default)'
    }
  })));
}
const Inputs = {
  TextInput,
  Textarea,
  Select,
  PriceInput,
  OTPInput
};
Object.assign(__ds_scope, { TextInput, Textarea, Select, PriceInput, OTPInput, Inputs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Inputs.jsx", error: String((e && e.message) || e) }); }

// components/forms/Toggles.jsx
try { (() => {
function Checkbox({
  checked,
  onChange,
  label
}) {
  return React.createElement('label', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      cursor: 'pointer'
    }
  }, React.createElement('input', {
    type: 'checkbox',
    checked,
    onChange,
    style: {
      width: 18,
      height: 18,
      accentColor: 'var(--remax-blue)'
    }
  }), label);
}
function Radio({
  checked,
  onChange,
  label,
  name
}) {
  return React.createElement('label', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      cursor: 'pointer'
    }
  }, React.createElement('input', {
    type: 'radio',
    name,
    checked,
    onChange,
    style: {
      width: 18,
      height: 18,
      accentColor: 'var(--remax-blue)'
    }
  }), label);
}
function Switch({
  checked,
  onChange,
  label
}) {
  return React.createElement('label', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      cursor: 'pointer'
    }
  }, React.createElement('span', {
    onClick: () => onChange && onChange(!checked),
    style: {
      width: 40,
      height: 22,
      borderRadius: 999,
      background: checked ? 'var(--remax-blue)' : 'var(--gray-300)',
      position: 'relative',
      transition: 'background var(--duration-fast)'
    }
  }, React.createElement('span', {
    style: {
      position: 'absolute',
      top: 2,
      left: checked ? 20 : 2,
      width: 18,
      height: 18,
      borderRadius: '50%',
      background: '#fff',
      transition: 'left var(--duration-fast)',
      boxShadow: 'var(--shadow-xs)'
    }
  })), label);
}
const Toggles = {
  Checkbox,
  Radio,
  Switch
};
Object.assign(__ds_scope, { Checkbox, Radio, Switch, Toggles });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Toggles.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Navigation.jsx
try { (() => {
function Navbar({
  logo,
  links = [],
  sticky
}) {
  return React.createElement('header', {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 32px',
      background: '#fff',
      borderBottom: '1px solid var(--border-default)',
      position: sticky ? 'sticky' : 'static',
      top: 0,
      zIndex: 10,
      fontFamily: 'var(--font-sans)'
    }
  }, React.createElement('img', {
    src: logo,
    style: {
      height: 28
    }
  }), React.createElement('nav', {
    style: {
      display: 'flex',
      gap: 28
    }
  }, links.map((l, i) => React.createElement('a', {
    key: i,
    href: '#',
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--fg-primary)',
      textDecoration: 'none'
    }
  }, l))), React.createElement('div', {
    style: {
      display: 'flex',
      gap: 10
    }
  }, React.createElement(__ds_scope.Button, {
    variant: 'ghost',
    size: 'sm'
  }, 'Sign In'), React.createElement(__ds_scope.Button, {
    variant: 'primary',
    size: 'sm'
  }, 'List a Property')));
}
function Breadcrumb({
  items = []
}) {
  return React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 13,
      color: 'var(--fg-secondary)',
      fontFamily: 'var(--font-sans)'
    }
  }, items.map((it, i) => React.createElement(React.Fragment, {
    key: i
  }, i > 0 && React.createElement(__ds_scope.Icon, {
    name: 'chevron-right',
    size: 12
  }), React.createElement('a', {
    href: '#',
    style: {
      color: i === items.length - 1 ? 'var(--fg-primary)' : 'var(--fg-secondary)',
      fontWeight: i === items.length - 1 ? 600 : 400,
      textDecoration: 'none'
    }
  }, it))));
}
function BottomNav({
  items = [],
  active = 0
}) {
  return React.createElement('div', {
    style: {
      display: 'flex',
      justifyContent: 'space-around',
      padding: '10px 0',
      background: '#fff',
      borderTop: '1px solid var(--border-default)',
      width: 360,
      fontFamily: 'var(--font-sans)'
    }
  }, items.map((it, i) => React.createElement('div', {
    key: i,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 3,
      color: i === active ? 'var(--remax-blue)' : 'var(--fg-muted)',
      fontSize: 11
    }
  }, React.createElement(__ds_scope.Icon, {
    name: it.icon,
    size: 20
  }), it.label)));
}
function DashboardSidebar({
  items = [],
  active = 0
}) {
  return React.createElement('div', {
    style: {
      width: 220,
      background: 'var(--dark-blue)',
      color: '#fff',
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      borderRadius: 'var(--radius-card)',
      fontFamily: 'var(--font-sans)'
    }
  }, items.map((it, i) => React.createElement('div', {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 12px',
      borderRadius: 'var(--radius-sm)',
      background: i === active ? 'rgba(255,255,255,0.12)' : 'transparent',
      fontSize: 14,
      fontWeight: i === active ? 600 : 400,
      cursor: 'pointer'
    }
  }, React.createElement(__ds_scope.Icon, {
    name: it.icon,
    size: 17
  }), it.label)));
}
const Navigation = {
  Navbar,
  Breadcrumb,
  BottomNav,
  DashboardSidebar
};
Object.assign(__ds_scope, { Navbar, Breadcrumb, BottomNav, DashboardSidebar, Navigation });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Navigation.jsx", error: String((e && e.message) || e) }); }

// components/property/MortgageCalculator.jsx
try { (() => {
function MortgageCalculator({
  price = 4850000000
}) {
  const [down, setDown] = React.useState(20);
  const [years, setYears] = React.useState(15);
  const rate = 0.085;
  const principal = price * (1 - down / 100);
  const monthly = Math.round(principal * (rate / 12) / (1 - Math.pow(1 + rate / 12, -years * 12)));
  return React.createElement('div', {
    style: {
      width: 340,
      padding: 20,
      borderRadius: 'var(--radius-card)',
      background: '#fff',
      border: '1px solid var(--border-default)',
      boxShadow: 'var(--shadow-sm)',
      fontFamily: 'var(--font-sans)'
    }
  }, React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontWeight: 700,
      fontSize: 15
    }
  }, React.createElement(__ds_scope.Icon, {
    name: 'calculator',
    size: 16
  }), 'Mortgage Calculator'), React.createElement('div', {
    style: {
      marginTop: 14,
      fontSize: 12,
      color: 'var(--fg-secondary)'
    }
  }, 'Down payment: ', down, '%'), React.createElement('input', {
    type: 'range',
    min: 10,
    max: 50,
    value: down,
    onChange: e => setDown(+e.target.value),
    style: {
      width: '100%',
      accentColor: 'var(--remax-blue)'
    }
  }), React.createElement('div', {
    style: {
      marginTop: 10,
      fontSize: 12,
      color: 'var(--fg-secondary)'
    }
  }, 'Term: ', years, ' years'), React.createElement('input', {
    type: 'range',
    min: 5,
    max: 30,
    value: years,
    onChange: e => setYears(+e.target.value),
    style: {
      width: '100%',
      accentColor: 'var(--remax-blue)'
    }
  }), React.createElement('div', {
    style: {
      marginTop: 16,
      padding: 14,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--accent-subtle)'
    }
  }, React.createElement('div', {
    style: {
      fontSize: 12,
      color: 'var(--accent-active)'
    }
  }, 'Estimated monthly payment'), React.createElement('div', {
    style: {
      fontSize: 22,
      fontWeight: 700,
      fontFamily: 'var(--font-mono)',
      color: 'var(--dark-blue)'
    }
  }, 'Rp ', monthly.toLocaleString('id-ID'))));
}
Object.assign(__ds_scope, { MortgageCalculator });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/property/MortgageCalculator.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketplace/AgentDashboard.jsx
try { (() => {
const {
  DashboardSidebar
} = window.REMAXIndonesiaDesignSystem_19230c;
const {
  StatisticCard,
  InsightCard
} = window.REMAXIndonesiaDesignSystem_19230c;
const {
  Badge
} = window.REMAXIndonesiaDesignSystem_19230c;
const {
  Button
} = window.REMAXIndonesiaDesignSystem_19230c;
const {
  Icon
} = window.REMAXIndonesiaDesignSystem_19230c;
const leads = [{
  name: 'Budi Santoso',
  property: 'Modern Minimalist House',
  stage: 'New',
  value: 'Rp 4.850.000.000'
}, {
  name: 'Maria Kusuma',
  property: 'Cozy Family Apartment',
  stage: 'Contacted',
  value: 'Rp 2.100.000.000'
}, {
  name: 'Rina Hartanto',
  property: 'Luxury Villa with Pool',
  stage: 'Visit Scheduled',
  value: 'Rp 7.200.000.000'
}];
const stageTone = {
  New: 'accent',
  Contacted: 'warning',
  'Visit Scheduled': 'success'
};
function AgentDashboard() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      background: 'var(--bg-page)',
      minHeight: '100%',
      display: 'flex',
      gap: 20,
      padding: 20
    }
  }, /*#__PURE__*/React.createElement(DashboardSidebar, {
    items: [{
      icon: 'layout-dashboard',
      label: 'Overview'
    }, {
      icon: 'building-2',
      label: 'Listings'
    }, {
      icon: 'users',
      label: 'Leads'
    }, {
      icon: 'bar-chart-3',
      label: 'Analytics'
    }, {
      icon: 'settings',
      label: 'Settings'
    }],
    active: 0
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-h2)',
      fontWeight: 700
    }
  }, "Welcome back, Siti"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 15
    })
  }, "New Listing")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      marginTop: 20,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(StatisticCard, {
    label: "Active Listings",
    value: "18",
    delta: "+2 this month"
  }), /*#__PURE__*/React.createElement(StatisticCard, {
    label: "New Leads",
    value: "9",
    delta: "+12%",
    icon: "users"
  }), /*#__PURE__*/React.createElement(StatisticCard, {
    label: "Commission (YTD)",
    value: "Rp 612jt",
    delta: "+18%",
    icon: "wallet"
  }), /*#__PURE__*/React.createElement(InsightCard, {
    title: "Follow up with Budi",
    body: "This lead viewed the Kemang listing 4 times this week \u2014 reach out today."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28,
      background: '#fff',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-card)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 20px',
      borderBottom: '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 16
    }
  }, "Recent Leads"), /*#__PURE__*/React.createElement(Icon, {
    name: "sliders-horizontal",
    size: 16
  })), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      textAlign: 'left',
      color: 'var(--fg-secondary)',
      fontSize: 12
    }
  }, ['Name', 'Property', 'Stage', 'Value'].map(h => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: {
      padding: '10px 20px',
      fontWeight: 600
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, leads.map((l, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    style: {
      borderTop: '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 20px'
    }
  }, l.name), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 20px',
      color: 'var(--fg-secondary)'
    }
  }, l.property), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 20px'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: stageTone[l.stage]
  }, l.stage)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 20px',
      fontFamily: 'var(--font-mono)'
    }
  }, l.value))))))));
}
window.AgentDashboard = AgentDashboard;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketplace/AgentDashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketplace/Homepage.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Navbar
} = window.REMAXIndonesiaDesignSystem_19230c;
const {
  Button
} = window.REMAXIndonesiaDesignSystem_19230c;
const {
  TextInput
} = window.REMAXIndonesiaDesignSystem_19230c;
const {
  PropertyCard
} = window.REMAXIndonesiaDesignSystem_19230c;
const {
  StatisticCard
} = window.REMAXIndonesiaDesignSystem_19230c;
const {
  BlogCard,
  TestimonialCard
} = window.REMAXIndonesiaDesignSystem_19230c;
const {
  Icon
} = window.REMAXIndonesiaDesignSystem_19230c;
const listings = [{
  price: 'Rp 4.850.000.000',
  title: 'Modern Minimalist House',
  address: 'Kemang, Jakarta Selatan',
  beds: 4,
  baths: 3,
  area: '320 m²',
  featured: true
}, {
  price: 'Rp 2.100.000.000',
  title: 'Cozy Family Apartment',
  address: 'Kelapa Gading, Jakarta Utara',
  beds: 2,
  baths: 2,
  area: '88 m²',
  status: 'For Rent'
}, {
  price: 'Rp 7.200.000.000',
  title: 'Luxury Villa with Pool',
  address: 'Pondok Indah, Jakarta Selatan',
  beds: 5,
  baths: 5,
  area: '540 m²',
  featured: true
}];
function Homepage({
  onOpenListing
}) {
  const [saved, setSaved] = React.useState({});
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      background: 'var(--bg-page)',
      minHeight: '100%'
    }
  }, /*#__PURE__*/React.createElement(Navbar, {
    logo: "../../assets/logo-full.png",
    links: ['Buy', 'Rent', 'Sell', 'Agents', 'Insights'],
    sticky: true
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '72px 32px',
      textAlign: 'center',
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-display)',
      fontWeight: 700,
      letterSpacing: 'var(--ls-display)',
      color: 'var(--dark-blue)'
    }
  }, "Find your next home in Indonesia."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      color: 'var(--fg-secondary)',
      marginTop: 12
    }
  }, "Trusted local agents. Global RE/MAX network."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      justifyContent: 'center',
      marginTop: 32,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(TextInput, {
    placeholder: "City, neighborhood, or address",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 16
    })
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg"
  }, "Search Properties"))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '48px 32px',
      maxWidth: 1280,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-h2)',
      fontWeight: 700
    }
  }, "Featured Listings"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, "View all")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      flexWrap: 'wrap'
    }
  }, listings.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    onClick: onOpenListing,
    style: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(PropertyCard, _extends({}, l, {
    saved: saved[i],
    onToggleSave: e => {
      e.stopPropagation();
      setSaved(s => ({
        ...s,
        [i]: !s[i]
      }));
    }
  })))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '48px 32px',
      background: 'var(--bg-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-h2)',
      fontWeight: 700,
      marginBottom: 20
    }
  }, "Indonesia Market at a Glance"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(StatisticCard, {
    label: "Avg. Price / m\xB2",
    value: "Rp 18,4jt",
    delta: "+3.2% YoY"
  }), /*#__PURE__*/React.createElement(StatisticCard, {
    label: "Active Listings",
    value: "12.480",
    delta: "+8% MoM"
  }), /*#__PURE__*/React.createElement(StatisticCard, {
    label: "Avg. Days on Market",
    value: "46",
    delta: "-6%",
    icon: "clock"
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '48px 32px',
      maxWidth: 1280,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-h2)',
      fontWeight: 700,
      marginBottom: 20
    }
  }, "Insights & Stories"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(BlogCard, {
    category: "Market Trends",
    title: "Jakarta Property Outlook 2026",
    date: "Jul 12, 2026"
  }), /*#__PURE__*/React.createElement(TestimonialCard, {
    quote: "RE/MAX found us the perfect home in under a month.",
    name: "Andi Wijaya",
    role: "Homeowner, Bekasi"
  }))));
}
window.Homepage = Homepage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketplace/Homepage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketplace/ListingDetail.jsx
try { (() => {
const {
  Navbar,
  Breadcrumb
} = window.REMAXIndonesiaDesignSystem_19230c;
const {
  Button
} = window.REMAXIndonesiaDesignSystem_19230c;
const {
  Badge
} = window.REMAXIndonesiaDesignSystem_19230c;
const {
  AgentCard
} = window.REMAXIndonesiaDesignSystem_19230c;
const {
  MortgageCalculator
} = window.REMAXIndonesiaDesignSystem_19230c;
const {
  Icon
} = window.REMAXIndonesiaDesignSystem_19230c;
function ListingDetail({
  onBack
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      background: 'var(--bg-page)',
      minHeight: '100%'
    }
  }, /*#__PURE__*/React.createElement(Navbar, {
    logo: "../../assets/logo-full.png",
    links: ['Buy', 'Rent', 'Sell', 'Agents', 'Insights'],
    sticky: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 32px'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: onBack,
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-left",
      size: 14
    })
  }, "Back to results")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 32px 48px',
      maxWidth: 1280,
      margin: '0 auto',
      display: 'flex',
      gap: 32,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 640px'
    }
  }, /*#__PURE__*/React.createElement(Breadcrumb, {
    items: ['Home', 'Jakarta Selatan', 'Kemang']
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: 8,
      marginTop: 16,
      borderRadius: 'var(--radius-card)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 340,
      background: 'var(--gray-200)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: 'var(--gray-300)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: 'var(--gray-200)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(0,14,53,0.55)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 13,
      fontWeight: 600,
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "images",
    size: 14
  }), " +12 photos")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "success"
  }, "For Sale"), /*#__PURE__*/React.createElement(Badge, {
    tone: "dark"
  }, "Featured")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28,
      fontWeight: 700,
      fontFamily: 'var(--font-mono)',
      color: 'var(--dark-blue)',
      marginTop: 12
    }
  }, "Rp 4.850.000.000"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 700,
      marginTop: 6
    }
  }, "Modern Minimalist House"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--fg-secondary)',
      marginTop: 4,
      display: 'flex',
      gap: 4,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: 14
  }), " Jl. Kemang Raya No. 12, Jakarta Selatan"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      marginTop: 20,
      padding: '16px 0',
      borderTop: '1px solid var(--border-default)',
      borderBottom: '1px solid var(--border-default)'
    }
  }, ['bed-double', 'bath', 'maximize', 'car'].map((ic, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 16
  }), ['4 Beds', '3 Baths', '320 m²', '2 Garage'][i]))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      fontSize: 15,
      lineHeight: 1.6,
      color: 'var(--fg-secondary)'
    }
  }, "A bright, minimalist family home in the heart of Kemang, featuring an open living plan, private garden, and dedicated home office. Fully renovated in 2024 with natural materials throughout."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "calendar",
      size: 15
    })
  }, "Schedule a Visit"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "share-2",
      size: 15
    })
  }, "Share"))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 340,
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(AgentCard, {
    name: "Siti Rahayu",
    office: "RE/MAX Prime, Jakarta",
    phone: "+62 812 3456",
    listings: 18
  }), /*#__PURE__*/React.createElement(MortgageCalculator, {
    price: 4850000000
  }))));
}
window.ListingDetail = ListingDetail;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketplace/ListingDetail.jsx", error: String((e && e.message) || e) }); }

__ds_ns.BlogCard = __ds_scope.BlogCard;

__ds_ns.TestimonialCard = __ds_scope.TestimonialCard;

__ds_ns.ContentCards = __ds_scope.ContentCards;

__ds_ns.StatisticCard = __ds_scope.StatisticCard;

__ds_ns.InsightCard = __ds_scope.InsightCard;

__ds_ns.DataCards = __ds_scope.DataCards;

__ds_ns.AgentCard = __ds_scope.AgentCard;

__ds_ns.OfficeCard = __ds_scope.OfficeCard;

__ds_ns.PeopleCards = __ds_scope.PeopleCards;

__ds_ns.PropertyCard = __ds_scope.PropertyCard;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.FAB = __ds_scope.FAB;

__ds_ns.IconButtons = __ds_scope.IconButtons;

__ds_ns.TextInput = __ds_scope.TextInput;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.PriceInput = __ds_scope.PriceInput;

__ds_ns.OTPInput = __ds_scope.OTPInput;

__ds_ns.Inputs = __ds_scope.Inputs;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Toggles = __ds_scope.Toggles;

__ds_ns.Navbar = __ds_scope.Navbar;

__ds_ns.Breadcrumb = __ds_scope.Breadcrumb;

__ds_ns.BottomNav = __ds_scope.BottomNav;

__ds_ns.DashboardSidebar = __ds_scope.DashboardSidebar;

__ds_ns.Navigation = __ds_scope.Navigation;

__ds_ns.MortgageCalculator = __ds_scope.MortgageCalculator;

})();
