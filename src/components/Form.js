import React from 'react'
import propTypes from 'prop-types'
import dayjs from 'dayjs'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const Form = ({
  handleChange,
  handleDate,
  handleSubmit,
  booking,
  config,
  submitBtn,
  cssClass,
  action
}) => {
  config.startDate = new Date(dayjs(config.startDate).toISOString())
  return (
    <form
      onSubmit={handleSubmit}
      className={cssClass ? `form ${cssClass}` : 'form'}
      action={action || null}
    >
      <p className='text form__description'>
        Please remember that, you can book a table with maximum of 4 guests.
      </p>
      <label className='label' htmlFor='name'>
        Name
      </label>
      <input
        className='table-booking__input'
        type='text'
        name='name'
        required
        defaultValue={booking.name}
        onChange={handleChange}
      />
      <label htmlFor='email' className='label'>
        Email
      </label>
      <input
        className='table-booking__input'
        type='email'
        name='email'
        required
        onChange={handleChange}
        defaultValue={booking.email}
      />
      <label htmlFor='Datepicker' className='label'>
        Date
      </label>
      <DatePicker
        name='Datepicker'
        className='table-booking__input'
        selected={booking.date}
        onChange={handleDate}
        showTimeSelect
        minDate={config.startDate}
        timeFormat='HH'
        timeIntervals={60}
        minTime={config.startDate.setHours(config.minTime)}
        maxTime={config.startDate.setHours(config.maxTime)}
        dateFormat='MMMM dd, yyyy h aa'
        timeCaption='Time'
        placeholderText='Click and choose the date'
      />
      <label className='label' htmlFor='people' name='people'>
        Number of guests
      </label>
      <input
        className='table-booking__input'
        name='people'
        id='people'
        type='number'
        min='1'
        max='4'
        required
        onChange={handleChange}
        defaultValue={booking.people}
      />
      <p className='text table-booking__reminder'>
        Table is kept for 15 minutes after reservation time. We appreciate you
        being on time.
      </p>
      {submitBtn ? (
        <button className='btn btn--dark' type='submit'>
          Next step
        </button>
      ) : null}
    </form>
  )
}

Form.propTypes = {
  handleChange: propTypes.func,
  handleSubmit: propTypes.func,
  handleDate: propTypes.func,
  booking: propTypes.shape({
    date: propTypes.instanceOf(Date),
    people: propTypes.number,
    name: propTypes.string,
    email: propTypes.string,
    confirmed: propTypes.bool
  }),
  config: propTypes.shape({
    startDate: propTypes.instanceOf(Date),
    minTime: propTypes.number,
    maxTime: propTypes.number
  }),
  submitBtn: propTypes.bool,
  cssClass: propTypes.string,
  action: propTypes.string
}

export default Form
