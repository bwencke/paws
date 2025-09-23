import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import LocationPieChart from './LocationPieChart';
import TypePieChart from './TypePieChart';
import { HourEntry } from '../types/volunteerTypes';

interface VolunteerHoursPieChartsProps {
  hourEntries: HourEntry[];
}

const VolunteerHoursPieCharts: React.FC<VolunteerHoursPieChartsProps> = ({ hourEntries }) => (
  <Swiper
    style={{ marginTop: '1rem' }}
    spaceBetween={16}
    slidesPerView={1}
    pagination={{ clickable: true }}
    modules={[Navigation]}
    navigation
  >
    <SwiperSlide>
      <div style={{ maxWidth: '75%', margin: '0 auto' }}>
        <LocationPieChart hours={hourEntries} />
        <div style={{ fontSize: '0.95rem', color: 'var(--ion-color-medium)', margin: '1rem 0' }}>
          Hours by Location
        </div>
      </div>
    </SwiperSlide>
    <SwiperSlide>
      <div style={{ maxWidth: '75%', margin: '0 auto' }}>
        <TypePieChart hours={hourEntries} />
        <div style={{ fontSize: '0.95rem', color: 'var(--ion-color-medium)', margin: '1rem 0' }}>
          Hours by Activity
        </div>
      </div>
    </SwiperSlide>
  </Swiper>
);

export default VolunteerHoursPieCharts;
