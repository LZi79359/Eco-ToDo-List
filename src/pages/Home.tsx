import { OverlayEventDetail } from '@ionic/core';
import {
  IonAlert,
  IonBadge,
  IonButton,
  IonCheckbox,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { useRef, useState, useEffect } from 'react';

interface ToDoItem {
  // structures the todo item
  text: string;
  completed: boolean;
}

const Home: React.FC = () => {
  // initialize modal and input references
  const modal = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);


  // initialize state variables
  const [trackerBadge, setTrackerBadge] = useState<number>(0);
  const [toDoList, setToDoList] = useState<ToDoItem[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [showAlert, setShowAlert] = useState(false);
  const [indexToDelete, setIndexToDelete] = useState< number | null>(null);

  // this function loads the data from localStorage
  useEffect(() => {
    const savedToDoList = localStorage.getItem('toDoList');
    if (savedToDoList) {
      const parsedList = JSON.parse(savedToDoList);
      setToDoList(parsedList);
      updateTrackerBadge(parsedList);
    }
  }, []);

  // this function updates the data in localStorage
  const saveToDoListToStorage = (updatedList: ToDoItem[]) => {
    localStorage.setItem('toDoList', JSON.stringify(updatedList));
  };

  // this function updates the tracker badge
  const updateTrackerBadge = (updatedList: ToDoItem[]) => {
    const completedCount = updatedList.filter(item => item.completed).length;
    setTrackerBadge(completedCount);
  };

  // this function handles toggling the checkbox
  const handleToggleCheckbox = (index: number) => {
    const updatedList = [...toDoList];
    updatedList[index].completed = !updatedList[index].completed;
    setToDoList(updatedList);
    updateTrackerBadge(updatedList);
    saveToDoListToStorage(updatedList);
  };

 //this function closes the modal and passes the user input back to the main page
  function confirm() {
    modal.current?.dismiss(input.current?.value, 'confirm');
  }

  //this function checks if the cancel or add button were used and acts accordingly
  function handleModalClose(event: CustomEvent<OverlayEventDetail>) {
    if (event.detail.role === 'confirm') {
      const newItem = event.detail.data;
      if (typeof newItem === 'string' && newItem.trim() !== '') {
        const updatedList = [...toDoList, { text: newItem.trim(), completed: false }];
        setToDoList(updatedList);
        updateTrackerBadge(updatedList);
        saveToDoListToStorage(updatedList); 
      }
    }
  }

  // this function handles deletion of list items
  const handleDeleteToDoItem = (indexToDelete: number) => {
    const updatedList = toDoList.filter((_, i) => i !== indexToDelete);
    setToDoList(updatedList);
    updateTrackerBadge(updatedList);
    saveToDoListToStorage(updatedList);
    setIndexToDelete(null);
  };

  // Renders the to-do list in Ionic format
  const renderTodoList = () => {
    const renderedToDoList = [];
    for (let i = 0; i < toDoList.length; i++) {
      renderedToDoList.push(
        <IonItem key={i}>
          <IonCheckbox
            checked={toDoList[i].completed}
            onIonChange={() => handleToggleCheckbox(i)}
            slot="start"
          />
          <IonLabel style={{
            textDecoration: toDoList[i].completed ? 'line-through' : 'none', // Apply strikethrough if completed
          }} >{toDoList[i].text}</IonLabel>
          <IonButton color={'warning'} onClick={() => {
            setIndexToDelete(i);
            setShowAlert(true);
          }} >
            Delete
          </IonButton>
          
        </IonItem>
      );
    }

    return renderedToDoList;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="success">
          <IonTitle style={{ color: 'white' }}>
            Eco Tracker
            <IonBadge style={{ marginLeft: '5px' }} color="warning">{trackerBadge}</IonBadge>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>{renderTodoList()}</IonList>
        
        {/* Button to open Modal to add Item to ToDoList */}
        <IonFab slot="fixed" vertical="bottom" horizontal="center">
          <IonFabButton id="open-modal" color="success">
            <IonIcon icon={add} style={{ color: 'white' }} />
          </IonFabButton>
        </IonFab>
      </IonContent>

      {/* Modal to add Item to ToDoList */}
      <IonModal ref={modal} trigger="open-modal" onWillDismiss={handleModalClose}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add New Eco Activity</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonInput ref={input} placeholder="e.g. Plant a tree" onIonInput={(e: any) => setInputValue(e.target.value)}/>
          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
              <IonButton onClick={() => modal.current?.dismiss()} fill="clear" color="medium">CANCEL</IonButton>
              <IonButton onClick={confirm} disabled={inputValue.trim() === ''}>ADD</IonButton>
          </div>
        </IonContent>
      </IonModal>

      {/* Confirm Delete Alert */}
      <IonAlert
            isOpen={showAlert}
            header='Confirm Delete'
            message='Are you sure you want to delete this item?'
            buttons={[
              {text: 'CANCEL',
               role: 'cancel',
               handler: () => setShowAlert(false)
              },
              {
                text: 'DELETE',
                role: 'confirm',
                handler: () => {
                  if (indexToDelete !== null){
                    handleDeleteToDoItem(indexToDelete)
                  }
                  setShowAlert(false);
                }
              }
            ]}/>
    </IonPage>
  
);
};

export default Home;
