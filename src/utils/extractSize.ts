import { KeyboardProduct } from '../types/keyboard';

type Product = KeyboardProduct & { type?: string; size?: string };

export const SIZE_VALUES: Record<string, number> = {
  '40%': 40,
  '50%': 50,
  '60%': 60,
  '65%': 65,
  '70%': 70,
  '75%': 75,
  '80%': 80,
  'TKL': 80,
  '96%': 96,
  '1800': 96,
  '100%': 100,
  'Full': 100,
  'Numpad': 105,
  'Novelty': 150,
};

export const extractSize = (product: Product): string | null => {
  // Use stored size field first (populated by scraper's classifySize function)
  if (product.size && SIZE_VALUES[product.size] !== undefined) {
    return product.size;
  }

  // Fallback: infer from name/description at runtime
  const text = (product.name + ' ' + (product.description || '')).toLowerCase();

  const pctMatch = text.match(/\b(40|50|60|65|70|75|80|96|100)\s*%/);
  if (pctMatch) return pctMatch[1] + '%';

  if (/\btkl\b|\btenkeyless\b/.test(text)) return 'TKL';
  if (/\bfull[- ]size\b/.test(text)) return 'Full';
  if (/\b1800\s*(layout|compact)\b/.test(text)) return '96%';

  const keyCountMatch = text.match(/\b(40|50|61|64|65|67|68|75|82|83|84|87|88|96|98|100|104|108)[- ]?key/i);
  if (keyCountMatch) {
    const n = parseInt(keyCountMatch[1]);
    if (n <= 50) return '50%';
    if (n <= 65) return '65%';
    if (n <= 75) return '75%';
    if (n <= 88) return 'TKL';
    if (n <= 100) return '96%';
    return 'Full';
  }

  const name = product.name?.toLowerCase() || '';
  const vendor = product.vendor?.toLowerCase() || '';

  // Keychron model map — verified against Keychron product pages
  if (vendor === 'keychron') {
    const m = name.match(/\b([qvkbc])(\d{1,2})\b/i);
    if (m) {
      const s = m[1].toUpperCase(), n = parseInt(m[2]);
      const map: Record<string, Record<number, string>> = {
        K: { 1:'75%', 2:'75%', 3:'75%', 4:'96%', 5:'Full', 6:'65%', 7:'65%', 8:'TKL', 9:'40%', 10:'Full', 11:'65%', 12:'60%', 13:'75%', 14:'96%', 15:'Full' },
        Q: { 1:'75%', 2:'65%', 3:'TKL', 4:'60%', 5:'TKL', 6:'Full', 7:'Full', 8:'TKL', 9:'40%', 10:'Full' },
        V: { 1:'75%', 2:'65%', 3:'TKL', 4:'60%', 5:'TKL', 6:'Full', 7:'Full' },
        C: { 1:'TKL', 2:'65%', 3:'60%' },
        B: { 1:'75%' },
      };
      if (map[s]?.[n]) return map[s][n];
    }
  }

  if (vendor === 'epomaker') {
    const thMatch = name.match(/\b(?:th|ep|rt|g)(\d{2,3})\b/i);
    if (thMatch) {
      const prefix = name.match(/\b(th|ep|rt|g)(\d{2,3})\b/i)?.[1]?.toLowerCase();
      const num = parseInt(thMatch[1]);
      if (prefix === 'rt') return 'Full';
      if (num <= 61) return '60%';
      if (num <= 68) return '65%';
      if (num <= 80) return '75%';
      if (num <= 88) return 'TKL';
      return 'Full';
    }
  }

  if (vendor === 'drop') {
    if (/\balt\b/.test(name)) return '65%';
    if (/\bctrl\b/.test(name)) return 'TKL';
    if (/\bshift\b/.test(name)) return '96%';
    if (/\bplanck\b/.test(name)) return '40%';
    if (/\bpreonic\b/.test(name)) return '50%';
    if (/\bsense75\b/.test(name)) return '75%';
  }

  if (vendor === 'kbdfans') {
    if (/\bd60\b|\btofu60\b/.test(name)) return '60%';
    if (/\bd65\b|\btofu65\b|\bkbd67\b/.test(name)) return '65%';
    if (/\bd84\b|\bkbd75\b/.test(name)) return '75%';
    if (/\bfreebird\b|\bd100\b/.test(name)) return 'TKL';
    if (/\bodin\b|\bbella\b|\bd108\b/.test(name)) return 'Full';
  }

  if (vendor === 'novelkeys') {
    if (/\bnk65\b/.test(name)) return '65%';
    if (/\bnk87\b|\bhope\b/.test(name)) return 'TKL';
  }

  if (vendor === 'glorious') {
    if (/\bgmmk\s*pro\b/.test(name)) return '75%';
    if (/\bgmmk\s*2\b/.test(name)) return 'Full';
    if (/\bgmmk\b/.test(name)) return 'TKL';
  }

  return null;
};

export const getSizeValue = (product: Product): number => {
  const size = extractSize(product);
  return size ? SIZE_VALUES[size] || 50 : 999;
};
