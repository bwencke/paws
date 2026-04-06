import { Redirect, Route, useHistory } from 'react-router-dom'
import { IonApp, IonLabel, IonIcon, IonRouterOutlet, IonTabBar, IonTabButton, setupIonicReact, IonTabs } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { supabase } from '../lib/supabase'
import { timeOutline, shieldOutline } from 'ionicons/icons'
import { StatusBar, Style } from '@capacitor/status-bar'
import { App as CapacitorApp } from '@capacitor/app'

import '@ionic/react/css/ionic.bundle.css'

/* Theme variables */
import './theme/variables.css'
import { AccountPage } from './pages/account/Account'
import { useEffect, useState } from 'react'
import VolunteerPage from './pages/volunteer/Volunteer'
import AdminPage from './pages/admin/AdminPage'
import ManageUsersPage from './pages/admin/manage/ManageUsersPage'
import ManageActivitiesPage from './pages/admin/manage/ManageActivitiesPage'
import ManageLocationsPage from './pages/admin/manage/ManageLocationsPage'
import AllVolunteerHoursListPage from './pages/admin/view/AllVolunteerHoursPage'
import AllVolunteerHoursPage from './pages/admin/view/AllVolunteerHoursPage'

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
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null) // <-- Use null for loading state
  const history = useHistory();

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
        void supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single()
          .then(
            ({ data: profile }) => {
              setIsAdmin(profile?.is_admin === true);
            },
            () => setIsAdmin(false)
          );
      } else {
        setIsAdmin(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setIsLoggedIn(!!session);

      if (session) {
        void supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single()
          .then(
            ({ data: profile }) => {
              setIsAdmin(profile?.is_admin === true);
            },
            () => setIsAdmin(false)
          );
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show loading spinner while checking auth/admin state
  if (isLoggedIn === null || isAdmin === null) {
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
            <Route exact path="/admin" component={AdminPage} />
            <Route exact path="/admin/view/all-volunteer-hours" component={AllVolunteerHoursPage} />
            <Route exact path="/admin/manage/users" component={ManageUsersPage} />
            <Route exact path="/admin/manage/activities" component={ManageActivitiesPage} />
            <Route exact path="/admin/manage/locations" component={ManageLocationsPage} />
            <Route exact path="/account" component={AccountPage} />
            <Redirect exact from="/" to="/volunteer" />
          </IonRouterOutlet>
          {isLoggedIn && isAdmin && (
            <IonTabBar slot="bottom" className="ion-tab-bar" data-testid="tab-bar">
              <IonTabButton tab="volunteer" href="/volunteer">
                <IonIcon icon={timeOutline} />
                <IonLabel>Hours</IonLabel>
              </IonTabButton>
              <IonTabButton tab="admin" href="/admin" >
                <IonIcon icon={shieldOutline} />
                <IonLabel>Admin</IonLabel>
              </IonTabButton>
            </IonTabBar>
          )}
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  )
}
