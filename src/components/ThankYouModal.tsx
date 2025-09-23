import React from 'react';
import { IonModal, IonContent, IonButton } from '@ionic/react';
import { FaDog, FaCat, FaPaw } from 'react-icons/fa'; // Example animal icons
import { LuDog, LuCat, LuPawPrint } from 'react-icons/lu'; // Example animal icons
import { GiBalloonDog, GiJumpingDog, GiSniffingDog, GiCat, GiHollowCat } from 'react-icons/gi'

interface ThankYouModalProps {
  onDismiss: () => void;
}

const dogIcons = [FaDog, FaPaw, LuDog, LuPawPrint, GiBalloonDog, GiJumpingDog, GiSniffingDog];
const catIcons = [FaCat, FaPaw, LuCat, LuPawPrint, GiCat, GiHollowCat];

const randomDogMessages = [
  "You’re paws-itively amazing!",
  "Thanks fur everything you do!",
  "You’re the ulti-mutt volunteer!",
  "We’re mutts about you!",
  "Howl you ever know how much we appreciate you?",
  "Your kindness is un-fur-gettable!",
  "You help us go the extra mile—tails wag because of you!",
  "You’re paws-down the best!"
]
const randomCatMessages = [
  "You’re purr-fect!",
  "Thank mew for your hard work!",
  "You're the cat's whiskers!",
  "You’re claw-some!",
  "We’re feline so lucky to have you!",,
  "Your kindness is un-fur-gettable!",
  "We’re not lion when we say you’re incredible!",
  "You’re paws-down the best!"
];

const generateRandomThankYouContent = () => {
  const animalType = Math.random() < 0.5 ? {icons: dogIcons, messages: randomDogMessages} : {icons: catIcons, messages: randomCatMessages}; // Randomly choose between dog and cat
  const randomMessage = animalType.messages[Math.floor(Math.random() * animalType.messages.length)];
  const Icon = animalType.icons[Math.floor(Math.random() * animalType.icons.length)];
  return { message: randomMessage, icon: <Icon size={100} style={{ marginTop: '200px' }} /> };
};

const ThankYouModal: React.FC<ThankYouModalProps> = ({ onDismiss }) => {
  const { message, icon } = generateRandomThankYouContent();
  return (
    <IonModal isOpen={true}>
      <IonContent className="ion-padding" style={{ textAlign: 'center' }}>
        {icon}
        <h1>Thank You!</h1>
        <p>{message}</p>
        <IonButton expand="block" onClick={onDismiss} data-testid="close-btn">
          Close
        </IonButton>
      </IonContent>
    </IonModal>
  )
};

export default ThankYouModal;