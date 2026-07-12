import { useId } from 'react';
import { IonIcon } from '@ionic/react';
import { Badge } from '../types/badgeTypes';
import { getIonicon } from '../utils/getIonicon';
import {
  FaClock,
  FaPaw,
  FaCheckCircle,
  FaMedal,
  FaStar,
  FaTrophy,
  FaCrown,
  FaCat,
  FaDog,
  FaBroom,
  FaLaptop,
  FaHome,
  FaHeart,
  FaStore,
  FaGlassCheers,
  FaComments,
  FaCalendarCheck,
  FaCar,
  FaCalendarDay,
  FaSun,
  FaMoon,
  FaGift,
  FaFire,
  FaShieldAlt
} from 'react-icons/fa'

const iconMap = {
  FaClock,
  FaPaw,
  FaCheckCircle,
  FaMedal,
  FaStar,
  FaTrophy,
  FaCrown,
  FaCat,
  FaDog,
  FaBroom,
  FaLaptop,
  FaHome,
  FaHeart,
  FaStore,
  FaGlassCheers,
  FaComments,
  FaCalendarCheck,
  FaCar,
  FaCalendarDay,
  FaSun,
  FaMoon,
  FaGift,
  FaFire,
  FaShieldAlt
}

interface BadgeItemProps {
  badge: Badge;
}

const BADGE_SIZE = 120;
const ICON_CIRCLE_SIZE = 72;
const RING_RADIUS = 56;
const TEXT_ARC_RADIUS = 50;
const TEXT_Y_OFFSET = 0;

function splitBadgeName(name: string): [string, string] {
  const trimmed = name.trim();
  const words = trimmed.split(/\s+/);
  if (words.length > 1) {
    const splitAt = Math.ceil(words.length / 2);
    return [words.slice(0, splitAt).join(' '), words.slice(splitAt).join(' ')];
  }
  const mid = Math.ceil(trimmed.length / 2);
  return [trimmed.slice(0, mid), trimmed.slice(mid)];
}

const BadgeIcon = ({ iconName, size = 32, color = "#F6AD55" }) => {
  // 3. Look up the component based on the string passed from your database
  const IconComponent = iconMap[iconName];

  // 4. Return a fallback if the database string doesn't match anything in your map
  if (!IconComponent) {
    return <FaQuestionCircle size={size} color="#A0AEC0" title="Icon missing" />;
  }

  // 5. Render the matched icon!
  return <IconComponent size={size} color={color} />;
};

export function BadgeItem({ badge }: BadgeItemProps) {
  const pathId = useId().replace(/:/g, '');
  const center = BADGE_SIZE / 2;
  const [topText, bottomText] = splitBadgeName(badge.name);

  const topArcCenterY = center + 25;
  const bottomArcCenterY = center + 2;

  const topPath = `M ${center - TEXT_ARC_RADIUS},${topArcCenterY} A ${TEXT_ARC_RADIUS - 12},${TEXT_ARC_RADIUS} 0 0,1 ${center + TEXT_ARC_RADIUS},${topArcCenterY}`;
  const bottomPath = `M ${center - TEXT_ARC_RADIUS},${bottomArcCenterY} A ${TEXT_ARC_RADIUS},${TEXT_ARC_RADIUS} 0 0,0 ${center + TEXT_ARC_RADIUS},${bottomArcCenterY}`;

  const textStyle = {
    fill: 'white',
    fontSize: 15,
    fontWeight: 600,
    letterSpacing: '0.25em',
  } as const;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: BADGE_SIZE,
          height: BADGE_SIZE,
        }}
      >
        <svg
          width={BADGE_SIZE}
          height={BADGE_SIZE}
          style={{ position: 'absolute', inset: 0 }}
          aria-hidden
        >
          <defs>
            <path id={`${pathId}-top`} d={topPath} />
            <path id={`${pathId}-bottom`} d={bottomPath} />
          </defs>
          <circle
            cx={center}
            cy={center}
            r={RING_RADIUS}
            fill="#0047AB"
            stroke="darkblue"
            strokeWidth={2}
          />
          {topText && (
            <text {...textStyle}>
              <textPath href={`#${pathId}-top`} startOffset="50%" textAnchor="middle">
                {topText.toUpperCase()}
              </textPath>
            </text>
          )}
          {bottomText && (
            <text
              {...textStyle}
              transform={`rotate(${center} ${bottomArcCenterY + TEXT_ARC_RADIUS})`}
            >
              <textPath href={`#${pathId}-bottom`} startOffset="50%" textAnchor="middle">
                {bottomText.toUpperCase()}
              </textPath>
            </text>
          )}
        </svg>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: ICON_CIRCLE_SIZE,
            height: ICON_CIRCLE_SIZE,
            marginTop: -ICON_CIRCLE_SIZE / 2,
            marginLeft: -ICON_CIRCLE_SIZE / 2,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#6495ED',
            border: '2px solid gold',
          }}
        >
          {BadgeIcon({iconName: badge.icon, color: 'white'})}
        </div>
      </div>
      {badge.description && (
        <p style={{ marginTop: 8, fontSize: 13, lineHeight: 1.3 }}>{badge.description}</p>
      )}
    </div>
  );
}
