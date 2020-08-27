import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { motion } from 'framer-motion'
import emailjs from 'emailjs-com'
import dayjs from 'dayjs'
import { splitDate, splitTime, formatDate, convertToDate, getEmailActionUrl } from '../utils/helpers'
import { DATEPICKER_CONFIG, pageTransitions } from '../constants/config'
import { DataContext } from '../components/DataContext'
import { Modal } from '../ui/Modal/Modal'
import db from '../firebase'
import Form from '../components/Form'
import about from '../assets/images/landing/brooke-lark-about.jpg'
import { notifyError } from '../utils/notification'
import { DB_ERROR_MSG } from '../constants/toastMessages'
import { Button } from '../ui/Button/Button'

type Booking = {
  name: string
  email: string
  guests: number
  date: Date
}

const ReviewBooking: React.FC = () => {
  const { state } = useContext(DataContext)
  const { location, contact } = state.company
  const [show, toggleModal] = useState(false)
  const [booking, setBooking] = useState<Booking>({
    name: '',
    email: '',
    guests: 0,
    date: new Date()
  })
  const [editable, setEditable] = useState(false)

  useEffect(() => {
    const booking: Booking = { ...state.booking }
    booking.date = convertToDate(booking.date)
    setBooking({ ...booking })
  }, [state.booking])

  const handleModal = () => {
    toggleModal(true)
    window.localStorage.removeItem('booking')
  }

  const handleBookingEdit = () => {
    setEditable(true)
  }

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'guests') {
      setBooking({ ...booking, [e.target.name]: parseInt(e.target.value) })
      return
    }
    setBooking({ ...booking, [e.target.name]: e.target.value })
  }

  const handleDateChange = (date: Date, e: React.SyntheticEvent<any, Event>) => {
    setBooking({ ...booking, date: date })
  }

  const handleEmailSend = () => {
    const templateParams = {
      name: booking.name,
      email: booking.email,
      guests: booking.guests,
      date: dayjs(booking.date).format('DD-MMMM-YYYY HH:mm')
    }
    emailjs.send('gmail-alkinoos', 'reservation', templateParams, process.env.REACT_APP_DEV_EMAIL_API_KEY).then(
      response => {
        console.info('SUCCESS!', response.status, response.text)
        handleModal()
      },
      err => {
        console.error('FAILED...', err)
      }
    )
  }

  const handleBookingSubmit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    const submitBooking = { ...booking }
    db.collection('bookings')
      .add({
        email: submitBooking.email,
        name: submitBooking.name,
        date: submitBooking.date,
        guests: submitBooking.guests,
        confirmed: true,
        createdAt: dayjs().format('YYYY-MM-DD HH:mm')
      })
      .then(() => {
        handleEmailSend()
      })
      .catch(err => {
        console.log('Error occurred while saving to database: ', err)
        notifyError(DB_ERROR_MSG)
      })
  }

  const { address, code, city, province } = location
  const { name, guests, date } = booking

  if (editable) {
    return (
      <motion.div className="review-booking" initial="exit" animate="enter" exit="exit">
        <ToastContainer />
        <Modal show={show}>
          <h2 className="heading modal-book__heading">Thank you</h2>
          <p className="text modal-book__text">Thank you for booking reservation.</p>
          <p className="text modal-book__text">We will contact you shortly.</p>
          <footer className="modal-book__footer">
            <Link className="btn btn--transparent" to="/">
              Back to Home
            </Link>
            <Link className="btn btn--light" to="/menu">
              See Menu
            </Link>
          </footer>
        </Modal>
        <motion.article className="review-booking__content" variants={pageTransitions}>
          <h1 className="heading review-booking__company">
            <Link to="/">{contact.name}</Link>
          </h1>
          <img className="review-booking__image" src={about} alt="" />
          <h2 className="review-booking__title">Edit booking</h2>
          <div className="review-booking__form">
            <Form
              booking={booking}
              config={DATEPICKER_CONFIG}
              handleChange={handleBookingChange}
              handleDate={handleDateChange}
              handleSubmit={handleBookingSubmit}
              submitBtn={false}
              cssClass="form--edit"
              action={getEmailActionUrl(booking.email)}
              withBookingDesc={true}
            />
          </div>
          <footer className="review-booking__footer review-booking__footer--edit">
            <form onSubmit={handleBookingSubmit}>
              <Button className="btn--light" type="submit">
                Confirm Booking
              </Button>
            </form>
          </footer>
        </motion.article>
      </motion.div>
    )
  }

  return (
    <>
      <Modal show={show}>
        <h2 className="heading modal-book__heading">Thank you</h2>
        <p className="text modal-book__text">Thank you for booking reservation.</p>
        <p className="text modal-book__text">We will contact you shortly.</p>
        <footer className="modal-book__footer">
          <Link className="btn btn--transparent" to="/">
            Back to Home
          </Link>
          <Link className="btn btn--light" to="/menu">
            See Menu
          </Link>
        </footer>
      </Modal>
      <motion.div className="review-booking" initial="exit" animate="enter" exit="exit">
        <motion.article className="review-booking__content" variants={pageTransitions}>
          <h1 className="heading review-booking__company">
            <Link to="/">{contact.name}</Link>
          </h1>
          <img className="review-booking__image" src={about} alt="" />
          <p className="review-booking__client">
            <strong className="review-booking__name">{name}</strong> reservation
          </p>
          <div className="review-booking__container">
            <div className="section__col section__col--flexible">
              <p className="review-booking__value">{guests}</p>
              <p className="review-booking__description">Guests</p>
            </div>
            <div className="section__col section__col--flexible">
              <p className="review-booking__value">{splitDate(formatDate(convertToDate(date)))}</p>
              <p className="review-booking__description">Date</p>
            </div>
            <div className="section__col section__col--flexible">
              <p className="review-booking__value">{splitTime(formatDate(convertToDate(date)))}</p>
              <p className="review-booking__description">Time</p>
            </div>
          </div>
          <p className="review-booking__address">{address}</p>
          <p className="review-booking__address">
            {city}, {province}, {code}{' '}
          </p>
          <footer className="review-booking__footer">
            <form onSubmit={handleBookingSubmit}>
              <Button className="btn--transparent" type="button" onClick={handleBookingEdit}>
                Edit booking
              </Button>
              <Button className="btn--light" type="submit">
                Confirm Booking
              </Button>
            </form>
          </footer>
        </motion.article>
      </motion.div>
    </>
  )
}

export default ReviewBooking
