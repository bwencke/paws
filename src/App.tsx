import { Redirect, Route } from 'react-router-dom'
import { IonApp, IonLabel, IonIcon, IonRouterOutlet, IonTabBar, IonTabButton, setupIonicReact, IonTabs } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { supabase } from '../lib/supabase'
import { calendarOutline, pawOutline, peopleOutline, timeOutline, shieldOutline } from 'ionicons/icons'
import { StatusBar, Style } from '@capacitor/status-bar'
import { App as CapacitorApp } from '@capacitor/app'

import '@ionic/react/css/ionic.bundle.css'

/* Theme variables */
import './theme/variables.css'
import { LoginPage } from './components/Login'
import { AccountPage } from './pages/Account'
import { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { ChangeEmailPage } from './pages/ChangeEmail'
import { AdoptionsPage } from './pages/Adoptions'
import EventsPage from './pages/Events'
import HoursPage from './pages/volunteer/Hours'
import VolunteerPage from './pages/volunteer/Volunteer'
import AdminPage from './pages/admin/AdminPage'
import ManageUsersPage from './pages/admin/ManageUsersPage'

setupIonicReact()

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

const checkAppLaunchUrl = async () => {
  const { url } = await CapacitorApp.getLaunchUrl();
  console.log('App opened with URL: ' + url);
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean>(false) // <-- Add isAdmin state

  const setupStatusBar = async () => {
    await StatusBar.setBackgroundColor({ color: '#ffffff' });
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setOverlaysWebView({ overlay: false });
  };

  useEffect(() => {
    setupStatusBar();

    // Check initial auth state
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setIsLoggedIn(!!session);

      if (session) {
        // Fetch user profile to check is_admin, but don't block UI
        supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            console.log('User profile (initial):', profile);
            setIsAdmin(profile?.is_admin === true);
          })
          .catch(() => setIsAdmin(false));
      } else {
        setIsAdmin(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setIsLoggedIn(!!session);

      if (session) {
        supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            console.log('User profile (updated):', profile);
            setIsAdmin(profile?.is_admin === true);
          })
          .catch(() => setIsAdmin(false));
      } else {
        setIsAdmin(false);
      }
    });

    checkAppLaunchUrl();

    return () => subscription.unsubscribe();
  }, []);

  // Show nothing while checking auth state
  if (isLoggedIn === null) {
    return null
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            {/* <Route exact path="/adoptions" render={() => <AdoptionsPage />} />
            <Route exact path="/events" render={() => <EventsPage />} /> */}
            {/* <Route exact path="/volunteer/login" render={() => <LoginPage />} /> */}

            {/* <Route exact path="/volunteer/hours" render={() => <HoursPage />} /> */}
            {/* <Route exact path="/">
              <Redirect to="/volunteer" />
            </Route> */}
            <Route exact path="/:tab(volunteer)" render={() => <VolunteerPage />} />
            <Route exact path="/:tab(admin)" render={() => <AdminPage />} />
            <Route exact path="/:tab(admin)/manage-users" render={() => <ManageUsersPage />} />
            <Route exact path="/:tab(account)" render={() => <AccountPage />} />
            <Redirect exact from="/" to="/volunteer" />
          </IonRouterOutlet>
          {isLoggedIn && isAdmin && (
            <IonTabBar slot="bottom" className="ion-tab-bar" data-testid="tab-bar">
              <IonTabButton tab="volunteer" href="/volunteer">
                <IonIcon icon={timeOutline} />
                <IonLabel>Hours</IonLabel>
              </IonTabButton>
              <IonTabButton tab="admin" href="/admin">
                <IonIcon icon={shieldOutline} />
                <IonLabel>Admin</IonLabel>
              </IonTabButton>
            </IonTabBar>
          )}
          {/* <IonTabBar slot="bottom" className="ion-tab-bar" data-testid="tab-bar">
            <IonTabButton tab="adoptions" href="/adoptions">
              <IonIcon icon={pawOutline} />
              <IonLabel>Adoptions</IonLabel>
            </IonTabButton>
            <IonTabButton tab="events" href="/events">
              <IonIcon icon={calendarOutline} />
              <IonLabel>Events</IonLabel>
            </IonTabButton>
            <IonTabButton tab="volunteer" href="/volunteer">
              <IonIcon icon={peopleOutline} />
              <IonLabel>Volunteer</IonLabel>
            </IonTabButton>
          </IonTabBar> */}
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  )
}
