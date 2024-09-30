import css from './formelements.module.css'

type ToggleProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  labelLeft?: string
  labelRight?: string
  className?: string
}

const Toggle: React.FC<ToggleProps> = ({ onChange, labelLeft, labelRight, className }) => {
  return (
    <div className={`${css.toggle} ${className}`}>
      <span>{labelLeft}</span>
      <label className={css.switch}>
        <input type='checkbox' onChange={onChange} />
        <span className={css.slider}></span>
      </label>
      <span>{labelRight}</span>
    </div>
  )
}

export default Toggle