import React, { useState, useEffect, useContext, useReducer } from 'react'
import { motion } from 'framer-motion'
import { withRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import { UserContext } from '../components/UserContext'
import { apiReducer, apiInitialState } from '../reducers/apiReducer'
import Navbar from '../components/Navbar'
import Booking from '../components/Booking'
import Spinner from '../components/Spinner'
import Modal from '../components/Modal/Modal'
import Form from '../components/Form'
import { pageTransitions, DATEPICKER_CONFIG } from '../constants/config'
import { LOGIN } from '../constants/routes'
import { auth, logout } from '../utils/login'
import db from '../firebase'
import { getData, Order } from '../utils/database'
import { navigateTo } from '../utils/navigate'
import { formatBookings } from '../utils/helpers'
import { notifyError, notifyInfo } from '../utils/notification'
import { DB_ERROR_MSG } from '../constants/toastMessages'
import { ReactComponent as CloseIcon } from '../assets/icons/close.svg'

const Admin: React.FC<any> = ({ history }) => {
  const [state, dispatch] = useReducer(apiReducer, apiInitialState)
  const [bookingDetail, setBookingDetail] = useState<any>({ id: '', data: {} })
  const [bookings, setBookings] = useState([])
  const [showModal, setShowModal] = useState(false)
  const adminLinks = [{ name: 'Bookings', link: 'bookings' }, { name: 'Storage', link: 'storage' }]

  const { user } = useContext(UserContext)

  const handleSignOut = async () => {
    dispatch({ type: 'FETCHING' })
    try {
      await logout()
      dispatch({ type: 'SUCCESS' })
      navigateTo(history, LOGIN)
    } catch (error) {
      dispatch({ type: 'ERROR' })
      notifyError(DB_ERROR_MSG)
    }
  }

  const hideModal = (e: React.KeyboardEvent<HTMLDivElement>) => {
    console.log('hide modal event', e)
  }

  const toggleOptions = (booking: any) => {
    setBookingDetail(booking)
    setShowModal(!showModal)
  }

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedBookingData = {
      ...bookingDetail.data,
      [e.target.name]: e.target.value
    }
    if (e.target.name === 'guests') {
      const updatedBookingData = {
        ...bookingDetail.data,
        [e.target.name]: parseInt(e.target.value)
      }
      setBookingDetail({
        ...bookingDetail,
        data: updatedBookingData
      })
      return
    }
    setBookingDetail({ ...bookingDetail, data: updatedBookingData })
  }

  const handleDateChange = (_date: Date, e: React.SyntheticEvent<any, Event>) => {
    const updatedBookingData = { ...bookingDetail.data, date: e }
    setBookingDetail({ ...bookingDetail, data: updatedBookingData })
  }

  const handleBookingUpdate = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>
  ) => {
    const submitBooking: any = { ...bookingDetail }
    e.preventDefault()
    console.info('data to be submitted', submitBooking)
    db.collection('bookings')
      .doc(bookingDetail.id)
      .update({
        email: submitBooking.data.email,
        name: submitBooking.data.name,
        date: submitBooking.data.date,
        guests: submitBooking.data.guests,
        confirmed: true
      })
      .then(() => {
        setShowModal(false)
        notifyInfo('Booking updated successfully.')
      })
      .catch(err => {
        console.error('Error occurred while saving to database: ', err)
        notifyError(DB_ERROR_MSG)
      })
  }

  const handleBookingDelete = () => {
    db.collection('bookings')
      .doc(bookingDetail.id)
      .delete()
      .then(() => {
        setShowModal(false)
        notifyInfo(`Removed ${bookingDetail.data.name} booking successfully.`)
      })
      .catch(err => console.error('error in handleDelete', err))
  }

  useEffect(() => {
    const listener = auth.onAuthStateChanged(async () => {
      type Params = {
        name: string
        order: Order
        limit: number
      }
      if (user) {
        try {
          dispatch({ type: 'FETCHING' })
          const params: Params = {
            name: 'bookings',
            order: { name: 'date', type: 'asc' },
            limit: 20
          }
          const { order, name, limit } = params
          db.collection(name)
            .orderBy(order.name, order.type)
            .limit(limit)
            .onSnapshot(querySnapshot => {
              const booking = getData(querySnapshot)
              const allBookings: any = formatBookings(booking)
              setBookings(allBookings)
              dispatch({ type: 'SUCCESS' })
            })
        } catch (error) {
          dispatch({ type: 'ERROR' })
          console.error('Error on fetching collection', error)
          notifyError(DB_ERROR_MSG)
        }
      } else {
        history.push({ pathname: LOGIN })
      }
    })
    return () => listener()
  }, [history, user])

  if (state.isLoading) {
    return <Spinner />
  }
  return (
    <>
      <ToastContainer className="toast__container" toastClassName="toast" progressClassName="toast__progress" />
      <Modal show={showModal}>
        <div className="modal-book__nav">
          <button className="modal-book__close" onClick={() => setShowModal(false)}>
            <CloseIcon />
          </button>
        </div>
        <h2 className="heading modal-book__heading">Booking action</h2>
        <p className="text modal-book__text">
          Choose an action for <strong>{bookingDetail.name}</strong> booking.
        </p>
        <p className="text modal-book__text">Both edit or delete process cannot be undone.</p>
        <div className="admin__form-container" onKeyUp={e => hideModal(e)}>
          <Form
            booking={bookingDetail.data}
            config={DATEPICKER_CONFIG}
            handleChange={handleBookingChange}
            handleDate={handleDateChange}
            handleSubmit={handleBookingUpdate}
            submitBtn={false}
            cssClass="form--edit"
            action=""
            withBookingDesc={false}
          />
        </div>
        <footer className="modal-book__footer">
          <button className="btn btn--transparent" type="button" onClick={handleBookingDelete}>
            Delete
          </button>
          <button className="btn btn--light" type="submit" onClick={handleBookingUpdate}>
            Update
          </button>
        </footer>
      </Modal>
      <Navbar admin hashlink links={adminLinks}>
        <button className="btn btn--light btn--small" onClick={handleSignOut}>
          Sign out
        </button>
      </Navbar>
      <motion.main className="container admin__container" initial="exit" animate="enter" exit="exit">
        <h2 className="admin__title" id="bookings">
          Bookings
        </h2>
        {bookings.length === 0 ? (
          <p>No bookings yet</p>
        ) : (
          <motion.table className="table" variants={pageTransitions}>
            <thead className="table__header">
              <tr className="table__row">
                <th className="table__heading">Name</th>
                <th className="table__heading">Date</th>
                <th className="table__heading">Time</th>
                <th className="table__heading">Email</th>
                <th className="table__heading">Guests</th>
                <th className="table__heading">Options</th>
              </tr>
            </thead>
            <tbody>
              {bookings &&
                bookings.map((item: any) => {
                  return (
                    <Booking
                      key={item.id}
                      name={item.data.name}
                      email={item.data.email}
                      guests={item.data.guests}
                      date={item.data.date}
                      toggleOptions={() => toggleOptions(item)}
                    />
                  )
                })}
            </tbody>
          </motion.table>
        )}
        <h2 className="admin__title" id="storage">
          Storage
        </h2>
      </motion.main>
    </>
  )
}

export default withRouter(Admin)
