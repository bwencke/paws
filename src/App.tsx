import { Redirect, Route } from 'react-router-dom'
import { IonApp, IonLabel, IonIcon, IonRouterOutlet, IonTabBar, IonTabButton, setupIonicReact, IonTabs } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { supabase } from '../lib/supabase'
import { calendarOutline, pawOutline, peopleOutline, timeOutline } from 'ionicons/icons'
import { StatusBar, Style } from '@capacitor/status-bar' // Import StatusBar

import '@ionic/react/css/ionic.bundle.css'

/* Theme variables */
import './theme/variables.css'
import { LoginPage } from './pages/volunteer/Login'
import { AccountPage } from './pages/volunteer/Account'
import { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { ChangeEmailPage } from './pages/ChangeEmail'
import { AdoptionsPage } from './pages/Adoptions'
import EventsPage from './pages/Events'
import HoursPage from './pages/volunteer/Hours'
import VolunteerPage from './pages/volunteer/Volunteer'

setupIonicReact()

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  const setupStatusBar = async () => {
    // Set background color
    await StatusBar.setBackgroundColor({ color: '#ffffff' });
  
    // Set icon/text style to dark (on light background)
    await StatusBar.setStyle({ style: Style.Dark });
  
    // Optional: make it overlay or not
    await StatusBar.setOverlaysWebView({ overlay: false });
  };

  useEffect(() => {
    // Setup status bar
    setupStatusBar()

    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Show nothing while checking auth state
  if (isLoggedIn === null) {
    return null
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/adoptions" render={() => <AdoptionsPage />} />
            <Route exact path="/events" render={() => <EventsPage />} />
            <Route exact path="/volunteer" render={() => <VolunteerPage />} />
            <Route exact path="/volunteer/login" render={() => <LoginPage />} />
            <Route exact path="/volunteer/account" render={() => <AccountPage />} />
            <Route exact path="/volunteer/hours" render={() => <HoursPage />} />
            {/* <Route
              exact
              path="/volunteer/hours"
              render={() => (isLoggedIn ? <HoursPage /> : <Redirect to="/adoptions" />)}
            /> */}
            <Route exact path="/">
              <Redirect to="/adoptions" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom" className="ion-tab-bar" data-testid="tab-bar">
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
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  )
}
