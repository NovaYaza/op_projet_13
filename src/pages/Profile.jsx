import "../assets/styles/Profile.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchUserProfile, updateUserName } from "../redux/userSlice";

export default function Profile() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { firstName, lastName } = useSelector((state) => state.user);

  const [editMode, setEditMode] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");

  useEffect(() => {
    if (token) {
      dispatch(fetchUserProfile(token));
    }
  }, [token]);

  const handleEdit = () => {
    setNewFirstName(firstName);
    setNewLastName(lastName);
    setEditMode(true);
  };

  const handleSave = () => {
    dispatch(updateUserName({ token, firstName: newFirstName, lastName: newLastName }));
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  return (
    <main className="main bg-dark">
      <div className="header">
        {!editMode ? (
          <>
            <h1>
              Welcome back<br />{firstName} {lastName}!
            </h1>
            <button className="edit-button" onClick={handleEdit}>Edit Name</button>
          </>
        ) : (
          <div className="edit-name-form">
            <h1>Edit your name</h1>
            <div className="edit-fields">
              <input
                type="text"
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
              />
              <input
                type="text"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
              />
            </div>
            <div className="edit-actions">
              <button className="edit-button" onClick={handleSave}>Save</button>
              <button className="edit-button" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      <h2 className="sr-only">Accounts</h2>

      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Checking (x8349)</h3>
          <p className="account-amount">$2,082.79</p>
          <p className="account-amount-description">Available Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>

      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Savings (x6712)</h3>
          <p className="account-amount">$10,928.42</p>
          <p className="account-amount-description">Available Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>

      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Credit Card (x8349)</h3>
          <p className="account-amount">$184.30</p>
          <p className="account-amount-description">Current Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
    </main>
  );
}