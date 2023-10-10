export function AppointmentDisplay(props: any) {
  return (
    <div>
      Type: {props.type}
      <br />
      Provider: {props.provider}
      <br />
      Start Time: {props.start_time}
      <br />
      End Time: {props.end_time}
      <br />
    </div>
  )
}
