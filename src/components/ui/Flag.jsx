import { isoToFlag } from '../../utils/flags';

export function Flag({ iso }) {
  const flag = isoToFlag(iso);
  return flag ? <span aria-hidden="true">{flag} </span> : null;
}
