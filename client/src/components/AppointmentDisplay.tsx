export function AppointmentDisplay(props: any) {
  return (
    <div>
      Type: {props.type}
      <br />
      Provider: {props.provider.first_name} {props.provider.last_name}
      <br />
      Description: {props.description}
      <br />
      Start Time: {props.start_time}
      <br />
      End Time: {props.end_time}
      <br />
    </div>
  )
}
