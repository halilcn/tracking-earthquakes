import './index.scss'

const Skelton = props => {
  const { className, ...otherProps } = props

  return <div className={`skelton ${className || ''}`} {...otherProps} />
}

export default Skelton
