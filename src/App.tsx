import { Redirect, Route } from 'react-router-dom'
import { IonApp, IonRouterOutlet, setupIonicReact, IonTabs } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { supabase } from '../lib/supabase'
import { StatusBar, Style } from '@capacitor/status-bar'
import { App as CapacitorApp } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'

import '@ionic/react/css/ionic.bundle.css'

/* Theme variables */
import './theme/variables.css'
import { AccountPage } from './pages/account/Account'
import { useEffect, useState } from 'react'
import VolunteerPage from './pages/volunteer/Volunteer'
import { BadgesPage } from './pages/badges/BadgesPage'

setupIonicReact()

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

// Add Capacitor App event listeners
CapacitorApp.addListener('appStateChange', ({ isActive }) => {
  console.log('App state changed. Is active?', isActive);
});

CapacitorApp.addListener('appUrlOpen', data => {
  console.log('App opened with URL:', data);
});

CapacitorApp.addListener('appRestoredResult', data => {
  console.log('Restored state:', data);
});

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  const setupStatusBar = async () => {
    if (!Capacitor.isNativePlatform()) return;

    await StatusBar.setBackgroundColor({ color: '#ffffff' });
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setOverlaysWebView({ overlay: false });
  };

  useEffect(() => {
    let mounted = true;

    void setupStatusBar().catch(() => {
      console.warn('StatusBar plugin unavailable on this platform.');
    });

    const syncAuthState = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setIsLoggedIn(!!session);
        }
      } catch {
        if (mounted) {
          setIsLoggedIn(false);
        }
      } finally {
        if (mounted) {
          setAuthLoading(false);
        }
      }
    };

    // Check initial auth state
    void syncAuthState();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      setAuthLoading(false);
    });

    const appStateListener = CapacitorApp.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        void syncAuthState();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
      void appStateListener.then((listener) => listener.remove());
    };
  }, []);

  // Show loading spinner while checking auth state
  if (authLoading || isLoggedIn === null) {
    return (
      <IonApp>
        <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
          <span>Loading...</span>
        </div>
      </IonApp>
    )
  }

  return (
    <IonApp>
      <IonReactRouter basename={routerBasename}>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/volunteer" component={VolunteerPage} />
            <Route exact path="/account" component={AccountPage} />
            <Route exact path="/badges" component={BadgesPage} />
            <Redirect exact from="/" to="/volunteer" />
          </IonRouterOutlet>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  )
}
