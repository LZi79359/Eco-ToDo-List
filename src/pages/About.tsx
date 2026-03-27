import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';

const About: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={'success'}>
          <IonTitle style={{color:'white'}}>About</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <IonCard>
          <img alt="Placeholder Image" src="https://placehold.co/600x400"/>
          <IonCardHeader>
            <IonCardTitle>About Eco Tracker</IonCardTitle>
            <IonCardSubtitle>Copyright (c) Luke Zammit Version</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            This application was developed as a part of a learning project at MCAST ICT Institute to explore the capabilites of Ionic React. It features a simple and intuitive interface, allowing suers to easily add and delte tasks related to their ecological
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default About;
