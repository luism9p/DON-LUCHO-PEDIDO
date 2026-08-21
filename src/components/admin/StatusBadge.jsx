import { STATUS_COLOR, STATUS_LABEL } from '../../utils/orderStatus'

export default function StatusBadge({ estado }) {
  return (
    <span className="status-badge" style={{ backgroundColor: STATUS_COLOR[estado] }}>
      {STATUS_LABEL[estado]}
    </span>
  )
}
