import React from 'react'
import dayjs from 'dayjs'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { Label } from '../ui/Label/Label'
import { Input } from '../ui/Input/Input'
import { Button } from '../ui/Button/Button'

type Props = {
  handleDate: (date: Date, e: React.SyntheticEvent<any, Event>) => void
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>) => void
  handleBookingChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  booking: any
  config: any
  cssClass?: string
  submitBtn: boolean
  action: string
  withBookingDesc: boolean
}

const Form: React.FC<Props> = ({
  handleChange,
  handleDate,
  handleSubmit,
  booking,
  config,
  submitBtn,
  cssClass,
  action,
  withBookingDesc
}) => {
  config.startDate = new Date(dayjs(config.startDate).toISOString())
  return (
    <form
      onSubmit={handleSubmit}
      className={cssClass ? `form ${cssClass}` : 'form'}
      action={action}
      aria-label="Add a booking"
    >
      {withBookingDesc ? (
        <p className="text form__description">Please remember that, you can book a table with maximum of 4 guests.</p>
      ) : null}
      <Label htmlFor="name">Name</Label>
      <Input
        type="text"
        name="name"
        required
        aria-required="true"
        defaultValue={booking.name}
        onChange={handleChange}
      />
      <Label htmlFor="email">Email</Label>
      <Input
        type="email"
        name="email"
        required
        aria-required="true"
        onChange={handleChange}
        defaultValue={booking.email}
      />
      <Label htmlFor="Datepicker">Date</Label>
      <DatePicker
        name="Datepicker"
        className="input"
        selected={booking.date}
        onChange={handleDate}
        showTimeSelect
        minDate={config.startDate}
        timeFormat="HH"
        timeIntervals={60}
        minTime={config.startDate.setHours(config.minTime)}
        maxTime={config.startDate.setHours(config.maxTime)}
        dateFormat="MMMM dd, yyyy h aa"
        timeCaption="Time"
        placeholderText="Click and choose the date"
      />
      <Label htmlFor="guests">Number of guests</Label>
      <Input
        name="guests"
        id="guests"
        type="number"
        min="1"
        max="4"
        required
        aria-required="true"
        onChange={handleChange}
        defaultValue={booking.guests}
      />
      {withBookingDesc ? (
        <p className="text table-booking__reminder">
          Table is kept for 15 minutes after reservation time. We appreciate you being on time.
        </p>
      ) : null}
      {submitBtn ? (
        <Button className="btn--dark" type="submit">
          Next step
        </Button>
      ) : null}
    </form>
  )
}

export default Form