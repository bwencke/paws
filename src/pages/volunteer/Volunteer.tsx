import { IonPage, IonContent, IonButton, IonBadge, IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';
import { Header } from '../../components/Header';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function VolunteerPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [recentActivity, setRecentActivity] = useState({
    totalHours: 0,
    totalEvents: 0,
  });
  const [selectedChart, setSelectedChart] = useState<string>('activity'); // State for selected chart

  useEffect(() => {
    // Check if the user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);

      if (session) {
        // Fetch recent activity for logged-in users
        fetchRecentActivity(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);

      if (session) {
        fetchRecentActivity(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRecentActivity = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('hours')
        .select('hours')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching recent activity:', error);
        return;
      }

      if (data) {
        const totalHours = data.reduce((sum, entry) => sum + entry.hours, 0); // Sum up all hours
        const totalEvents = data.length; // Count the number of events

        setRecentActivity({ totalHours, totalEvents });
      }
    } catch (err) {
      console.error('Unexpected error fetching recent activity:', err);
    }
  };

  // Chart.js data for bar chart
  const barChartData = {
    labels: ['Volunteer Hours', 'Events Attended'],
    datasets: [
      {
        label: 'Last Month',
        data: [recentActivity.totalHours, recentActivity.totalEvents],
        backgroundColor: ['#4caf50', '#2196f3'],
        borderColor: ['#388e3c', '#1976d2'],
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Volunteer Activity Summary',
      },
    },
  };

  // Chart.js data for event type pie chart
  const eventTypeData = {
    labels: ['Foster', 'Clean', 'Adoption Event'],
    datasets: [
      {
        data: [40, 30, 30], // Example percentages
        backgroundColor: ['#ff6384', '#36a2eb', '#ffce56'],
        hoverBackgroundColor: ['#ff6384', '#36a2eb', '#ffce56'],
      },
    ],
  };

  // Chart.js data for event location pie chart
  const eventLocationData = {
    labels: ['Foster', 'Cattery', 'Petsmart', 'Tractor Supply', 'Misc.'],
    datasets: [
      {
        data: [25, 20, 30, 15, 10], // Example percentages
        backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#9c27b0', '#607d8b'],
        hoverBackgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#9c27b0', '#607d8b'],
      },
    ],
  };

  return (
    <IonPage>
      <Header title="Volunteer" />
      <IonContent className="ion-padding">
        {isLoggedIn ? (
          <>
            <h2>Welcome Back!</h2>
            <div
              style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center',
              backgroundColor: '#f9f9f9',
              marginTop: '10px',
              }}
            >
              <p style={{ margin: '0', fontSize: '16px', color: '#555' }}>
              You have volunteered a total of <span style={{ fontWeight: 'bold', color: '#4caf50' }}>
                {recentActivity.totalHours}
              </span> hours and attended <span style={{ fontWeight: 'bold', color: '#2196f3' }}>
                {recentActivity.totalEvents}
              </span> events in the last month.
              </p>
            </div>
            <p>Keep up the great work!</p>
            {/* <p>Here's a summary of your recent activity:</p>

            <IonSegment
              value={selectedChart}
              onIonChange={(e) => setSelectedChart(e.detail.value!)}
            >
              <IonSegmentButton value="activity">
                <IonLabel>Summary</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="types">
                <IonLabel>Types</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="locations">
                <IonLabel>Locations</IonLabel>
              </IonSegmentButton>
            </IonSegment>

            {/* Conditionally Render Charts */}
            {/* {selectedChart === 'activity' && (
              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <Bar data={barChartData} options={barChartOptions} />
              </div>
            )}
            {selectedChart === 'types' && (
              <div style={{ maxWidth: '300px', margin: '0 auto' }}>
                <Pie data={eventTypeData} />
              </div>
            )}
            {selectedChart === 'locations' && (
              <div style={{ maxWidth: '300px', margin: '0 auto' }}>
                <Pie data={eventLocationData} />
              </div>
            )}

            <h3 className="ion-margin-top">Your Progress</h3>
            <div
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center',
                backgroundColor: '#f9f9f9',
                marginTop: '10px',
              }}
            >
              <h4 style={{ margin: '0 0 8px 0', color: '#4caf50' }}>Goal: Attend 5 Events</h4>
              <div
                style={{
                  height: '10px',
                  width: '100%',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '5px',
                  overflow: 'hidden',
                  marginBottom: '8px',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: '60%', // Example: 3/5 completed = 60%
                    backgroundColor: '#4caf50',
                  }}
                ></div>
              </div>
              <p style={{ margin: '0', fontSize: '14px', color: '#555' }}>
                Progress: 3/5 Events Completed
              </p>
            </div> */}

            <div className="ion-margin-top">
              <h4>Actions:</h4>
              <IonButton expand="block" color="primary" routerLink="/volunteer/hours">
                Log Volunteer Hours
              </IonButton>
              <IonButton expand="block" color="secondary" routerLink="/volunteer/account">
                Manage Account
              </IonButton>
            </div>
          </>
        ) : (
          <>
            <h3>Make a Difference!</h3>
            <p>Volunteering at P.A.W.S. is a rewarding experience. Here are some benefits of joining us:</p>
            <ul>
              <li>🐾 Make a positive impact on the lives of animals in need.</li>
              <li>🌟 Gain valuable experience and skills.</li>
              <li>🤝 Meet like-minded individuals who share your passion for animal welfare.</li>
              <li>📚 Receive training and support from our dedicated team.</li>
              <li>🎉 Have fun while making a difference!</li>
            </ul>
            <p>Ready to get started?</p>
            <div className="ion-margin-top">
              <IonButton
                expand="block"
                color="primary"
                href="https://new.shelterluv.com/form/volunteer/NSR/18588-volunteer"
                target="_blank"
              >
                Apply to Volunteer
              </IonButton>
            </div>
            <div>
              <IonButton expand="block" color="secondary" routerLink="/volunteer/login">
                Sign In
              </IonButton>
            </div>
          </>
        )}
      </IonContent>
    </IonPage>
  );
}