import { Navigate, Route, Routes, HashRouter } from 'react-router-dom';
import { useLaunchParams, useSignal, miniApp, initData } from '@tma.js/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';

import { routes } from '@/navigation/routes.tsx';

const ALLOWED_USERNAMES = [
  'alhazova_unitpay',
  'tonoyan_unitpay',
  'komissarenko_unitpay',
  'esina_unitpay',
  'deeva_unitpay',
  'grigoreva_unitpay',
  'dragunov_unitpay',
  'volkova_unitpay',
  'nijnevskiy_unitpay',
  'volgin_unitpay',
  'head_of_account_unitpay',
  'dolzhenkova_unitpay',
  'dmitrii_unitpay',
  'intern_unitpay',
  'pavlova_webmasters',
  'unitcom',
  'ignat',
];

export function App() {
  const lp = useLaunchParams();
  const isDark = useSignal(miniApp.isDark);

  const user = useSignal(initData.user);
  const username = user?.username?.toLowerCase() ?? '';
  const isAllowed = !username || ALLOWED_USERNAMES.includes(username);

  if (!isAllowed) {
    return (
      <AppRoot
        appearance={isDark ? 'dark' : 'light'}
        platform={['macos', 'ios'].includes(lp.tgWebAppPlatform) ? 'ios' : 'base'}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100dvh',
          padding: '24px',
          textAlign: 'center',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        }}>
          <p style={{ fontSize: '48px', margin: '0 0 16px' }}>🔒</p>
          <p style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 8px' }}>Нет доступа</p>
          <p style={{ fontSize: '15px', opacity: 0.6, margin: 0 }}>
            Это приложение доступно только для сотрудников UnitPay
          </p>
        </div>
      </AppRoot>
    );
  }

  return (
    <AppRoot
      appearance={isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.tgWebAppPlatform) ? 'ios' : 'base'}
    >
      <HashRouter>
        <Routes>
          <Route path="/" element={<Navigate to={localStorage.getItem('onboarding_done') ? '/topics' : '/onboarding'} replace />} />
          {routes.filter(r => r.path !== '/').map((route) => <Route key={route.path} {...route} />)}
          <Route path="*" element={<Navigate to={localStorage.getItem('onboarding_done') ? '/topics' : '/onboarding'} replace />} />
        </Routes>
      </HashRouter>
    </AppRoot>
  );
}
