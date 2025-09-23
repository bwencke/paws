import React, { useEffect, useState } from 'react';
import {
  IonPage, IonContent, IonList, IonItem, IonLabel, IonListHeader, IonSpinner, IonNote, IonIcon, IonSkeletonText,
  IonFab, IonFabButton, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonInput, IonToast, IonAlert
} from '@ionic/react';
import { chevronForwardOutline, add, trash } from 'ionicons/icons';
import { Header } from '../../../components/Header';
import { supabase } from '../../../../lib/supabase';

type User = {
  id?: string;
  email: string;
  full_name?: string;
  is_signed_up?: boolean;
};

const ManageUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | undefined>(undefined);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; email?: string }>({ open: false });

  useEffect(() => {
    const fetchUsersAndPermitted = async () => {
      setLoading(true);

      // Fetch users from profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name');

      // Fetch permitted emails
      const { data: permitted, error: permittedError } = await supabase
        .from('permitted_emails')
        .select('email');

      if (profilesError || permittedError) {
        setLoading(false);
        return;
      }

      // Map users by email for quick lookup
      const usersByEmail: Record<string, User> = {};
      (profiles || []).forEach((profile) => {
        usersByEmail[profile.email] = {
          id: profile.id,
          email: profile.email,
          full_name: `${profile.first_name} ${profile.last_name}`,
          is_signed_up: true,
        };
      });

      // Add permitted emails not in users
      (permitted || []).forEach((p) => {
        if (!usersByEmail[p.email]) {
          usersByEmail[p.email] = {
            email: p.email,
            is_signed_up: false,
          };
        }
      });

      setUsers(Object.values(usersByEmail));
      setLoading(false);
    };

    fetchUsersAndPermitted();
  }, [toastMessage]); // re-fetch when a new email is added

  const handleAddEmail = async () => {
    if (!newEmail.trim()) {
      setToastMessage('Please enter an email address.');
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from('permitted_emails')
      .insert([{ email: newEmail.trim() }]);
    setSaving(false);
    if (error) {
      setToastMessage('Failed to add email.');
    } else {
      setToastMessage('Email added!');
      setShowModal(false);
      setNewEmail('');
    }
  };

  const handleDeleteEmail = async (email: string) => {
    setSaving(true);
    const { error } = await supabase
      .from('permitted_emails')
      .delete()
      .eq('email', email);
    setSaving(false);
    if (error) {
      setToastMessage('Failed to delete email.');
    } else {
      setToastMessage('Email deleted!');
    }
  };

  if (loading) {
    return (
      <IonPage>
        <Header title="Manage Users" showBackButton={true} />
        <IonContent fullscreen>
          <IonList>
            {[...Array(10)].map((_, idx) => (
              <IonItem key={idx}>
                <IonSkeletonText animated={true} style={{ width: '80%' }} />
              </IonItem>
            ))}
          </IonList>
        </IonContent>
      </IonPage>
    )
  }

  return (
    <IonPage>
      <Header title="Manage Users" />
      <IonContent fullscreen>
        <IonList>
          {users.map((user) => (
            <IonItem key={user.email}>
              <IonLabel>
                {user.is_signed_up
                  ? user.full_name
                  : (<>{user.email} <IonNote>(Not Signed Up)</IonNote></>)
                }
              </IonLabel>
              {user.is_signed_up ? null : (
                <IonButton
                  slot="end"
                  color="danger"
                  fill="clear"
                  onClick={() => setConfirmDelete({ open: true, email: user.email })}
                  disabled={saving}
                >
                  <IonIcon icon={trash} />
                </IonButton>
              )}
            </IonItem>
          ))}
        </IonList>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Add User</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonInput
              label="Email"
              labelPlacement="stacked"
              type="email"
              value={newEmail}
              onIonChange={e => setNewEmail(e.detail.value!)}
              placeholder="Enter email address"
              disabled={saving}
            />
            <IonButton expand="block" onClick={handleAddEmail} disabled={saving} style={{ marginTop: 16 }}>
              {saving ? <IonSpinner name="dots" /> : 'Add Email'}
            </IonButton>
            <IonButton fill="clear" expand="block" onClick={() => setShowModal(false)} disabled={saving}>
              Cancel
            </IonButton>
          </IonContent>
        </IonModal>
        <IonAlert
          isOpen={confirmDelete.open}
          header="Delete User"
          message={`Are you sure you want to delete "${confirmDelete.email}"?`}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => setConfirmDelete({ open: false }),
            },
            {
              text: 'Delete',
              role: 'destructive',
              handler: () => {
                if (confirmDelete.email) handleDeleteEmail(confirmDelete.email);
                setConfirmDelete({ open: false });
              },
            },
          ]}
          onDidDismiss={() => setConfirmDelete({ open: false })}
        />
        <IonToast
          isOpen={!!toastMessage}
          message={toastMessage}
          duration={2000}
          onDidDismiss={() => setToastMessage(undefined)}
        />
      </IonContent>
    </IonPage>
  );
};

export default ManageUsersPage;