import React from "react";
//import './App.css';
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import PopupWithForm from "./PopupWithForm.js";
import ImagePopup from "./ImagePopup.js";
import api from "../utils/api.js";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";


function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(
    false
  );
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(
    false
  );
  const [currentUser, setCurrentUser] = React.useState({name:'',about:''});
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState([]);
  const [cards, setCards] = React.useState([]);

  React.useEffect(() => {
    Promise.all([api.getUserInformation(),api.getInitialCards()])
      .then(([user, card]) => {
        setCurrentUser(user);
        setCards(card)
      })
      .catch((err) => console.log(err));
  },[]);
  //console.log(currentUser);
  function handleUpdateUser(user) {
      api.editUserInformation(user)
        .then((user) => {
          //console.log(user)
          setCurrentUser(user)
        })
        .catch((err) => console.log(`Ошибка при изменении данных ${err}`))
        .finally(() => closeAllPopups());
  }
  function handleUpdateAvatar(avatar) {
    api.editAvatarUser(avatar)
      .then((avatar) => setCurrentUser(avatar))
      .catch((err) => console.log(`Ошибка при обновлении аватара${err}`))
      .finally(() => closeAllPopups());
  }
  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
      const newCards = cards.map((c) => c._id === card._id ? newCard : c);
      setCards(newCards);
    })
    .catch((err) => console.log(`Ошибка при постановки лайка ${err}`))
  }
  function handleCardDelete(card) {
    api.removeCard(card._id)
      .then(() => {
        const newCards = cards.filter((c) => c._id !== card._id);
        setCards(newCards);
      })
      .catch((err) => console.log(`Ошибка при снятии лайка${err}`))
  }
  function handleAddCard(card) {
    api.addCard(card)
      .then((card) => setCards([card, ...cards]))
      .catch((err) => console.log(`Ошибка при добавлении карточки ${err}`))
      .finally(() => closeAllPopups());
  }
  /* Открытие попапов */
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  /* Закрытие попапов */
  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImagePopupOpen(false);
  }
  function handleCardClick(card) {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  }
  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header />
        <Main
          onEditAvatar={handleEditAvatarClick}
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onCardClick={handleCardClick}
          cards={cards}
          onCardLike={handleCardLike}
          onDeleteClick={handleCardDelete} 
        />
        <Footer />
        <ImagePopup
          link={selectedCard.link}
          name={selectedCard.name}
          isOpen={isImagePopupOpen}
          onClose={closeAllPopups}
        />
        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser}/>
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddCard}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups} 
          onUpdateAvatar={handleUpdateAvatar}/>
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;