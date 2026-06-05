import { detectLang, TRANSLATIONS } from '../i18n/translations';

const SPINNER_STYLE = `
@keyframes hj-pulse {
  0%, 100% { opacity: 0.2; transform: scale(0.7); }
  50%       { opacity: 1;   transform: scale(1);   }
}
@keyframes hj-bar {
  0%   { width: 0%; }
  40%  { width: 60%; }
  70%  { width: 80%; }
  100% { width: 95%; }
}
`;

/** @param {{ stage?: 'auth' | 'sync' }} props */
export default function LoadingScreen({ stage }) {
  const T = TRANSLATIONS[detectLang()];
  const label = stage === 'sync' ? T.UI.loadingSync
              : stage === 'auth' ? T.UI.loadingAuth
              : T.UI.loading;

  return (
    <div style={{ position:"fixed", inset:0, ba