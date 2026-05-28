import React from 'react';
import VolunteerHoursManager from './VolunteerHoursManager';
import AllVolunteerHours from './AllVolunteerHours';

interface VolunteerHoursHomeProps {
  userId: string;
  isAdmin: boolean;
  selectedView: 'user' | 'all';
}

const VolunteerHoursHome: React.FC<VolunteerHoursHomeProps> = ({ userId, isAdmin, selectedView }) => {
  if (!isAdmin) {
    return <VolunteerHoursManager userId={userId} />;
  }

  return selectedView === 'all' ? <AllVolunteerHours /> : <VolunteerHoursManager userId={userId} />;
};

export default VolunteerHoursHome;