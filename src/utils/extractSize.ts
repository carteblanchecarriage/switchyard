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
  if (product.size && SIZE_VALUES[product.size]) {
    return product.size;
  }

  const text = (product.name + ' ' + (product.description || '')).toLowerCase();

  const percentageMatch = text.match(/\b(40|50|60|65|70|75|80|96|100)%/);
  if (percentageMatch) return percentageMatch[1] + '%';

  if (text.includes('tkl') || text.includes('tenkeyless')) return 'TKL';
  if (text.includes('full-size') || text.includes('full size')) return 'Full';
  if (text.includes('numpad') && !text.includes('keyboard')) return 'Numpad';
  if (text.includes('1800') || text.includes('1800 layout')) return '96%';

  const vendor = product.vendor?.toLowerCase() || '';
  const name = product.name?.toLowerCase() || '';

  if (vendor === 'keychron') {
    const modelMatch = name.match(/\b(q|v|k|c|b)\d+/i);
    if (modelMatch) {
      const model = modelMatch[0].toUpperCase();
      if (model === 'Q1' || model === 'V1' || model === 'B1') return '75%';
      if (model === 'Q2' || model === 'V2' || model === 'K2') return '65%';
      if (model === 'Q3' || model === 'V3' || model === 'K3' || model === 'C1') return 'TKL';
      if (model === 'Q4' || model === 'K4') return '60%';
      if (model === 'Q5' || model === 'V5' || model === 'K5') return 'TKL';
      if (model === 'Q6' || model === 'V6' || model === 'K6') return 'Full';
      if (model === 'Q7' || model === 'V7' || model === 'K7') return 'Full';
      if (model === 'Q8' || model === 'V8' || model === 'K8') return 'TKL';
      if (model === 'Q9' || model === 'K9') return '40%';
      if (model === 'Q10' || model === 'V10' || model === 'K10' || model === 'K14' || model === 'K15') return 'Full';
    }
  }

  if (vendor === 'epomaker') {
    const thMatch = name.match(/th(\d+)/i);
    if (thMatch) {
      const size = parseInt(thMatch[1]);
      if (size <= 70) return '65%';
      if (size <= 100) return 'TKL';
      if (size <= 110) return 'Full';
      return '96%';
    }
    if (name.includes('g84')) return '75%';
    if (name.includes('rt100')) return 'Full';
    if (name.includes('he30')) return 'Numpad';
  }

  if (vendor === 'drop') {
    if (name.includes('alt')) return '65%';
    if (name.includes('ctrl')) return 'TKL';
    if (name.includes('shift')) return '96%';
    if (name.includes('sense75')) return '75%';
    if (name.includes('preonic')) return '50%';
    if (name.includes('planck')) return '40%';
  }

  if (vendor === 'kbdfans') {
    if (name.includes('60') || name.includes('d60') || name.includes('tofu60')) return '60%';
    if (name.includes('65') || name.includes('d65') || name.includes('tofu65') || name.includes('kbd67')) return '65%';
    if (name.includes('75') || name.includes('kbd75') || name.includes('d84')) return '75%';
    if (name.includes('8x') || name.includes('freebird') || name.includes('d100')) return 'TKL';
    if (name.includes('odin') || name.includes('bella') || name.includes('mountain') || name.includes('d108')) return 'Full';
  }

  if (vendor === 'novelkeys') {
    if (name.includes('nk65')) return '65%';
    if (name.includes('nk87')) return 'TKL';
    if (name.includes('hope')) return 'TKL';
    if (name.includes('nibble')) return '65%';
    if (name.includes('big switch')) return 'Novelty';
  }

  const genericMatch = name.match(/\b(th|ek|p|a|d)(\d{2,3})\b/i);
  if (genericMatch) {
    const size = parseInt(genericMatch[2]);
    if (size <= 65) return '65%';
    if (size <= 80) return 'TKL';
    if (size <= 100) return 'Full';
  }

  return null;
};

export const getSizeValue = (product: Product): number => {
  const size = extractSize(product);
  return size ? SIZE_VALUES[size] || 50 : 999;
};
