import * as icons from 'ionicons/icons';

export function getIonicon(name: string) {
  return icons[name as keyof typeof icons] ?? icons.ribbonOutline;
}
