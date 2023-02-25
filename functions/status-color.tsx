export const statusColor = (status: string) => {
  switch(status) {
    case 'Request':
      return '#353CE4';
    case 'Quotation ready':
      return '#22C0CA';
    case 'Cancelled':
      return '#EA2518';
    case 'Accepted':
      return '#228ECA';
    case 'Completed':
      return '#49D380';
  }
}